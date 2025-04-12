import React, { useEffect, useState } from "react";
import { getPeligrosByActividad } from "../services/Peligro";
import { Peligro, Actividad } from "../models/Peligro";

interface PeligrosContainerProps {
    actividadId: number;
}

const PeligrosContainer: React.FC<PeligrosContainerProps> = ({ actividadId }) => {
    const [peligros, setPeligros] = useState<Peligro[]>([]);
    const [actividad, setActividad] = useState<Actividad | null>(null);

    useEffect(() => {
        const fetchPeligros = async () => {
            try {
                const data = await getPeligrosByActividad(actividadId);
                if (data.length > 0) {
                    setActividad(data[0].actividad);
                }
                setPeligros(data);
            } catch (error) {
                console.error("Error al cargar los peligros:", error);
                setPeligros([]);
            }
        };
        fetchPeligros();
    }, [actividadId]);

    return (
        <div>
            {actividad ? (
                <h2>Actividad: {actividad.nombre} (ID: {actividad.id})</h2>
            ) : (
                <p>Cargando actividad...</p>
            )}
            <ul>
                {peligros.length > 0 ? (
                    peligros.map((peligro) => (
                        <li key={peligro.id}>
                            <strong>ID Actividad-----: {actividadId}</strong> | 
                            <strong> ID Peligro------: {peligro.id}</strong> - 
                            {peligro.descripcion}
                        </li>
                    ))
                ) : (
                    <p>No hay peligros registrados para esta actividad.</p>
                )}
            </ul>
        </div>
    );
};

export default PeligrosContainer;
