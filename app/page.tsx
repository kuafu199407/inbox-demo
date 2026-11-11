import { getMessages } from "@/lib/db";

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function summarize(body: string): string {
  if (body.length <= 120) return body;
  return body.slice(0, 120).trimEnd() + "…";
}

export default async function Home() {
  const messages = getMessages();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <h1 className="text-xl font-semibold tracking-tight">收件箱</h1>
          <p className="mt-1 text-sm text-zinc-500">收到的 Webhook 消息列表</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center">
            <p className="text-zinc-500">暂无消息</p>
            <p className="mt-2 text-sm text-zinc-400">通过 POST /api/webhook 发送消息</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((message) => (
              <li
                key={message.id}
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {message.sender ?? "未知发送者"}
                      {message.channel && (
                        <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-normal text-zinc-600">
                          {message.channel}
                        </span>
                      )}
                    </p>
                    <p className="mt-1 break-words text-sm leading-relaxed text-zinc-700">
                      {summarize(message.body)}
                    </p>
                  </div>
                  <time
                    dateTime={new Date(message.created_at).toISOString()}
                    className="shrink-0 text-xs text-zinc-400"
                  >
                    {formatTime(message.created_at)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
