export interface Actividad {
    id: number;
    nombre: string;
}

export interface MedidaControl {
    id: number;
    descripcion: string;
    actividad: Actividad;
}
