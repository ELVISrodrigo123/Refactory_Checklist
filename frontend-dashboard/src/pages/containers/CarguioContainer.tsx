import React, { useEffect, useState } from 'react';
import ArtactividadService, { Artactividad } from '../services/ArtactividadService';
import ArtactividadList from '../components/Area210List';

const CarguioContainer: React.FC = () => {
    const [artactividades, setArtactividades] = useState<Artactividad[]>([]);

    useEffect(() => {
        cargarArtactividades();
    }, []);

    const cargarArtactividades = async () => {
        try {
            const data = await ArtactividadService.listarTodos();
            const actividadesFiltradas = Array.isArray(data) ? data.filter(artactividad => 
                artactividad.nombre.toLowerCase().includes('330')
            ) : [];
            setArtactividades(actividadesFiltradas);
        } catch (error) {
            console.error('Error al cargar las actividades:', error);
        }
    };

    return (
        <div className="p-4">
            <h1 style={{ paddingBottom: '2rem' }} className="text-2xl font-bold mb-4">
                330 - CARGUIO
            </h1>


            <ArtactividadList
                artactividades={artactividades}
            />
        </div>
    );
};

export default CarguioContainer;
