import { createTheme } from "@mui/material/styles";

// Thème clair
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#FFFFFF",
      paper: "#F3F4F6",
    },
    primary: {
      main: "#3B82F6",
    },
    text: {
      primary: "#1F2937",
      secondary: "#9CA3AF",
      disabled: "#DDDDDD",
    },
  },
  custom: {
    cardBorderColor: "#1F2937",
    cardHoverBorderColor: "#1F2937",
    cardHoverBgColor: "#F5F4F2",
    formInputBg: "#F3F4F6",
    formDisabledButtonBg: "#DDDDDD",
    cardDetailBorder: "#1F2937",
  },
});

// Thème sombre
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#111827",
      paper: "#1F2937",
    },
    primary: {
      main: "#3B82F6",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#D1D5DB",
      disabled: "#B2B2B2",
    },
  },
  custom: {
    cardBorderColor: "#9CA3AF",
    cardHoverBorderColor: "#D1D5DB",
    cardHoverBgColor: "#1F2937",
    formInputBg: "#1F2937",
    formDisabledButtonBg: "#273758",
    cardDetailBorder: "#FFFFFF",
  },
});
