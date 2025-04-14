import { Sector } from "../models/Sector";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const getSectores = async (): Promise<Sector[]> => {
    const response = await fetch(`${API_URL}/sectores/`);
    if (!response.ok) throw new Error(`Error HTTP! Estado: ${response.status}`);
    return await response.json();
};

export const getSector = async (id: number): Promise<Sector> => {
    const response = await fetch(`${API_URL}/sectores/${id}/`);
    if (!response.ok) throw new Error(`Error HTTP! Estado: ${response.status}`);
    return await response.json();
};

export const createSector = async (data: Omit<Sector, 'id'>): Promise<Sector> => {
    const response = await fetch(`${API_URL}/sectores/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error HTTP! Estado: ${response.status}`);
    return await response.json();
};

export const updateSector = async (id: number, data: Partial<Sector>): Promise<Sector> => {
    const response = await fetch(`${API_URL}/sectores/${id}/`, {
        method: 'PATCH',  // Cambiado a PATCH para actualizaciones parciales
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error HTTP! Estado: ${response.status}`);
    return await response.json();
};

export const deleteSector = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/sectores/${id}/`, { 
        method: 'DELETE' 
    });
    if (!response.ok) throw new Error(`Error HTTP! Estado: ${response.status}`);
};