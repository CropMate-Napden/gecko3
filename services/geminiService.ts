
import { GoogleGenAI, Type, GenerateContentRequest } from "@google/genai";
import { AnalysisResult, ChatMessage, HistoryItem, HistoryAnalysisResult } from "../types";

// --- 1. MODEL CONFIGURATION ---
const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

// Define model priority list based on verified available models.
const MODEL_PRIORITY = [
  'models/gemini-3-flash-preview',
  'models/gemini-2.5-pro',
  'models/gemini-2.5-flash',
  'models/gemma-3-27b-it'
];

// --- 2. AUTOMATIC FALLBACK LOGIC ---

const isQuotaError = (error: any): boolean => {
  if (error.status === 'RESOURCE_EXHAUSTED' || (error.g && error.g.code === 8)) return true;
  if (error.message && (error.message.includes('429') || error.message.toLowerCase().includes('quota'))) return true;
  if (error.status === 'NOT_FOUND' || (error.message && error.message.includes('404'))) return true;
  return false;
};

const generateContentWithFallback = async (request: Omit<GenerateContentRequest, 'model'>) => {
  const ai = getAI();
  let lastError: any = null;

  for (const modelName of MODEL_PRIORITY) {
    try {
      console.log(`Attempting to generate content with model: ${modelName}`);
      const response = await ai.models.generateContent({ ...request, model: modelName });
      console.log(`Successfully generated content with model: ${modelName}`);
      return response;
    } catch (error: any) {
      lastError = error;
      console.warn(`Model ${modelName} failed. Error:`, error.message);
      if (!isQuotaError(error)) {
        console.error("Error is not quota-related or model-not-found. Aborting fallback chain.");
        throw error;
      }
    }
  }

  console.error("All fallback models failed due to quota or other issues.");
  throw new Error(`All AI models are currently unavailable. Last error: ${lastError?.message || 'Unknown error'}`);
};


// --- 3. REFACTORED API CALLS ---

export const analyzeCropImage = async (base64Image: string): Promise<AnalysisResult> => {
  const systemInstruction = `
    You are an expert agronomist, plant pathologist, and agricultural economist.
    Analyze the provided image of a crop or plant with "Chain-of-Thought" reasoning.
    1. **Visual Evidence:** Describe *exactly* where you see the issue.
    2. **Diagnosis:** Identify the crop and health status.
    3. **Impact Analysis:** Estimate potential yield loss if untreated.
    4. **Treatment & Pricing:** Recommend treatments and estimate current market prices.
    5. **Action Plan:** Define the single "Next Best Step".
    Return the result in a strict JSON format.
  `;

  const request = {
    contents: [{
      parts: [
        { text: "Analyze this crop image. Provide visual evidence, yield impact prediction, dynamic treatment pricing, and a priority action step." },
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
      ],
    }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cropName: { type: Type.STRING },
          healthStatus: { type: Type.STRING, enum: ['Healthy', 'Diseased', 'Unknown'] },
          confidence: { type: Type.NUMBER },
          diseaseName: { type: Type.STRING },
          visualEvidence: { type: Type.STRING },
          yieldImpact: { type: Type.STRING },
          cause: { type: Type.STRING },
          nextBestStep: { type: Type.STRING },
          treatmentOptions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['Organic', 'Chemical', 'Cultural'] },
                estimatedPrice: { type: Type.STRING },
                instructions: { type: Type.STRING }
              },
              required: ['name', 'type', 'instructions']
            }
          },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          preventativeMeasures: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['cropName', 'healthStatus', 'confidence', 'visualEvidence', 'yieldImpact', 'nextBestStep', 'treatmentOptions', 'recommendations', 'preventativeMeasures'],
      },
    },
  };

  const response = await generateContentWithFallback(request);

  if (!response.text) {
    throw new Error("No analysis data received from the AI.");
  }
  return JSON.parse(response.text.trim()) as AnalysisResult;
};

export const chatWithGemini = async (messages: ChatMessage[]): Promise<string> => {
  const request = {
    contents: messages.map(m => ({ role: m.role, parts: m.parts })),
    config: {
      systemInstruction: "You are CropMate AI Chatbot, an advanced agricultural assistant. You can analyze images, predict yield impacts, and suggest treatments with pricing. You can also manage the user's to-do list. Be professional, supportive, and data-driven."
    }
  };
  
  const response = await generateContentWithFallback(request);
  return response.text || "I couldn't process that request.";
};

export const analyzeHistory = async (history: HistoryItem[]): Promise<HistoryAnalysisResult> => {
  const systemInstruction = `
    You are an expert agricultural AI assistant. Analyze the provided history of crop analyses.
    Identify patterns, provide an overall summary, offer actionable recommendations, and predict future needed actions.
    Always return your analysis in a structured JSON format.
  `;

  const historySummary = history.map(item => ({
    timestamp: new Date(item.timestamp).toLocaleString(),
    cropName: item.result.cropName,
    healthStatus: item.result.healthStatus,
    diseaseName: item.result.diseaseName,
  }));

  const request = {
    contents: [{ parts: [{ text: `Analyze the following crop analysis history:\n\n${JSON.stringify(historySummary, null, 2)}` }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallSummary: { type: Type.STRING },
          identifiedPatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          predictedActions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['overallSummary', 'identifiedPatterns', 'recommendations', 'predictedActions'],
      },
    },
  };

  const response = await generateContentWithFallback(request);

  if (!response.text) {
    throw new Error("No history analysis data received from the AI.");
  }
  return JSON.parse(response.text.trim()) as HistoryAnalysisResult;
};
