import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchPatients } from "../services/patientService";
import { fetchAppointments } from "../services/appointmentService";
import { fetchPrescriptions } from "../services/prescriptionService";
import { getConnections } from "../services/connectionService";
import Loader from "../components/Loader";
import { formatDate } from "../utils/helpers";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ patients: [], appointments: [], prescriptions: [], connections: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [apt, presc, conn] = await Promise.all([
          fetchAppointments(), fetchPrescriptions(), getConnections()
        ]);
        if (user.role === "doctor") {
          const pat = await fetchPatients();
          setData({ patients: pat.data, appointments: apt.data, prescriptions: presc.data, connections: conn.data });
        } else {
          setData({ patients: [], appointments: apt.data, prescriptions: presc.data, connections: conn.data });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <Loader />;

  const upcoming = data.appointments.filter((a) => new Date(a.date) >= new Date()).slice(0, 3);
  const pending = data.connections.filter((c) => c.status === "pending");

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero greeting */}
      <div className="rounded-2xl p-6 mb-6 flex items-center justify-between fade-up"
        style={{ background: "linear-gradient(135deg, var(--teal-700) 0%, var(--teal-500) 100%)" }}>
        <div>
          <h2 className="text-2xl text-white mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Hello, {user.name} 👋
          </h2>
          <p style={{ color: "var(--teal-200)", fontSize: "0.875rem" }}>
            {user.role === "doctor"
              ? `You have ${pending.length} pending connection request${pending.length !== 1 ? "s" : ""}`
              : `You have ${data.appointments.length} appointment${data.appointments.length !== 1 ? "s" : ""} on record`}
          </p>
        </div>
        <div className="text-6xl opacity-20 hidden sm:block">⚕️</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {user.role === "doctor" && (
          <StatCard label="Patients" value={data.patients.length} icon="🧑‍💼" delay={1} color="teal" />
        )}
        <StatCard label="Appointments" value={data.appointments.length} icon="📅" delay={2} color="blue" />
        <StatCard label="Prescriptions" value={data.prescriptions.length} icon="💊" delay={3} color="purple" />
        <StatCard label={user.role === "doctor" ? "Requests" : "Doctors"} value={data.connections.length} icon="🔗" delay={4} color="gold" />
      </div>

      {/* Upcoming appointments */}
      {upcoming.length > 0 && (
        <div className="card p-5 fade-up delay-2">
          <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Upcoming Appointments
          </h3>
          <div className="flex flex-col gap-3">
            {upcoming.map((a) => (
              <div key={a._id} className="flex items-center justify-between py-2 border-b last:border-0"
                style={{ borderColor: "var(--slate-100)" }}>
                <div>
                  <p className="text-sm font-medium">{a.patient?.name || a.doctor?.name}</p>
                  <p className="text-xs" style={{ color: "var(--slate-400)" }}>{a.reason || "No reason specified"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatDate(a.date)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full badge-${a.status}`}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctor: pending requests */}
      {user.role === "doctor" && pending.length > 0 && (
        <div className="card p-5 mt-4 fade-up delay-3">
          <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Pending Connection Requests
          </h3>
          <div className="flex flex-col gap-2">
            {pending.map((c) => (
              <div key={c._id} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "var(--teal-50)" }}>
                <div>
                  <p className="text-sm font-medium">{c.patient?.name}</p>
                  <p className="text-xs" style={{ color: "var(--slate-400)" }}>{c.patient?.email}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full badge-pending">Pending</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, delay, color }) {
  const colors = {
    teal:   { bg: "linear-gradient(135deg, var(--teal-500), var(--teal-400))", shadow: "rgba(13,122,158,0.3)" },
    blue:   { bg: "linear-gradient(135deg, #3b82f6, #60a5fa)", shadow: "rgba(59,130,246,0.3)" },
    purple: { bg: "linear-gradient(135deg, #8b5cf6, #a78bfa)", shadow: "rgba(139,92,246,0.3)" },
    gold:   { bg: "linear-gradient(135deg, #d97706, var(--gold-400))", shadow: "rgba(217,119,6,0.3)" },
  };
  const { bg, shadow } = colors[color];
  return (
    <div className={`rounded-2xl p-5 text-white fade-up delay-${delay}`}
      style={{ background: bg, boxShadow: `0 8px 24px ${shadow}` }}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-0.5 opacity-80">{label}</p>
    </div>
  );
}
