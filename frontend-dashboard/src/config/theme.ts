import { createTheme, ThemeOptions } from "@mui/material";
import { green, indigo, grey } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface PaletteColor {
    normal?: string;
  }

  interface SimplePaletteColorOptions {
    normal?: string;
  }

  interface Palette {
    neutral: {
      light: string;
      medium: string;
      normal: string;
      main: string;
    };
    green: {
      main: string;
    };
  }

  interface PaletteOptions {
    neutral?: {
      light: string;
      medium: string;
      normal: string;
      main: string;
    };
    green?: {
      main: string;
    };
  }

  interface TypographyVariants {
    h7: React.CSSProperties;
    h8: React.CSSProperties;
    link: React.CSSProperties;
    cardTitle: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    h7?: React.CSSProperties;
    h8?: React.CSSProperties;
    link?: React.CSSProperties;
    cardTitle?: React.CSSProperties;
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#fff",
      normal: indigo[500],
    },

    secondary: {
      main: indigo[200],
      normal: indigo["A400"],
    },

    neutral: {
      light: "#5569ff",
      medium: grey[200],
      normal: "#b21f1f",
      main: "#1976d2",
    },

    green: {
      main: green[800],
    },
  },

  typography: {
    link: {
      fontSize: "0.8rem",
      fontWeight: 500,
      display: "block",
      cursor: "pointer",
    },
    cardTitle: {
      fontSize: "1.2rem",
      display: "block",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1rem",
    },
    h7: {
      fontSize: "0.8rem",
    },
    h8: {
      fontSize: "0.7rem",
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;