import { insertMessage } from "@/lib/db";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const items = Array.isArray(payload) ? payload : [payload];
  const inserted = [];

  for (const item of items) {
    if (typeof item !== "object" || item === null) {
      continue;
    }

    const raw = item as Record<string, unknown>;
    const message = insertMessage({
      id: typeof raw.id === "string" ? raw.id : undefined,
      sender: typeof raw.sender === "string" ? raw.sender : undefined,
      body: typeof raw.body === "string" ? raw.body : undefined,
      channel: typeof raw.channel === "string" ? raw.channel : undefined,
      raw_payload: raw,
    });
    inserted.push(message);
  }

  return Response.json({ inserted: inserted.length });
}
