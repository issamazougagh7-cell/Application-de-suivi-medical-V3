import { useEffect, useState } from "react";
import { getConnections, respondToConnection } from "../services/connectionService";
import Loader from "../components/Loader";

export default function Connections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConnections().then(({ data }) => {
      setConnections(data);
      setLoading(false);
    });
  }, []);

  const handleRespond = async (id, status) => {
    await respondToConnection(id, status);
    setConnections((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status } : c))
    );
  };

  if (loading) return <Loader />;

  const pending = connections.filter((c) => c.status === "pending");
  const others = connections.filter((c) => c.status !== "pending");

  return (
    <div className="max-w-2xl mx-auto fade-up">
      <h2 className="text-3xl mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>Patient Requests</h2>
      <p className="text-sm mb-6" style={{ color: "var(--slate-400)" }}>
        Manage connection requests from patients
      </p>

      {pending.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--teal-500)" }}>
            Pending ({pending.length})
          </p>
          <div className="flex flex-col gap-3">
            {pending.map((c) => (
              <div key={c._id} className="card p-5 flex items-center justify-between fade-up">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: "var(--teal-50)" }}>🧑</div>
                  <div>
                    <p className="font-semibold text-sm">{c.patient?.name}</p>
                    <p className="text-xs" style={{ color: "var(--slate-400)" }}>{c.patient?.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleRespond(c._id, "accepted")}
                    className="text-xs font-semibold px-4 py-2 rounded-xl transition-all text-white"
                    style={{ background: "var(--teal-500)" }}>
                    Accept
                  </button>
                  <button onClick={() => handleRespond(c._id, "rejected")}
                    className="text-xs font-semibold px-4 py-2 rounded-xl"
                    style={{ background: "#fef2f2", color: "#991b1b" }}>
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--slate-400)" }}>
            History
          </p>
          <div className="flex flex-col gap-3">
            {others.map((c) => (
              <div key={c._id} className="card p-4 flex items-center justify-between opacity-70">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                    style={{ background: "var(--slate-100)" }}>🧑</div>
                  <div>
                    <p className="font-medium text-sm">{c.patient?.name}</p>
                    <p className="text-xs" style={{ color: "var(--slate-400)" }}>{c.patient?.email}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full badge-${c.status}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {connections.length === 0 && (
        <div className="text-center py-16" style={{ color: "var(--slate-400)" }}>
          <p className="text-4xl mb-3">🔗</p>
          <p className="font-medium">No connection requests yet</p>
          <p className="text-sm mt-1">Patients will appear here when they search for you</p>
        </div>
      )}
    </div>
  );
}