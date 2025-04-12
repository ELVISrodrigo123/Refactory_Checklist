import axios from "axios";
import {
  RespuestaChecklist,
  CreateRespuestaChecklistPayload,
  UpdateRespuestaChecklistPayload,
} from "../models/RespuestaChecklist";
import {
  CreateRespuestaTareaPayload,
  UpdateRespuestaTareaPayload,
  RespuestaTarea,
} from "../models/RespuestaTarea";
import {
  createRespuestaTarea,
  getRespuestasTareasByRespuesta,
  updateRespuestaTarea,
  deleteRespuestaTarea,
} from "../services/RespuestaTareaService";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/respuestas/`;

// Configuración común de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Funciones básicas CRUD
export const getRespuestas = async (params?: {
  formulario?: number;
  usuario?: number;
}): Promise<RespuestaChecklist[]> => {
  try {
    const response = await api.get<RespuestaChecklist[]>("", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching respuestas:", error);
    throw new Error(
      "No se pudieron obtener las respuestas. Por favor, intente nuevamente."
    );
  }
};

export const getRespuestaById = async (
  id: number
): Promise<RespuestaChecklist> => {
  try {
    const response = await api.get<RespuestaChecklist>(`${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching respuesta con ID ${id}:`, error);
    throw new Error(`No se pudo obtener la respuesta con ID ${id}`);
  }
};

export const createRespuesta = async (
  payload: CreateRespuestaChecklistPayload
): Promise<RespuestaChecklist> => {
  try {
    // Validaciones mejoradas
    if (!payload.formulario || isNaN(Number(payload.formulario))) {
      throw new Error("ID de formulario inválido o faltante");
    }

    if (!payload.usuario || isNaN(Number(payload.usuario))) {
      throw new Error("ID de usuario inválido o faltante");
    }

    console.log("Enviando payload a /api/respuestas:", payload); // Log para depuración

    const response = await api.post<RespuestaChecklist>("", payload);

    console.log("Respuesta recibida:", response.data); // Log para depuración

    return response.data;
  } catch (error: any) {
    console.error("Error detallado al crear respuesta:", {
      error: error.response?.data || error.message,
      request: {
        url: API_BASE_URL,
        payload,
      },
    });

    // Mejorar mensaje de error para el usuario
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Error al crear la respuesta. Verifique los datos e intente nuevamente.";

    throw new Error(errorMessage);
  }
};

// En services/RespuestaChecklistService.ts

export const updateRespuesta = async (
  id: number,
  payload: {
    comentario_general?: string;
    respuestas_tareas?: Array<{
      id?: number;
      tarea: number;
      estado_bueno: boolean;
      estado_malo: boolean;
      comentario?: string;
    }>;
  }
): Promise<RespuestaChecklist & { respuestas_tareas: RespuestaTarea[] }> => {
  try {
    // 1. Actualizar la respuesta principal
    const respuestaActualizada = await api.patch<RespuestaChecklist>(`${id}/`, {
      comentario_general: payload.comentario_general
    });

    // 2. Actualizar cada tarea individualmente
    const tareasActualizadas: RespuestaTarea[] = [];
    
    if (payload.respuestas_tareas && payload.respuestas_tareas.length > 0) {
      for (const tareaPayload of payload.respuestas_tareas) {
        if (tareaPayload.id) {
          // Actualizar tarea existente
          const tareaActualizada = await api.patch<RespuestaTarea>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/respuestas-tareas/${tareaPayload.id}/`,
            {
              estado_bueno: tareaPayload.estado_bueno,
              estado_malo: tareaPayload.estado_malo,
              comentario: tareaPayload.comentario || ""
            }
          );
          tareasActualizadas.push(tareaActualizada.data);
        } else {
          // Crear nueva tarea (si es necesario)
          const tareaCreada = await api.post<RespuestaTarea>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/respuestas-tareas/`,
            {
              tarea: tareaPayload.tarea,
              respuesta: id,
              estado_bueno: tareaPayload.estado_bueno,
              estado_malo: tareaPayload.estado_malo,
              comentario: tareaPayload.comentario || ""
            }
          );
          tareasActualizadas.push(tareaCreada.data);
        }
      }
    }

    return {
      ...respuestaActualizada.data,
      respuestas_tareas: tareasActualizadas
    };

  } catch (error: any) {
    console.error("Error en updateRespuesta:", {
      error: error.response?.data || error.message,
      payload
    });

    let errorMessage = "Error al actualizar la respuesta";
    if (error.response?.status === 401) {
      errorMessage = "Sesión expirada. Por favor, inicie sesión nuevamente";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};

export const deleteRespuesta = async (id: number): Promise<void> => {
  try {
    // Primero eliminar las respuestas de tareas asociadas
    const tareas = await getRespuestasTareasByRespuesta(id);
    await Promise.all(
      tareas.map((tarea) => {
        if (tarea.id) {
          return deleteRespuestaTarea(tarea.id);
        }
        return Promise.resolve();
      })
    );

    // Luego eliminar la respuesta principal
    await api.delete(`${id}/`);
  } catch (error: any) {
    console.error(
      `Error deleting respuesta con ID ${id}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        `Error al eliminar la respuesta con ID ${id}`
    );
  }
};
// Modifica esta parte del código:
export const createCompleteRespuesta = async (
  payload: {
    formulario: number;
    usuario: number;
    comentario_general: string;
    respuestas_tareas: Array<{
      tarea: number;
      estado_bueno: boolean;
      estado_malo: boolean;
      comentario?: string;
    }>;
  }
): Promise<RespuestaChecklist & { respuestas_tareas: RespuestaTarea[] }> => {
  try {
    // 1. Verificar autenticación primero
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    // 2. Validaciones de payload
    if (!payload.formulario || isNaN(Number(payload.formulario))) {
      throw new Error("ID de formulario inválido o faltante");
    }

    if (!payload.usuario || isNaN(Number(payload.usuario))) {
      throw new Error("ID de usuario inválido o faltante");
    }

    if (!Array.isArray(payload.respuestas_tareas)) {
      throw new Error("Las respuestas de tareas deben ser un arreglo");
    }

    // Configuración común de headers
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 3. Crear respuesta principal usando la instancia de api configurada
    const respuestaCreada = await api.post<RespuestaChecklist>("", {
      formulario: payload.formulario,
      usuario: payload.usuario,
      comentario_general: payload.comentario_general
    });

    // 4. Crear tareas asociadas usando la misma instancia de api
    const tareasPromises = payload.respuestas_tareas.map(tarea => {
      const tareaPayload: CreateRespuestaTareaPayload = {
        tarea: tarea.tarea,
        respuesta: respuestaCreada.data.id,
        estado_bueno: tarea.estado_bueno,
        estado_malo: tarea.estado_malo,
        comentario: tarea.comentario || ""
      };

      return api.post<RespuestaTarea>(`${process.env.NEXT_PUBLIC_API_URL}/api/respuestas-tareas/`, tareaPayload)
        .then(response => response.data)
        .catch(async error => {
          // Si falla alguna tarea, hacer rollback
          await api.delete(`${respuestaCreada.data.id}/`);
          throw new Error(`Error al crear tarea: ${error.response?.data?.message || error.message}`);
        });
    });

    const tareasCreadas = await Promise.all(tareasPromises);

    return {
      ...respuestaCreada.data,
      respuestas_tareas: tareasCreadas
    };

  } catch (error: any) {
    console.error("Error en createCompleteRespuesta:", {
      error: error.response?.data || error.message,
      stack: error.stack
    });

    // Mejorar mensaje de error
    let errorMessage = "Error al procesar la solicitud completa";
    
    if (error.response?.status === 401) {
      errorMessage = "Sesión expirada. Por favor, inicie sesión nuevamente";
      // Redirigir a login si es un error 401
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};