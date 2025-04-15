import { TareaChecklist } from "../models/TareaChecklistModel";
import { getTitulosChecklist, TituloChecklistResponse } from "./TitulosCkecklist";
import { getFormularios } from "./Formulario";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const TareaChecklistService = {
    // Obtener estructura completa
    getEstructuraCompleta: async (): Promise<{
        formularios: Array<{
            id: number;
            titulo: string;
            titulos: Array<{
                id: number;
                nombre: string;
                tareas: TareaChecklist[];
            }>
        }>
    }> => {
        try {
            const [formularios, titulos, tareas] = await Promise.all([
                getFormularios(),
                getTitulosChecklist(1), // O puedes hacerlo dinámico
                fetch(`${API_URL}/tareas/`).then(res => res.json())
            ]);

            return {
                formularios: formularios.map(formulario => ({
                    id: formulario.id,
                    titulo: formulario.titulo,
                    titulos: titulos
                        .filter(titulo => titulo.formulario === formulario.id)
                        .map(titulo => ({
                            id: titulo.id,
                            nombre: titulo.nombre,
                            tareas: tareas
                                .filter(tarea => tarea.titulo === titulo.id)
                                .map(tarea => new TareaChecklist(
                                    tarea.id,
                                    tarea.descripcion,
                                    tarea.titulo
                                ))
                        }))
                }))
            };
        } catch (error) {
            console.error("Error al obtener estructura:", error);
            throw error;
        }
    },

    // Métodos CRUD
    create: async (tarea: TareaChecklist): Promise<TareaChecklist> => {
        const response = await fetch(`${API_URL}/tareas/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarea.toJson())
        });
        if (!response.ok) throw new Error("Error al crear tarea");
        return response.json();
    },

    update: async (id: number, tarea: TareaChecklist): Promise<TareaChecklist> => {
        const response = await fetch(`${API_URL}/tareas/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: tarea.id,
                descripcion: tarea.descripcion,
                titulo: tarea.titulo
            })
        });
        if (!response.ok) throw new Error("Error al actualizar tarea");
        return response.json();
    },
    
    delete: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/tareas/${id}/`, { 
            method: 'DELETE' 
        });
        if (!response.ok) throw new Error("Error al eliminar tarea");
    }
};