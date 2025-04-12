import React, { useState, useEffect } from "react";
import { ExcelFile } from "../models/ExcelFile";
import { getExcelFiles, createExcelFile, deleteExcelFile } from "../services/excelFileService";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const ExcelFileContainer: React.FC = () => {
    const [excelFiles, setExcelFiles] = useState<ExcelFile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);

    useEffect(() => {
        const fetchExcelFiles = async () => {
            try {
                const files = await getExcelFiles();
                setExcelFiles(files);
            } catch (error) {
                console.error("Error loading Excel files:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExcelFiles();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setFileToUpload(file);
    };

    const handleFileUpload = async () => {
        if (!fileToUpload) return;

        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("description", "Descripción opcional"); // Aquí puedes agregar descripción si es necesario

        try {
            const newFile = await createExcelFile(formData);
            setExcelFiles([...excelFiles, newFile]);
            setFileToUpload(null);
        } catch (error) {
            console.error("Error uploading Excel file:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteExcelFile(id);
            setExcelFiles(excelFiles.filter((file) => file.id !== id));
        } catch (error) {
            console.error("Error deleting Excel file:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Archivos Excel</h2>
            <input type="file" onChange={handleFileChange} />
            <Button variant="contained" color="primary" onClick={handleFileUpload} disabled={!fileToUpload}>
                Subir Archivo
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Archivo</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Fecha de Subida</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {excelFiles.map((file) => (
                            <TableRow key={file.id}>
                                <TableCell>{file.file}</TableCell>
                                <TableCell>{file.description}</TableCell>
                                <TableCell>{file.uploaded_at}</TableCell>
                                <TableCell>{file.is_active ? "Activo" : "Inactivo"}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(file.id)}>
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ExcelFileContainer;

