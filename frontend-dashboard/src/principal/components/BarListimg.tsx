import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

export default function VisionSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const videoSrc = '/assets/video/header.mp4';
  const overlayColor = 'rgba(0, 0, 0, 0.5)';
  const textContent = {
    title: "PROPÓSITO",
    description: "Innovar en la minería en Bolivia y el mundo para generar oportunidades y bienestar sostenible, convirtiéndonos en la minera número uno de plata globalmente."
  };

  return (
    <Box sx={{
      position: 'relative',
      width: '100vw',
      height: isMobile ? '100vh' : '100vh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 1,
          opacity: 0.2
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Tu navegador no soporta el video.
      </Box>

      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: overlayColor,
        zIndex: 0,
      }} />

      <Box sx={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '90vw',
        p: 4,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: isMobile ? 'translateY(0)' : 'none'
      }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: 700,
            color: 'white',
            mb: 3,
            textTransform: 'uppercase',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            width: '100%'
          }}
        >
          {textContent.title}
        </Typography>
        <Typography
          component="p"
          sx={{
            color: 'white',
            lineHeight: 1.6,
            fontSize: isMobile ? '1.1rem' : '1.5rem',
            maxWidth: '800px',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            px: isMobile ? 0 : 2,
            width: '100%'
          }}
        >
          {textContent.description}
        </Typography>
      </Box>
    </Box>
  );
}