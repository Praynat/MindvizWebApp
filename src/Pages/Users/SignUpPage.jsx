import React from "react";
import Container from "@mui/material/Container";
import { Navigate } from "react-router-dom";
import ROUTES from "../../Routes/routesModel";
import { Box, Typography } from "@mui/material";
import useUsers from "../../Hooks/Users/useUsers";
import useForm from "../../Hooks/Forms/useForm";
import signupSchema from "../../Models/Users/signupSchema";
import initialSignupForm from "../../Helpers/Users/initialForms/initialSignupForm";
import { useMyUser } from "../../Providers/Users/UserProvider";
import SignupForm from "../../Components/Users/SignupForm";
import NavItem from "../../Components/Routes/NavItem";


export default function SignupPage() {
  const {handleSignup} = useUsers();
  
  const { data, errors, handleChange,handleCheckboxChange, handleReset, validateForm, onSubmit } =
    useForm(initialSignupForm, signupSchema, handleSignup);

  const {user}=useMyUser();
  
  if (user) return <Navigate to={ROUTES.ROOT} replace/>
  
  return (
    <Container
      sx={{
     
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection:"column",
        mt:"68px"
      }}
    >
      <SignupForm
        onSubmit={onSubmit}
        onReset={handleReset}
        validateForm={validateForm()}
        title={"Create New Account"}
        errors={errors}
        data={data}
        onChange={handleChange}
        handleCheckboxChange={handleCheckboxChange}
      />
      <Box sx={{display:"flex",gap:"20px", alignItems:"baseline"}}>
          <Typography variant="body" color="white" sx={{fontFamily:"Open-Sans",mt:"10px", fontWeight:"100",fontSize:"20px", color:'#B2B2B2'}}>
              Already have an account?
          </Typography>
          <NavItem
              buttonSx={{color:"#428AFF", m:"0 0.1rem"}}
              sx={{height:"100px"}}
              to={ROUTES.LOGIN} 
              label={"Login"}
              variant="outlined"
              color="primary"
          />
        </Box>
    </Container>
  );
}


//have to add loading (on button or else) and error (if email already exists...)  