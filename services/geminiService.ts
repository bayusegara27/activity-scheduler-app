
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not found. Gemini API features will be disabled.");
}

// Conditional initialization to prevent errors if API_KEY is missing
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const geminiService = {
  suggestActivityTitle: async (description: string): Promise<string> => {
    if (!ai) {
      // Fallback or error if API key is not available
      console.error("Gemini API key not configured. Cannot suggest title.");
      return "Suggestion unavailable"; 
    }
    if (!description.trim()) {
      return ""; // Return empty if description is empty
    }

    const prompt = `Berdasarkan deskripsi aktivitas berikut, sarankan judul yang ringkas dan informatif (idealnya 3-6 kata, maksimal 10 kata). Hanya kembalikan judulnya saja, tanpa teks atau penjelasan tambahan.

Deskripsi: "${description}"

Judul yang Disarankan:`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT, 
        contents: prompt,
        config: {
          temperature: 0.5, // Lower temperature for more focused/deterministic titles
          maxOutputTokens: 2250,
          topK: 10,
        }
      });
      
      const responseText = response.text; // Access the getter safely

      if (responseText && typeof responseText === 'string') {
        const suggestedTitle = responseText.trim();
        // Basic cleanup: remove potential quotes if Gemini adds them
        return suggestedTitle.replace(/^["']|["']$/g, '');
      } else {
        // Log the problematic response for debugging if text is missing or not a string
        console.warn("Gemini API response.text was not a valid string or was undefined. Full response:", JSON.stringify(response, null, 2));
        
        // Check for specific finish reasons if available to provide more context
        const finishReason = response?.candidates?.[0]?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
             throw new Error(`Title suggestion failed. Model finish reason: ${finishReason}.`);
        }
        // Fallback error if text is not available
        throw new Error("Title suggestion failed: No valid text content received from API.");
      }

    } catch (error) {
      // This console.error will now log either the error from the API call itself 
      // or the specific error thrown above if response.text was invalid.
      console.error("Error calling Gemini API for title suggestion:", error);
      // This generic error is what gets propagated to the UI layer.
      throw new Error("Failed to get suggestion from AI. Please check your API key and network connection.");
    }
  },
};
