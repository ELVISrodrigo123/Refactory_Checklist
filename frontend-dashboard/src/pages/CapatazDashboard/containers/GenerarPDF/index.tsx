import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from "@mui/material";

// Interfaces (se mantienen igual)
interface Tarea {
    id: number;
    descripcion: string;
    si: boolean;
    no: boolean;
    observaciones: string;
    titulo: number;
}

interface Titulo {
    id: number;
    nombre: string;
    formulario: number;
}

interface UserInfo {
    nombre: string;
    rol: string;
    turno: string;
    grupo: string;
}

interface Formulario {
    id: number;
    titulo: string;
    sector: number;
    item: string;
    aspecto_a_verificar: string;
    bueno: string;
    malo: string;
    comentarios: string;
}

interface GenerarPDFProps {
    datosTemporales: Tarea[];
    userInfo: UserInfo | null;
    formularioSeleccionado: Formulario | null;
    fechaActual: string;
    horaActual: string;
    sectorNombre: string;
    titulos: Titulo[];
    comentarioFinal: string;
}

const GenerarPDF: React.FC<GenerarPDFProps> = ({
    datosTemporales,
    userInfo,
    formularioSeleccionado,
    fechaActual,
    horaActual,
    sectorNombre,
    titulos,
    comentarioFinal,
}) => {
    const generarPDF = (): void => {
        const doc = new jsPDF("p", "mm", "a4");
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");

        // -------------------------
        // ENCABEZADO CON IMAGEN
        // -------------------------
        const recuadroAncho = 25;
        const recuadroAlto = 15;
        const tituloX = 15;
        const tituloY = 15;

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.rect(tituloX, tituloY, 180, recuadroAlto);

        // Logo
        doc.rect(tituloX, tituloY, recuadroAncho, recuadroAlto);
        const imagenURL = "/assets/img/logo.png";
        doc.addImage(imagenURL, "PNG", tituloX + 2, tituloY + 2, recuadroAncho - 4, recuadroAlto - 4);

        // Título del formulario
        const nombreFormulario = formularioSeleccionado?.titulo || "Error no existe formulario";
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const tituloFormularioX = tituloX + recuadroAncho + (180 - 2 * recuadroAncho) / 2;
        const tituloFormularioY = tituloY + recuadroAlto / 2 + 2;
        doc.text(nombreFormulario, tituloFormularioX, tituloFormularioY, { align: "center" });

        // Versión
        doc.rect(tituloX + 180 - recuadroAncho, tituloY, recuadroAncho, recuadroAlto);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Versión 3", tituloX + 180 - recuadroAncho / 2, tituloY + recuadroAlto / 2 + 2, { align: "center" });

        // -------------------------
        // INFORMACIÓN DEL USUARIO
        // -------------------------
        const tablaInfoY = tituloY + recuadroAlto + 2;
        const tablaAncho = 180;
        const filaAlto = 6;

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.rect(tituloX, tablaInfoY, tablaAncho, filaAlto * 3);

        // Líneas divisorias
        doc.line(tituloX, tablaInfoY + filaAlto, tituloX + tablaAncho, tablaInfoY + filaAlto);
        doc.line(tituloX, tablaInfoY + filaAlto * 2, tituloX + tablaAncho, tablaInfoY + filaAlto * 2);

        // Datos del usuario
        doc.text(`Fecha: ${fechaActual}`, tituloX + 2, tablaInfoY + filaAlto - 1);
        doc.text(`Hora: ${horaActual}`, tituloX + tablaAncho * 0.4 + 2, tablaInfoY + filaAlto - 1);
        doc.text(`Turno: ${userInfo?.turno || "N/A"}`, tituloX + tablaAncho * 0.7 + 2, tablaInfoY + filaAlto - 1);

        doc.text(`Realizado por: ${userInfo?.nombre || "N/A"}`, tituloX + 2, tablaInfoY + filaAlto * 2 - 1);
        doc.text(`Firma: ${userInfo?.rol || "N/A"}`, tituloX + tablaAncho * 0.4 + 2, tablaInfoY + filaAlto * 2 - 1);
        doc.text(`Área: ${sectorNombre || "Sin información"}`, tituloX + tablaAncho * 0.7 + 2, tablaInfoY + filaAlto * 2 - 1);

        doc.text(`Grupo: ${userInfo?.grupo || "N/A"}`, tituloX + 2, tablaInfoY + filaAlto * 3 - 1);
        // -------------------------
// TABLA DE TAREAS (VERSIÓN COMPACTA)
// -------------------------
const startY = tablaInfoY + filaAlto * 3 + 2; // Reducimos el espacio inicial

// 1. Agrupar tareas por título (igual que antes)
const tareasAgrupadas = datosTemporales.reduce((acc, tarea) => {
    const titulo = titulos.find((t) => t.id === tarea.titulo);
    if (!titulo) return acc;

    if (!acc[titulo.id]) {
        acc[titulo.id] = {
            nombre: titulo.nombre,
            tareas: []
        };
    }
    acc[titulo.id].tareas.push(tarea);
    return acc;
}, {} as Record<number, { nombre: string, tareas: Tarea[] }>);

// 2. Configurar headers compactos
const headers = [
    [
        { 
            content: formularioSeleccionado?.item || "Ítem", 
            rowSpan: 2,
            styles: { 
                halign: 'center', 
                valign: 'middle',
                fontSize: 6
            }
        },
        { 
            content: formularioSeleccionado?.aspecto_a_verificar || "Aspectos", 
            rowSpan: 2,
            styles: { 
                halign: 'center', 
                valign: 'middle',
                fontSize: 6
            }
        },
        { 
            content: "Estado", 
            colSpan: 2,
            styles: { 
                halign: 'center', 
                valign: 'middle',
                fontSize: 6
            }
        },
        { 
            content: formularioSeleccionado?.comentarios || "Obs.", 
            rowSpan: 2,
            styles: { 
                halign: 'center', 
                valign: 'middle',
                fontSize: 6
            }
        }
    ],
    [
        { 
            content: formularioSeleccionado?.bueno || "✓", 
            styles: { 
                halign: 'center', 
                valign: 'middle',
                fontSize: 6
            }
        },
        { 
            content: formularioSeleccionado?.malo || "✗", 
            styles: { 
                halign: 'center', 
                valign: 'middle',
                fontSize: 6
            }
        }
    ]
];

// 3. Preparar los datos en versión compacta
const body = Object.values(tareasAgrupadas).flatMap(grupo => {
    return grupo.tareas.map((tarea, index) => {
        const rowData = [
            index === 0 ? {
                content: grupo.nombre,
                rowSpan: grupo.tareas.length,
                styles: {
                    halign: 'center',
                    valign: 'middle',
                    fontStyle: 'bold',
                    fontSize: 4.5,
                    textColor: "#000"
                }
            } : null,
            { 
                content: tarea.descripcion,
                styles: {
                    fontSize: 6
                }
            },
            { 
                content: tarea.si ? "X" : "", 
                styles: { 
                    halign: "center", 
                    valign: "middle",
                    fontSize: 6
                } 
            },
            { 
                content: tarea.no ? "X" : "", 
                styles: { 
                    halign: "center", 
                    valign: "middle",
                    fontSize: 6
                } 
            },
            { 
                content: tarea.observaciones || "",
                styles: {
                    fontSize: 6
                }
            }
        ];

        return rowData.filter(item => item !== null);
    });
});

// 4. Generar la tabla compacta
(doc as any).autoTable({
    head: headers,
    body: body,
    startY: startY,
    theme: "grid",
    margin: { left: 15, right: 15 }, // Márgenes más pequeños
    tableWidth: "auto",
    styles: {
        fontSize: 6, // Texto más pequeño
        cellPadding: 1.5, // Espaciado interno reducido
        valign: "middle",
        lineWidth: 0.1, // Bordes más finos
        lineColor: [200, 200, 200] // Gris claro
    },
    headStyles: {
        fillColor: "#1E293B",
        textColor: "#FFFFFF",
        fontStyle: "bold",
        fontSize: 6, // Texto más pequeño en headers
        lineWidth: 0.1
    },
    columnStyles: {
        0: { cellWidth: 20, halign: "center" }, // ÍTEM más angosto
        1: { cellWidth: "auto", halign: "left" }, // ASPECTOS (ancho flexible)
        2: { cellWidth: 8, halign: "center" }, // ✓ (Sí) más angosto
        3: { cellWidth: 8, halign: "center" }, // ✗ (No) más angosto
        4: { cellWidth: 45, halign: "left" } // OBSERVACIONES más angosto
    },
    didParseCell: (data: any) => {
        // Manejar celdas fusionadas
        if (data.column.index === 0 && data.row.index > 0) {
            data.cell = { raw: "", rowSpan: 1 };
        }
        
        // Resaltar celdas con X (sin color, solo negrita)
        if ([2, 3].includes(data.column.index) && data.cell.raw === "X") {
            data.cell.styles = data.cell.styles || {};
            data.cell.styles.fontStyle = "bold";
        }
    }
});

        // -------------------------
        // TABLA FINAL INTEGRADA
        // -------------------------
        const finalY = (doc as any).autoTable.previous.finalY;

        // Obtener el ancho total de la hoja (por ejemplo, A4: 210mm) menos los márgenes
        const pageWidth = doc.internal.pageSize.width; // Ancho total de la página
        const marginLeft = tituloX ; // Margen izquierdo
        const marginRight = pageWidth - marginLeft - 180; // Margen derecho (ajustable)

        // Crear tabla final con 2 filas integradas
        (doc as any).autoTable({
            body: [
                [
                    {
                        content: `Otras observaciones: ${comentarioFinal || "Ninguna"}`,
                        colSpan: 5,
                        styles: {
                            fontSize: 6,
                            fillColor: [255, 255, 255], // Fondo blanco
                            textColor: [0, 0, 0], // Texto negro
                            fontStyle: 'normal',
                            halign: 'left',
                            valign: 'middle',
                            lineWidth: 0.1 // Grosor del borde interno
                        }
                    }
                ]
            ],
            startY: finalY,
            margin: { left: marginLeft, right: marginRight }, // Márgenes para ocupar todo el ancho
            tableWidth: pageWidth - marginLeft - marginRight, // Ancho total de la tabla
            styles: {
                lineColor: [0, 0, 0], // Color del borde
                lineWidth: 0.1 // Grosor del borde general
            },
            columnStyles: {
                0: { cellWidth: (pageWidth - marginLeft - marginRight) / 5 }, // 5 columnas iguales
                1: { cellWidth: (pageWidth - marginLeft - marginRight) / 5 },
                2: { cellWidth: (pageWidth - marginLeft - marginRight) / 5 },
                3: { cellWidth: (pageWidth - marginLeft - marginRight) / 5 },
                4: { cellWidth: (pageWidth - marginLeft - marginRight) / 5 }
            },
            theme: 'grid',
            showHead: 'never'
        });
        // Guardar el PDF
        doc.save(`checklist_${formularioSeleccionado?.titulo || "generado"}_${fechaActual.replace(/\//g, '-')}.pdf`);
    };

    return (
        <Button
            variant="contained"
            color="success"
            onClick={generarPDF}
            sx={{
                ml: 2,
                bgcolor: "#4CAF50",
                color: "#fff",
                "&:hover": { bgcolor: "#45a049" },
                fontSize: "0.75rem",
                padding: "6px 12px",
            }}
        >
            Generar PDF
        </Button>
    );
};

export default GenerarPDF;