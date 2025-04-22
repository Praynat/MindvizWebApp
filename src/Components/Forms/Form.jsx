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
        <Grid xs={12}>
          <FormButton
            node="Submit"
            onClick={onSubmit}
            disabled={!validateForm}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <FormButton
            node={<LoopIcon />}
            variant="outlined"
            component="div"
            onClick={onReset}

          />
        </Grid>
        <Grid xs={12} sm={6}>
          <FormButton
            node="cancel"
            color="error"
            component="div"
            variant="outlined"
            onClick={() => navigate(to)}
          />
        </Grid>

      </Grid>
    </Box>
  );
};

export default Form;