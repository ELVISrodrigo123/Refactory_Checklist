import { FormularioChecklist } from "../models/FormularioChecklist";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/formularios/`;

export const getFormularios = async (): Promise<FormularioChecklist[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener los formularios");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getFormularioById = async (
  id: number
): Promise<FormularioChecklist> => {
  try {
    const response = await fetch(`${API_URL}${id}/`);
    if (!response.ok) {
      throw new Error("Error al obtener el formulario");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createFormulario = async (
  formulario: Omit<FormularioChecklist, "id">
): Promise<FormularioChecklist> => {
  try {
    // Validación manual del código (debe ser provisto por el usuario)
    if (!formulario.codigo || !formulario.codigo.trim()) {
      throw new Error("El código es requerido");
    }

    // Validación de la versión
    if (!formulario.version || !formulario.version.trim()) {
      throw new Error("La versión es requerida");
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formulario),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear el formulario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createFormulario:", error);
    throw error;
  }
};

export const updateFormulario = async (
  id: number,
  formulario: FormularioChecklist
): Promise<FormularioChecklist> => {
  try {
    // Validaciones para la actualización
    if (!formulario.codigo || !formulario.codigo.trim()) {
      throw new Error("El código es requerido");
    }

    if (!formulario.version || !formulario.version.trim()) {
      throw new Error("La versión es requerida");
    }

    const response = await fetch(`${API_URL}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formulario),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar el formulario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateFormulario:", error);
    throw error;
  }
};

export const deleteFormulario = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el formulario");
    }
  } catch (error) {
    console.error("Error en deleteFormulario:", error);
    throw error;
  }
};

export const cambiarEstadoFormulario = async (
  id: number,
  nuevoEstado: FormularioChecklist["estado"]
): Promise<FormularioChecklist> => {
  try {
    const response = await fetch(`${API_URL}${id}/cambiar_estado/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    if (!response.ok) {
      throw new Error("Error al cambiar el estado del formulario");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en cambiarEstadoFormulario:", error);
    throw error;
  }
};

export const buscarFormularioPorCodigo = async (
  codigo: string
): Promise<FormularioChecklist[]> => {
  try {
    const todosFormularios = await getFormularios();

    return todosFormularios.filter((formulario) =>
      formulario.codigo.toLowerCase().includes(codigo.toLowerCase())
    );
  } catch (error) {
    console.error("Error al buscar formularios:", error);
    throw error;
  }
};

export const verificarCodigoUnico = async (
  codigo: string
): Promise<boolean> => {
  try {
    if (!codigo || !codigo.trim()) {
      return false;
    }

    const response = await fetch(
      `${API_URL}verificar_codigo/?codigo=${encodeURIComponent(codigo)}`
    );
    if (!response.ok) {
      throw new Error("Error al verificar el código");
    }
    const data = await response.json();
    return data.disponible;
  } catch (error) {
    console.error("Error en verificarCodigoUnico:", error);
    throw error;
  }
};
