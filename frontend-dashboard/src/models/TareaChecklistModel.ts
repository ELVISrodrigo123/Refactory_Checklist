export class TareaChecklist {
    constructor(
        public id: number = 0,
        public descripcion: string = "",
        public titulo: number = 0
    ) {}

    static fromJson(json: any): TareaChecklist {
        return new TareaChecklist(
            json.id,
            json.descripcion,
            json.titulo
        );
    }

    toJson(): any {
        return {
            id: this.id,
            descripcion: this.descripcion,
            titulo: this.titulo
        };
    }

    isValid(): boolean {
        return this.descripcion.trim() !== "" && this.titulo !== 0;
    }
}