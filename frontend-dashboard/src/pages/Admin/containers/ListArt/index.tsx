import React from "react";
import AdminLayout from "../../../components/AdminLayout";
import ArtactividadContainer from '../../../containers/ArtactividadContainer';
import { Box, Typography } from "@mui/material";

const ListArt: React.FC = () => {
    return (
        <AdminLayout>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" component="h4" sx={{
                    pb: 3,
                    fontWeight: 'bold',
                }}>
                    ANÁLISIS DE RIESGO EN EL TRABAJO (ART)
                </Typography>
                <ArtactividadContainer />
            </Box>
        </AdminLayout>
    );
};

export default ListArt;
