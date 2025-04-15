"use server";

import ArtactividadService from '@/services/ArtactividadService';
import { revalidatePath } from 'next/cache'
 
export async function deleteActivity(id: number, path: string) {
  await ArtactividadService.eliminarArtactividad(id);
  revalidatePath(path);
}