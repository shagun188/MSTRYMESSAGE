import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

export const runtime = "edge";
export async function GET() {
  return NextResponse.json({ message: " API route is working!" });
}

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = await streamText({
      model: openai("gpt-4o-mini"), // You can also use 'gpt-3.5-turbo' or 'gpt-4o'
      prompt,
    });

    return result.toTextStreamResponse();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
