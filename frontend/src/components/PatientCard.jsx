import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function PatientCard({ patient, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (confirm("Delete this patient?")) {
      await api.delete(`/patients/${patient._id}`);
      onDelete(patient._id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
      <h3 className="font-semibold text-gray-800">{patient.name}</h3>
      <p className="text-sm text-gray-500">Age: {patient.age} · {patient.gender}</p>
      <p className="text-sm text-gray-500">Phone: {patient.phone || "N/A"}</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => navigate(`/patients/edit/${patient._id}`)}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}