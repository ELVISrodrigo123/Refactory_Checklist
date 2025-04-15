import React from "react";
import { Area } from "../models/Area";
import { Button, Card, CardContent, Typography } from "@mui/material";

interface Props {
    areas: Area[];
    onEliminar: (id: number) => void;
    onEditar: (area: Area) => void;
}

const AreaList: React.FC<Props> = ({ areas, onEliminar, onEditar }) => {
    return (
        <div>
            {areas.map((area) => (
                <Card key={area.id} style={{ marginBottom: "10px" }}>
                    <CardContent>
                        {/* Mostrar el nombre de la artactividad */}
                        <Typography variant="h6">
                            {area.artactividad.nombre} - {area.opcion_display}
                        </Typography>
                        <Button variant="contained" color="secondary" onClick={() => onEliminar(area.id)} style={{marginRight:"2em"}}>
                            Eliminar
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => onEditar(area)}>
                            Editar
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default AreaList;
