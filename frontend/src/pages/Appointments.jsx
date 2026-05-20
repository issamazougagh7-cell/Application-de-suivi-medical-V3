import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAppointments } from "../services/appointmentService";
import { updateAppointment } from "../services/appointmentService";
import Loader from "../components/Loader";
import AppointmentTimeline from "../components/AppointmentTimeline";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/helpers";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments().then(({ data }) => {
      setAppointments(data);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (id, status) => {
    const { data } = await updateAppointment(id, { status });
    setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status: data.status } : a));
  };

  if (loading) return <Loader />;

  const filtered = appointments
    .filter((a) => filter === "all" || a.status === filter)
    .filter((a) => {
      const name = user.role === "doctor" ? a.patient?.name : a.doctor?.name;
      return name?.toLowerCase().includes(search.toLowerCase()) ||
        a.reason?.toLowerCase().includes(search.toLowerCase());
    });

  return (
    <div className="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl" style={{ fontFamily: "'DM Serif Display', serif" }}>Appointments</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--slate-400)" }}>
            {appointments.length} total · {appointments.filter((a) => a.status === "pending").length} pending
          </p>
        </div>
        {user.role === "doctor" && (
          <Link to="/appointments/add" className="btn-primary text-sm inline-flex items-center gap-2">
            + Schedule Appointment
          </Link>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder={user.role === "doctor" ? "Search by patient or reason..." : "Search by doctor or reason..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base flex-1"
        />
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className="text-xs font-semibold px-3 py-2 rounded-xl capitalize transition-all"
              style={{
                background: filter === s ? "var(--teal-500)" : "white",
                color: filter === s ? "white" : "var(--slate-600)",
                border: `1px solid ${filter === s ? "var(--teal-500)" : "var(--slate-200)"}`,
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 card" style={{ color: "var(--slate-400)" }}>
          <p className="text-4xl mb-3">📅</p>
          <p className="font-medium">No appointments found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((a, i) => (
            <div key={a._id} className={`card p-5 fade-up delay-${Math.min(i + 1, 4)}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: "var(--teal-50)" }}>
                    {user.role === "doctor" ? "🧑" : "👨‍⚕️"}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {user.role === "doctor" ? a.patient?.name : `Dr. ${a.doctor?.name}`}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--slate-400)" }}>
                      {a.reason || "No reason specified"}
                    </p>
                    {a.notes && (
                      <p className="text-xs mt-1 italic px-2 py-1 rounded-lg inline-block"
                        style={{ background: "var(--teal-50)", color: "var(--teal-700)" }}>
                        📝 {a.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{formatDate(a.date)}</p>
                  {user.role === "doctor" && a.status !== "cancelled" && a.status !== "completed" && (
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a._id, e.target.value)}
                      className="mt-1 text-xs border rounded-lg px-2 py-1 outline-none cursor-pointer"
                      style={{ borderColor: "var(--slate-200)" }}>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  )}
                </div>
              </div>
              <AppointmentTimeline status={a.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}