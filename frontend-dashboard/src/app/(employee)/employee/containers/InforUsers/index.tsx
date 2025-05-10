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
        <TableContainer component={Paper} >
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell >Fecha: {fechaActual}</TableCell>
                        <TableCell >Hora: {horaActual}</TableCell>
                        <TableCell >Turno: {userInfo?.turno}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Operador: {userInfo?.nombre}</TableCell>
                        <TableCell >Firma: {userInfo?.rol}</TableCell>
                        <TableCell >Área: {area}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Grupo: {userInfo?.grupo}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default InformacionFormulario;