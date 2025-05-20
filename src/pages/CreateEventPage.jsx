import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { createEvent } from '../services/eventService';
import EventForm from '../components/EventForm';

const CreateEventPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (formValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const result = await dispatch(createEvent(formValues));
      
      if (result.success) {
        // Rediriger vers le tableau de bord administrateur après la création réussie
        navigate('/admin/dashboard', { 
          state: { 
            notification: {
              type: 'success',
              message: 'Événement créé avec succès !'
            }
          }
        });
      } else {
        setSubmitError(result.error);
      }
    } catch (error) {
      setSubmitError(error.message || 'Une erreur est survenue lors de la création de l\'événement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit">
            Accueil
          </MuiLink>
          <MuiLink component={Link} to="/admin/dashboard" underline="hover" color="inherit">
            Tableau de bord administrateur
          </MuiLink>
          <Typography color="text.primary">Créer un événement</Typography>
        </Breadcrumbs>
      </Box>
      
      <EventForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
        mode="create"
      />
    </Container>
  );
};

export default CreateEventPage;
