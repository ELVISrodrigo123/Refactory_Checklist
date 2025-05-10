import { Artactividad } from "@/services/ArtactividadService";

export function filterData(data: Artactividad[], area: string) {
    const actividadesFiltradas: Artactividad[] = Array.isArray(data) ? data.filter(artactividad =>
        artactividad.nombre.toLowerCase().includes(area)
    ) : [];
    
    return actividadesFiltradas;
}