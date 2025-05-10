"use client"
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { PageHeader } from '../core/PageHeader';

interface CustomDialogProps {
    text: string;
    header?: {
        title?: string;
        subtitle?: string;
    }
    dialogDescription?: string;
    children: React.ReactNode;
    actions?: {
        label: string;
        component?: React.ReactNode;
        variant?: "text" | "outlined" | "contained";
        color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
        onClick: () => void;
    }[],
    open: boolean;
    handleClickOpen: () => void;
    handleClose: () => void;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
    fullWidth?: boolean;
    triggerButton: {
        variant: "text" | "outlined" | "contained";
        color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
        startIcon?: React.ReactNode;
    }
}

export function CustomDialog({ text, header, dialogDescription, children, actions, handleClickOpen, handleClose, open, maxWidth = "xl", fullWidth = false, triggerButton }: CustomDialogProps) {


    return (
        <Box>
            <Button
                variant={triggerButton.variant}
                color={triggerButton.color || "primary"}
                startIcon={triggerButton.startIcon}
                onClick={handleClickOpen}
                sx={{
                    px: 3,
                    textTransform: 'none',
                    fontWeight: 600
                }}
            >
                {text}
            </Button>

            <Dialog
                component={Card}
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    {
                        header && (
                            <PageHeader title={header.title} subtitle={header.subtitle} />
                        )
                    }
                </DialogTitle>
                <DialogContent>
                    {dialogDescription && (
                        <DialogContentText sx={{ mt: "2em" }}>
                            {dialogDescription}
                        </DialogContentText>
                    )}

                    <Box sx={{ padding: "3em", mt: "2em" }}>
                        {children}
                    </Box>
                </DialogContent>
                <DialogActions>
                    {actions && actions.map((action, index) => (
                        <Button
                            key={index}
                            onClick={action.onClick}
                            variant={action.variant || "contained"}
                            startIcon={action.component}
                            color={action.color || "primary"}
                            sx={{ px: 3, textTransform: 'none', fontWeight: 600 }}
                        >
                            {action.label}
                        </Button>
                    ))}
                    <Button onClick={handleClose} variant="outlined" color="primary" sx={{ px: 3, textTransform: 'none', fontWeight: 600 }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
};