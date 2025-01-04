import React from "react";
import TextField from "@mui/material/TextField";
import { useDarkLightTheme } from "../../Theme/ThemeProvider";
import UseCapitalize from "../../Hooks/UseCapitalize";
import { Grid2 } from "@mui/material";

const { capitalizeFirstLetter } = UseCapitalize();
const Input = ({ variant = "outlined", type = "text", name, data, label, required = true, error, onChange,rows,multiline=false, ...rest }) => {
  const { theme } = useDarkLightTheme();
  return (
    <Grid2  xs={12}>
      <TextField
        variant={variant}
        label={capitalizeFirstLetter(label)}
        type={type}
        id={name}
        name={name}
        value={data[name] ? data[name] : ""}
        required={required}
        helperText={error}
        error={Boolean(error)}
        onChange={onChange}
        fullWidth
        autoComplete="off"
        rows={rows}
        multiline={multiline}
        sx={{ 
          backgroundColor: theme.formInputColor, // Set your desired background color here
          '& .MuiInputBase-input': {
            color: theme.strongTextColor, // Set input text color
          },
          '& .MuiInputLabel-root': {
            color: '#B2B2B2', // Set label text color 
          },
          '& .MuiFormHelperText-root': {
            color: '#B2B2B2', // Set helper text color
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#8e8e8e', // Set default border color
            },
            '&:hover fieldset': {
              borderColor: theme.cardHoverBorderColor, // Set border color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3B82F6', // Set border color when focused
            },
            '&.Mui-error fieldset': {
              borderColor: '#FF0000', // Set border color when error
            },
          },
          
        }}
        {...rest}
      />
    </Grid2>
  );
};

export default Input;