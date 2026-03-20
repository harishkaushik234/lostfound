import { useEffect, useRef, useState } from "react";
import { formatDate } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

export const ChatWindow = ({ conversation, messages, socket, onSend }) => {
  const [draft, setDraft] = useState("");
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const otherParticipant = conversation?.participants?.find(
    (participant) => participant._id !== user?._id
  );

  useEffect(() => {
    if (socket && conversation?._id) {
      socket.emit("conversation:join", conversation._id);
    }
  }, [socket, conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex h-[calc(100vh-9rem)] min-h-[560px] items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/5 text-slate-400">
        Pick a conversation to start chatting.
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] min-h-[560px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
      <div className="shrink-0 border-b border-white/10 p-4">
        <h2 className="font-display text-xl font-semibold text-white">{conversation.item?.title}</h2>
        <p className="text-sm text-slate-400">
          Chat with {otherParticipant?.name || "the owner"} about this item
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Owner: {otherParticipant?.name || "Unknown"} | Item: {conversation.item?.title}
        </p>
      </div>

      <div className="chat-scroll flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => {
          const isOwn = message.sender?._id === user?._id || message.sender === user?._id;
          return (
            <div key={message._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-md rounded-3xl px-4 py-3 ${
                  isOwn ? "bg-brand-500 text-white" : "bg-slate-800 text-slate-100"
                }`}
              >
                <p>{message.content}</p>
                <p className={`mt-2 text-xs ${isOwn ? "text-brand-100" : "text-slate-400"}`}>
                  {formatDate(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) {
            return;
          }
          onSend(draft.trim());
          setDraft("");
        }}
        className="shrink-0 border-t border-white/10 p-4"
      >
        <div className="flex gap-3">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write your message..."
            className="flex-1 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-brand-400"
          />
          <button type="submit" className="rounded-2xl bg-brand-500 px-5 py-3 font-medium text-white">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
