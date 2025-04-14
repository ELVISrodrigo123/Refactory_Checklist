import { Box } from "@mui/material";
import ArtactividadContainer from "@/pages/containers/ArtactividadContainer";
import { PageHeader } from "@/components/core/PageHeader";

const ListArt: React.FC = () => {
    return (
        <Box sx={{ p: 4 }}>
            <PageHeader width="xl" title="Art Activities" subtitle="Manage your art activities here" />
            <Box sx={{ mt: 4 }}>
                <ArtactividadContainer />
                
            </Box>            
        </Box>
    );
};

export default ListArt;
