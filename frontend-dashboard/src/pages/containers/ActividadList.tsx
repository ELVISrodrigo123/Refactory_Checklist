import React, { useEffect, useState } from "react";
import ActividadService from "../services/ActividadService";
import { Actividad } from "../models/ActividadModel";

const ActividadList: React.FC = () => {
    const [actividades, setActividades] = useState<Actividad[]>([]);

    useEffect(() => {
        ActividadService.getAll().then(setActividades);
    }, []);

    return (
        <div>
            <h2>Lista de Actividades</h2>
            <ul>
                {actividades.map((actividad) => (
                    <li key={actividad.id}>
                        <strong>{actividad.nombre}</strong> - {actividad.descripcion}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActividadList;
