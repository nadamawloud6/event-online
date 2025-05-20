import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { fetchEvents } from '../services/eventService';
import { fetchRegistrations, cancelRegistration } from '../services/registrationService';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { events, loading: eventsLoading } = useSelector((state) => state.events);
  const { registrations, loading: registrationsLoading } = useSelector((state) => state.registrations);

  useEffect(() => {
    dispatch(fetchEvents());
    if (user) {
      dispatch(fetchRegistrations(user.id));
    }
  }, [dispatch, user]);

  // Get user's registered events
  const userRegisteredEvents = registrations.map(registration => {
    const event = events.find(event => event.id === registration.eventId);
    return {
      ...registration,
      event
    };
  });

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Handle registration cancellation
  const handleCancelRegistration = async (registrationId) => {
    if (confirm('Êtes-vous sûr de vouloir annuler cette inscription ?')) {
      await dispatch(cancelRegistration(registrationId));
    }
  };

  const loading = eventsLoading || registrationsLoading;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bienvenue, {user?.name} !
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez vos événements et inscriptions depuis votre tableau de bord personnel.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* User Stats */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Vos statistiques
            </Typography>

            <List>
              <ListItem>
                <EventIcon sx={{ mr: 2, color: 'primary.main' }} />
                <ListItemText
                  primary={`${userRegisteredEvents.length} événements inscrits`}
                />
              </ListItem>

              <Divider component="li" />

              <ListItem>
                <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                <ListItemText
                  primary={`Rôle : ${user?.role === 'Admin' ? 'Administrateur' : 'Participant'}`}
                />
              </ListItem>

              <Divider component="li" />

              <ListItem>
                <CalendarIcon sx={{ mr: 2, color: 'primary.main' }} />
                <ListItemText
                  primary="Événements à venir"
                  secondary={userRegisteredEvents.filter(reg =>
                    reg.event && new Date(reg.event.startDate) > new Date()
                  ).length}
                />
              </ListItem>
            </List>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/events"
                fullWidth
              >
                Parcourir plus d'événements
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Registered Events */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Vos événements inscrits
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : userRegisteredEvents.length > 0 ? (
              <Grid container spacing={2}>
                {userRegisteredEvents.map((registration) => (
                  <Grid item xs={12} key={registration.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="h6" component="div">
                              {registration.event?.title || 'Événement non trouvé'}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {registration.event ? formatDate(registration.event.startDate) : ''}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              {registration.event?.location || ''}
                            </Typography>

                            <Box sx={{ mt: 1 }}>
                              <Chip
                                label={registration.status === 'Confirmed' ? 'Confirmé' : registration.status}
                                color={registration.status === 'Confirmed' ? 'success' : 'default'}
                                size="small"
                              />
                              {registration.checkedIn && (
                                <Chip
                                  label="Enregistré"
                                  color="primary"
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>
                          </Box>

                          <Box>
                            <Button
                              variant="outlined"
                              size="small"
                              component={Link}
                              to={`/events/${registration.eventId}`}
                              sx={{ mr: 1 }}
                            >
                              Voir
                            </Button>

                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleCancelRegistration(registration.id)}
                            >
                              Annuler
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Vous n'êtes inscrit à aucun événement pour le moment.
                </Typography>
                <Button
                  variant="contained"
                  component={Link}
                  to="/events"
                >
                  Parcourir les événements
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
