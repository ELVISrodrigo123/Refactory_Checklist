import Actividad210Service from "@/services/Actividad210Service";
import { DetailsDialogUi } from "./DetailsDialogUi";
import { Peligro } from "@/models/Peligro";
import { Riesgo } from "@/models/Riesgo";
import { MedidaControl } from "@/models/MedidaControl";

export async function DetailsDialog({ id }: { id: string }) {


    // get data action

    const data = await Actividad210Service.getByArtactividadId(Number(id));

    const [peligrosData, riesgosData, medidasData] = await Promise.all([
        Promise.all(data.map(a => Actividad210Service.getPeligrosByActividadId(a.id))),
        Promise.all(data.map(a => Actividad210Service.getRiesgosByActividadId(a.id))),
        Promise.all(data.map(a => Actividad210Service.getMedidasByActividadId(a.id)))
    ]);

    const peligrosMap: { [key: number]: Peligro[] } = [];
    const riesgosMap: { [key: number]: Riesgo[] } = [];
    const medidasMap: { [key: number]: MedidaControl[] } = [];

    data.forEach((actividad, index) => {
        peligrosMap[actividad.id] = peligrosData[index] || [];
        riesgosMap[actividad.id] = riesgosData[index] || [];
        medidasMap[actividad.id] = medidasData[index] || [];
    });
    return (
        <DetailsDialogUi activities={data} id={id} medidas={medidasMap} peligros={peligrosMap} riesgos={riesgosMap} />
    )
}