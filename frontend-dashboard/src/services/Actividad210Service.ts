import axios from 'axios';
import { Actividad } from '../models/ActividadModel';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/actividades/`;

interface Peligro {
  id: number;
  descripcion: string;
  actividad: Actividad;
}

interface Riesgo {
  id: number;
  descripcion: string;
  actividad: Actividad;
}

interface MedidaControl {
  id: number;
  descripcion: string;
  actividad: Actividad;
}

const Actividad210Service = {
  // Obtener actividades filtradas por artactividadId
  getByArtactividadId: async (artactividadId: number): Promise<Actividad[]> => {
    const response = await axios.get(
      `${API_URL}?artactividad=${artactividadId}`
    );
    return response.data;
  },

  // Obtener peligros por actividadId
  getPeligrosByActividadId: async (actividadId: number): Promise<Peligro[]> => {
    const response = await axios.get(`${API_URL}${actividadId}/peligros/`);
    return response.data;
  },

  // Obtener riesgos por actividadId
  getRiesgosByActividadId: async (actividadId: number): Promise<Riesgo[]> => {
    const response = await axios.get(`${API_URL}${actividadId}/riesgos/`);
    return response.data;
  },

  // Obtener medidas de control por actividadId
  getMedidasByActividadId: async (
    actividadId: number
  ): Promise<MedidaControl[]> => {
    const response = await axios.get(
      `${API_URL}${actividadId}/medidascontrol/`
    );
    return response.data;
  }
};

export default Actividad210Service;
