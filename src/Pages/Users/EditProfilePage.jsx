import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import useUsers from "../../Hooks/Users/useUsers";
import { useMyUser } from "../../Providers/Users/UserProvider";
import useForm from "../../Hooks/Forms/useForm";
import initialEditUserForm from "../../Helpers/Users/initialForms/initialEditUserForm";
import editUserSchema from "../../Models/Users/editUserSchema";
import { getUserData } from "../../Services/Users/usersApiService";
import denormalizeUser from "../../Helpers/Users/normalization/denormalizeUser";
import EditUserForm from "../../Components/Users/EditUserForm";


export default function EditProfilePage() {
  const { handleUserUpdate } = useUsers();
  const { user } = useMyUser();

  const userId = user ? user._id : null;

  const {
    data,
    errors,
    handleChange,
    handleReset,
    validateForm,
    onSubmit,
    setData,
  } = useForm(initialEditUserForm, editUserSchema, (userFromClient) =>
    handleUserUpdate(userFromClient, userId)
  );

  useEffect(() => {
    if (userId) {
      getUserData(userId)
        .then((data) => {
          const modelUser = denormalizeUser(data);
          setData(modelUser);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
    }
  }, [userId, setData]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        mt: "68px",
      }}
    >
      {user ? (
        <EditUserForm
          onSubmit={onSubmit}
          onReset={handleReset}
          validateForm={validateForm}
          title={"Change user info"}
          errors={errors}
          data={data}
          onChange={handleChange}
        />
      ) : (
        <div>Error: User data not available.</div>
      )}
    </Container>
  );
}
