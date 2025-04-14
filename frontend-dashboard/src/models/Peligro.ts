export class Actividad {
    id: number;
    nombre: string;

    constructor(id: number, nombre: string) {
        this.id = id;
        this.nombre = nombre;
    }
}

export class Peligro {
    id: number;
    descripcion: string;
    actividad: Actividad;

    constructor(id: number, descripcion: string, actividad: Actividad) {
        this.id = id;
        this.descripcion = descripcion;
        this.actividad = actividad;
    }
}
