import React, { useEffect, useState } from 'react';
import ArtactividadService, { Artactividad } from '../../services/ArtactividadService';
import ArtactividadList from '../components/Area210List';

const Area210Container: React.FC = () => {
    const [artactividades, setArtactividades] = useState<Artactividad[]>([]);
    // const [, setSelectedArtactividad] = useState<Artactividad | null>(null);

    useEffect(() => {
        cargarArtactividades();
    }, []);

    const cargarArtactividades = async () => {
        try {
            const data = await ArtactividadService.listarTodos();
            // Aseguramos que siempre sea un arreglo, incluso si la respuesta es vacía o no es un arreglo
            setArtactividades(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al cargar las actividades:', error);
        }
    };
    // const manejarEliminar = async (id: number) => {
    //     await ArtactividadService.eliminarArtactividad(id);
    //     cargarArtactividades();
    // };

    return (
        <div className="p-4">
            <h1 style={{ paddingBottom: '2rem' }} className="text-2xl font-bold mb-4">
                ANALISIS DE RIEGO EN EL TRABAJO (ART)
            </h1>

            <ArtactividadList
                artactividades={Array.isArray(artactividades) ? artactividades : []}
            />
        </div>
    );
};

export default Area210Container;

