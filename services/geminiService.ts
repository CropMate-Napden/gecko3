
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResult, ChatMessage } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeCropImage = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = getAI();

  const systemInstruction = `
    You are an expert agronomist and plant pathologist. 
    Analyze the provided image of a crop or plant.
    1. Identify the crop type.
    2. Determine its health status (Healthy or Diseased).
    3. If diseased, identify the disease and symptoms.
    4. Provide specific, actionable recommendations for treatment and preventative measures.
    
    Always return your analysis in a structured JSON format.
  `;

  const prompt = "Analyze this crop image and provide a detailed health report including identification, disease detection (if any), and expert recommendations.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
        ],
      },
    ],
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
          symptoms: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          cause: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          preventativeMeasures: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['cropName', 'healthStatus', 'confidence', 'recommendations', 'preventativeMeasures'],
      },
    },
  });

  if (!response.text) {
    throw new Error("No analysis data received from the AI.");
  }

  return JSON.parse(response.text.trim()) as AnalysisResult;
};

export const chatWithGemini = async (messages: ChatMessage[]): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: messages.map(m => ({
      role: m.role,
      parts: m.parts
    })),
    config: {
      systemInstruction: "You are AgroVision AI Chatbot, a helpful agricultural assistant. You can analyze images of plants, answer questions about farming, sustainable agriculture, and crop management. Be professional, supportive, and informative."
    }
  });
  return response.text || "I couldn't process that request.";
};
