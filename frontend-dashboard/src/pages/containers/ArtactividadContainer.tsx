import { Card } from '@mui/material';
import ArtactividadService from '../../services/ArtactividadService';
import ArtactividadList from '@/components/ArtactividadList';

async function ArtactividadContainer() {

  const data = await ArtactividadService.listarTodos();
  return (
    <Card>
      <ArtactividadList
        artactividades={data}
      />
    </Card>
  );
};

export default ArtactividadContainer;