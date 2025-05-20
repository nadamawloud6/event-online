import React from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Paper
} from '@mui/material';

const HomePage = () => {

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Box sx={{ maxWidth: 'sm', mx: 'auto', textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            SmartEvent
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Votre solution complète de gestion d'événements
          </Typography>
          <Typography variant="body1" paragraph>
            Découvrez, inscrivez-vous et gérez des événements en toute simplicité.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              to="/events"
              sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
            >
              Parcourir les événements
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              component={Link}
              to="/register"
            >
              S'inscrire
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
          Pourquoi choisir SmartEvent ?
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Gestion d'événements simplifiée
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Créez et gérez des événements avec notre interface intuitive.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Inscription fluide
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inscrivez-vous aux événements en quelques clics.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Tableau de bord complet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accédez à tous vos événements depuis un tableau de bord personnalisé.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
