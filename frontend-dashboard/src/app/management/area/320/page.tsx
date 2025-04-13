import ArtactividadService from "@/pages/services/ArtactividadService";
import { filterData } from "@/utils/filterData";
import { PageHeader } from "@/components/core/PageHeader";
import ArtactividadList from "@/pages/components/ArtactividadList";


export default async function Filtros() {
    const data = await ArtactividadService.listarTodos();
    const actividadesFiltradas = filterData(data, '320');
    return (
        <div style={{ padding: "3em" }}>
            <PageHeader
                title="320 - FILTROS"
                subtitle="Welcome to the Filtros area"
            />


            <ArtactividadList
                artactividades={actividadesFiltradas}
            />
        </div>
    );
}
