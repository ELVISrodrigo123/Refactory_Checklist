export interface RevisionChecklist {
    id: number;
    usuario: number | null;           // ID del revisor (debería ser obligatorio)
    usuario_username?: string;        // Nombre del revisor (opcional)
    fecha_revision: string;
    estado: 'pendiente' | 'revisado' | 'observado';
    observaciones: string | null;
    respuesta: number;
}

export interface CreateRevisionPayload {
    estado: 'pendiente' | 'revisado' | 'observado';
    observaciones?: string | null;
    respuesta: number;
    usuario: number;                  // Añadir este campo como obligatorio
    usuario_username?: string;        // Añadir este campo opcional
}

export interface UpdateRevisionPayload {
    estado?: 'pendiente' | 'revisado' | 'observado';
    observaciones?: string | null;
}