export class TituloChecklistModel {
    id: number;
    nombre: string;
    formulario: number;

    constructor(id: number = 0, nombre: string = "", formulario: number = 0) {
        this.id = id;
        this.nombre = nombre;
        this.formulario = formulario;
    }

    isValid(): boolean {
        return this.nombre.trim() !== "" && this.formulario !== 0;
    }

    reset(): void {
        this.id = 0;
        this.nombre = "";
        this.formulario = 0;
    }
}