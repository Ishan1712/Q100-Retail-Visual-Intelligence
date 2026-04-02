/**
 * LLM Comparison Service
 * Compares inspection images against master reference images using Google Gemini Vision.
 */

const COMPARISON_PROMPT = `You are a retail shelf inspection AI.

You will receive TWO images:
- IMAGE 1 = MASTER (the ideal/expected shelf layout)
- IMAGE 2 = INSPECTION (the actual current shelf photo)

Compare the inspection image against the master. Identify missing, misplaced, or extra products.

Respond with ONLY a valid JSON object. No markdown, no code fences, no text before or after.

Schema:
{"status":"OK or NOT_OK","confidence":0.95,"summary":"short summary","products_found":["Product A","Product B"],"missing_products":[{"product":"Name","shelf":"top","expected_count":3,"found_count":1,"restock_needed":2}],"misplaced_products":[{"product":"Name","current_location":"top shelf left","correct_location":"eye level center"}],"extra_products":[{"product":"Name","location":"eye level right"}],"shelf_analysis":{"top":{"status":"OK","notes":"All products present"},"eyeLevel":{"status":"NOT_OK","notes":"2 missing"},"lower":{"status":"OK","notes":"Fully stocked"}},"restock_actions":["Restock 2 units of X on eye level"],"reasoning":"2-3 sentence explanation"}

Rules:
- status="OK" only if inspection perfectly matches master
- confidence=0.0 to 1.0
- Be specific with product names, quantities, shelf positions
- Output ONLY the JSON object`;

export function getApiKey() {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey !== 'your_gemini_api_key_here') return envKey;
  return localStorage.getItem('q100_gemini_key') || '';
}

