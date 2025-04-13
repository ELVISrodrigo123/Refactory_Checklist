import { PageHeader } from "@/components/core/PageHeader";
import ArtactividadList from "@/pages/components/ArtactividadList";
import ArtactividadService from "@/pages/services/ArtactividadService";
import { filterData } from "@/utils/filterData";

export default async function FlotacionPlomo() {

    const data = await ArtactividadService.listarTodos();
    const actividadesFiltradas = filterData(data, '240');

    return (
        <div style={{ padding: "3em" }}>
            <PageHeader
                title="240 - FLOTACION PLOMO"
                subtitle="Welcome to the Flotacion Plomo area"
            />

            <ArtactividadList
                artactividades={actividadesFiltradas}
            />
        </div>
    );
};

