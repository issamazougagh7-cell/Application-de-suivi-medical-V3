import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--teal-50)" }}>
      <div className="w-full max-w-md fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "var(--teal-500)" }}>⚕️</div>
            <span className="font-semibold" style={{ color: "var(--teal-700)" }}>MedTrack</span>
          </div>
          <h2 className="text-3xl" style={{ fontFamily: "'DM Serif Display', serif" }}>Create your account</h2>
          <p className="text-sm mt-1" style={{ color: "var(--slate-400)" }}>Join the platform today</p>
        </div>

        <div className="card p-8">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {["patient", "doctor"].map((r) => (
              <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                className="py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all"
                style={{
                  borderColor: form.role === r ? "var(--teal-400)" : "var(--slate-200)",
                  background: form.role === r ? "var(--teal-50)" : "white",
                  color: form.role === r ? "var(--teal-600)" : "var(--slate-600)",
                }}>
                {r === "doctor" ? "👨‍⚕️ Doctor" : "🧑 Patient"}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "#fef2f2", color: "#991b1b" }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { label: "Full Name", key: "name", type: "text", placeholder: "Dr. Sarah Amrani" },
              { label: "Email", key: "email", type: "email", placeholder: "you@clinic.com" },
              { label: "Password", key: "password", type: "password", placeholder: "••••••••" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--slate-600)" }}>{label}</label>
                <input type={type} placeholder={placeholder} value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input-base" required />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "var(--slate-400)" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold" style={{ color: "var(--teal-500)" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
