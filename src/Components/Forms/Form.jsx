import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import FormButton from "./FormButton";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import LoopIcon from "@mui/icons-material/Loop";
import { useDarkLightTheme } from "../../Theme/ThemeProvider";

const Form = ({
  title = "",
  onSubmit,
  onReset,
  validateForm,
  to = "/",
  color = "inherit",
  spacing = 1,
  styles = {},
  children,
  submitText = "Submit", // Add prop for submit button text
}) => {
  const { theme } = useDarkLightTheme();
  const navigate = useNavigate();

  return (
    <Box
      component="form"
      color={color}
      sx={{ p: { xs: 1, sm: 2 }, ...styles }}
      onSubmit={onSubmit}
      autoComplete="off"
      noValidate
    >
      <Typography align="center" variant="h5" component="h1" mb={6} sx={{ fontFamily: "roboto", fontWeight: "500", fontSize: "30px", color: theme.strongTextColor }}>
        {title.charAt(0).toUpperCase() + title.slice(1)}
      </Typography>

      <Grid container spacing={spacing} sx={{ mb: "0px" }}>
        {children}
      </Grid>

      <Grid container spacing={1} my={2} direction="row" width="100">
        <Grid item xs={12}> {/* Changed from xs={6} to take full width initially */}
          <FormButton
            node={submitText} // Use the prop here
            onClick={onSubmit} // onSubmit should handle preventDefault
            disabled={!validateForm} // Use validateForm prop
            type="submit" // Make this the actual submit button
          />
        </Grid>
        <Grid item xs={12} sm={6}> {/* Keep reset and cancel */}
          <FormButton
            node={<LoopIcon />}
            variant="outlined"
            component="div" // Should not submit the form
            onClick={onReset}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormButton
            node="cancel"
            color="error"
            component="div" // Should not submit the form
            variant="outlined"
            onClick={() => navigate(to)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Form;