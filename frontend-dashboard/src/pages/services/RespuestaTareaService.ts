import axios from "axios";
import {
  RespuestaTarea,
  CreateRespuestaTareaPayload,
  UpdateRespuestaTareaPayload,
} from "../models/RespuestaTarea";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/respuestas-tareas/`;

// Configuración de axios con interceptores
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      throw new Error("No se encontró token de autenticación");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      let errorMessage = "Error en el servidor";

      if (status === 400) {
        errorMessage = error.response.data?.message || "Datos inválidos";
      } else if (status === 401) {
        errorMessage = "No autorizado - Por favor inicie sesión nuevamente";
      } else if (status === 403) {
        errorMessage = "Prohibido - No tiene permisos para esta acción";
      } else if (status === 404) {
        errorMessage = "Recurso no encontrado";
      } else if (status === 500) {
        errorMessage = error.response.data?.message || "Error interno del servidor";
      }

      error.message = errorMessage;
    } else if (error.request) {
      error.message = "No se recibió respuesta del servidor";
    } else {
      error.message = "Error al configurar la solicitud";
    }

    return Promise.reject(error);
  }
);

export const getRespuestasTareas = async (params?: {
  respuesta?: number;
  tarea?: number;
}): Promise<RespuestaTarea[]> => {
  try {
    const response = await api.get<RespuestaTarea[]>("", { params });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching respuestas tareas:", error);
    throw error;
  }
};

export const getRespuestasTareasByRespuesta = async (
  respuestaId: number
): Promise<RespuestaTarea[]> => {
  return getRespuestasTareas({ respuesta: respuestaId });
};

export const getRespuestaTareaById = async (
  id: number
): Promise<RespuestaTarea> => {
  try {
    const response = await api.get<RespuestaTarea>(`${id}/`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching respuesta tarea con ID ${id}:`, error);
    throw error;
  }
};

export const createRespuestaTarea = async (
  payload: CreateRespuestaTareaPayload
): Promise<RespuestaTarea> => {
  try {
    // Validación de los checkboxes
    if (payload.estado_bueno && payload.estado_malo) {
      throw new Error(
        "Una tarea no puede estar marcada como buena y mala simultáneamente"
      );
    }

    if (!payload.estado_bueno && !payload.estado_malo) {
      throw new Error("Debe seleccionar al menos una opción (Bueno o Malo)");
    }

    // Validación de campos requeridos
    if (!payload.tarea || isNaN(Number(payload.tarea))) {
      throw new Error("ID de tarea inválido o faltante");
    }

    if (!payload.respuesta || isNaN(Number(payload.respuesta))) {
      throw new Error("ID de respuesta inválido o faltante");
    }

    const response = await api.post<RespuestaTarea>("", payload);
    return response.data;
  } catch (error: any) {
    console.error("Error creating respuesta tarea:", {
      error: error.message,
      payload,
    });
    throw error;
  }
};

export const createRespuestasTareasBulk = async (
  respuestas: CreateRespuestaTareaPayload[]
): Promise<RespuestaTarea[]> => {
  try {
    // Validar todas las respuestas antes de enviar
    respuestas.forEach((respuesta) => {
      if (respuesta.estado_bueno && respuesta.estado_malo) {
        throw new Error(
          `La tarea ${respuesta.tarea} no puede estar marcada como buena y mala simultáneamente`
        );
      }
      if (!respuesta.estado_bueno && !respuesta.estado_malo) {
        throw new Error(
          `Debe seleccionar al menos una opción (Bueno o Malo) para la tarea ${respuesta.tarea}`
        );
      }
    });

    const promises = respuestas.map((respuesta) =>
      createRespuestaTarea(respuesta)
    );
    return await Promise.all(promises);
  } catch (error: any) {
    console.error("Error creating bulk respuestas tareas:", error);
    throw error;
  }
};

export const updateRespuestaTarea = async (
  id: number,
  payload: UpdateRespuestaTareaPayload
): Promise<RespuestaTarea> => {
  try {
    // Validación de los checkboxes
    if (payload.estado_bueno && payload.estado_malo) {
      throw new Error(
        "Una tarea no puede estar marcada como buena y mala simultáneamente"
      );
    }

    const response = await api.patch<RespuestaTarea>(`${id}/`, payload);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating respuesta tarea con ID ${id}:`, error);
    throw error;
  }
};

export const updateRespuestasTareasBulk = async (
  updates: { id: number; payload: UpdateRespuestaTareaPayload }[]
): Promise<RespuestaTarea[]> => {
  try {
    // Validar todas las actualizaciones antes de enviar
    updates.forEach(({ payload }) => {
      if (payload.estado_bueno && payload.estado_malo) {
        throw new Error(
          "Una tarea no puede estar marcada como buena y mala simultáneamente"
        );
      }
    });

    const promises = updates.map(({ id, payload }) =>
      updateRespuestaTarea(id, payload)
    );
    return await Promise.all(promises);
  } catch (error: any) {
    console.error("Error updating bulk respuestas tareas:", error);
    throw error;
  }
};

export const deleteRespuestaTarea = async (id: number): Promise<void> => {
  try {
    await api.delete(`${id}/`);
  } catch (error: any) {
    console.error(`Error deleting respuesta tarea con ID ${id}:`, error);
    throw error;
  }
};