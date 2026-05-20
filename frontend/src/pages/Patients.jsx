import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchPatients, removePatient } from "../services/patientService";
import Loader from "../components/Loader";
import { generatePatientPDF } from "../utils/pdfExport";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients().then(({ data }) => {
      setPatients(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Delete this patient?")) {
      await removePatient(id);
      setPatients((prev) => prev.filter((p) => p._id !== id));
    }
  };

  if (loading) return <Loader />;

  const filtered = patients
    .filter((p) => genderFilter === "all" || p.gender === genderFilter)
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search)
    );

  return (
    <div className="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl" style={{ fontFamily: "'DM Serif Display', serif" }}>Patients</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--slate-400)" }}>
            {patients.length} total patient{patients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link to="/patients/add" className="btn-primary text-sm">+ Add Patient</Link>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base flex-1"
        />
        <div className="flex gap-2">
          {["all", "male", "female"].map((g) => (
            <button key={g} onClick={() => setGenderFilter(g)}
              className="text-xs font-semibold px-3 py-2 rounded-xl capitalize transition-all"
              style={{
                background: genderFilter === g ? "var(--teal-500)" : "white",
                color: genderFilter === g ? "white" : "var(--slate-600)",
                border: `1px solid ${genderFilter === g ? "var(--teal-500)" : "var(--slate-200)"}`,
              }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 card" style={{ color: "var(--slate-400)" }}>
          <p className="text-4xl mb-3">🧑‍💼</p>
          <p className="font-medium">No patients found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <div key={p._id} className={`card p-5 flex flex-col gap-3 fade-up delay-${Math.min(i + 1, 4)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: p.gender === "female" ? "#fdf2f8" : "var(--teal-50)" }}>
                    {p.gender === "female" ? "👩" : "👨"}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs" style={{ color: "var(--slate-400)" }}>
                      {p.age} yrs · {p.gender}
                    </p>
                  </div>
                </div>
              </div>

              {p.phone && (
                <p className="text-xs" style={{ color: "var(--slate-500)" }}>📞 {p.phone}</p>
              )}

              {p.medicalHistory && (
                <p className="text-xs px-2 py-1.5 rounded-lg line-clamp-2"
                  style={{ background: "var(--teal-50)", color: "var(--teal-700)" }}>
                  {p.medicalHistory}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button onClick={() => navigate(`/patients/edit/${p._id}`)}
                  className="flex-1 text-xs font-semibold py-2 rounded-xl transition-all"
                  style={{ background: "var(--teal-50)", color: "var(--teal-600)" }}>
                  Edit
                </button>
                <button onClick={() => generatePatientPDF(p)}
                  className="flex-1 text-xs font-semibold py-2 rounded-xl transition-all"
                  style={{ background: "#f0fdf4", color: "#065f46" }}>
                  📄 Export
                </button>
                <button onClick={() => handleDelete(p._id)}
                  className="flex-1 text-xs font-semibold py-2 rounded-xl transition-all"
                  style={{ background: "#fef2f2", color: "#991b1b" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}