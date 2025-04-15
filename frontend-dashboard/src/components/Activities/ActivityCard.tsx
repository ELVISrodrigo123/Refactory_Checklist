"use client";
import React, { useState } from 'react'
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    IconButton,
    Skeleton
} from "@mui/material";
import { VolumeUp, VolumeOff, PlayArrow } from "@mui/icons-material";
import { Actividad } from '@/models/ActividadModel';
import { Peligro } from '@/models/Peligro';
import { Riesgo } from '@/models/Riesgo';
import { MedidaControl } from '@/models/MedidaControl';

export interface ActivityCardProps {
    activities: Actividad[];
    peligros: { [key: number]: Peligro[] },
    riesgos: { [key: number]: Riesgo[] },
    medidas: { [key: number]: MedidaControl[] },
}




export default function ActivityCard({ activities, medidas, peligros, riesgos }: ActivityCardProps) {

    const [estaPausado, setEstaPausado] = useState(false);

    const leerTexto = (actividad: Actividad) => {
        if (!window.speechSynthesis) {
            alert("Tu navegador no soporta la síntesis de voz.");
            return;
        }

        window.speechSynthesis.cancel(); // Detener cualquier síntesis en curso

        const message = new SpeechSynthesisUtterance();
        let voces = window.speechSynthesis.getVoices();

        // Si las voces aún no han cargado, espera 500ms y reintenta
        if (voces.length === 0) {
            setTimeout(() => {
                voces = window.speechSynthesis.getVoices();
                asignarVoz(message, voces, actividad);
            }, 500);
        } else {
            asignarVoz(message, voces, actividad);
        }
    };

    const asignarVoz = (message: SpeechSynthesisUtterance, voces: SpeechSynthesisVoice[], actividad: Actividad) => {
        // Busca una voz masculina y seria en español
        const vozMasculina = voces.find(v =>
            v.lang.includes("es") && (
                v.name.toLowerCase().includes("male") ||
                v.name.toLowerCase().includes("deep") ||
                v.name.toLowerCase().includes("serious") ||
                v.name.toLowerCase().includes("hombre") ||
                v.name.toLowerCase().includes("bariton")
            )
        ) || voces.find(v => v.lang.includes("es")); // Si no encuentra, usa la primera en español

        message.voice = vozMasculina || null;
        message.lang = "es-ES";
        message.rate = 0.99;  // Velocidad más lenta para sonar más dominante
        message.pitch = 0.1;  // Tono más bajo para que suene más grave

        message.text = `Actividad: ${actividad.nombre}. Peligros: ${peligros[actividad.id]?.map(p => p.descripcion).join(", ") || "No hay peligros"}. ` +
            `Riesgos: ${riesgos[actividad.id]?.map(r => r.descripcion).join(", ") || "No hay riesgos"}. ` +
            `Medidas de Control: ${medidas[actividad.id]?.map(m => m.descripcion).join(", ") || "No hay medidas de control"}.`;

        setEstaPausado(false);
        window.speechSynthesis.speak(message);
    };




    const pausarTexto = () => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            setEstaPausado(true);
        }
    };

    const reanudarTexto = () => {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setEstaPausado(false);
        }
    };

    return (
        <Box p={4} sx={{
            width: { xs: "100%", sm: "90%", md: "80%" },
            margin: "0 auto",
        }}>
            {/* {loading ? (
                <CircularProgress />
            ) :  */}
            {activities.length > 0 ? (
                <Grid container spacing={3}>
                    {activities.map((actividad) => (
                        <Grid item xs={12} md={6} key={actividad.id}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6">{actividad.nombre}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {actividad.descripcion}
                                    </Typography>
                                    <IconButton color="primary" onClick={() => leerTexto(actividad)}>
                                        <VolumeUp />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={pausarTexto}>
                                        <VolumeOff />
                                    </IconButton>
                                    {estaPausado && (
                                        <IconButton color="success" onClick={reanudarTexto}>
                                            <PlayArrow />
                                        </IconButton>
                                    )}
                                    <Box mt={2}>
                                        <Typography color="error"><strong>Peligros:</strong></Typography>
                                        {peligros[actividad.id]?.length ? (
                                            <ul style={{ color: "#FF1943" }}>{peligros[actividad.id].map(p => <li key={p.id}>{p.descripcion}</li>)}</ul>
                                        ) : (<Skeleton width={100} />)}

                                        <Typography color="success.main"><strong>Riesgos:</strong></Typography>
                                        {riesgos[actividad.id]?.length ? (
                                            <ul style={{ color: "#57CA22" }}>{riesgos[actividad.id].map(r => <li key={r.id}>{r.descripcion}</li>)}</ul>
                                        ) : (<Skeleton width={100} />)}

                                        <Typography color="primary"><strong>Medidas de Control:</strong></Typography>
                                        {medidas[actividad.id]?.length ? (
                                            <ul style={{ color: "#5569ff" }}>{medidas[actividad.id].map(m => <li key={m.id}>{m.descripcion}</li>)}</ul>
                                        ) : (<Skeleton width={100} />)}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography>No hay activities registradas para este ART.</Typography>
            )}
        </Box>
    )
};