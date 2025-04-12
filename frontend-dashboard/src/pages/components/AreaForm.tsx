import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
import { Area } from "../models/Area";
import ArtactividadService from "../services/ArtactividadService";

interface Artactividad {
    id: number;
    nombre: string;
}

interface Props {
    onSubmit: (area: { artactividad: number; opcion: string }) => void;
    areaSeleccionada?: Area | null;
    resetSeleccion: () => void;
}

const opciones = [
    { value: "210", label: "210-CHANCADO" },
    { value: "220", label: "220-DOMO" },
    { value: "230", label: "230-MOLIENDA" },
    { value: "240", label: "240-FLOTACION PLOMO" },
    { value: "250", label: "250-FLOTACION ZINC" },
    { value: "270", label: "270-REACTIVOS" },
    { value: "310", label: "310-ESPESADORES" },
    { value: "320", label: "320-FILTROS" },
    { value: "330", label: "330-CARGUIO" },
];

const AreaForm: React.FC<Props> = ({ onSubmit, areaSeleccionada, resetSeleccion }) => {
    const [area, setArea] = useState<{ artactividad: number; opcion: string }>({
        artactividad: 0,
        opcion: "",
    });

    const [artactividades, setArtactividades] = useState<Artactividad[]>([]);

    useEffect(() => {
        ArtactividadService.listarTodos()
            .then((data: Artactividad[]) => {
                if (Array.isArray(data)) {
                    setArtactividades(data);
                } else {
                    console.error("Error: La API no devolvió un array de actividades.");
                }
            })
            .catch((err) => console.error("Error al listar actividades:", err));
    }, []);

    useEffect(() => {
        if (areaSeleccionada) {
            setArea({
                artactividad: areaSeleccionada.artactividad.id,
                opcion: areaSeleccionada.opcion || "",
            });
        } else {
            setArea({ artactividad: 0, opcion: "" });
        }
    }, [areaSeleccionada]);

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setArea((prev) => ({
            ...prev,
            [name]: name === "artactividad" ? Number(value) : value,
        }));
    };

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();

        if (area.artactividad === 0) {
            alert("Selecciona una actividad válida.");
            return;
        }

        console.log("📤 Enviando datos:", area);

        try {
            await onSubmit(area);
            resetSeleccion();
            setArea({ artactividad: 0, opcion: "" });
        } catch (error) {
            console.error("❌ Error al enviar el formulario:", error);
            alert("Error al enviar los datos. Revisa la consola.");
        }
    };

    return (
        <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "2em" }}>
            <TextField
                select
                label="Actividad"
                name="artactividad"
                value={area.artactividad}
                onChange={manejarCambio}
                required
            >
                {artactividades.map((art) => (
                    <MenuItem key={art.id} value={art.id}>
                        {art.nombre}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                select
                label="Área"
                name="opcion"
                value={area.opcion}
                onChange={manejarCambio}
                required
            >
                {opciones.map((op) => (
                    <MenuItem key={op.value} value={op.value}>
                        {op.label}
                    </MenuItem>
                ))}
            </TextField>

            <Button type="submit" variant="contained" color="primary">
                {areaSeleccionada ? "Actualizar" : "Crear"}
            </Button>
        </form>
    );
};

export default AreaForm;
