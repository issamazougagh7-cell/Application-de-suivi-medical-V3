export default function Loader() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 opacity-20" style={{ borderColor: "var(--teal-400)" }} />
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "var(--teal-400)", borderTopColor: "transparent" }} />
      </div>
    </div>
  );
}
