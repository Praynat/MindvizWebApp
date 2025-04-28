import React, { createContext, useCallback, useContext, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

const SnackbarContext = createContext();

export default function SnackbarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("success");
  const [variant, setVariant] = useState("filled");
  const [message, setMessage] = useState("");
  // new: store per-snack options
  const [anchorOrigin, setAnchorOrigin] = useState({ vertical: "bottom", horizontal: "right" });
  const [autoHideDuration, setAutoHideDuration] = useState(3000);

  const setSnack = useCallback(
    (severity, text, options = {}) => {
      setColor(severity);
      setMessage(text);
      setVariant(options.variant || "filled");
      // override only if provided
      if (options.anchorOrigin) setAnchorOrigin(options.anchorOrigin);
      if (options.autoHideDuration != null) setAutoHideDuration(options.autoHideDuration);
      setOpen(true);
    },
    []
  );

  return (
    <>
      <SnackbarContext.Provider value={setSnack}>
        {children}
      </SnackbarContext.Provider>

      <Snackbar
        anchorOrigin={anchorOrigin}
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={() => setOpen(false)}
      >
        <Alert severity={color} variant={variant}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export const useSnack = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnack must be used inside SnackbarProvider");
  return ctx;
};