import { PageHeader } from "@/components/core/PageHeader";
import ArtactividadList from "@/components/ArtactividadList";
import ArtactividadService from "@/services/ArtactividadService";
import { filterData } from "@/utils/filterData";

async function DomoPage() {


    const data = await ArtactividadService.listarTodos();

    const actividadesFiltradas = filterData(data, '220');
    return (
        <div style={{ padding: "3em" }}>
            <PageHeader
                title="220 - DOMO"
                subtitle="Welcome to the Domo area"
            />

            <ArtactividadList
                artactividades={actividadesFiltradas}
            />
        </div>
    );
};

export default DomoPage;