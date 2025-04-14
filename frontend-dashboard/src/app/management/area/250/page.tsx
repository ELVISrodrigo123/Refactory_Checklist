import { PageHeader } from "@/components/core/PageHeader";
import ArtactividadList from "@/pages/components/ArtactividadList";
import ArtactividadService from "@/pages/services/ArtactividadService";
import { filterData } from "@/utils/filterData";

export default async function FlotacionZinc() {
    const data = await ArtactividadService.listarTodos();
    const actividadesFiltradas = filterData(data, '250');
    return (
        <div style={{ padding: "3em" }}>
            <PageHeader
                title="250 - FLOTACION ZINC"
                subtitle="Welcome to the Flotacion Zinc area"
            />


            <ArtactividadList
                artactividades={actividadesFiltradas}
            />
        </div>
    );
}
