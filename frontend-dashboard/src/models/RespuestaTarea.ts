export interface RespuestaTarea {
  id?: number; // Hacer opcional para creaciones
  estado_bueno: boolean;
  estado_malo: boolean;
  comentario: string | null;
  respuesta: number;
  tarea: number;
}

export interface CreateRespuestaTareaPayload {
  estado_bueno: boolean; // Hacer obligatorio
  estado_malo: boolean; // Hacer obligatorio
  comentario?: string | null;
  respuesta: number;
  tarea: number;
}

export interface UpdateRespuestaTareaPayload {
  id: number;
  estado_bueno?: boolean;
  estado_malo?: boolean;
  comentario?: string | null;
  // No incluir respuesta y tarea aquí ya que no deberían cambiar
}
