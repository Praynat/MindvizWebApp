import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      // from --bg-neutral / --bg-light-gray
      default: "#F7F9FC",
      paper: "#EBEEF2",
    },
    primary: {
      // gradient start/end
      main: "#2BC0E4",
      dark: "#2C3E50",
      contrastText: "#FFFFFF",
    },
    secondary: {
      // accent
      main: "#FFA65C",
      contrastText: "#1E1E1E",
    },
    text: {
      // text on light surfaces
      primary: "#1E1E1E",
      secondary: "#9CA3AF",
      disabled: "#DDDDDD",
    },
  },
  custom: {
    // borders & hovers in light mode
    cardBorderColor: "#1E1E1E",
    cardHoverBorderColor: "#1E1E1E",
    cardHoverBgColor: "#F0F0F0",      // --hover-bg-light
    formInputBg: "#EBEEF2",
    formDisabledButtonBg: "#DDDDDD",
    cardDetailBorder: "#1E1E1E",
  },
});

// Thème sombre
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      // darker backgrounds
      default: "#2C3E50",     // gradient-end
      paper: "#1E1E1E",
    },
    primary: {
      // keep same accent for buttons / links
      main: "#2BC0E4",
      dark: "#2C3E50",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FFA65C",
      contrastText: "#1E1E1E",
    },
    text: {
      // text on dark surfaces
      primary: "#FFFFFF",
      secondary: "rgba(255,255,255,0.85)", // --text-white-85
      disabled: "#666666",
    },
  },
  custom: {
    // borders & hovers in dark mode
    cardBorderColor: "#9CA3AF",
    cardHoverBorderColor: "#FFFFFF",
    cardHoverBgColor: "rgba(255,255,255,0.2)", // --hover-bg-white-20
    formInputBg: "#1E1E1E",
    formDisabledButtonBg: "#444444",
    cardDetailBorder: "#FFFFFF",
  },
});