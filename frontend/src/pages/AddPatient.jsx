import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPatient } from "../services/patientService";

export default function AddPatient() {
  const [form, setForm] = useState({ name: "", age: "", gender: "male", phone: "", medicalHistory: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPatient(form);
      navigate("/patients");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding patient");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Add Patient</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input className="border rounded-lg px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="border rounded-lg px-3 py-2" placeholder="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
        <select className="border rounded-lg px-3 py-2" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input className="border rounded-lg px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <textarea className="border rounded-lg px-3 py-2" placeholder="Medical History" rows={3} value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Add Patient</button>
      </form>
    </div>
  );
}