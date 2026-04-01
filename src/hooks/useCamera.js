import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for camera access via getUserMedia.
 * Manages stream lifecycle, attaches to a <video> ref, and provides snapshot capability.
 * Handles mobile orientation so the camera preview and snapshot match how the device is held.
 *
 * @param {Object} options
 * @param {boolean} options.active - Whether camera should be active
 * @param {'environment'|'user'} options.facingMode - Camera facing mode (default: 'environment' for rear camera)
 * @param {{ width?: number, height?: number }} options.resolution - Desired resolution
 * @returns {{ videoRef, canvasRef, stream, error, hasCamera, takeSnapshot, retryCamera }}
 */
export default function useCamera({
  active = true,
  facingMode = 'environment',
  resolution = { width: 1280, height: 720 },
} = {}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [hasCamera, setHasCamera] = useState(false);
  // Track if the stream is rotated (landscape stream on portrait device)
  const [rotated, setRotated] = useState(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasCamera(false);
    setRotated(false);
  }, []);

  const attachStream = useCallback(async (stream) => {
    streamRef.current = stream;
    const video = videoRef.current;
    if (!video) return;

    video.srcObject = stream;
    await video.play();

    // After playing, check if the stream dimensions mismatch the device orientation.
    // On many mobile devices, the camera sensor is physically landscape — getUserMedia
    // returns a landscape stream even when the phone is in portrait. The native camera
    // app rotates internally, but getUserMedia does not.
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    const streamLandscape = video.videoWidth > video.videoHeight;

    if (isPortrait && streamLandscape) {
      // The stream is landscape but the device is portrait → we need to rotate
      setRotated(true);
    } else {
      setRotated(false);
    }

    setHasCamera(true);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera API not supported in this browser');
      return;
    }

    try {
      stopStream();

      // On portrait devices, swap width/height hints so the browser can try portrait
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;
      const w = isPortrait ? resolution.height : resolution.width;
      const h = isPortrait ? resolution.width : resolution.height;

      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: w },
          height: { ideal: h },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      await attachStream(stream);
    } catch (err) {
      // If rear camera fails, try without facingMode constraint
      if (facingMode === 'environment') {
        try {
          const isPortrait = window.matchMedia('(orientation: portrait)').matches;
          const w = isPortrait ? resolution.height : resolution.width;
          const h = isPortrait ? resolution.width : resolution.height;

          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: w }, height: { ideal: h } },
            audio: false,
          });
          await attachStream(fallbackStream);
          return;
        } catch (fallbackErr) {
          // Fall through to error handling
        }
      }

      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError(`Camera error: ${err.message}`);
      }
      setHasCamera(false);
    }
  }, [facingMode, resolution.width, resolution.height, stopStream, attachStream]);

  // Start/stop based on active flag
  useEffect(() => {
    if (active) {
      startCamera();
    } else {
      stopStream();
    }
    return stopStream;
  }, [active, startCamera, stopStream]);

  /**
   * Capture a snapshot from the live video feed.
   * If the stream was rotated for display, the snapshot is rotated to match
   * so the output image is always in the correct portrait/landscape orientation.
   * Returns a data URL (JPEG).
   */
  const takeSnapshot = useCallback(() => {
    const video = videoRef.current;
    if (!video || !hasCamera) return null;

    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvasRef.current = canvas;
    }

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    if (rotated) {
      // Stream is landscape but device is portrait → rotate the snapshot 90° so the
      // output image is portrait, matching what the user sees on screen.
      canvas.width = vh;
      canvas.height = vw;
      const ctx = canvas.getContext('2d');
      ctx.translate(vh / 2, vw / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.drawImage(video, -vw / 2, -vh / 2);
    } else {
      canvas.width = vw;
      canvas.height = vh;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
    }

    return canvas.toDataURL('image/jpeg', 0.85);
  }, [hasCamera, rotated]);

  return {
    videoRef,
    canvasRef,
    stream: streamRef.current,
    error,
    hasCamera,
    takeSnapshot,
    retryCamera: startCamera,
    rotated,
  };
}
