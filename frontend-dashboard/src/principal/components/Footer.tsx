import { Box, Container, Grid, IconButton, Typography, Link, useTheme, Button } from "@mui/material";
import {
  Facebook,
  LinkedIn,
  WhatsApp,
  Twitter,
  YouTube,
  Email,
  LocationOn,
  Phone
} from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Twitter />, url: "https://x.com/MinSanCristobal", name: "Twitter" },
    { icon: <Facebook />, url: "https://www.facebook.com/minerasancristobal/", name: "Facebook" },
    { icon: <LinkedIn />, url: "https://www.linkedin.com/company/minerasancristobal", name: "LinkedIn" },
    { icon: <YouTube />, url: "https://www.youtube.com/channel/UCOWuXIO5bawVPBhkd2vNEOg", name: "YouTube" },
    { icon: <WhatsApp />, url: "https://wa.me/+59171425703", name: "WhatsApp" }
  ];

  const contactInfo = [
    { icon: <LocationOn fontSize="small" />, text: "Av. Arce #1234, La Paz, Bolivia" },
    { icon: <Phone fontSize="small" />, text: "+591 2 2770000" },
    { icon: <Email fontSize="small" />, text: "contacto@minerasancristobal.com" }
  ];

  const legalLinks = [
    { text: "Términos y Condiciones", url: "#" },
    { text: "Política de Privacidad", url: "#" },
    { text: "Política de Cookies", url: "#" }
  ];

  return (
    <Box
      component="footer"

    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Logo y descripción */}
          <Grid maxWidth="" item xs={12} md={4}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme.palette.common.white
              }}
            >
              Minera San Cristóbal
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Liderando la minería con innovación y responsabilidad.
            </Typography>

            {/* Redes sociales */}
            <Box sx={{ mt: 2, display: "flex", gap: 2 }} >
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  startIcon={social.icon}
                  variant="outlined"
                  sx={{ pl: 3 }}
                />
              ))}
            </Box>
          </Grid>

          {/* Contacto */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Contacto
            </Typography>
            {contactInfo.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ mr: 1.5, color: theme.palette.primary.light }}>
                  {item.icon}
                </Box>
                <Typography variant="body2">
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Grid>

          {/* Enlaces legales */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Legal
            </Typography>
            {legalLinks.map((link, index) => (
              <Box key={index} sx={{ mb: 1.5 }}>
                <Link
                  href={link.url}
                  color="inherit"
                  underline="hover"
                  sx={{
                    '&:hover': {
                      color: theme.palette.primary.light
                    }
                  }}
                >
                  {link.text}
                </Link>
              </Box>
            ))}
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{
          mt: 4,
          pt: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="body2">
            © {currentYear} Minera San Cristóbal S.A. Todos los derechos reservados.
          </Typography>
          <Typography variant="body2">
            Sitio web diseñado por Elvis Rodrigo
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;