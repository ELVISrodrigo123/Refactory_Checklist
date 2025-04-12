export interface FormularioChecklist {
    id?: number;
    titulo: string;
    sector: number;
    sector_nombre?: string;
    fecha_creacion?: string;
    item: string;
    aspecto_a_verificar: string;
    bueno: string;
    malo: string;
    comentarios: string;
    estado: "pendiente" | "en_revision" | "aprobado" | "rechazado";
    version: string;
    codigo: string;
  }
  
  export const ESTADOS_FORMULARIO = [
    { value: "pendiente", label: "Pendiente" },
    { value: "en_revision", label: "En Revisión" },
    { value: "aprobado", label: "Aprobado" },
    { value: "rechazado", label: "Rechazado" },
  ];