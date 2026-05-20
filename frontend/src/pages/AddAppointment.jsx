import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addAppointment } from "../services/appointmentService";
import { fetchPatients } from "../services/patientService";
import { getConnections } from "../services/connectionService";

export default function AddAppointment() {
  const [form, setForm] = useState({ patient: "", patientUser: "", date: "", reason: "", notes: "", status: "pending" });
  const [patients, setPatients] = useState([]);
  const [connections, setConnections] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchPatients(), getConnections()]).then(([patRes, connRes]) => {
      setPatients(patRes.data);
      setConnections(connRes.data.filter((c) => c.status === "accepted"));
    });
  }, []);

  // When patient (Patient model) is selected, auto-find their patientUser from connections
  const handlePatientChange = (patientId) => {
    // Try to match by name or find manually — doctor maps Patient → User via connections
    setForm({ ...form, patient: patientId, patientUser: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addAppointment(form);
      navigate("/appointments");
    } catch (err) {
      setError(err.response?.data?.message || "Error scheduling appointment");
    }
  };

  return (
    <div className="max-w-lg mx-auto fade-up">
      <h2 className="text-3xl mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>Schedule Appointment</h2>
      <p className="text-sm mb-6" style={{ color: "var(--slate-400)" }}>Create a new appointment for a patient</p>

      <div className="card p-6">
        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "#fef2f2", color: "#991b1b" }}>{error}</div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--slate-600)" }}>Patient</label>
            <select className="input-base" value={form.patient} onChange={(e) => handlePatientChange(e.target.value)} required>
              <option value="">Select patient</option>
              {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>

          {connections.length > 0 && (
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--slate-600)" }}>
                Link to Connected Patient User <span style={{ color: "var(--slate-400)" }}>(optional — for visibility)</span>
              </label>
              <select className="input-base" value={form.patientUser} onChange={(e) => setForm({ ...form, patientUser: e.target.value })}>
                <option value="">— Select connected user —</option>
                {connections.map((c) => (
                  <option key={c._id} value={c.patient._id}>{c.patient.name} ({c.patient.email})</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--slate-600)" }}>Date & Time</label>
            <input type="datetime-local" className="input-base" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--slate-600)" }}>Reason</label>
            <input type="text" className="input-base" placeholder="e.g. Follow-up consultation" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--slate-600)" }}>Doctor Notes</label>
            <textarea className="input-base" rows={3} placeholder="Private notes visible to patient..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--slate-600)" }}>Status</label>
            <select className="input-base" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {["pending", "confirmed", "cancelled", "completed"].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary w-full mt-2">Schedule Appointment</button>
        </form>
      </div>
    </div>
  );
}