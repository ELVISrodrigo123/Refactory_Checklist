"use client"
import { useState } from 'react'
import { Box, Button, Card, Container, Dialog, DialogProps, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { PageHeader } from '../core/PageHeader';
import ActivityCard, { type ActivityCardProps } from '../Activities/ActivityCard';

interface Props extends ActivityCardProps {
    id: string
}

export function DetailsDialogUi({activities, medidas, peligros, riesgos, id}: Props) {

    const [open, setOpen] = useState(false);
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('sm');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box>
            <Button
                variant="contained"
                color="primary"
                startIcon={<VisibilityIcon />}
                onClick={handleClickOpen}
                sx={{
                    px: 3,
                    textTransform: 'none',
                    fontWeight: 600
                }}
            >
                Mostrar Actividades
            </Button>

            <Dialog
                component={Card}
                fullWidth={true}
                maxWidth={"xl"}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    <PageHeader title={`Activity ID: ${id}`} subtitle="Details of the activity" />

                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can set my maximum width and whether to adapt or not.
                    </DialogContentText>

                    <Box sx={{ padding: "3em", mt: "2em" }}>
                        <ActivityCard
                            activities={activities}
                            medidas={medidas}
                            peligros={peligros}
                            riesgos={riesgos}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
};