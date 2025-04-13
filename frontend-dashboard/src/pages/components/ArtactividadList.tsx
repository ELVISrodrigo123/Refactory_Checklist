"use client";
import React from "react";
import { Artactividad } from "../services/ArtactividadService";
import { Box, Button, Card, Container, Divider, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

interface ArtactividadListProps {
  artactividades: Artactividad[];

}

const ArtactividadList: React.FC<ArtactividadListProps> = ({ artactividades }) => {
  const router = useRouter();

  const handleMostrarActividades = (artactividadId: number) => {
    router.push(`/management/actividad210/${artactividadId}`);
  };

  return (
    <Container component={Card} maxWidth="lg" sx={{ marginTop: "2em", padding: "2em", display: "grid", gridTemplateColumns: { sm: "1fr 1fr", md: "repeat(3, 1fr)", lg: "repeat(2, 1fr)" }, gap: "1em" }}>
      {artactividades.map((artactividad) => (
        <Card
          key={artactividad.id}
          className="border p-4 mb-2 rounded shadow"
          sx={{ padding: "1em", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
        >
          <Typography variant="h3" component="h3" sx={{ fontSize: "1.5em", fontWeight: "bold", textAlign: "center" }}>
            {artactividad.nombre}
          </Typography>

          <Box sx={{ marginTop: "auto", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Divider sx={{ margin: "1em 0", width: "100%" }} />
            <Button
              variant="contained"
              startIcon={<VisibilityIcon />}
              onClick={() => handleMostrarActividades(artactividad.id!)}
              sx={{ marginTop: "" }}
            >
              Mostrar Actividades
            </Button>
          </Box>
        </Card>
      ))}
    </Container>
  );
};

export default ArtactividadList;