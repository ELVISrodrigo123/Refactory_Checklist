import { PageHeader } from "@/components/core/PageHeader";
import ArtactividadList from "@/pages/components/ArtactividadList";
import ArtactividadService from "@/pages/services/ArtactividadService";
import { filterData } from "@/utils/filterData";

export default async function Molienda() {

    const data = await ArtactividadService.listarTodos();

    const actividadesFiltradas = filterData(data, '230');
    return (
        <>
            <div style={{ padding: "3em" }}>
                <PageHeader 
                    title="230 - MOLIENDA"
                    subtitle="Welcome to the Molienda area"
                />


                <ArtactividadList
                    artactividades={actividadesFiltradas}
                // onEliminar={manejarEliminar}
                // onEditar={() => {}}
                />
            </div>
        </>
    );
};



