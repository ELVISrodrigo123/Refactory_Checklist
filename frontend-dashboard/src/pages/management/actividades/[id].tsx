import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ActividadService from "../../services/ActividadService";
import { Actividad } from "../../models/ActividadModel";
import Button from "@mui/material/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Box from "@mui/material/Box";

const ActividadesPorArtactividad = () => {
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const router = useRouter();
    const { id } = router.query; // Captura el ID de artactividad desde la URL

    useEffect(() => {
        if (id) {
            loadActividades(Number(id)); // Convierte el ID a número
        }
    }, [id]);

    const loadActividades = async (artactividadId: number) => {
        try {
            const data = await ActividadService.getByArtactividadId(artactividadId);
            setActividades(data);
        } catch (error) {
            console.error("Error cargando actividades:", error);
            setActividades([]); // Manejar error estableciendo lista vacía
        }
    };

    const handleButtonClick = (actividad: Actividad) => {
        router.push(`/management/messageart/${actividad.id}`);
    };

    return (
        <div style={{padding:"3em"}}>
            <h1>Actividades del ART #{id}</h1>
            {actividades.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {actividades.map((actividad) => (
                        <li key={actividad.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #ddd" }}>
                            <span>
                                {actividad.nombre} - {actividad.descripcion}
                            </span>
                            <Box>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<ErrorOutlineIcon />}
                                    onClick={() => handleButtonClick(actividad)}
                                    sx={{ minWidth: "200px" }}
                                >
                                    Peligro y Riesgo
                                </Button>
                            </Box>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay actividades registradas para este ART.</p>
            )}
        </div>
    );
};


export default ActividadesPorArtactividad;
