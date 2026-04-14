import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Enhance prompt with the selected style
    const enhancedPrompt = style
      ? `${prompt}, ${style.toLowerCase()} style`
      : prompt;

    // Pollinations.ai parameters
    const width = 1024;
    const height = 1024;
    const model = "flux"; // Options: 'flux', 'turbo', 'stable-diffusion'
    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&seed=${seed}&nologo=true`;

    console.log(`🎨 Generating image for: ${enhancedPrompt}`);
    console.log(`🔗 URL: ${imageUrl}`);

    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Pollinations API returned ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // Return one image (can be extended to generate multiple variations)
    return NextResponse.json({ images: [base64Image] });
  } catch (error: any) {
    console.error("Error in /api/ai/avatar:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}