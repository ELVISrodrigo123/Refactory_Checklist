import ArtactividadService from "@/services/ArtactividadService";
import { filterData } from "@/utils/filterData";
import ArtactividadList from "@/components/ArtactividadList";
import { PageHeader } from "@/components/core/PageHeader";

export default async function Espesadores() {
    const data = await ArtactividadService.listarTodos();
    const actividadesFiltradas = filterData(data, '310');
    return (
        <div style={{ padding: "3em" }}>
            <PageHeader
                title="310 - ESPESADORES"
                subtitle="Welcome to the Espesadores area"
            />


            <ArtactividadList
                artactividades={actividadesFiltradas}
            />
        </div>
    );
}

