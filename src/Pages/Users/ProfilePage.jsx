import React from 'react';
import { Avatar, Grid, Typography, Box, Card, CircularProgress } from '@mui/material';
import { useMyUser } from '../../Providers/Users/UserProvider';
import UseCapitalize from '../../Hooks/UseCapitalize';
import useProfileStyles from '../../Style/profilePageStyle';

const ProfilePage = () => {
  const { userData, loading } = useMyUser();
  const { capitalizeFirstLetter } = UseCapitalize();

  const styles = useProfileStyles();
  if (loading) {
    return <CircularProgress />;
  }

  if (!userData) {
    return <Typography variant="h6" color="error">Failed to load user data</Typography>;
  }

  return (
    <Card sx={styles.card}>
      <Grid container spacing={2}>
        <Grid container={false} xs={12}  justifyContent="center">
          <Avatar sx={styles.avatar}>
            {capitalizeFirstLetter(userData.name.first[0])}
          </Avatar>
        </Grid>
        <Grid container={false} xs={12}  justifyContent="center">
          <Typography variant="h1" sx={styles.nameStyle}>
            {capitalizeFirstLetter(userData.name.first)} {capitalizeFirstLetter(userData.name.last)}
          </Typography>
        </Grid>
        <Grid container={false} xs={12}  justifyContent="center">
          <Typography variant="subtitle1" sx={styles.title}>
            ID: <span style={styles.span}>{userData._id}</span>
          </Typography>
        </Grid>
        <Grid container={false} xs={12}>
          <Typography sx={styles.title}>
            Address:{" "}
            <span style={styles.span}>
              {userData.address.houseNumber} {userData.address.street} {userData.address.city} {userData.address.country} {userData.address.zip}
            </span>
          </Typography>
        </Grid>
        <Grid container={false} xs={12}>
          <Typography sx={styles.title}>
            Email: <span style={styles.span}>{userData.email}</span>
          </Typography>
        </Grid>
        <Grid container={false} xs={12}>
          <Typography sx={styles.title}>
            Phone: <span style={styles.span}>{userData.phone}</span>
          </Typography>
        </Grid>
        <Grid container={false} xs={12}>
          <Typography sx={styles.title}>
            Business user: <span style={styles.span}>{userData.isBusiness ? 'Yes' : 'No'}</span>
          </Typography>
        </Grid>
        <Grid container={false} xs={12}  justifyContent="center">
          {userData.image.url && (
            <Box
              component="img"
              sx={styles.image}
              src={userData.image.url}
              alt="Profile"
            />
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default ProfilePage;
