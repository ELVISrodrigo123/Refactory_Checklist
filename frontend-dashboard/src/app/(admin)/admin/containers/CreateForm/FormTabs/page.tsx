"use client";
import React, { useState, useCallback, memo } from 'react';
import { Tabs, Tab, Box, Fade } from '@mui/material';
import Sector from '../SectorForm';
import Formulario from '../CkecklistForm';
import TituloChecklist from '../TituloChecklist';
import TareaChecklist from '../TareaChecklist';

const FormTabs = () => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    }, []);

    const tabs = [
        { label: 'Sectores', Component: Sector },
        { label: 'Formularios', Component: Formulario },
        { label: 'Títulos', Component: TituloChecklist },
        { label: 'Tareas', Component: TareaChecklist }
    ];

    return (
        <Box sx={{ 
            p: 2
        }}>
            <Tabs
                value={tabIndex}
                onChange={handleChange}
                variant="fullWidth"
                sx={{ 
                    mb: 3,
                
                }}
            >
                {tabs.map((tab, index) => (
                    <Tab 
                        key={index}
                        label={tab.label}
                        sx={{ 
                            textTransform: 'none',
                            fontWeight: 'bold',
                            minHeight: '48px'
                        }}
                    />
                ))}
            </Tabs>

            <Box sx={{ 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
            }}>
                {tabs.map((tab, index) => (
                    <Fade key={index} in={tabIndex === index} timeout={200}>
                        <div hidden={tabIndex !== index}>
                            <Box sx={{ p: 2 }}>
                                <tab.Component />
                            </Box>
                        </div>
                    </Fade>
                ))}
            </Box>
        </Box>
    );
};

export default memo(FormTabs);