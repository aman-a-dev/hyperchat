import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    // Enhance prompt with the selected style
    const enhancedPrompt = style
      ? `${prompt}, ${style.toLowerCase()} style`
      : prompt;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 },
      );
    }

    // Initialize the Gemini client
    const ai = new GoogleGenAI({ apiKey });

    // Generate content using the correct model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image", // or 'gemini-3-pro-image-preview' for higher quality
      contents: enhancedPrompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        // Optional: control number of images (if supported)
        // generationConfig: { candidateCount: 4 },
      },
    });

    // Extract images from response
    const images: string[] = [];
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        images.push(part.inlineData.data); // base64 string without prefix
      }
    }

    if (images.length === 0) {
      // Sometimes the model might return text instead of images
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      return NextResponse.json(
        { error: text || "No images generated" },
        { status: 500 },
      );
    }

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error("Error in /api/generate-avatar:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
