"use client";
import React from "react";
import { Artactividad } from "../services/ArtactividadService";
import { Button, Container } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

interface ArtactividadListProps {
    artactividades: Artactividad[];

}

const Area210List: React.FC<ArtactividadListProps> = ({ artactividades }) => {
    const router = useRouter();

    const handleMostrarActividades = (artactividadId: number) => {
        router.push(`/management/actividad210/${artactividadId}`);
    };

    return (
        <Container maxWidth="md" className="mt-4">
            {artactividades.map((artactividad) => (
                <div key={artactividad.id} className="border p-4 mb-2 rounded shadow">
                    <h4 className="font-bold">{artactividad.nombre}</h4>

                    <div className="mt-2">
                        <div style={{ width: "100%", paddingBottom: "1em", paddingTop: "1em", display: "flex", justifyContent: "flex-start" }}>
                            <Button
                                
                                style={{ marginRight: "2em" }}
                                variant="contained"
                                startIcon={<VisibilityIcon />}
                                onClick={() => handleMostrarActividades(artactividad.id!)}
                            >
                                Mostrar Actividades
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </Container>
    );
};

export default Area210List;