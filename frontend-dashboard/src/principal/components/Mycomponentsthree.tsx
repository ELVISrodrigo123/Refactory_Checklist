import { Box, Container, Grid, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import Image from "next/image";

const IndustrialSafety = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const content = {
    title: "Seguridad Industrial",
    subtitle: "Importancia de la Seguridad Industrial",
    description: "La seguridad industrial es fundamental para proteger la integridad de los trabajadores y prevenir accidentes. Implementar normas de seguridad reduce riesgos y mejora el ambiente laboral, asegurando el cumplimiento de las normativas vigentes.",
    buttonText: "Más información",
    images: {
      left: "/assets/img/seccionthree.jpeg",
      right: "/assets/img/secciontwo.jpg"
    }
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 8,
        px: isSmallScreen ? 2 : 4
      }}
    >
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        textAlign="center" 
        gutterBottom
        sx={{
          fontWeight: 700,
          color: 'primary.main',
          mb: 4
        }}
      >
        {content.title}
      </Typography>
      
      <Grid 
        container 
        spacing={4} 
        justifyContent="center" 
        alignItems={isMobile ? "flex-start" : "center"}
      >
        {/* Imagen izquierda */}
        <Grid item xs={12} md={4} order={{ xs: 1, md: 1 }}>
          <Box sx={{
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            height: '100%',
            minHeight: isMobile ? 250 : 350
          }}>
            <Image
              src={content.images.left}
              alt="Equipos de seguridad industrial"
              width={500}
              height={500}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              priority
            />
          </Box>
        </Grid>

        {/* Contenido central */}
        <Grid 
          item 
          xs={12} 
          md={4} 
          order={{ xs: 3, md: 2 }}
          sx={{
            textAlign: isMobile ? 'center' : 'left',
            px: isMobile ? 2 : 4
          }}
        >
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            sx={{
              fontWeight: 600,
              mb: 3,
              color: 'text.primary'
            }}
          >
            {content.subtitle}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{
              mb: 4,
              lineHeight: 1.7,
              color: 'text.secondary'
            }}
          >
            {content.description}
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            size={isMobile ? "medium" : "large"}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: theme.shadows[4],
              '&:hover': {
                boxShadow: theme.shadows[8]
              }
            }}
          >
            {content.buttonText}
          </Button>
        </Grid>

        {/* Imagen derecha */}
        <Grid item xs={12} md={4} order={{ xs: 2, md: 3 }}>
          <Box sx={{
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            height: '100%',
            minHeight: isMobile ? 250 : 350
          }}>
            <Image
              src={content.images.right}
              alt="Trabajadores con equipos de protección"
              width={500}
              height={500}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default IndustrialSafety;