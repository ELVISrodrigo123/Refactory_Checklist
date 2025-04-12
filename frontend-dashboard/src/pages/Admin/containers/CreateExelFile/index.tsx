import { useState, useEffect, useCallback } from 'react';
import { 
  Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, 
  CircularProgress, Box, Snackbar, Alert,
  Typography
} from '@mui/material';
import { UploadFile as UploadFileIcon, Delete, CloudUpload } from '@mui/icons-material';
import AdminLayout from "../../../components/AdminLayout";
import { ExcelFile } from '../../../models/ExcelFile';
import { getExcelFiles, createExcelFile, deleteExcelFile } from '../../../services/excelFileService';

const CreateExcelFile = () => {
  const [excelFiles, setExcelFiles] = useState<ExcelFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExcelFiles = useCallback(async () => {
    setLoading(true);
    try {
      const files = await getExcelFiles();
      setExcelFiles(files);
    } catch (error) {
      console.error('Error loading Excel files:', error);
      handleError('Error al cargar los archivos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExcelFiles();
  }, [fetchExcelFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileToUpload(event.target.files?.[0] || null);
  };

  const handleFileUpload = async () => {
    if (!fileToUpload) return;
    
    if (!fileToUpload.name.endsWith('.xlsx')) {
      handleError('Por favor, sube un archivo Excel válido (.xlsx).');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('description', 'Descripción opcional');
      formData.append('is_active', 'true');

      const newFile = await createExcelFile(formData);
      setExcelFiles(prev => [...prev, newFile]);
      setFileToUpload(null);
      handleError('Archivo subido correctamente.');
    } catch (error) {
      console.error('Error uploading Excel file:', error);
      handleError('Error al subir el archivo.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este archivo?')) return;
    try {
      await deleteExcelFile(id);
      setExcelFiles(prev => prev.filter(file => file.id !== id));
      handleError('Archivo eliminado correctamente.');
    } catch (error) {
      console.error('Error deleting file:', error);
      handleError('Error al eliminar el archivo.');
    }
  };

  const handleError = (message: string) => {
    setError(message);
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <AdminLayout>
      <Box sx={{ 
        p: { xs: 1, md: 3 },
        color: "text.primary"
      }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Typography variant="h4" component="h1" sx={{ 
            mb: 3,
            fontWeight: 600,
            color: "primary.main"
          }}>
            ARCHIVOS EXCEL DOCUMENTADOS
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 4,
            alignItems: 'center'
          }}>
            <Button
              component="label"
              variant="contained"
              color="primary"
              startIcon={<CloudUpload />}
              sx={{ flexShrink: 0 }}
            >
              Seleccionar Archivo
              <input 
                type="file" 
                hidden 
                onChange={handleFileChange}
                accept=".xlsx"
              />
            </Button>

            <Button 
              variant="contained" 
              onClick={handleFileUpload} 
              disabled={!fileToUpload || uploading} 
              startIcon={uploading ? <CircularProgress size={20} /> : <UploadFileIcon />}
              color="secondary"
              sx={{ flexShrink: 0 }}
            >
              {uploading ? 'Subiendo...' : 'Subir Archivo'}
            </Button>

            {fileToUpload && (
              <Typography variant="body2" sx={{ ml: 1 }}>
                {fileToUpload.name}
              </Typography>
            )}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : excelFiles.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography>No hay archivos disponibles.</Typography>
            </Paper>
          ) : (
            <TableContainer 
              component={Paper}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3
              }}
            >
              <Table>
                <TableHead sx={{ bgcolor: 'primary.dark' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>
                      Lista de Análisis de Riesgo
                    </TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>
                      Fecha de Subida
                    </TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {excelFiles.map((file) => (
                    <TableRow 
                      key={file.id} 
                      sx={{ 
                        '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                        '&:hover': { bgcolor: 'action.selected' }
                      }}
                    >
                      <TableCell>{file.file.split('/').pop()}</TableCell>
                      <TableCell>
                        {file.created_at
                          ? new Date(file.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Fecha no disponible'}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteFile(file.id)}
                          aria-label="Eliminar archivo"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Snackbar
          open={!!error}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={error?.includes('correctamente') ? 'success' : 'error'}
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  );
};

export default CreateExcelFile;