import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
} from "@mui/material";

interface UserInfo {
    nombre: string;
    rol: string;
    turno: string;
    grupo: string;
}

interface Props {
    fechaActual: string;
    horaActual: string;
    userInfo: UserInfo | null;
    area?: string; //Mark as optional
}

const InformacionFormulario: React.FC<Props> = (props) => {
    const { fechaActual, horaActual, userInfo, area = "N/A" } = props;

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 3, bgcolor: "#1E293B" }}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ color: "#fff" }}>Fecha: {fechaActual}</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Hora: {horaActual}</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Turno: {userInfo?.turno}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ color: "#fff" }}>Operador: {userInfo?.nombre}</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Firma: {userInfo?.rol}</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Área: {area}</TableCell>
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