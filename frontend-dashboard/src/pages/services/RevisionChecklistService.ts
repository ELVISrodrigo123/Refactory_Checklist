import axios from "axios";
import {
  RevisionChecklist,
  CreateRevisionPayload,
  UpdateRevisionPayload,
} from "../models/RevisionChecklist";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/revisiones/`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getRevisionesByRespuesta = async (respuestaId: number) => {
  try {
    const response = await api.get(`?respuesta=${respuestaId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching revisiones for respuesta ${respuestaId}:`,
      error
    );
    throw new Error("No se pudieron obtener las revisiones");
  }
};

export const crearRevision = async (payload: {
  respuesta: number;
  estado: string;
  observaciones: string;
  usuario: number | null;
}) => {
  try {
    const response = await api.post("", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating revision:", error);
    throw new Error("No se pudo crear la revisión");
  }
};

export const updateRevision = async (
  id: number,
  payload: UpdateRevisionPayload
): Promise<RevisionChecklist> => {
  try {
    const response = await api.patch<RevisionChecklist>(`${id}/`, payload);
    return response.data;
  } catch (error: any) {
    console.error(
      `Error updating revision ${id}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || `Error al actualizar la revisión ${id}`
    );
  }
};

export const deleteRevision = async (id: number): Promise<void> => {
  try {
    await api.delete(`${id}/`);
  } catch (error: any) {
    console.error(
      `Error deleting revision ${id}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || `Error al eliminar la revisión ${id}`
    );
  }
};
