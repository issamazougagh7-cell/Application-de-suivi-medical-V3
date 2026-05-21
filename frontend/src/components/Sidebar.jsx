import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const doctorLinks = [
    { to: "/", icon: "🏠", label: "Dashboard", end: true },
    { to: "/patients", icon: "🧑‍💼", label: "Patients" },
    { to: "/appointments", icon: "📅", label: "Appointments" },
    { to: "/prescriptions", icon: "💊", label: "Prescriptions" },
    { to: "/connections", icon: "🔗", label: "Requests" },
    { to: "/chat", icon: "💬", label: "Messages" },
  ];

  const patientLinks = [
    { to: "/", icon: "🏠", label: "Dashboard", end: true },
    { to: "/find-doctor", icon: "🔍", label: "Find Doctor" },
    { to: "/appointments", icon: "📅", label: "My Appointments" },
    { to: "/prescriptions", icon: "💊", label: "My Prescriptions" },
    { to: "/chat", icon: "💬", label: "Messages" },
  ];

  const links = user?.role === "doctor" ? doctorLinks : patientLinks;

  return (
    <aside className="w-60 flex flex-col py-6" style={{ background: "var(--teal-900)", minHeight: "100vh" }}>
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
          style={{ background: "var(--gold-400)" }}>⚕️</div>
        <div>
          <p className="font-bold text-white text-sm">MedTrack</p>
          <p className="text-xs" style={{ color: "var(--teal-200)" }}>
            {user?.role === "doctor" ? "Doctor Portal" : "Patient Portal"}
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-3 flex-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--teal-400)" }}>
          Menu
        </p>
        {links.map(({ to, icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? "text-white" : "text-slate-300 hover:text-white hover:bg-white/5"
              }`
            }
            style={({ isActive }) => isActive ? {
              background: "linear-gradient(135deg, var(--teal-500), var(--teal-400))",
              boxShadow: "0 4px 12px rgba(13,122,158,0.4)"
            } : {}}>
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mt-4">
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)" }}>
          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--teal-200)" }}>{user?.email}</p>
        </div>
      </div>
    </aside>
  );
}
