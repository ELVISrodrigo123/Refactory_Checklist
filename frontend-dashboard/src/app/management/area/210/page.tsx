import { PageHeader } from "@/components/core/PageHeader";
import ArtactividadList from "@/pages/components/ArtactividadList";
import ArtactividadService from "@/pages/services/ArtactividadService";
import { filterData } from "@/utils/filterData";

const Chancado = async () => {


    const data = await ArtactividadService.listarTodos();

    // Filtrar solo las actividades de "210-CHANCADO"
    const actividadesFiltradas = filterData(data, '210');

    return (
        <div style={{ padding: "3em" }}>
            <PageHeader 
                title="210 - CHANCADO"
                subtitle="Welcome to the Chancado area"
            />

            <ArtactividadList
                artactividades={actividadesFiltradas}
            />
        </div>
    );
};

export default Chancado;