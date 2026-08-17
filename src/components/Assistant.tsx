import { useEffect, useRef, useState } from "react";
import { MdChat, MdClose, MdSend } from "react-icons/md";
import "./styles/Assistant.css";

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface DisplayMessage extends ChatMessage {
  id: number;
}

const STARTER_PROMPTS = [
  "What are Farzam's core skills?",
  "Tell me about his RAG projects",
  "What tech stack does he use?",
];

const Assistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: DisplayMessage = {
      id: idRef.current++,
      role: "user",
      parts: [{ text: trimmed }],
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const history: ChatMessage[] = nextMessages
        .slice(0, -1)
        .map(({ role, parts }) => ({ role, parts }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setMessages((prev) => [
        ...prev,
        { id: idRef.current++, role: "model", parts: [{ text: data.reply }] },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't reach the assistant. Try again in a moment."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className={`assistant-toggle ${isOpen ? "assistant-toggle-open" : ""}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Toggle AI assistant"
        data-cursor="disable"
      >
        {isOpen ? <MdClose /> : <MdChat />}
      </button>

      <div className={`assistant-panel ${isOpen ? "assistant-panel-open" : ""}`}>
        <div className="assistant-header">
          <div>
            <p className="assistant-header-title">Ask about Farzam</p>
            <p className="assistant-header-sub">Skills, tech stack, experience</p>
          </div>
        </div>

        <div className="assistant-messages" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="assistant-empty">
              <p>Ask me anything about Farzam's background - here are a few ideas:</p>
              <div className="assistant-starters">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    className="assistant-starter"
                    onClick={() => sendMessage(prompt)}
                    data-cursor="disable"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`assistant-bubble assistant-bubble-${m.role}`}>
              {m.parts[0].text}
            </div>
          ))}

          {isLoading && (
            <div className="assistant-bubble assistant-bubble-model assistant-bubble-loading">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          {error && <div className="assistant-error">{error}</div>}
        </div>

        <form
          className="assistant-input-row"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            aria-label="Message"
          />
          <button type="submit" aria-label="Send" disabled={isLoading || !input.trim()}>
            <MdSend />
          </button>
        </form>
      </div>
    </>
  );
};

export default Assistant;
