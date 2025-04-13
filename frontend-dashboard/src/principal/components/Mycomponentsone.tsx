import { Box, Typography, Grid, useTheme, useMediaQuery, Card, Divider } from '@mui/material';
import Image from 'next/image';

const riskCards = [
  {
    title: "Peligro",
    description: "Evaluación de peligros potenciales y su impacto en la seguridad de los trabajadores.",
    image: "/assets/img/peligroh.png",
    altText: "Ilustración de identificación de peligros"
  },
  {
    title: "Riesgo",
    description: "Identificación de riesgos asociados a las operaciones en la planta minera.",
    image: "/assets/img/riesgoh.png",
    altText: "Ilustración de análisis de riesgos"
  },
  {
    title: "Medidas de Control",
    description: "Implementación de medidas para mitigar riesgos y garantizar un entorno seguro.",
    image: "/assets/img/epp.png",
    altText: "Ilustración de equipos de protección personal"
  }
];

const introText = "En Minera San Cristóbal, nos comprometemos con la seguridad de nuestros trabajadores. Este análisis de riesgo identifica los peligros potenciales en las operaciones de la planta minera y establece medidas de control para garantizar un ambiente de trabajo seguro y eficiente.";

export default function RiskAnalysis() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{
      color: 'white',
      py: 8,
      px: isMobile ? 2 : 4,
      textAlign: 'center',
    }}>
      <Typography variant={isMobile ? "h4" : "h3"} sx={{
        fontWeight: 700,
        mb: 5,
        px: isMobile ? 2 : 0
      }}>
        Análisis de Riesgo en el Trabajo
      </Typography>

      <Box sx={{
        maxWidth: isMobile ? '100%' : '50%',
        mx: 'auto',
        mb: 8,
        px: isMobile ? 2 : 0
      }}>
        <Typography variant="body1">
          {introText}
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center" alignItems={'center'}>
        {riskCards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              variant="outlined"
              sx={{
                p: 3,
                background: `${theme.colors.alpha.black[5]}`
              }}
            >
              <Box sx={{
                width: '100%',
                height: 250,
                borderRadius: 1,
                overflow: 'hidden',
                mb: 3,
                position: 'relative',
                flexShrink: 0
              }}>
                <Image
                  src={card.image}
                  fill
                  style={{ objectFit: "cover" }}
                  alt={card.altText}
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={85}
                />
              </Box>
              <Divider
                sx={{
                  my: 2
                }}
              />
              <Typography variant="h5" sx={{
                pb: 2
              }}
                color="text.secondary">
                {card.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {card.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}