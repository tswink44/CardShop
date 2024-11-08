import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000", // Replace with your FastAPI backend URL
});

export const getCards = async () => {
    try {
        const response = await api.get("/cards");
        return response.data;
    } catch (error) {
        console.error("Error fetching cards:", error);
        throw error;
    }
};

export const getCardDetails = async (id) => {
    try {
        const response = await api.get(`/cards/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching card details:", error);
        throw error;
    }
};
