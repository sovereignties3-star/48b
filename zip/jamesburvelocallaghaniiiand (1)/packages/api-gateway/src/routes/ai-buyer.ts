import { Router, Request, Response } from 'express';
import { GoogleGenAI } from "@google/genai";

export const aiBuyerRouter = Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

aiBuyerRouter.post('/analyze-and-buy', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an AI buyer assistant. Analyze the input request and return a structured JSON response with analysis and potential buying actions.",
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error) {
    console.error('Error in analyze-and-buy:', error);
    res.status(500).json({ error: 'Failed to analyze and buy' });
  }
});