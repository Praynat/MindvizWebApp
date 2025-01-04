import React from "react";
import { Container} from "@mui/material";
import initialContactUsForm from "../../Helpers/Contact/initialContactUsForm";
import contactSchema from "../../Models/Contact/contactSchema";
import useForm from "../../Hooks/Forms/useForm";
import useUsers from "../../Hooks/Users/useUsers";
import Form from "../../Components/Forms/Form";
import Input from "../../Components/Forms/Input";
import ROUTES from "../../Routes/routesModel";

export default function ContactPage() {
  const {handleContact} = useUsers();
  const { data, errors, handleChange, handleReset, validateForm, onContactSubmit } =
    useForm(initialContactUsForm, contactSchema, handleContact);

    

    const onFormSubmit = () => {
      onContactSubmit();
      setTimeout(() => {       
        handleReset();
      }, 1000);
      
    };
   
  return (
    
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection:"column"
        }}
      >
        <Form
          title="Contact Us" 
          styles={{ maxWidth: "450px" }}
          to={ROUTES.ROOT}
          onSubmit={onFormSubmit}
          onReset={handleReset}
          validateForm={validateForm()}
        >
          <Input
            label="Name"
            name="name"
            type="name"
            error={errors.email}
            onChange={handleChange}
            data={data}
          
          />
          <Input
            label="Email"
            name="email"
            type="email"
            error={errors.email}
            onChange={handleChange}
            data={data}
          />
          <Input
            label="Message"
            name="message"
            type="text"
            error={errors.email}
            onChange={handleChange}
            data={data}
            rows={4}
            multiline={true}
          />
           
        </Form>
       
      </Container>
  );
}



