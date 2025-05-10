"use client";
import React, { useState } from "react";
import { Artactividad } from "../services/ArtactividadService";
import { Box, Card, Container, Divider, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CustomDialog } from "./core/CustomDialog";
import { deleteActivity } from "@/actions/deleteAction";
import { getDetails } from "@/actions/getDetails";
import { Peligro } from "@/models/Peligro";
import { Actividad } from '@/models/ActividadModel';
import { Riesgo } from "@/models/Riesgo";
import { MedidaControl } from "@/models/MedidaControl";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ActivityCard from "./Activities/ActivityCard";

interface ArtactividadListProps {
  artactividades: Artactividad[];
}

interface ActivityDetails {
  activities: Actividad[];
  peligrosMap: { [key: number]: Peligro[] };
  riesgosMap: { [key: number]: Riesgo[] };
  medidasMap: { [key: number]: MedidaControl[] };
}

const ArtactividadList: React.FC<ArtactividadListProps> = ({ artactividades }) => {

  const [openDialog, setOpenDialog] = useState(false);

  const [details, setDetails] = useState<ActivityDetails | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async (id: number) => {
    if (id) {
      await deleteActivity(id, '/admin/containers/ListArt');
    }
    handleCloseDialog();
  };

  const getAllDetails = async (id: number) => {
    const data = await getDetails(id);
    console.log("Data: ", data);

    setDetails(data);
    setDetailsDialogOpen(true);
  }

  console.log("Details: ", details);



  return (
    <Container component={Card} maxWidth="lg" sx={{ marginTop: "2em", padding: "2em", display: "grid", gridTemplateColumns: { sm: "1fr 1fr", md: "repeat(3, 1fr)", lg: "repeat(2, 1fr)" }, gap: "1em", mb: "2em" }}>
      {artactividades.map((artactividad) => (
        <Card
          key={artactividad.id}
          className="border p-4 mb-2 rounded shadow"
          sx={{ padding: "1em", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
        >
          <Typography variant="h3" component="h3" sx={{ fontSize: "1.5em", fontWeight: "bold", textAlign: "center", my: "1em" }}>
            {artactividad.nombre}
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ justifyContent: "center", marginTop: "auto", width: "100%", gap: "1em" }}>
            <Divider sx={{ width: "100%", margin: "1" }} />
            {/* <DetailsDialog id={'1'} /> */}
            <CustomDialog
              text="Eliminar"
              dialogDescription="¿Estás seguro que deseas eliminar este registro? Esta acción no se puede deshacer."
              open={openDialog}
              handleClickOpen={() => setOpenDialog(true)}
              handleClose={handleCloseDialog}
              actions={[
                { label: "Eliminar", onClick: () => handleConfirmDelete(artactividad.id!), variant: "contained", color: "error", component: <DeleteIcon /> },
              ]}
              maxWidth="sm"
              fullWidth={true}
              triggerButton={{
                variant: "contained",
                color: "error",
                startIcon: <DeleteIcon />,
              }}
            >
              <Box>
                <Typography variant="body1">Detalles de la actividad: {artactividad.nombre}</Typography>
              </Box>
            </CustomDialog>

            <CustomDialog
              text="Ver Detalles"
              header={{ title: "Detalles de la actividad", subtitle: "Detalles de la actividad" }}
              open={detailsDialogOpen}
              handleClickOpen={() => getAllDetails(artactividad.id!)}
              handleClose={() => setDetailsDialogOpen(false)}
              maxWidth="lg"
              fullWidth={true}
              triggerButton={{
                variant: "contained",
                color: "primary",
                startIcon: <VisibilityIcon />,
              }}
            >
              <Box>
                <ActivityCard
                  activities={details?.activities || []}
                  medidas={details?.medidasMap || []}
                  peligros={details?.peligrosMap || []}
                  riesgos={details?.riesgosMap || []}
                />
              </Box>
            </CustomDialog>

          </Stack>
        </Card>
      ))}
    </Container>
  );
};

export default ArtactividadList;