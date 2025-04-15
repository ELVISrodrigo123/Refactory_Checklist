const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export interface TituloChecklistResponse {
    id: number;
    nombre: string;
    formulario: number;
}
const fetchAPI = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Error HTTP! Estado: ${response.status}, Mensaje: ${errorData?.detail || "Error desconocido"}`);
    }

    return response.json();
};

export const getTitulosChecklist = async (formularioId: number): Promise<TituloChecklistResponse[]> => {
    return fetchAPI(`${API_URL}/titulos/?formulario=${formularioId}`);
};

export const createTituloChecklist = async (titulo: { nombre: string; formulario: number }) => {
    if (!titulo.nombre.trim() || !titulo.formulario) {
        throw new Error("El nombre y el formulario son obligatorios.");
    }
    return fetchAPI(`${API_URL}/titulos/`, {
        method: 'POST',
        body: JSON.stringify(titulo),
    });
};

export const updateTituloChecklist = async (id: number, titulo: { nombre: string; formulario: number }) => {
    if (!titulo.nombre.trim() || !titulo.formulario) {
        throw new Error("El nombre y el formulario son obligatorios.");
    }
    return fetchAPI(`${API_URL}/titulos/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(titulo),
    });
};

export const deleteTituloChecklist = async (id: number) => {
    const response = await fetch(`${API_URL}/titulos/${id}/`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Error HTTP! Estado: ${response.status}`);
};
