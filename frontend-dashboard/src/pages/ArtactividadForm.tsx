import React, { useState, useEffect, useCallback } from "react";
import { Artactividad } from "./services/ArtactividadService";
import { Button, TextField, Box } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

interface ArtactividadFormProps {
  onSubmit: (nuevoArtactividad: Artactividad) => void;
  onUpdate: (id: number, datosActualizados: Artactividad) => void;
  artactividadSeleccionada: Artactividad | null;
  resetSeleccion: () => void;
}

const ArtactividadForm: React.FC<ArtactividadFormProps> = ({
  onSubmit,
  onUpdate,
  artactividadSeleccionada,
  resetSeleccion,
}) => {
  // Estado optimizado con inicialización directa
  const [formData, setFormData] = useState<Artactividad>({ 
    nombre: "", 
    descripcion: "" 
  });

  // Efecto más eficiente para resetear el formulario
  useEffect(() => {
    setFormData(
      artactividadSeleccionada 
        ? { ...artactividadSeleccionada } 
        : { nombre: "", descripcion: "" }
    );
  }, [artactividadSeleccionada]);

  // Handler memoizado para cambios
  const manejarCambio = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  // Submit handler optimizado
  const manejarSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      
      if (artactividadSeleccionada?.id) {
        onUpdate(artactividadSeleccionada.id, formData);
      } else {
        onSubmit(formData);
      }
      
      resetSeleccion();
      setFormData({ nombre: "", descripcion: "" });
    },
    [formData, artactividadSeleccionada, onSubmit, onUpdate, resetSeleccion]
  );

  return (
    <Box component={"form"} onSubmit={manejarSubmit} sx={{ p:2, display: 'flex', gap: 2}}>
      <Box sx={{ mb: 2, flex: 1 }}>
        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={manejarCambio}
          fullWidth
          variant="outlined"
          required
          
        />
      </Box>

      <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        type="submit"
        sx={{ 
          mb: 2,
          px: 3,
          py: 1,
          fontWeight: 600,
          textTransform: 'none'
        }}
      >
        {artactividadSeleccionada ? "Actualizar" : "Crear"}
      </Button>
    </Box>
  );
};

export default React.memo(ArtactividadForm);