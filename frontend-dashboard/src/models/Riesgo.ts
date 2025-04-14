export interface Actividad {
    id: number;
    nombre: string;
}

export interface Riesgo {
    id: number;
    descripcion: string;
    actividad: Actividad;
}