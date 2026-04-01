import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for camera access via getUserMedia.
 * Manages stream lifecycle, attaches to a <video> ref, and provides snapshot capability.
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

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasCamera(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera API not supported in this browser');
      return;
    }

    try {
      // Stop any existing stream first
      stopStream();

      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: resolution.width },
          height: { ideal: resolution.height },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setHasCamera(true);
    } catch (err) {
      // If rear camera fails, try without facingMode constraint
      if (facingMode === 'environment') {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: resolution.width }, height: { ideal: resolution.height } },
            audio: false,
          });
          streamRef.current = fallbackStream;
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            await videoRef.current.play();
          }
          setHasCamera(true);
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
  }, [facingMode, resolution.width, resolution.height, stopStream]);

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
   * Returns a data URL (JPEG).
   */
  const takeSnapshot = useCallback(() => {
    const video = videoRef.current;
    if (!video || !hasCamera) return null;

    // Create or use existing canvas
    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvasRef.current = canvas;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.85);
  }, [hasCamera]);

  return {
    videoRef,
    canvasRef,
    stream: streamRef.current,
    error,
    hasCamera,
    takeSnapshot,
    retryCamera: startCamera,
  };
}
