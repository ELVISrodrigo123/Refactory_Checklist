import ArchiveIcon from '@mui/icons-material/Archive';
import ViewListIcon from '@mui/icons-material/ViewList';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import EditNoteIcon from '@mui/icons-material/EditNote';

export const menuItems = [
    {
        path: "/Admin/containers/CreateExelFile",
        label: "Subir archivo Excel",
        icon: <ArchiveIcon />,
    },
    {
        path: "/Admin/containers/ListArt",
        label: "Lista de ART",
        icon: <ViewListIcon />,
    },
    {
        path: "/Admin/containers/UserProfile",
        label: "Crear Usuario",
        icon: <PersonAddAltIcon />,
    },
    {
        path: "/Admin/containers/ViewProfile",
        label: "Lista de Personal",
        icon: <SupervisorAccountIcon />,
    },
    {
        path: "/Admin/containers/CreateForm",
        label: "Creacion de formularios",
        icon: <ViewListIcon />,
    },
    {
        path: "/Admin/containers/TableFormulario",
        label: "Formularios",
        icon: <EditNoteIcon />,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistReactivos",
        label: "Form Domo",
        icon: <EditNoteIcon />,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistEspesadores",
        label: "Form Molienda",
        icon: <EditNoteIcon />,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistFiltro",
        label: "Form Flotacion Plomo",
        icon: <EditNoteIcon />,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistFlotacionZinc",
        label: "Form Flotación Zinc",
        icon: <EditNoteIcon />,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistReactivos",
        label: "Form Reactivos",
        icon: <EditNoteIcon />,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistEspesadores",
        label: "Form Espesadores",
        icon: <EditNoteIcon />,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistFiltro",
        label: "Form Filtros",
        icon: <EditNoteIcon />,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistCarguio",
        label: "Form Carguío",
        icon: <EditNoteIcon />,
    },
];