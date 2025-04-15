import axios from "axios";
import { Riesgo } from "../models/Riesgo";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/`;

export const getRiesgosPorActividad = async (actividadId: number): Promise<Riesgo[]> => {
    try {
        const response = await axios.get(`${API_URL}/actividad/${actividadId}/riesgos/`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los riesgos:", error);
        return [];
    }
};
