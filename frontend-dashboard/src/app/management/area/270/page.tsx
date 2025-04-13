import { PageHeader } from "@/components/core/PageHeader";
import ArtactividadService from "@/pages/services/ArtactividadService";
import { filterData } from "@/utils/filterData";
import ArtactividadList from "@/pages/components/ArtactividadList";

export default async function Reactivos() {
    const data = await ArtactividadService.listarTodos();
    const actividadesFiltradas = filterData(data, '250');
    return (
        <div style={{ padding: "3em" }}>
            <PageHeader
                title="270 - REACTIVOS"
                subtitle="Welcome to the Reactivos area"
            />


            <ArtactividadList
                artactividades={actividadesFiltradas}
            />
        </div>
    );
};
