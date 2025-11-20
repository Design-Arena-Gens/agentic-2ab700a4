import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  try {
    const { topic, tone, length } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const toneMap = {
      professional: "professional and authoritative",
      casual: "casual and conversational",
      inspirational: "inspirational and motivational",
      educational: "educational and informative",
      storytelling: "storytelling and narrative-driven",
    };

    const lengthMap = {
      short: "100-150 words",
      medium: "150-250 words",
      long: "250-400 words",
    };

    const toneGuide = toneMap[tone as keyof typeof toneMap] || "professional";
    const lengthGuide = lengthMap[length as keyof typeof lengthMap] || "150-250 words";

    const prompt = `You are a LinkedIn content expert. Generate a compelling LinkedIn post about: ${topic}

Requirements:
- Tone: ${toneGuide}
- Length: ${lengthGuide}
- Include relevant emojis sparingly (1-3 max)
- Use short paragraphs for readability
- Include a strong hook in the first line
- End with a call-to-action or thought-provoking question
- Make it engaging and authentic
- Use line breaks for better formatting

Generate only the post content, no additional commentary.`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const post = message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error("Error generating post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate post" },
      { status: 500 }
    );
  }
}
