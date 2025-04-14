import React, { useEffect, useState, useCallback } from 'react';
import { Box, Card, Typography } from '@mui/material';
import ArtactividadService, { Artactividad } from '../services/ArtactividadService';
import ArtactividadList from '../components/ArtactividadList';
import ArtactividadForm from '../ArtactividadForm';

const ArtactividadContainer: React.FC = () => {
  const [artactividades, setArtactividades] = useState<Artactividad[]>([]);
  const [selectedArtactividad, setSelectedArtactividad] = useState<Artactividad | null>(null);

  // Función memoizada para cargar actividades
  const cargarArtactividades = useCallback(async () => {
    try {
      const data = await ArtactividadService.listarTodos();
      setArtactividades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar las actividades:', error);
    }
  }, []);

  useEffect(() => {
    cargarArtactividades();
  }, [cargarArtactividades]);

  const manejarCrear = async (nuevoArtactividad: Artactividad) => {
    await ArtactividadService.crearArtactividad(nuevoArtactividad);
    await cargarArtactividades();
  };

  const manejarActualizar = async (id: number, datosActualizados: Artactividad) => {
    await ArtactividadService.actualizarArtactividad(id, datosActualizados);
    await cargarArtactividades();
    setSelectedArtactividad(null);
  };

  const manejarEliminar = async (id: number) => {
    await ArtactividadService.eliminarArtactividad(id);
    await cargarArtactividades();
  };

  return (
    <Card>

      <ArtactividadForm
        onSubmit={manejarCrear}
        artactividadSeleccionada={selectedArtactividad}
        onUpdate={manejarActualizar}
        resetSeleccion={() => setSelectedArtactividad(null)}
      />

      <ArtactividadList
        artactividades={artactividades}
        onEliminar={manejarEliminar}
        onEditar={setSelectedArtactividad}
      />
    </Card>
  );
};

export default ArtactividadContainer;