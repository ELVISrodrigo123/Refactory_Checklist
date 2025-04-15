"use client";
import { Artactividad } from "../services/ArtactividadService";
import { Button, Card, Container, Divider, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";


interface ArtactividadListProps {
    artactividades: Artactividad[];
}


function PreviewActivitiesList({ artactividades }: ArtactividadListProps) {

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
                    sx={{ padding: "1em", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "1em" }}
                >
                    <Typography variant="h3" component="h3" sx={{ fontSize: "1.5em", fontWeight: "bold", textAlign: "center" }}>
                        {artactividad.nombre}
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: "auto", width: "100%", justifyContent: "center", display: "flex", gap: "1em" }}>
                        <Divider sx={{ width: "100%", margin: "1" }} />
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleMostrarActividades(artactividad.id)}
                        >
                            Ver Actividades
                        </Button>
                    </Stack>
                </Card>
            ))}
        </Container>
    )
}

export default PreviewActivitiesList
