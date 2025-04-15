import ActivityCard from "@/components/Activities/ActivityCard";
import { PageHeader } from "@/components/core/PageHeader";
import { Actividad } from "@/models/ActividadModel";
import Actividad210Service from "@/services/Actividad210Service";
import { Box } from "@mui/material";

interface Peligro {
    id: number;
    descripcion: string;
    actividad: Actividad;
}
interface Riesgo {
    id: number;
    descripcion: string;
    actividad: Actividad;
}
interface MedidaControl {
    id: number;
    descripcion: string;
    actividad: Actividad;
}

interface IProps {
    params: { id: string };
}

export default async function Actividad210index({ params: { id } }: IProps) {


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
        <Box sx={{ padding: "3em", mt: "2em" }}>
            <PageHeader title={`Activity ID: ${id}`} subtitle="Details of the activity" />
            <ActivityCard
                activities={data}
                medidas={medidasMap}
                peligros={peligrosMap}
                riesgos={riesgosMap}
            />
        </Box>

    );
};