import api from "../utils/api";

export const fetchConversations = () => api.get("/messages/conversations");
export const fetchMessages = (userId) => api.get(`/messages/${userId}`);
export const sendMessage = (receiverId, text) => api.post("/messages", { receiverId, text });
