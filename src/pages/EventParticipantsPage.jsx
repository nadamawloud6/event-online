import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Event as EventIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { fetchEvent } from '../services/eventService';
import { fetchEventRegistrations } from '../services/registrationService';
import { getUsers } from '../services/storageService';

const EventParticipantsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { event, loading: eventLoading, error: eventError } = useSelector((state) => state.events);
  const { registrations, loading: registrationsLoading, error: registrationsError } = useSelector((state) => state.registrations);
  
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('registrationDate');
  const [order, setOrder] = useState('desc');
  
  // Charger les données de l'événement et des inscriptions
  useEffect(() => {
    if (id) {
      dispatch(fetchEvent(id));
      dispatch(fetchEventRegistrations(id));
    }
  }, [dispatch, id]);
  
  // Préparer les données des participants en combinant les inscriptions avec les informations utilisateur
  useEffect(() => {
    if (registrations && registrations.length > 0) {
      // Récupérer tous les utilisateurs depuis le localStorage
      const users = getUsers();
      
      // Combiner les inscriptions avec les informations utilisateur
      const participantsData = registrations.map(registration => {
        const user = users.find(u => String(u.id) === String(registration.userId)) || {};
        return {
          ...registration,
          name: user.name || 'Utilisateur inconnu',
          email: user.email || 'Email inconnu',
          role: user.role || 'Rôle inconnu'
        };
      });
      
      setParticipants(participantsData);
      setFilteredParticipants(participantsData);
    } else {
      setParticipants([]);
      setFilteredParticipants([]);
    }
  }, [registrations]);
  
  // Filtrer les participants en fonction du terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredParticipants(participants);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = participants.filter(participant => 
        participant.name.toLowerCase().includes(lowercasedSearch) ||
        participant.email.toLowerCase().includes(lowercasedSearch) ||
        participant.role.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredParticipants(filtered);
    }
  }, [searchTerm, participants]);
  
  // Gérer le changement de tri
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    
    // Trier les participants
    const sortedParticipants = [...filteredParticipants].sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];
      
      if (order === 'asc') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue < bValue) return 1;
        if (aValue > bValue) return -1;
        return 0;
      }
    });
    
    setFilteredParticipants(sortedParticipants);
  };
  
  // Formater la date
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
  
  // Afficher un indicateur de chargement
  if (eventLoading || registrationsLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  // Afficher un message d'erreur si nécessaire
  if (eventError || registrationsError) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {eventError || registrationsError || 'Une erreur est survenue lors du chargement des données'}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            component={RouterLink} 
            to="/admin/dashboard"
          >
            Retour au tableau de bord
          </Button>
        </Box>
      </Container>
    );
  }
  
  // Afficher un message si l'événement n'est pas trouvé
  if (!event) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning" sx={{ mt: 4 }}>
          Événement non trouvé
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            component={RouterLink} 
            to="/admin/dashboard"
          >
            Retour au tableau de bord
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      {/* Fil d'Ariane */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} to="/" underline="hover" color="inherit">
            Accueil
          </Link>
          <Link component={RouterLink} to="/admin/dashboard" underline="hover" color="inherit">
            Tableau de bord administrateur
          </Link>
          <Typography color="text.primary">Participants</Typography>
        </Breadcrumbs>
      </Box>
      
      {/* En-tête de la page */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EventIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            Participants à l'événement
          </Typography>
        </Box>
        
        <Typography variant="h6" gutterBottom>
          {event.title}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Chip 
            icon={<PersonIcon />} 
            label={`${filteredParticipants.length} participant(s)`} 
            color="primary" 
            variant="outlined" 
          />
          {event.maxAttendees && (
            <Chip 
              label={`Capacité max: ${event.maxAttendees}`} 
              color="secondary" 
              variant="outlined" 
            />
          )}
          <Chip 
            label={`Date: ${formatDate(event.startDate)}`} 
            variant="outlined" 
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Barre de recherche */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher un participant par nom, email ou rôle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm('')} size="small">
                    <Typography variant="caption">Effacer</Typography>
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
        
        {/* Liste des participants */}
        {filteredParticipants.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      Nom
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'email'}
                      direction={orderBy === 'email' ? order : 'asc'}
                      onClick={() => handleRequestSort('email')}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'role'}
                      direction={orderBy === 'role' ? order : 'asc'}
                      onClick={() => handleRequestSort('role')}
                    >
                      Rôle
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'registrationDate'}
                      direction={orderBy === 'registrationDate' ? order : 'asc'}
                      onClick={() => handleRequestSort('registrationDate')}
                    >
                      Date d'inscription
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredParticipants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        {participant.email}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={participant.role} 
                        size="small"
                        color={participant.role === 'Admin' ? 'secondary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{formatDate(participant.registrationDate)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={participant.status} 
                        size="small"
                        color={participant.status === 'Confirmed' ? 'success' : 'warning'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Aucun participant trouvé pour cet événement.
            </Typography>
          </Box>
        )}
      </Paper>
      
      {/* Bouton de retour */}
      <Box sx={{ mb: 4 }}>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          component={RouterLink} 
          to="/admin/dashboard"
        >
          Retour au tableau de bord
        </Button>
      </Box>
    </Container>
  );
};

export default EventParticipantsPage;
