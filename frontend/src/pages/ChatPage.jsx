import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";
import { ConversationList } from "../components/chat/ConversationList";
import { ChatWindow } from "../components/chat/ChatWindow";
import { useAuth } from "../context/AuthContext";

export const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const {
    user,
    socket,
    unreadCounts,
    clearUnreadCount,
    setActiveConversationId
  } = useAuth();

  const conversationMap = useMemo(
    () => new Map(conversations.map((conversation) => [conversation._id, conversation])),
    [conversations]
  );

  const loadConversations = async () => {
    const { data } = await api.get("/chat/conversations");
    setConversations(data.conversations);
  };

  const loadMessages = async (conversation) => {
    setActiveConversation(conversation);
    setActiveConversationId(conversation._id);
    clearUnreadCount(conversation._id);
    const { data } = await api.get(`/chat/conversations/${conversation._id}/messages`);
    setMessages(data.messages);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (location.state?.conversation) {
      const conversation = location.state.conversation;
      setActiveConversation(conversation);
      loadConversations();
      loadMessages(conversation);
    }
  }, [location.state]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleNewMessage = (message) => {
      const conversationId = message.conversation?._id || message.conversation;
      const isActiveConversation = conversationId === activeConversation?._id;

      if (isActiveConversation) {
        setMessages((current) => [...current, message]);
      }
    };

    const handleConversationUpdated = () => {
      loadConversations();
    };

    socket.on("message:new", handleNewMessage);
    socket.on("conversation:updated", handleConversationUpdated);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("conversation:updated", handleConversationUpdated);
    };
  }, [socket, activeConversation, user]);

  useEffect(() => {
    if (!activeConversation?._id) {
      return;
    }

    const freshConversation = conversationMap.get(activeConversation._id);
    if (freshConversation) {
      setActiveConversation(freshConversation);
    }
  }, [conversationMap, activeConversation?._id]);

  useEffect(() => {
    return () => {
      setActiveConversationId(null);
    };
  }, [setActiveConversationId]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
      <div className="chat-scroll h-[calc(100vh-9rem)] overflow-y-auto rounded-[28px]">
        <ConversationList
          conversations={conversations}
          activeId={activeConversation?._id}
          unreadCounts={unreadCounts}
          onSelect={loadMessages}
        />
      </div>
      <ChatWindow
        conversation={activeConversation}
        messages={messages}
        socket={socket}
        onSend={(content) => {
          if (!activeConversation?._id) {
            return;
          }

          socket?.emit("message:send", { conversationId: activeConversation._id, content });
        }}
      />
    </div>
  );
};
