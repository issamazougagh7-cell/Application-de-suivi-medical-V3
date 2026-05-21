import { useState } from "react";
import { searchDoctorByEmail, sendConnectionRequest } from "../services/connectionService";

export default function FindDoctor() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(""); setResult(null); setRequestSent(false);
    setLoading(true);
    try {
      const { data } = await searchDoctorByEmail(email);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "No doctor found");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      await sendConnectionRequest(result.doctor._id);
      setRequestSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send request");
    }
  };

  const statusLabel = {
    pending: { text: "Request Pending", badge: "badge-pending" },
    accepted: { text: "Already Connected", badge: "badge-accepted" },
    rejected: { text: "Request Rejected", badge: "badge-rejected" },
  };

  return (
    <div className="max-w-lg mx-auto fade-up">
      <h2 className="text-3xl mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>Find Your Doctor</h2>
      <p className="text-sm mb-6" style={{ color: "var(--slate-400)" }}>
        Search for a doctor by their email address and send a connection request.
      </p>

      <div className="card p-6 mb-5">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="email"
            placeholder="doctor@clinic.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base flex-1"
            required
          />
          <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
            {loading ? "..." : "Search"}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm mb-4 fade-up" style={{ background: "#fef2f2", color: "#991b1b" }}>
          {error}
        </div>
      )}

      {result && (
        <div className="card p-6 fade-up">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: "var(--teal-50)", border: "2px solid var(--teal-200)" }}>
                👨‍⚕️
              </div>
              <div>
                <h3 className="font-semibold text-lg">{result.doctor.name}</h3>
                <p className="text-sm" style={{ color: "var(--slate-400)" }}>{result.doctor.email}</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block"
                  style={{ background: "var(--teal-50)", color: "var(--teal-600)" }}>
                  Doctor
                </span>
              </div>
            </div>
          </div>

          {requestSent || result.connectionStatus ? (
            <div className={`text-sm font-medium text-center py-2.5 rounded-xl ${
              requestSent || result.connectionStatus === "pending" ? "badge-pending" :
              result.connectionStatus === "accepted" ? "badge-accepted" : "badge-rejected"
            }`}>
              {requestSent ? "✓ Request Sent!" : statusLabel[result.connectionStatus]?.text}
            </div>
          ) : (
            <button onClick={handleConnect} className="btn-primary w-full">
              Send Connection Request
            </button>
          )}
        </div>)}

      
      <div className="mt-8 p-5 rounded-2xl fade-up delay-2" style={{ background: "var(--teal-50)", border: "1px dashed var(--teal-200)" }}>
        <p className="text-sm font-semibold mb-1" style={{ color: "var(--teal-700)" }}>How it works</p>
        <ol className="text-sm space-y-1" style={{ color: "var(--slate-600)" }}>
          <li>1. Search for your doctor using their email</li>
          <li>2. Send a connection request</li>
          <li>3. Once accepted, your doctor can schedule appointments & prescriptions for you</li>
          <li>4. All data will appear on your dashboard</li>
        </ol>
      </div>
    </div>
  );
}
