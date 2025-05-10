import React, { useState, useEffect } from "react";
import { Artactividad } from "../services/ArtactividadService";
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
  const [formData, setFormData] = useState<Artactividad>({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    if (artactividadSeleccionada) {
      setFormData(artactividadSeleccionada);
    } else {
      setFormData({ nombre: "", descripcion: "" });
    }
  }, [artactividadSeleccionada]);

  const manejarCambio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (artactividadSeleccionada) {
      onUpdate(artactividadSeleccionada.id!, formData);
    } else {
      onSubmit(formData);
    }
    resetSeleccion();
    setFormData({ nombre: "", descripcion: "" });
  };

  return (
    <form onSubmit={manejarSubmit}>
      <Box sx={{ mb: 2 }}>
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
{/*       <Box sx={{ mb: 2 }}>
        <TextField
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={manejarCambio}
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          required
        />
      </Box> */}
      <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        type="submit"
        sx={{ mb: 2 }}
      >
        {artactividadSeleccionada ? "Actualizar" : "Crear"}
      </Button>
    </form>
  );
};

export default ArtactividadForm;

