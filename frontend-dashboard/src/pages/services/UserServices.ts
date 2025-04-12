import { CustomUser } from "../models/UserModel";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/users/`;
const API_URL_REFRESH = `${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`; // Asegúrate de tener el endpoint correcto en las variables de entorno

// Función para refrescar el token (MISMO ARCHIVO)
const refreshToken = async (): Promise<string> => {
  const refreshTokenValue = localStorage.getItem("refreshToken");

  if (!refreshTokenValue) {
    throw new Error("No hay refresh token disponible.");
  }

  try {
    const refreshResponse = await axios.post(
      API_URL_REFRESH,
      { refresh: refreshTokenValue },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const newAccessToken = refreshResponse.data.access;
    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (error: any) {
    console.error(
      "Error al refrescar el token:",
      error.response?.data || error.message
    );
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    throw new Error("No se pudo refrescar el token. Inicia sesión nuevamente.");
  }
};

// Crear un usuario
export const createUser = async (data: Partial<CustomUser> | FormData): Promise<CustomUser> => {
  try {
    const isFormData = data instanceof FormData;
    const config = {
      headers: {
        ...(isFormData 
          ? {} 
          : { 'Content-Type': 'application/json' })
      }
    };

    const response = await axios.post(API_URL, data, config);
    
    if (response.data.tokens) {
      localStorage.setItem("accessToken", response.data.tokens.access);
      localStorage.setItem("refreshToken", response.data.tokens.refresh);
    }

    return response.data;
  } catch (error: any) {
    console.error("Error al crear el usuario:", error.response?.data || error.message);
    throw error;
  }
};
// Obtener la lista de usuarios
export const getUsers = async (): Promise<CustomUser[]> => {
  try {
    const token = localStorage.getItem("accessToken"); // Obtener el token actualizado

    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw new Error("Error al obtener los usuarios");
  }
};

// Actualizar un usuario
// services/UserServices.ts
export const updateUser = async (
  id: number,
  data: Partial<CustomUser> | FormData
): Promise<CustomUser> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No hay token disponible");

    const isFormData = data instanceof FormData;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData 
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' })
      }
    };

    // Depuración: Mostrar qué se está enviando
    if (isFormData) {
      const formData = data as FormData;
      console.log("Datos enviados (FormData):");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
    } else {
      console.log("Datos enviados (JSON):", data);
    }

    const response = await axios.patch(`${API_URL}${id}/`, data, config);
    
    // Depuración: Mostrar respuesta
    console.log("Respuesta del servidor:", response.data);
    
    return response.data;
  } catch (error: any) {
    console.error("Error completo:", {
      request: error.config?.data || error.config,
      response: error.response?.data,
      headers: error.response?.headers
    });
    throw error;
  }
};
// Eliminar un usuario
export const deleteUser = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem("accessToken"); // Obtener el token actualizado

    await axios.delete(`${API_URL}${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw new Error("Error al eliminar el usuario");
  }
};

// Subir imagen del usuario
export const uploadUserImage = async (
  id: number,
  file: File
): Promise<CustomUser> => {
  try {
    const token = localStorage.getItem("accessToken"); // Obtener el token actualizado
    const formData = new FormData();
    formData.append("photo", file);

    const response = await axios.put(`${API_URL}${id}/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error al subir la imagen:",
      error.response?.data || error.message
    );
    throw new Error("Error al subir la imagen");
  }
};

export const getCurrentUser = async (): Promise<CustomUser> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No autenticado");

    const response = await axios.get(`${API_URL}me/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener usuario:", error.response?.data || error.message);
    throw error;
  }
};