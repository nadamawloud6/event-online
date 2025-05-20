import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  PeopleAlt as PeopleAltIcon
} from '@mui/icons-material';
import { fetchEvents, deleteEvent } from '../services/eventService';
import { fetchEventRegistrations } from '../services/registrationService';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state) => state.events);
  const { registrations, loading: registrationsLoading } = useSelector((state) => state.registrations);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRegistrationsDialog, setOpenRegistrationsDialog] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Gérer les notifications de la page précédente
  useEffect(() => {
    if (location.state?.notification) {
      setNotification(location.state.notification);
      // Nettoyer l'état de location pour éviter d'afficher la notification après un rafraîchissement
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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

  // Gérer la création d'un nouvel événement
  const handleCreateEvent = () => {
    navigate('/admin/events/create');
  };

  // Gérer l'édition d'un événement
  const handleEditEvent = (event) => {
    navigate(`/admin/events/edit/${event.id}`);
  };

  // Gérer la visualisation d'un événement
  const handleViewEvent = (event) => {
    navigate(`/events/${event.id}`);
  };

  // Gérer la visualisation des participants d'un événement
  const handleViewParticipants = (event) => {
    navigate(`/admin/events/${event.id}/participants`);
  };

  // Gérer la suppression d'un événement
  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedEvent) {
      const result = await dispatch(deleteEvent(selectedEvent.id));
      setOpenDeleteDialog(false);
      setSelectedEvent(null);

      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Événement supprimé avec succès !'
        });
      } else {
        setNotification({
          type: 'error',
          message: result.error || 'Erreur lors de la suppression de l\'événement'
        });
      }
    }
  };

  // Gérer la visualisation des inscriptions
  const handleViewRegistrations = async (event) => {
    setSelectedEvent(event);
    await dispatch(fetchEventRegistrations(event.id));
    setOpenRegistrationsDialog(true);
  };

  // Fermer la notification
  const handleCloseNotification = () => {
    setNotification(null);
  };

  const loading = eventsLoading || registrationsLoading;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Tableau de bord administrateur
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateEvent}
        >
          Créer un événement
        </Button>
      </Box>

      {eventsError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {eventsError}
        </Alert>
      )}

      {/* Notification */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {notification && (
          <Alert
            onClose={handleCloseNotification}
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Gérer les événements
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : events.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Titre</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Lieu</TableCell>
                  <TableCell>Participants</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell component="th" scope="row">
                      {event.title}
                    </TableCell>
                    <TableCell>{formatDate(event.startDate)}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.maxAttendees || 'Illimité'}</TableCell>
                    <TableCell>
                      {event.isPublished ? 'Publié' : 'Brouillon'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="info"
                        onClick={() => handleViewEvent(event)}
                        title="Voir l'événement"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewRegistrations(event)}
                        title="Voir les inscriptions rapides"
                      >
                        <PersonIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleViewParticipants(event)}
                        title="Gérer les participants"
                      >
                        <PeopleAltIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditEvent(event)}
                        title="Modifier l'événement"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(event)}
                        title="Supprimer l'événement"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              Aucun événement trouvé. Créez votre premier événement pour commencer.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateEvent}
            >
              Créer un événement
            </Button>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'événement "{selectedEvent?.title}" ? Cette action ne peut pas être annulée.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Annuler</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Registrations Dialog */}
      <Dialog
        open={openRegistrationsDialog}
        onClose={() => setOpenRegistrationsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Inscriptions pour "{selectedEvent?.title}"
        </DialogTitle>
        <DialogContent>
          {registrationsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : registrations.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Utilisateur</TableCell>
                    <TableCell>Date d'inscription</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Enregistré</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>{registration.userId}</TableCell>
                      <TableCell>{formatDate(registration.registrationDate)}</TableCell>
                      <TableCell>{registration.status === 'Confirmed' ? 'Confirmé' : registration.status}</TableCell>
                      <TableCell>{registration.checkedIn ? 'Oui' : 'Non'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
              Aucune inscription trouvée pour cet événement.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRegistrationsDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboardPage;
