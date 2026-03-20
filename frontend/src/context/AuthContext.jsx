import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import api from "../api/client";

const AuthContext = createContext(null);
const STORAGE_KEY = "lost-found-token";
const UNREAD_STORAGE_KEY = "lost-found-unread-counts";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEY));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(STORAGE_KEY)));
  const [socket, setSocket] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState(() => {
    const saved = localStorage.getItem(UNREAD_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(UNREAD_STORAGE_KEY, JSON.stringify(unreadCounts));
  }, [unreadCounts]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  useEffect(() => {
    if (!token || !user?._id) {
      setSocket(null);
      return undefined;
    }

    const instance = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: { token }
    });

    const handleConversationUpdated = (payload) => {
      if (payload.senderId === user._id) {
        return;
      }

      toast.success(`1 new message from ${payload.senderName}`);

      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(`Message from ${payload.senderName}`, {
            body: payload.lastMessage
          });
        } else if (Notification.permission === "default") {
          Notification.requestPermission();
        }
      }

      if (payload.conversationId !== activeConversationId) {
        setUnreadCounts((current) => ({
          ...current,
          [payload.conversationId]: (current[payload.conversationId] || 0) + 1
        }));
      }
    };

    instance.on("conversation:updated", handleConversationUpdated);
    setSocket(instance);

    return () => {
      instance.off("conversation:updated", handleConversationUpdated);
      instance.disconnect();
    };
  }, [token, user?._id, activeConversationId]);

  const saveSession = (payload) => {
    localStorage.setItem(STORAGE_KEY, payload.token);
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    saveSession(data);
    toast.success("Welcome back");
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    saveSession(data);
    toast.success("Account created");
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(UNREAD_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setUnreadCounts({});
    setActiveConversationId(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put("/auth/me", payload);
    setUser(data.user);
    toast.success("Profile updated");
  };

  const clearUnreadCount = (conversationId) => {
    setUnreadCounts((current) => ({
      ...current,
      [conversationId]: 0
    }));
  };

  const totalUnreadCount = Object.values(unreadCounts).reduce(
    (sum, count) => sum + Number(count || 0),
    0
  );

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      socket,
      unreadCounts,
      totalUnreadCount,
      activeConversationId,
      setActiveConversationId,
      clearUnreadCount,
      login,
      register,
      logout,
      updateProfile
    }),
    [user, token, loading, socket, unreadCounts, totalUnreadCount, activeConversationId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
