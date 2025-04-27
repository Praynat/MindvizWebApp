import React from "react";
import ROUTES from "../../Routes/routesModel";
import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import { useDarkLightTheme } from "../../Theme/ThemeProvider";
import Form from "../Forms/Form";
import Input from "../Forms/Input";


export default function SignupForm({
  onSubmit,
  onReset,
  validateForm,
  title,
  errors,
  data,
  onChange,
  handleCheckboxChange
}) {
  const { theme } = useDarkLightTheme();
  return (
    <Form
      onSubmit={onSubmit}
      onReset={onReset}
      validateForm={validateForm}
      title={title}
      styles={{ maxWidth: "800px" }}
      to={ROUTES.ROOT}
    >
      <Grid container spacing={2} sx={{mt:"10px"}}>
        <Grid container={false} xs={12} sm={5}>
          <Input
            name="first"
            label="First Name"
            error={errors.first}
            onChange={onChange}
        data={data}
          />
        </Grid>
        
        <Grid container={false} xs={12} sm={3}>
          <Input
            name="middle"
            label="Middle Name"
            error={errors.middle}
            onChange={onChange}
            data={data}
            required={false}
          />
        </Grid>

        <Grid container={false} xs={12} sm={4}>
          <Input
            name="last"
            label="Last Name"
            error={errors.last}
            onChange={onChange}
            data={data}
          />
        </Grid>

        <Grid container={false} xs={12} sm={3}>
          <Input
            name="phone"
            label="Phone"
            type="phone"
            error={errors.phone}
            onChange={onChange}
            data={data}
          />
        </Grid>
        <Grid container={false} xs={12} sm={6}>
          <Input
            name="email"
            label="Email"
            type="email"
            error={errors.email}
            onChange={onChange}
            data={data}
          />
        </Grid>
        <Grid container={false} xs={12} sm={3}>
          <Input
            name="password"
            label="password"
            type="password"
            error={errors.password}
            onChange={onChange}
            data={data}
            sm={6}
         />
        </Grid>

        <Grid container={false} xs={12} sm={5}>
          <Input
            label="Country"
            name="country"
            error={errors.country}
            onChange={onChange}
            data={data}
          />
        </Grid>
        <Grid container={false} xs={12} sm={2}>
          <Input
            name="state"
            label="State"
            error={errors.state}
            onChange={onChange}
            data={data}
            required={false}
          />
         </Grid>
        <Grid container={false} xs={12} sm={5}>
          <Input
            name="city"
            label="City"
            error={errors.city}
            onChange={onChange}
            data={data}
          />
        </Grid>

        <Grid container={false} xs={12} sm={6}>
          <Input
            name="street"
            label="Street"
            error={errors.street}
            onChange={onChange}
            data={data}
          />
        </Grid>
        <Grid container={false} xs={12} sm={3}>
          <Input
            name="houseNumber"
            label="House Number"
            type="number"
            error={errors.houseNumber}
            onChange={onChange}
            data={data}
          />
        </Grid>
        <Grid container={false} xs={12} sm={3}>
          <Input
            name="zip"
            label="Zip"
            error={errors.zip}
            onChange={onChange}
            data={data}
            required={false}
          />
        </Grid>

        <Grid container={false} xs={12} sm={9}>
          <Input
            name="url"
            label="Image URL"
            error={errors.url}
            onChange={onChange}
            data={data}
            required={true}
          />
        </Grid>
        <Grid container={false} xs={12} sm={3}>
          <Input
            name="alt"
            label="Image Alt"
            error={errors.alt}
            onChange={onChange}
            data={data}
            required={true}
          />
        </Grid>

        <Grid container={false} xs={12}>
          <FormControlLabel
            onChange={handleCheckboxChange}
            name="isBusiness"
            control={<Checkbox value={data.isBusiness} color="primary" sx={{color:theme.strongTextColor}}/>}
            label="Signup as business"
            sx={{color:theme.strongTextColor}}
          />
        </Grid>
      </Grid>
    </Form>
  );
}
