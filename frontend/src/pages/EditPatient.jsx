import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPatient, updatePatient } from "../services/patientService";
import Loader from "../components/Loader";

export default function EditPatient() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatient(id).then(({ data }) => setForm(data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePatient(id, form);
    navigate("/patients");
  };

  if (!form) return <Loader />;

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Edit Patient</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input className="border rounded-lg px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="border rounded-lg px-3 py-2" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
        <select className="border rounded-lg px-3 py-2" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input className="border rounded-lg px-3 py-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <textarea className="border rounded-lg px-3 py-2" rows={3} value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Save Changes</button>
      </form>
    </div>
  );
}