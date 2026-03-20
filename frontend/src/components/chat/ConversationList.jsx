import { formatDate } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

export const ConversationList = ({ conversations, activeId, unreadCounts, onSelect }) => {
  const { user } = useAuth();

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5">
      {conversations.map((conversation) => {
        const otherParticipant = conversation.participants?.find(
          (participant) => participant._id !== user?._id
        );
        const unreadCount = unreadCounts[conversation._id] || 0;

        return (
          <button
            type="button"
            key={conversation._id}
            onClick={() => onSelect(conversation)}
            className={`flex w-full items-center gap-3 border-b border-white/5 px-4 py-4 text-left transition last:border-b-0 ${
              activeId === conversation._id ? "bg-brand-500/10" : "hover:bg-white/5"
            }`}
          >
            <img
              src={conversation.item?.imageUrl}
              alt={conversation.item?.title}
              className="h-14 w-14 rounded-2xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{otherParticipant?.name || "Unknown user"}</p>
              <p className="truncate text-sm text-slate-400">{conversation.item?.title}</p>
              <p className="truncate text-xs text-slate-500">{conversation.lastMessage || "No messages yet"}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-slate-500">
                {conversation.lastMessageAt ? formatDate(conversation.lastMessageAt) : ""}
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white">
                  +{unreadCount}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
