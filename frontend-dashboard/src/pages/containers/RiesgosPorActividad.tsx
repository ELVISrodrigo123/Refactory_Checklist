import React, { useEffect, useState } from "react";
import { getRiesgosPorActividad } from "../services/RiesgoService";
import { Riesgo } from "../models/Riesgo";

interface Props {
    actividadId: number;
}

const RiesgosPorActividad = ({ actividadId }: Props) => {
    const [riesgos, setRiesgos] = useState<Riesgo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRiesgos = async () => {
            try {
                const data = await getRiesgosPorActividad(actividadId);
                setRiesgos(data);
            } catch {
                setError("Hubo un error al cargar los riesgos.");
            } finally {
                setLoading(false);
            }
        };

        fetchRiesgos();
    }, [actividadId]);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Riesgos</h2>
            <ul>
                {riesgos.map((riesgo) => (
                    <li key={riesgo.id}>{riesgo.descripcion}</li>
                ))}
            </ul>
        </div>
    );
};

export default RiesgosPorActividad;