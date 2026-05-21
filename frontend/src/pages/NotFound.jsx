import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-gray-500 text-lg">Page not found</p>
      <Link to="/" className="text-blue-600 hover:underline">← Go Home</Link>
    </div>
  );
}
