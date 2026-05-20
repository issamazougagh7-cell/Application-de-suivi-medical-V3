import api from "../utils/api";

export const fetchPrescriptions = () => api.get("/prescriptions");
export const addPrescription = (data) => api.post("/prescriptions", data);
export const removePrescription = (id) => api.delete(`/prescriptions/${id}`);