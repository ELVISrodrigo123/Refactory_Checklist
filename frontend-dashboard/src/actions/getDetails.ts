"use server"

import { MedidaControl } from "@/models/MedidaControl";
import { Peligro } from "@/models/Peligro";
import { Riesgo } from "@/models/Riesgo";
import Actividad210Service from "@/services/Actividad210Service";

export async function getDetails(id: number) {
    const data = await Actividad210Service.getByArtactividadId(Number(id));

    const [peligrosData, riesgosData, medidasData] = await Promise.all([
        Promise.all(data.map(a => Actividad210Service.getPeligrosByActividadId(a.id))),
        Promise.all(data.map(a => Actividad210Service.getRiesgosByActividadId(a.id))),
        Promise.all(data.map(a => Actividad210Service.getMedidasByActividadId(a.id)))
    ]);

    const peligrosMap: { [key: number]: Peligro[] } = {};
    const riesgosMap: { [key: number]: Riesgo[] } = {};
    const medidasMap: { [key: number]: MedidaControl[] } = {};

    data.forEach((actividad, index) => {
        peligrosMap[actividad.id] = peligrosData[index] || [];
        riesgosMap[actividad.id] = riesgosData[index] || [];
        medidasMap[actividad.id] = medidasData[index] || [];
    });

    return { activities: data, peligrosMap: peligrosMap, riesgosMap: riesgosMap, medidasMap: medidasMap };
}