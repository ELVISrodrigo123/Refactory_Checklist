import React, { useState } from "react";
import ActividadService from "../services/ActividadService";
import { Actividad } from "../models/ActividadModel";

interface ActividadFormProps {
    onAdd: () => void;
}

const ActividadForm: React.FC<ActividadFormProps> = ({ onAdd }) => {
    const [nombre, setNombre] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newActividad: Actividad = { nombre, descripcion, artactividad: 1 };
        await ActividadService.create(newActividad);
        onAdd();
        setNombre("");
        setDescripcion("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />
            <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
            />
            <button type="submit">Agregar Actividad</button>
        </form>
    );
};

export default ActividadForm;
