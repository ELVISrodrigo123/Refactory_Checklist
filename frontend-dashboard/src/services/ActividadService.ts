import axios from 'axios';
import { Actividad } from '../models/ActividadModel';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/actividades/`;

const ActividadService = {
  getAll: async (): Promise<Actividad[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<Actividad> => {
    const response = await axios.get(`${API_URL}${id}/`);
    return response.data;
  },

  getByArtactividadId: async (artactividadId: number): Promise<Actividad[]> => {
    const response = await axios.get(`${API_URL}?artactividad=${artactividadId}`);
    return response.data;
  },

  create: async (actividad: Actividad): Promise<Actividad> => {
    if (!actividad.artactividad) {
      throw new Error('El campo artactividad es obligatorio.');
    }
    const response = await axios.post(API_URL, actividad);
    return response.data;
  },

  update: async (id: number, actividad: Actividad): Promise<Actividad> => {
    if (!actividad.artactividad) {
      throw new Error('El campo artactividad es obligatorio.');
    }
    const response = await axios.put(`${API_URL}${id}/`, actividad);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}${id}/`);
  }
};

export default ActividadService;
