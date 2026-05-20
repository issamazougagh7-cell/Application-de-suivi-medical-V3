import { formatDate } from "../utils/helpers";

export default function AppointmentCard({ appointment }) {
  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-1">
      <p className="font-semibold">{appointment.patient?.name || "Patient"}</p>
      <p className="text-sm text-gray-500">Date: {formatDate(appointment.date)}</p>
      <p className="text-sm text-gray-500">Reason: {appointment.reason || "—"}</p>
      <span className={`text-xs font-medium px-2 py-1 rounded-full w-fit ${statusColor[appointment.status]}`}>
        {appointment.status}
      </span>
    </div>
  );
}