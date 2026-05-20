import { formatDate } from "../utils/helpers";

export default function PrescriptionCard({ prescription }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-1">
      <p className="font-semibold">Patient: {prescription.patient?.name || "—"}</p>
      <p className="text-sm text-gray-500">Date: {formatDate(prescription.date)}</p>
      <p className="text-sm text-gray-700 mt-1">{prescription.description}</p>
      {prescription.medications?.length > 0 && (
        <ul className="mt-2 space-y-1">
          {prescription.medications.map((m, i) => (
            <li key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {m.name} — {m.dosage} for {m.duration}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}