import React from "react";
import ROUTES from "../../Routes/routesModel";
import { Grid2 } from "@mui/material";
import Form from "../Forms/Form";
import Input from "../Forms/Input";

export default function EditUserForm({
  onSubmit,
  onReset,
  validateForm,
  title,
  errors,
  data,
  onChange,
}) {
  return (
    <Form
      onSubmit={onSubmit}
      onReset={onReset}
      validateForm={validateForm}
      title={title}
      styles={{ maxWidth: "800px" }}
      to={ROUTES.ROOT}
    >
      <Grid2 container spacing={2} sx={{ mt: "10px" }}>
        <Grid2  xs={12} sm={5}>
          <Input
            name="first"
            label="First Name"
            error={errors.first}
            onChange={onChange}
            data={data}
          />
        </Grid2>
        <Grid2  xs={12} sm={3}>
          <Input
            name="middle"
            label="Middle Name"
            error={errors.middle}
            onChange={onChange}
            data={data}
            required={false}
          />
        </Grid2>
        <Grid2  xs={12} sm={4}>
          <Input
            name="last"
            label="Last Name"
            error={errors.last}
            onChange={onChange}
            data={data}
          />
        </Grid2>
        <Grid2  xs={12} sm={3}>
          <Input
            name="phone"
            label="Phone"
            type="phone"
            error={errors.phone}
            onChange={onChange}
            data={data}
          />
        </Grid2>
        <Grid2  xs={12} sm={9}>
          <Input
            name="url"
            label="Image URL"
            error={errors.url}
            onChange={onChange}
            data={data}
            required={false}
          />
        </Grid2>
        <Grid2  xs={12} sm={3}>
          <Input
            name="alt"
            label="Image Alt"
            error={errors.alt}
            onChange={onChange}
            data={data}
            required={false}
          />
        </Grid2>
        <Grid2  xs={12} sm={5}>
          <Input
            label="Country"
            name="country"
            error={errors.country}
            onChange={onChange}
            data={data}
          />
        </Grid2>
        <Grid2  xs={12} sm={2}>
          <Input
            name="state"
            label="State"
            error={errors.state}
            onChange={onChange}
            data={data}
            required={false}
          />
        </Grid2>
        <Grid2  xs={12} sm={5}>
          <Input
            name="city"
            label="City"
            error={errors.city}
            onChange={onChange}
            data={data}
          />
        </Grid2>
        <Grid2  xs={12} sm={6}>
          <Input
            name="street"
            label="Street"
            error={errors.street}
            onChange={onChange}
            data={data}
          />
        </Grid2>
        <Grid2  xs={12} sm={3}>
          <Input
            name="houseNumber"
            label="House Number"
            type="number"
            error={errors.houseNumber}
            onChange={onChange}
            data={data}
          />
        </Grid2>
        <Grid2  xs={12} sm={3}>
          <Input
            name="zip"
            label="Zip"
            error={errors.zip}
            onChange={onChange}
            data={data}
            required={false}
          />
        </Grid2>
      </Grid2>
    </Form>
  );
}
