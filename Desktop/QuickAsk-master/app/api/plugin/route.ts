import { NextResponse, NextRequest } from "next/server";

async function handle(req: NextRequest) {
  const { message } = await req.json();
  const response = await fetch(
    `https://serpapi.com/search.json?engine=duckduckgo&q=${message}&api_key=${process.env.DUCKDUCKGO_API_KEY}`,
  );
  const results = (await response.json())["organic_results"];
  console.log(results);
  // Show result as JSON
  const result = results.map((item: any) => ({
    title: item.title || "",
    link: item.link || "",
    snippet: item.snippet || "",
    favicon: item.favicon || "",
    text: "",
  }));
  console.log(result);
  return NextResponse.json({ result: result });
}

export const POST = handle;
export const GET = handle;

export const runtime = "edge";
