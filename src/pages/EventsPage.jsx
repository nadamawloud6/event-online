import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Paper,
  Chip,
  IconButton,
  Fade,
  Zoom,
  Divider,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Event as EventIcon,
  SortByAlpha as SortIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import EventCard from '../components/EventCard';
import { fetchEvents } from '../services/eventService';

const EventsPage = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [fadeIn, setFadeIn] = useState(false);
  const eventsPerPage = 6;

  useEffect(() => {
    dispatch(fetchEvents());

    // Animation d'entrée
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setSortBy('date');
    setPage(1);
  };

  // Basculer l'affichage des filtres sur mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Formater la date
  const formatDate = (dateString) => {
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Filter and sort events
  const filteredEvents = events
    .filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.startDate) - new Date(b.startDate);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'location') {
        return a.location.localeCompare(b.location);
      }
      return 0;
    });

  // Paginate events
  const indexOfLastEvent = page * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handleChangePage = (event, value) => {
    setPage(value);
    // Défilement fluide vers le haut
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Calculer les statistiques des événements
  const upcomingEvents = events.filter(event => new Date(event.startDate) > new Date()).length;
  const totalLocations = new Set(events.map(event => event.location)).size;

  return (
    <Container maxWidth="lg">
      <Fade in={fadeIn} timeout={800}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 150,
              height: 150,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              zIndex: 0
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 180,
              height: 180,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.05)',
              zIndex: 0
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              Découvrez nos événements
            </Typography>

            <Typography variant="h6" sx={{ mb: 3, maxWidth: '80%', opacity: 0.9 }}>
              Trouvez et participez à des événements passionnants près de chez vous
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
              <Chip
                icon={<EventIcon />}
                label={`${events.length} événements au total`}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
              <Chip
                icon={<CalendarIcon />}
                label={`${upcomingEvents} événements à venir`}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
              <Chip
                icon={<LocationIcon />}
                label={`${totalLocations} lieux différents`}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Bouton de filtres pour mobile */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={toggleFilters}
          color="primary"
        >
          {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </Button>
      </Box>

      {/* Filters */}
      <Fade in={showFilters || !isMobile}>
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2">
              Filtrer les événements
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleResetFilters}
              disabled={!searchTerm && sortBy === 'date'}
            >
              Réinitialiser
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', md: 'center' }
          }}>
            <TextField
              fullWidth
              label="Rechercher des événements"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Titre, description ou lieu..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchTerm('')}
                      edge="end"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <FormControl sx={{ minWidth: { xs: '100%', md: 220 } }}>
              <InputLabel id="sort-by-label">Trier par</InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by"
                value={sortBy}
                label="Trier par"
                onChange={handleSortChange}
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon color="primary" />
                  </InputAdornment>
                }
              >
                <MenuItem value="date">Date (À venir)</MenuItem>
                <MenuItem value="title">Titre (A-Z)</MenuItem>
                <MenuItem value="location">Lieu (A-Z)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Résumé des filtres actifs */}
          {searchTerm && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Recherche : <Chip
                  label={searchTerm}
                  size="small"
                  onDelete={() => setSearchTerm('')}
                  sx={{ ml: 1 }}
                />
              </Typography>
            </Box>
          )}
        </Paper>
      </Fade>

      {/* Résultats de recherche */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {filteredEvents.length} {filteredEvents.length > 1 ? 'événements trouvés' : 'événement trouvé'}
        </Typography>

        {totalPages > 1 && (
          <Typography variant="body2" color="text.secondary">
            Page {page} sur {totalPages}
          </Typography>
        )}
      </Box>

      {/* Events Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : currentEvents.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {currentEvents.map((event, index) => (
              <Zoom
                in={fadeIn}
                style={{ transitionDelay: `${index * 100}ms` }}
                key={event.id}
              >
                <Grid item xs={12} sm={6} md={4}>
                  <EventCard event={event} />
                </Grid>
              </Zoom>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Paper
              elevation={2}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
                py: 2,
                borderRadius: 2
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                color="primary"
                size={isMobile ? "small" : "medium"}
                showFirstButton
                showLastButton
                siblingCount={isMobile ? 0 : 1}
              />
            </Paper>
          )}
        </>
      ) : (
        <Paper
          elevation={2}
          sx={{
            py: 8,
            px: 4,
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: 'rgba(0, 0, 0, 0.02)'
          }}
        >
          <EventIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun événement ne correspond à vos critères de recherche.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Essayez de modifier vos filtres ou d'effectuer une recherche différente.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleResetFilters}
            startIcon={<ClearIcon />}
          >
            Réinitialiser les filtres
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default EventsPage;
