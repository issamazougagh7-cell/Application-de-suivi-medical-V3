import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchConversations, fetchMessages, sendMessage } from "../services/messageService";
import { getConnections } from "../services/connectionService";
import { useAuth } from "../context/AuthContext";
import socket from "../utils/socket";
import Loader from "../components/Loader";

export default function Chat() {
  const { userId } = useParams(); // if navigated to /chat/:userId directly
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeId, setActiveId] = useState(userId || null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Load contacts (connected users) + conversation list
  useEffect(() => {
    const load = async () => {
      const [connRes, convRes] = await Promise.all([getConnections(), fetchConversations()]);
      const accepted = connRes.data.filter((c) => c.status === "accepted");
      // contacts = the "other" user in each connection
      const ctcts = accepted.map((c) =>
        user.role === "doctor" ? c.patient : c.doctor
      );
      setContacts(ctcts);
      setConversations(convRes.data);
      setLoading(false);
    };
    load();
  }, [user]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeId) return;
    fetchMessages(activeId).then(({ data }) => setMessages(data));
  }, [activeId]);

  // Real-time incoming messages
  useEffect(() => {
    if (!activeId) return;
    const roomId = [user._id, activeId].sort().join("_");
    socket.emit("joinChat", roomId);

    const handler = (msg) => {
      if (msg.roomId === roomId) {
        setMessages((prev) => {
          // Avoid duplicate if we sent it ourselves
          const exists = prev.find((m) => m._id === msg._id);
          return exists ? prev : [...prev, msg];
        });
      }
    };
    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [activeId, user._id]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeId || sending) return;
    setSending(true);
    const { data } = await sendMessage(activeId, text.trim());
    setMessages((prev) => [...prev, data]);
    setText("");
    setSending(false);

    // Emit via socket too
    const roomId = [user._id, activeId].sort().join("_");
    socket.emit("sendMessage", { ...data, roomId });

    // Update conversation list
    setConversations((prev) => {
      const existing = prev.find((c) =>
        (c.sender._id === activeId || c.receiver._id === activeId)
      );
      if (!existing) return prev;
      return [{ ...existing, text: data.text }, ...prev.filter((c) => c !== existing)];
    });
  };

  const activeContact = contacts.find((c) => c?._id === activeId);

  if (loading) return <Loader />;

  return (
    <div className="fade-up h-[calc(100vh-130px)] flex gap-4">
      {/* Sidebar: contacts */}
      <div className="w-64 shrink-0 card flex flex-col overflow-hidden">
        <div className="p-4 border-b" style={{ borderColor: "var(--slate-100)" }}>
          <h3 className="font-semibold text-sm" style={{ fontFamily: "'DM Serif Display', serif" }}>Messages</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--slate-400)" }}>{contacts.length} contact{contacts.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="p-4 text-center text-xs" style={{ color: "var(--slate-400)" }}>
              No contacts yet. Connect with a {user.role === "doctor" ? "patient" : "doctor"} first.
            </div>
          ) : (
            contacts.map((c) => {
              if (!c) return null;
              const lastMsg = conversations.find(
                (m) => m.sender._id === c._id || m.receiver._id === c._id
              );
              const isActive = activeId === c._id;
              return (
                <button key={c._id} onClick={() => setActiveId(c._id)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all"
                  style={{
                    background: isActive ? "var(--teal-50)" : "transparent",
                    borderLeft: isActive ? "3px solid var(--teal-400)" : "3px solid transparent",
                  }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                    style={{ background: "var(--teal-50)" }}>
                    {c.role === "doctor" ? "👨‍⚕️" : "🧑"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{c.name}</p>
                    {lastMsg && (
                      <p className="text-xs truncate" style={{ color: "var(--slate-400)" }}>
                        {lastMsg.text}
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex-1 card flex flex-col overflow-hidden">
        {!activeId ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-3"
            style={{ color: "var(--slate-400)" }}>
            <p className="text-4xl">💬</p>
            <p className="font-medium">Select a contact to start chatting</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-5 py-3.5 border-b flex items-center gap-3"
              style={{ borderColor: "var(--slate-100)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: "var(--teal-50)" }}>
                {activeContact?.role === "doctor" ? "👨‍⚕️" : "🧑"}
              </div>
              <div>
                <p className="font-semibold text-sm">{activeContact?.name}</p>
                <p className="text-xs" style={{ color: "var(--teal-500)" }}>
                  {activeContact?.role === "doctor" ? "Your Doctor" : "Patient"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-xs"
                  style={{ color: "var(--slate-300)" }}>
                  No messages yet. Say hello! 👋
                </div>
              ) : (
                messages.map((m) => {
                  const mine = m.sender === user._id || m.sender?._id === user._id;
                  return (
                    <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className="max-w-xs px-4 py-2.5 rounded-2xl text-sm"
                        style={mine ? {
                          background: "linear-gradient(135deg, var(--teal-500), var(--teal-400))",
                          color: "white",
                          borderBottomRightRadius: "4px",
                        } : {
                          background: "var(--slate-100)",
                          color: "var(--slate-800)",
                          borderBottomLeftRadius: "4px",
                        }}>
                        {m.text}
                        <p className={`text-[10px] mt-1 ${mine ? "opacity-70 text-right" : ""}`}
                          style={{ color: mine ? "rgba(255,255,255,0.7)" : "var(--slate-400)" }}>
                          {new Date(m.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend}
              className="px-4 py-3 border-t flex gap-3 items-center"
              style={{ borderColor: "var(--slate-100)" }}>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="input-base flex-1"
              />
              <button type="submit" disabled={sending || !text.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all shrink-0"
                style={{
                  background: text.trim() ? "var(--teal-500)" : "var(--slate-200)",
                  cursor: text.trim() ? "pointer" : "default",
                }}>
                →
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
