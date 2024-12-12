import { NextResponse, NextRequest } from "next/server";
import { AnthropicStream, StreamingTextResponse } from "ai";

// IMPORTANT! Set the runtime to edge

// Build a prompt from the messages
function buildPrompt(
  messages: { content: string; role: "system" | "user" | "assistant" }[],
) {
  return (
    messages
      .map(({ content, role }) => {
        if (role === "user") {
          return `Human: ${content}`;
        } else {
          return `Assistant: ${content}`;
        }
      })
      .join("\n\n") + "Assistant:"
  );
}

async function handle(req: NextRequest) {
  // Extract the `messages` from the body of the request
  const { messages, model, temperature } = await req.json();
  const response = await fetch("https://api.anthropic.com/v1/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
    },
    body: JSON.stringify({
      prompt: buildPrompt(messages),
      model: model,
      max_tokens_to_sample: 300,
      temperature: temperature,
      stream: true,
    }),
  });

  // Convert the response into a friendly text-stream
  const stream = AnthropicStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}

export const POST = handle;
export const GET = handle;

export const runtime = "edge";
