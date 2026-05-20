const steps = [
  { key: "pending",   label: "Requested",  icon: "📋" },
  { key: "confirmed", label: "Confirmed",  icon: "✅" },
  { key: "completed", label: "Completed",  icon: "🏁" },
];

const cancelledStep = { key: "cancelled", label: "Cancelled", icon: "❌" };

export default function AppointmentTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 mt-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ background: "#fef2f2", color: "#991b1b" }}>
          ❌ Cancelled
        </div>
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center gap-0 mt-3">
      {steps.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all`}
                style={{
                  background: done ? (active ? "var(--teal-400)" : "var(--teal-200)") : "var(--slate-100)",
                  border: active ? "2px solid var(--teal-500)" : "2px solid transparent",
                  boxShadow: active ? "0 0 0 3px rgba(21,165,200,0.2)" : "none",
                }}>
                {done ? step.icon : <span style={{ color: "var(--slate-300)" }}>○</span>}
              </div>
              <span className="text-[10px] mt-1 font-medium whitespace-nowrap"
                style={{ color: done ? "var(--teal-600)" : "var(--slate-300)" }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-10 h-0.5 mb-3 mx-1 transition-all"
                style={{ background: i < currentIdx ? "var(--teal-300)" : "var(--slate-200)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}