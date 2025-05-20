import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Breadcrumbs, 
  Link as MuiLink,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import { fetchEvent, updateEvent } from '../services/eventService';
import EventForm from '../components/EventForm';

const EditEventPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { event, loading, error } = useSelector((state) => state.events);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchEvent(id));
    }
  }, [dispatch, id]);

  const handleSubmit = async (formValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const result = await dispatch(updateEvent(id, formValues));
      
      if (result.success) {
        // Rediriger vers le tableau de bord administrateur après la modification réussie
        navigate('/admin/dashboard', { 
          state: { 
            notification: {
              type: 'success',
              message: 'Événement modifié avec succès !'
            }
          }
        });
      } else {
        setSubmitError(result.error);
      }
    } catch (error) {
      setSubmitError(error.message || 'Une erreur est survenue lors de la modification de l\'événement');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Événement non trouvé'}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <MuiLink component={Link} to="/admin/dashboard" underline="hover">
            Retour au tableau de bord
          </MuiLink>
        </Box>
      </Container>
    );
  }

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
          <Typography color="text.primary">Modifier l'événement</Typography>
        </Breadcrumbs>
      </Box>
      
      <EventForm
        initialValues={event}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
        mode="edit"
      />
    </Container>
  );
};

export default EditEventPage;
