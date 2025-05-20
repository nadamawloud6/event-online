import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { fetchEvent } from '../services/eventService';
import { registerForEvent, fetchRegistrations } from '../services/registrationService';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { event, loading: eventLoading, error: eventError } = useSelector((state) => state.events);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { registrations, loading: registrationLoading } = useSelector((state) => state.registrations);

  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchEvent(id));
    }
  }, [dispatch, id]);

  // Charger les inscriptions de l'utilisateur lorsqu'il est authentifié
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchRegistrations(user.id));
    }
  }, [dispatch, isAuthenticated, user]);

  // Vérifier si l'utilisateur est déjà inscrit - utiliser String() pour assurer une comparaison cohérente des types
  // Retourner false si user est null/undefined ou si registrations est vide pour éviter les erreurs
  const isRegistered = (user && registrations && registrations.length > 0)
    ? registrations.some(reg =>
        String(reg.eventId) === String(id) && String(reg.userId) === String(user.id)
      )
    : false;

  // Format dates
  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const formatTime = (dateString) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleTimeString('fr-FR', options);
  };

  const handleRegister = async () => {
    // Vérifier l'état d'authentification
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    // Vérifier si l'utilisateur est déjà inscrit
    if (isRegistered) {
      setRegistrationStatus({
        type: 'warning',
        message: 'Vous êtes déjà inscrit à cet événement'
      });
      return;
    }

    // Si l'utilisateur est authentifié mais que l'objet user est null,
    // nous pouvons quand même ouvrir la boîte de dialogue
    // La vérification de l'objet user sera faite dans confirmRegistration
    setOpenDialog(true);
  };

  const confirmRegistration = async () => {
    setOpenDialog(false);

    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated) {
      setRegistrationStatus({
        type: 'error',
        message: 'Vous devez être connecté pour vous inscrire à un événement'
      });
      // Rediriger vers la page de connexion
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    // Vérifier si l'objet utilisateur est disponible
    if (!user) {
      // Si l'utilisateur est authentifié mais que l'objet user est null,
      // nous pouvons essayer de récupérer les informations utilisateur à partir du localStorage
      // ou afficher un message d'erreur
      setRegistrationStatus({
        type: 'error',
        message: 'Impossible de récupérer vos informations. Veuillez vous reconnecter.'
      });
      // Rediriger vers la page de connexion
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    // Vérifier à nouveau si l'utilisateur est déjà inscrit (double vérification)
    if (isRegistered) {
      setRegistrationStatus({
        type: 'warning',
        message: 'Vous êtes déjà inscrit à cet événement'
      });
      return;
    }

    try {
      // Utiliser l'ID de l'utilisateur pour l'inscription
      const result = await dispatch(registerForEvent(id, user.id));

      if (result.success) {
        // Recharger les inscriptions pour mettre à jour l'état isRegistered
        await dispatch(fetchRegistrations(user.id));

        setRegistrationStatus({
          type: 'success',
          message: 'Vous vous êtes inscrit avec succès à cet événement !'
        });
      } else {
        setRegistrationStatus({
          type: 'error',
          message: result.error
        });
      }
    } catch (error) {
      setRegistrationStatus({
        type: 'error',
        message: error.message || 'Une erreur est survenue lors de l\'inscription'
      });
    }
  };

  if (eventLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (eventError || !event) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {eventError || 'Événement non trouvé'}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => navigate('/events')}>
            Retour aux événements
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {event.title}
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {formatDate(event.startDate)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimeIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {formatTime(event.startDate)} - {formatTime(event.endDate)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {event.location}
              </Typography>
            </Box>

            {event.maxAttendees && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  Participants max : {event.maxAttendees}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" gutterBottom>
          À propos de cet événement
        </Typography>

        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>

        {registrationStatus && (
          <Alert
            severity={registrationStatus.type}
            sx={{ mt: 2, mb: 2 }}
            onClose={() => setRegistrationStatus(null)}
          >
            {registrationStatus.message}
          </Alert>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/events')}
          >
            Retour aux événements
          </Button>

          <Button
            variant={isRegistered ? "outlined" : "contained"}
            color={isRegistered ? "success" : "primary"}
            onClick={handleRegister}
            disabled={!isAuthenticated || registrationLoading}
            startIcon={isRegistered ? <CheckIcon /> : null}
          >
            {!isAuthenticated ? 'Connectez-vous pour vous inscrire' :
             isRegistered ? 'Déjà inscrit' : 'S\'inscrire à l\'événement'}
          </Button>
        </Box>
      </Paper>

      {/* Registration Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmer l'inscription</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir vous inscrire à "{event.title}" ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={confirmRegistration} color="primary" autoFocus>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetailPage;
