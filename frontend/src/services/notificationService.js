import api from "../utils/api";

export const fetchNotifications = () => api.get("/notifications");
export const markAllRead = () => api.put("/notifications/read-all");
export const markOneRead = (id) => api.put(`/notifications/${id}/read`);