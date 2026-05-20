import { useEffect, useState } from "react";
import { fetchPrescriptions, addPrescription } from "../services/prescriptionService";
import { fetchPatients } from "../services/patientService";
import { getConnections } from "../services/connectionService";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/helpers";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    patient: "", patientUser: "", description: "",
    medications: [{ name: "", dosage: "", duration: "" }],
  });
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      const { data } = await fetchPrescriptions();
      setPrescriptions(data);
      if (user.role === "doctor") {
        const [patRes, connRes] = await Promise.all([fetchPatients(), getConnections()]);
        setPatients(patRes.data);
        setConnections(connRes.data.filter((c) => c.status === "accepted"));
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const addMedRow = () =>
    setForm({ ...form, medications: [...form.medications, { name: "", dosage: "", duration: "" }] });

  const updateMed = (i, key, val) => {
    const meds = [...form.medications];
    meds[i][key] = val;
    setForm({ ...form, medications: meds });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const { data } = await addPrescription(form);
    setPrescriptions([data, ...prescriptions]);
    setShowForm(false);
    setForm({ patient: "", patientUser: "", description: "", medications: [{ name: "", dosage: "", duration: "" }] });
  };

  if (loading) return <Loader />;

  const filtered = prescriptions.filter((p) => {
    const name = user.role === "doctor" ? p.patient?.name : p.doctor?.name;
    return (
      name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.medications?.some((m) => m.name?.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl" style={{ fontFamily: "'DM Serif Display', serif" }}>Prescriptions</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--slate-400)" }}>
            {prescriptions.length} record{prescriptions.length !== 1 ? "s" : ""}
          </p>
        </div>
        {user.role === "doctor" && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
            {showForm ? "Cancel" : "+ New Prescription"}
          </button>
        )}
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by patient, doctor, diagnosis, or medication..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base"
        />
      </div>

      {showForm && (
        <div className="card p-6 mb-6 fade-up">
          <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
            New Prescription
          </h3>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--slate-600)" }}>Patient</label>
                <select className="input-base" value={form.patient}
                  onChange={(e) => setForm({ ...form, patient: e.target.value })} required>
                  <option value="">Select patient</option>
                  {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--slate-600)" }}>
                  Connected User
                </label>
                <select className="input-base" value={form.patientUser}
                  onChange={(e) => setForm({ ...form, patientUser: e.target.value })}>
                  <option value="">— Link to user —</option>
                  {connections.map((c) => (
                    <option key={c._id} value={c.patient._id}>{c.patient.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--slate-600)" }}>Description / Diagnosis</label>
              <textarea className="input-base" rows={2} placeholder="Clinical notes..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--slate-600)" }}>
                  Medications
                </label>
                <button type="button" onClick={addMedRow}
                  className="text-xs font-semibold" style={{ color: "var(--teal-500)" }}>
                  + Add row
                </button>
              </div>
              {form.medications.map((m, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                  <input className="input-base text-xs" placeholder="Name" value={m.name}
                    onChange={(e) => updateMed(i, "name", e.target.value)} />
                  <input className="input-base text-xs" placeholder="Dosage" value={m.dosage}
                    onChange={(e) => updateMed(i, "dosage", e.target.value)} />
                  <input className="input-base text-xs" placeholder="Duration" value={m.duration}
                    onChange={(e) => updateMed(i, "duration", e.target.value)} />
                </div>
              ))}
            </div>
            <button type="submit" className="btn-primary w-full">Save Prescription</button>
          </form>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 card" style={{ color: "var(--slate-400)" }}>
          <p className="text-4xl mb-3">💊</p>
          <p className="font-medium">No prescriptions found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((p, i) => (
            <div key={p._id} className={`card p-5 fade-up delay-${Math.min(i + 1, 4)}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">
                    {user.role === "doctor" ? p.patient?.name : `Dr. ${p.doctor?.name}`}
                  </p>
                  <p className="text-xs" style={{ color: "var(--slate-400)" }}>{formatDate(p.date)}</p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--teal-50)", color: "var(--teal-600)" }}>
                  Rx
                </span>
              </div>
              <p className="text-sm mb-3" style={{ color: "var(--slate-600)" }}>{p.description}</p>
              {p.medications?.filter((m) => m.name).length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {p.medications.filter((m) => m.name).map((m, j) => (
                    <div key={j} className="flex items-center justify-between text-xs px-3 py-2 rounded-xl"
                      style={{ background: "var(--teal-50)" }}>
                      <span className="font-semibold" style={{ color: "var(--teal-700)" }}>{m.name}</span>
                      <span style={{ color: "var(--slate-500)" }}>{m.dosage} · {m.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}