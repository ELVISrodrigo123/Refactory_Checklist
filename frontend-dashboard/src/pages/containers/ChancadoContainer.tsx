import React, { useEffect, useState } from 'react';
import ArtactividadService, { Artactividad } from '../services/ArtactividadService';
import ArtactividadList from '../components/Area210List';

const ChancadoContainer: React.FC = () => {
    const [artactividades, setArtactividades] = useState<Artactividad[]>([]);

    useEffect(() => {
        cargarArtactividades();
    }, []);

    const cargarArtactividades = async () => {
        try {
            const data = await ArtactividadService.listarTodos();
            // Filtrar solo las actividades de "210-CHANCADO"
            const actividadesFiltradas = Array.isArray(data) ? data.filter(artactividad => 
                artactividad.nombre.toLowerCase().includes('210')
            ) : [];
            setArtactividades(actividadesFiltradas);
        } catch (error) {
            console.error('Error al cargar las actividades:', error);
        }
    };

    // const manejarEliminar = async (id: number) => {
    //     try {
    //         await ArtactividadService.eliminarArtactividad(id);
    //         cargarArtactividades(); // Recargar actividades después de eliminar
    //     } catch (error) {
    //         console.error('Error al eliminar la actividad:', error);
    //     }
    // };

    return (
        <div className="p-4">
            <h1 style={{ paddingBottom: '2rem' }} className="text-2xl font-bold mb-4">
                210 - CHANCADO
            </h1>

            {/* Lista de actividades filtradas */}
            <ArtactividadList
                artactividades={artactividades}
                // onEliminar={manejarEliminar}
                // onEditar={() => {}} // Puedes dejar esto vacío si no se necesita
            />
        </div>
    );
};

export default ChancadoContainer;
