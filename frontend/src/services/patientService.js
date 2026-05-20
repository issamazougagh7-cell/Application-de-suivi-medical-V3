import api from "../utils/api";

export const fetchPatients = () => api.get("/patients");
export const fetchPatient = (id) => api.get(`/patients/${id}`);
export const addPatient = (data) => api.post("/patients", data);
export const updatePatient = (id, data) => api.put(`/patients/${id}`, data);
export const removePatient = (id) => api.delete(`/patients/${id}`);