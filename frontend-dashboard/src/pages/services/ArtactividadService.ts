import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/artactividad/`; // Cambia según tu backend

export interface Artactividad {
    id?: number;
    nombre: string;
    descripcion: string;
}

const ArtactividadService = {
    listarTodos: async (): Promise<Artactividad[]> => {
    const response = await axios.get<Artactividad[]>(API_URL);
    return response.data;
    },

    obtenerPorId: async (id: number): Promise<Artactividad> => {
    const response = await axios.get<Artactividad>(`${API_URL}${id}/`);
    return response.data;
    },

    crearArtactividad: async (data: Artactividad): Promise<Artactividad> => {
    const response = await axios.post<Artactividad>(API_URL, data);
    return response.data;
    },

    actualizarArtactividad: async (id: number, data: Artactividad): Promise<Artactividad> => {
    const response = await axios.put<Artactividad>(`${API_URL}${id}/`, data);
    return response.data;
    },

    eliminarArtactividad: async (id: number): Promise<boolean> => {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.status === 204;
    },
};

export default ArtactividadService;
