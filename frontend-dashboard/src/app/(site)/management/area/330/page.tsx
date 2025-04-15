
import { PageHeader } from '@/components/core/PageHeader';
import ArtactividadList from "@/components/ArtactividadList";
import ArtactividadService from '@/services/ArtactividadService';
import { filterData } from '@/utils/filterData';
import React from 'react'

export default async function Carguio() {
    const data = await ArtactividadService.listarTodos();
    const actividadesFiltradas = filterData(data, '330');
    return (
        <div style={{ padding: "3em" }}>
            <PageHeader
                title="330 - Carguio"
                subtitle="Welcome to the Carguio area"
            />


            <ArtactividadList
                artactividades={actividadesFiltradas}
            />
        </div>
    );
}

