import axios from "axios";
import { Area } from "../models/Area";
import ArtactividadService from "./ArtactividadService";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/areas/`;

const AreaService = {
  listarTodos: async (): Promise<Area[]> => {
    try {
      const response = await axios.get(API_URL);
      const areas: Area[] = response.data;

      // Validar si la respuesta es un array
      if (!Array.isArray(areas)) {
        console.error("Error: La API de áreas no devolvió un array.");
        return [];
      }

      const artactividades = await ArtactividadService.listarTodos();

      // Validar si la API de artactividades devolvió un array
      if (!Array.isArray(artactividades)) {
        console.error("Error: La API de artactividades no devolvió un array.");
        return areas; // Devolver las áreas sin modificaciones si falla artactividades
      }

      const artactividadMap = Object.fromEntries(
        artactividades.map((a) => [a.id, a]) // Mapear id a objeto completo
      );

      return areas.map((area) => {
        const artactividadId =
          typeof area.artactividad === "number"
            ? area.artactividad
            : area.artactividad?.id;

        const artactividad = artactividadMap[artactividadId] || {
          id: artactividadId,
          nombre: "Desconocido",
        };

        return {
          ...area,
          artactividad, // Sobrescribir artactividad con objeto completo
        };
      });
    } catch (error) {
      console.error("Error al listar áreas:", error);
      return [];
    }
  },

  crearArea: async (area: Omit<Area, "id">) => {
    try {
      await axios.post(API_URL, area);
    } catch (error) {
      console.error("Error al crear área:", error);
    }
  },

  actualizarArea: async (id: number, datosActualizados: Partial<Area>) => {
    try {
      await axios.put(`${API_URL}${id}/`, datosActualizados);
    } catch (error) {
      console.error("Error al actualizar área:", error);
    }
  },

  eliminarArea: async (id: number) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
    } catch (error) {
      console.error("Error al eliminar área:", error);
    }
  },
};

export default AreaService;
