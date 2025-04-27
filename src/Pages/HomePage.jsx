import React from 'react';
import { Box, Typography, Stack, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import ROUTES from '../Routes/routesModel';
import './Css/HomePage.css';

const HomePage = () => {
  return (
    <Box className="home-page-container">
      {/* Hero Section */}
      <Box className="hero-section">
        <Typography
          variant="h1" // Keep variant for semantic meaning and potential base styles
          component="h1"
          className="hero-headline"
        >
          Mindviz
        </Typography>

        <Typography
          variant="h5" // Keep variant
          component="p"
          className="hero-subheadline"
        >
          Turn your to‑dos into an interactive mind map.
        </Typography>

        <Stack className="hero-button-stack" direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {/* Use Link component for navigation */}
          <Link to={ROUTES.SIGNUP} className="hero-button-primary hero-link-button">
            Signup
          </Link>
          <Link to={ROUTES.LOGIN} className="hero-button-secondary hero-link-button">
            Login
          </Link>
        </Stack>
      </Box>

      {/* Key Features Section */}
      <Box className="placeholder-section placeholder-section-neutral">
        <Typography variant="h2" component="h2" align="center" className="section-title">
          Key Features
        </Typography>
        <Grid container spacing={4} className="features-grid-container">
          {/* Feature 1: Interactive Mind Map */}
          <Grid container={false} xs={12} md={6}>
            <Box className="feature-card">
              
              <Box className="feature-image-placeholder">
              <img
                  src="/Images/HomePage/Mindmapping-Picture.png"
                  alt="Mind Mapping Example"
                />
              </Box>
              <Typography variant="h5" component="h3" className="feature-title">
                Interactive Mind Map
              </Typography>
              <Typography variant="body1" className="feature-description">
                Visualize your tasks and their connections in an intuitive mind map layout.
              </Typography>
            </Box>
          </Grid>

          {/* Feature 2: Auto Progress Tracking */}
          <Grid container={false} xs={12} md={6}>
            <Box className="feature-card">
              <Box className="feature-image-placeholder">
              <img
                  src="/Images/HomePage/ListPage-Progress-Picture.png"
                  alt="List Page Progress Example"
                />
              </Box>
              <Typography variant="h5" component="h3" className="feature-title">
                Auto Progress Tracking
              </Typography>
              <Typography variant="body1" className="feature-description">
                Automatically track completion progress based on sub-tasks and dependencies.
              </Typography>
            </Box>
          </Grid>

          {/* Feature 3: Calendar & List Views */}
          <Grid container={false} xs={12} md={6}>
            <Box className="feature-card">
              <Box className="feature-image-placeholder">
              <img
                  src="/Images/HomePage/ListPage-Kanban-Picture.png"
                  alt="List Page Kanban Example"
                />
              </Box>
              <Typography variant="h5" component="h3" className="feature-title">
                Kanban & List Views
              </Typography>
              <Typography variant="body1" className="feature-description">
                Switch between mind map, calendar, and list views to suit your workflow.
              </Typography>
            </Box>
          </Grid>

          {/* Feature 4: Smart Search & Filters */}
          <Grid container={false} xs={12} md={6}>
            <Box className="feature-card">
              <Box className="feature-image-placeholder">
              <img
                  src="/Images/HomePage/Search-Picture.png"
                  alt="Search Example"
                />
              </Box>
              <Typography variant="h5" component="h3" className="feature-title">
                Smart Search & Filters
              </Typography>
              <Typography variant="body1" className="feature-description">
                Quickly find any task using powerful search, tags, and filtering options.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* How It Works Section */}
      <Box className="placeholder-section placeholder-section-white how-it-works-section">
        <Typography variant="h2" component="h2" align="center" className="section-title">
          How It Works
        </Typography>
        <Box className="how-it-works-container">
          {/* Step 1: Create Tasks (Image Left) */}
          <Grid container spacing={5} className="step-row" alignItems="center">
            {/* Image Column */}
            <Grid container={false} xs={12} md={6} order={{ xs: 1, md: 1 }}>
              <Box className="step-image-placeholder">
              <img
                  src="/Images/HomePage/Create-Task-Picture.png"
                  alt="Create Task Example"
                />
              </Box>
            </Grid>
            {/* Text Column */}
            <Grid container={false} xs={12} md={6} order={{ xs: 2, md: 2 }}>
              <Box className="step-text-content">
                <Box className="step-content-box">
                  <Box className="step-number-circle">1</Box>
                  <Box className="step-text-wrapper">
                    <Typography variant="h4" component="h3" className="step-heading">
                      Create Tasks
                    </Typography>
                    <Typography variant="body1" className="step-description">
                      Add titles, deadlines, tags, and all the details you need for each task.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Step 2: Visualize Layout (Image Right) */}
          <Grid container spacing={5} className="step-row" alignItems="center">
            {/* Image Column */}
            <Grid container={false} xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Box className="step-image-placeholder">
              <img
                  src="/Images/HomePage/Visualize-Task-Picture.jpg"
                  alt="Visualize Task Example"
                />
              </Box>
            </Grid>
            {/* Text Column */}
            <Grid container={false} xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <Box className="step-text-content">
                <Box className="step-content-box">
                  <Box className="step-number-circle">2</Box>
                  <Box className="step-text-wrapper">
                    <Typography variant="h4" component="h3" className="step-heading">
                      Visualize Layout
                    </Typography>
                    <Typography variant="body1" className="step-description">
                      See your tasks and their interconnections automatically laid out as an interactive mind map.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Step 3: Stay on Track (Image Left) */}
          <Grid container spacing={5} className="step-row" alignItems="center">
            {/* Image Column */}
            <Grid container={false} xs={12} md={6} order={{ xs: 1, md: 1 }}>
              <Box className="step-image-placeholder">
              <img
                  src="/Images/HomePage/Progress-Task-Picture.jpg"
                  alt="Progress Task Example"
                />
              </Box>
            </Grid>
            {/* Text Column */}
            <Grid container={false} xs={12} md={6} order={{ xs: 2, md: 2 }}>
              <Box className="step-text-content">
                <Box className="step-content-box">
                  <Box className="step-number-circle">3</Box>
                  <Box className="step-text-wrapper">
                    <Typography variant="h4" component="h3" className="step-heading">
                      Stay on Track
                    </Typography>
                    <Typography variant="body1" className="step-description">
                      Watch progress update automatically as you complete sub-tasks and meet deadlines.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Testimonials Section - Explicitly written cards */}
      <Box className="placeholder-section placeholder-section-neutral testimonials-section">
        <Typography variant="h2" component="h2" align="center" className="section-title">
          What Our Users Say
        </Typography>
        {/* Row 1: Testimonial Cards */}
        <Grid container spacing={4} className="testimonials-grid-container" justifyContent="center">
          {/* Testimonial 1 */}
          <Grid container={false} xs={12} sm={8}>
            <Box className="testimonial-card">
              <Box className="avatar-placeholder">
               <img src="/Images/HomePage/Alice_Johnson_Avatar.png" alt="Alice Johnson" /> 
              </Box>
              <Typography variant="body1" className="testimonial-quote">
                "Mindviz transformed how our team handles complex projects. The visual layout is incredibly intuitive!"
              </Typography>
              <Typography variant="subtitle1" component="p" className="testimonial-name">
                Alice Johnson
              </Typography>
              <Typography variant="body2" className="testimonial-role">
                Project Manager
              </Typography>
            </Box>
          </Grid>

          {/* Testimonial 2 */}
          <Grid container={false} xs={12} sm={8}>
            <Box className="testimonial-card">
              <Box className="avatar-placeholder">
              <img src="/Images/HomePage/Bob_Williams_Avatar.png" alt="Alice Johnson" /> 
              </Box>
              <Typography variant="body1" className="testimonial-quote">
                "Finally, a tool that thinks like I do. Mapping out tasks visually has boosted my productivity significantly."
              </Typography>
              <Typography variant="subtitle1" component="p" className="testimonial-name">
                Bob Williams
              </Typography>
              <Typography variant="body2" className="testimonial-role">
                Freelance Designer
              </Typography>
            </Box>
          </Grid>

          {/* Testimonial 3 */}
          <Grid container={false} xs={12} sm={8}>
            <Box className="testimonial-card">
              <Box className="avatar-placeholder">
              <img src="/Images/HomePage/Charlie_Brown_Avatar.png" alt="Alice Johnson" /> 
              </Box>
              <Typography variant="body1" className="testimonial-quote">
                "Keeping track of dependencies was always a nightmare. Mindviz makes it simple and clear. Highly recommended."
              </Typography>
              <Typography variant="subtitle1" component="p" className="testimonial-name">
                Charlie Brown
              </Typography>
              <Typography variant="body2" className="testimonial-role">
                Startup Founder
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {/* Row 2: Logo Bar Placeholder */}
        <Box className="logo-bar-placeholder">
          <Typography variant="overline" display="block" align="center">
            Trusted by teams at (Partner Logos Placeholder)
          </Typography>
          {/* Add partner logos here later */}
        </Box>
      </Box>

      {/* Final Call-to-Action Section */}
      <Box className="cta-section">
        <Box className="cta-content-container">
          <Typography variant="h2" component="h2" className="cta-headline">
            Ready to take your task management to the next level?
          </Typography>
          <Typography variant="body1" className="cta-subhead">
            Start mapping your to‑dos in minutes.
          </Typography>
          <Stack className="cta-button-stack" direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {/* Use Link component for navigation */}
            <Link to={ROUTES.LOGIN} className="cta-button-outline cta-link-button">
              Log In
            </Link>
            <Link to={ROUTES.SIGNUP} className="cta-button-solid cta-link-button">
              Sign Up
            </Link>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;