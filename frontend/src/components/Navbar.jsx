import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { fetchNotifications, markAllRead, markOneRead } from "../services/notificationService";
import socket from "../utils/socket";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    fetchNotifications().then(({ data }) => setNotifs(data));
  }, []);

  useEffect(() => {
    const handler = (notif) => {
      setNotifs((prev) => [notif, ...prev]);
    };
    socket.on("notification", handler);
    return () => socket.off("notification", handler);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkAll = async () => {
    await markAllRead();
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClickNotif = async (n) => {
    if (!n.read) {
      await markOneRead(n._id);
      setNotifs((prev) => prev.map((x) => x._id === n._id ? { ...x, read: true } : x));
    }
    setOpen(false);
    navigate(n.link);
  };

  const typeIcon = {
    appointment: "📅",
    prescription: "💊",
    connection_request: "🔗",
    connection_accepted: "✅",
    message: "💬",
  };

  const roleColor = user?.role === "doctor"
    ? { bg: "var(--teal-50)", color: "var(--teal-700)" }
    : { bg: "#f0fdf4", color: "#065f46" };

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <header className="bg-white border-b px-6 py-3.5 flex justify-between items-center z-10 relative"
      style={{ borderColor: "var(--slate-200)" }}>
      <div>
        <p className="text-sm font-semibold" style={{ color: "var(--slate-800)" }}>
          Good day, <span style={{ color: "var(--teal-500)" }}>{user?.name}</span>
        </p>
        <p className="text-xs" style={{ color: "var(--slate-400)" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen(!open)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: open ? "var(--teal-50)" : "transparent", border: "1px solid var(--slate-200)" }}>
            <span className="text-base">🔔</span>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ background: "#ef4444" }}>
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl shadow-xl border overflow-hidden z-50"
              style={{ background: "white", borderColor: "var(--slate-200)" }}>
              <div className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: "var(--slate-100)" }}>
                <p className="font-semibold text-sm">Notifications</p>
                {unread > 0 && (
                  <button onClick={handleMarkAll} className="text-xs font-medium"
                    style={{ color: "var(--teal-500)" }}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifs.length === 0 ? (
                  <div className="py-8 text-center text-sm" style={{ color: "var(--slate-400)" }}>
                    <p className="text-2xl mb-2">🔔</p>No notifications yet
                  </div>
                ) : (
                  notifs.map((n) => (
                    <button key={n._id} onClick={() => handleClickNotif(n)}
                      className="w-full text-left px-4 py-3 flex items-start gap-3 transition-all hover:bg-gray-50 border-b last:border-0"
                      style={{
                        borderColor: "var(--slate-50)",
                        background: n.read ? "white" : "var(--teal-50)",
                      }}>
                      <span className="text-lg mt-0.5">{typeIcon[n.type] || "🔔"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{n.title}</p>
                        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--slate-500)" }}>{n.body}</p>
                        <p className="text-[10px] mt-1" style={{ color: "var(--slate-400)" }}>
                          {new Date(n.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: "var(--teal-400)" }} />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-full capitalize"
          style={{ background: roleColor.bg, color: roleColor.color }}>
          {user?.role}
        </span>
        <button onClick={handleLogout}
          className="text-sm font-medium px-4 py-2 rounded-xl transition-all"
          style={{ color: "#991b1b", background: "#fef2f2" }}>
          Sign Out
        </button>
      </div>
    </header>
  );
}
