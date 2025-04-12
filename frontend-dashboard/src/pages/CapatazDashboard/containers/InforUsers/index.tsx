import React from "react";
import { TableContainer, Table, TableBody, TableRow, TableCell, Paper, Typography } from "@mui/material";

interface InformacionFormularioProps {
    formularioSeleccionado: { titulo: string; sector: number } | null;
    fechaActual: string;
    horaActual: string;
    userInfo: { nombre: string; rol: string; turno: string; grupo: string } | null;
    obtenerNombreSector: (sectorId: number) => string;
}

const InformacionFormulario: React.FC<InformacionFormularioProps> = ({
    formularioSeleccionado,
    fechaActual,
    horaActual,
    userInfo,
    obtenerNombreSector,
}) => {
    return (
        <TableContainer component={Paper} sx={{ bgcolor: "#1E293B", p: 3, borderRadius: 2, my: 3, color: "#fff" }}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={Number(3)}>
                            <Typography variant="h6" sx={{ color: "#fff" }}>
                                {formularioSeleccionado?.titulo}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ color: "#fff" }}>Fecha: {fechaActual}</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Hora: {horaActual}</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Turno: {userInfo?.turno}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ color: "#fff" }}>Realizado por: {userInfo?.nombre}</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Firma: {userInfo?.rol}</TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                            Área: {obtenerNombreSector(formularioSeleccionado?.sector || 0)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ color: "#fff" }}>Grupo: {userInfo?.grupo}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default InformacionFormulario;