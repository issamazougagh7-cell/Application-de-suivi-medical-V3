import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--teal-950)" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12"
        style={{ background: "linear-gradient(160deg, var(--teal-900) 0%, var(--teal-700) 100%)" }}>
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "var(--gold-400)" }}>⚕️</div>
            <span className="font-semibold text-white text-lg">MedTrack</span>
          </div>
          <h1 className="text-4xl text-white leading-tight mb-4">
            Modern healthcare,<br />
            <span style={{ color: "var(--gold-300)" }}>simplified.</span>
          </h1>
          <p className="text-base" style={{ color: "var(--teal-200)" }}>
            Connect doctors and patients in one seamless platform. Manage appointments, prescriptions, and care records with ease.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[["👨‍⚕️","For Doctors","Manage patients & schedules"],["🧑","For Patients","Access your health records"]].map(([icon, title, desc]) => (
            <div key={title} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="text-2xl mb-2">{icon}</div>
              <p className="font-semibold text-white text-sm">{title}</p>
              <p className="text-xs mt-1" style={{ color: "var(--teal-200)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md fade-up">
          <div className="card p-8" style={{ background: "white" }}>
            <h2 className="text-3xl mb-1" style={{ fontFamily: "'DM Serif Display', serif", color: "var(--slate-800)" }}>
              Welcome back
            </h2>
            <p className="text-sm mb-8" style={{ color: "var(--slate-400)" }}>Sign in to your account</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "#fef2f2", color: "#991b1b" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--slate-600)" }}>Email</label>
                <input type="email" placeholder="doctor@clinic.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-base" required />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--slate-600)" }}>Password</label>
                <input type="password" placeholder="••••••••" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-base" required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: "var(--slate-400)" }}>
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold" style={{ color: "var(--teal-500)" }}>Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}