export function saveApiKey(key) {
  localStorage.setItem('q100_gemini_key', key);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function urlToBase64WithMime(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return { base64: await fileToBase64(blob), mime: blob.type || 'image/jpeg' };
}

/**
 * Try to parse a string as JSON. Returns null on failure.
 */
function tryParse(str) {
  if (!str || typeof str !== 'string') return null;
  try { return JSON.parse(str); } catch { return null; }
}

/**
 * Extract JSON from a text string using multiple strategies.
 */
function extractJSON(text) {
  if (!text) return null;
  const t = text.trim();

  // 1. Direct parse
  let result = tryParse(t);
  if (result) return result;

  // 2. Strip markdown code fences
  const stripped = t.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  result = tryParse(stripped);
  if (result) return result;

  // 3. Extract between first { and last } using balanced brace matching
  const firstBrace = t.indexOf('{');
  if (firstBrace === -1) return null;

  let depth = 0;
  for (let i = firstBrace; i < t.length; i++) {
    if (t[i] === '{') depth++;
    else if (t[i] === '}') {
      depth--;
      if (depth === 0) {
        result = tryParse(t.slice(firstBrace, i + 1));
        if (result) return result;
        break;
      }
    }
  }

  // 4. Last resort — first { to last }
  const lastBrace = t.lastIndexOf('}');
  if (lastBrace > firstBrace) {
    result = tryParse(t.slice(firstBrace, lastBrace + 1));
    if (result) return result;
  }

  return null;
}

/**
 * Compare inspection image against master using Google Gemini Vision API
 */
export async function compareWithMaster({
  apiKey,
  masterImageUrl,
  inspectionImage,
  expectedProducts = [],
  sectionName = '',
}) {
  if (!apiKey) throw new Error('API key is required.');

  const startTime = performance.now();

  // Prepare master image
  let masterBase64, masterMime;
  try {
    const result = await urlToBase64WithMime(masterImageUrl);
    masterBase64 = result.base64;
    masterMime = result.mime;
  } catch {
    masterBase64 = null;
    masterMime = null;
  }

  // Prepare inspection image
  let inspectionBase64, inspectionMime;
  if (typeof inspectionImage === 'string' && inspectionImage.startsWith('data:')) {
    inspectionBase64 = inspectionImage.split(',')[1];
    inspectionMime = inspectionImage.split(';')[0].split(':')[1] || 'image/jpeg';
  } else if (inspectionImage instanceof Blob || inspectionImage instanceof File) {
    inspectionBase64 = await fileToBase64(inspectionImage);
    inspectionMime = inspectionImage.type || 'image/jpeg';
  } else {
    throw new Error('Invalid inspection image format');
  }

  // Build prompt
  const contextPrompt = expectedProducts.length
    ? `\n\nSection: ${sectionName}\nExpected products (for reference only — prioritize visual comparison): ${expectedProducts.join(', ')}\n\nIMPORTANT: Your primary task is to visually compare IMAGE 1 vs IMAGE 2. If both images show the same shelf layout with the same products in the same positions, report status="OK" regardless of the expected product list. The expected product list is secondary context only.\n\nCompare the two images:`
    : '';

  let fullPrompt = COMPARISON_PROMPT + contextPrompt;
  if (!masterBase64) {
    fullPrompt += `\n\nNote: Master image URL: ${masterImageUrl}`;
  }

  const parts = [{ text: fullPrompt }];
  if (masterBase64) {
    parts.push({ inline_data: { mime_type: masterMime, data: masterBase64 } });
  }
  parts.push({ inline_data: { mime_type: inspectionMime, data: inspectionBase64 } });

  // Call Gemini API
  const model = 'gemini-3-flash-preview';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 16384,
          responseMimeType: 'application/json',
          thinkingConfig: {
            thinkingLevel: 'minimal',
          },
        },
      }),
    });
  } catch (networkErr) {
    throw new Error(`Network error: ${networkErr.message}`);
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const msg = errData?.error?.message || `API error: ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  const latencyMs = Math.round(performance.now() - startTime);

  // Check for blocked/empty responses
  const candidate = data?.candidates?.[0];
  if (!candidate) {
    const blockReason = data?.promptFeedback?.blockReason;
    throw new Error(blockReason ? `Request blocked: ${blockReason}` : 'No response from AI');
  }

  if (candidate.finishReason === 'SAFETY') {
    throw new Error('Response blocked by safety filters. Try a different image.');
  }

  const allParts = candidate?.content?.parts || [];

  // Log for debugging
  console.log('[LLM] Parts:', allParts.length, 'finishReason:', candidate.finishReason);

  // Strategy: try extracting JSON from each part individually, prioritizing non-thinking parts
  let parsed = null;

  // Pass 1: Non-thinking parts (the actual response)
  for (const part of allParts) {
    if (part.thought || !part.text) continue;
    parsed = extractJSON(part.text);
    if (parsed) {
      console.log('[LLM] Parsed from non-thinking part');
      break;
    }
  }

  // Pass 2: All parts combined (non-thinking only)
  if (!parsed) {
    const nonThinkingText = allParts
      .filter(p => p.text && !p.thought)
      .map(p => p.text)
      .join('\n');
    if (nonThinkingText) {
      parsed = extractJSON(nonThinkingText);
      if (parsed) console.log('[LLM] Parsed from combined non-thinking text');
    }
  }

  // Pass 3: Thinking parts individually (fallback — some responses put JSON here)
  if (!parsed) {
    for (const part of allParts) {
      if (!part.thought || !part.text) continue;
      parsed = extractJSON(part.text);
      if (parsed) {
        console.log('[LLM] Parsed from thinking part');
        break;
      }
    }
  }

  // Pass 4: ALL text combined
  if (!parsed) {
    const allText = allParts.map(p => p.text || '').join('\n');
    parsed = extractJSON(allText);
    if (parsed) console.log('[LLM] Parsed from all combined text');
  }

  // Fallback
  if (!parsed) {
    const allText = allParts.map(p => p.text || '').join('\n');
    console.warn('[LLM] Parse failed. Full response:', allText);
    parsed = {
      status: 'NOT_OK',
      confidence: 0.5,
      summary: 'AI analysis completed but response format was unexpected',
      products_found: [],
      missing_products: [],
      misplaced_products: [],
      extra_products: [],
      shelf_analysis: {},
      restock_actions: [],
      reasoning: allText || 'No response text received',
    };
  }

  // Ensure required fields exist
  parsed.products_found = parsed.products_found || [];
  parsed.missing_products = parsed.missing_products || [];
  parsed.misplaced_products = parsed.misplaced_products || [];
  parsed.extra_products = parsed.extra_products || [];
  parsed.shelf_analysis = parsed.shelf_analysis || {};
  parsed.restock_actions = parsed.restock_actions || [];

  const usage = data?.usageMetadata || {};

  return {
    ...parsed,
    latencyMs,
    model,
    tokens: {
      input: usage.promptTokenCount || 0,
      output: usage.candidatesTokenCount || 0,
      total: usage.totalTokenCount || 0,
    },
  };
}
