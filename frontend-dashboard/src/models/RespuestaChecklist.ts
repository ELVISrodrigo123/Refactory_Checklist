export interface RespuestaTarea {
  id?: number; // Hacer opcional para creaciones nuevas
  estado_bueno: boolean;
  estado_malo: boolean;
  comentario: string | null;
  tarea: number;
  respuesta?: number; // Opcional porque se asigna después
}

export interface RespuestaChecklist {
  id: number;
  formulario: number;
  usuario_username: string;
  usuario: number;
  fecha_respuesta: string;
  comentario_general: string;
  respuestas_tareas: RespuestaTarea[];
}

export interface CreateRespuestaChecklistPayload {
  formulario: number;
  usuario?: number;
  comentario_general?: string;
  respuestas_tareas?: Array<{
    estado_bueno: boolean;
    estado_malo: boolean;
    comentario?: string | null;
    tarea: number;
  }>;
}

export interface UpdateRespuestaChecklistPayload {
  comentario_general?: string;
  respuestas_tareas?: Array<{
    id?: number; // Opcional para nuevas tareas
    estado_bueno: boolean;
    estado_malo: boolean;
    comentario?: string | null;
    tarea: number;
  }>;
}
export interface RespuestaTarea {
  id?: number; // Hacer opcional para creaciones nuevas
  estado_bueno: boolean;
  estado_malo: boolean;
  comentario: string | null;
  tarea: number;
  respuesta?: number; // Opcional porque se asigna después
}

export interface RespuestaChecklist {
  id: number;
  formulario: number;
  usuario_username: string;
  usuario: number;
  fecha_respuesta: string;
  comentario_general: string;
  respuestas_tareas: RespuestaTarea[];
}

export interface CreateRespuestaChecklistPayload {
  formulario: number;
  usuario?: number;
  comentario_general?: string;
  respuestas_tareas?: Array<{
    estado_bueno: boolean;
    estado_malo: boolean;
    comentario?: string | null;
    tarea: number;
  }>;
}

export interface UpdateRespuestaChecklistPayload {
  comentario_general?: string;
  respuestas_tareas?: Array<{
    id?: number; // Opcional para nuevas tareas
    estado_bueno: boolean;
    estado_malo: boolean;
    comentario?: string | null;
    tarea: number;
  }>;
}
