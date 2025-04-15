import React, { useEffect, useState } from "react";
import { getMedidasControlPorActividad } from "../../services/MedidaControlService";
import { MedidaControl, Actividad } from "../../models/MedidaControl";

interface Props {
    actividadId: number;
}

const MedidasControlContainer = ({ actividadId }: Props) => {
    const [medidasControl, setMedidasControl] = useState<MedidaControl[]>([]);
    const [actividad, setActividad] = useState<Actividad | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMedidasControl = async () => {
            try {
                const data = await getMedidasControlPorActividad(actividadId);
                if (data.length > 0) {
                    setActividad(data[0].actividad);
                }
                setMedidasControl(data);
            } catch {
                setError("Hubo un error al cargar las medidas de control.");
            } finally {
                setLoading(false);
            }
        };

        fetchMedidasControl();
    }, [actividadId]);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {actividad && <h2>Actividad: {actividad.nombre}</h2>}
            <ul>
                {medidasControl.map((medida) => (
                    <li key={medida.id}>{medida.descripcion}</li>
                ))}
            </ul>
        </div>
    );
};

export default MedidasControlContainer;