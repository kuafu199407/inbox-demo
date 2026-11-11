import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "inbox.db");

fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender TEXT,
    body TEXT NOT NULL,
    channel TEXT,
    raw_payload TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

export type Message = {
  id: string;
  sender: string | null;
  body: string;
  channel: string | null;
  raw_payload: string;
  created_at: number;
};

export type InsertMessageInput = {
  id?: string;
  sender?: string;
  body?: string;
  channel?: string;
  raw_payload: unknown;
};

const insert = db.prepare<Message, InsertMessageInput>(`
  INSERT OR REPLACE INTO messages (id, sender, body, channel, raw_payload, created_at)
  VALUES ($id, $sender, $body, $channel, $raw_payload, $created_at)
`);

export function insertMessage(input: InsertMessageInput): Message {
  const id = input.id ?? crypto.randomUUID();
  const message: Message = {
    id,
    sender: input.sender ?? null,
    body: input.body ?? "",
    channel: input.channel ?? null,
    raw_payload: JSON.stringify(input.raw_payload),
    created_at: Date.now(),
  };
  insert.run(message);
  return message;
}

export function getMessages(): Message[] {
  return db
    .prepare<[], Message>("SELECT * FROM messages ORDER BY created_at DESC")
    .all();
}
