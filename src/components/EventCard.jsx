import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Grid,
  CardMedia,
  CardActionArea,
  Divider,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  ArrowForward as ArrowForwardIcon,
  Event as EventIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon
} from '@mui/icons-material';

const EventCard = ({ event }) => {
  const { id, title, description, startDate, endDate, location, maxAttendees } = event;
  const [saved, setSaved] = useState(false);
  const [elevated, setElevated] = useState(false);

  // Générer une couleur de fond aléatoire mais cohérente pour chaque événement
  const getEventColor = (eventId) => {
    // Utiliser l'ID de l'événement pour générer une couleur cohérente
    const colors = [
      'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)', // Indigo
      'linear-gradient(135deg, #f50057 0%, #ff4081 100%)', // Pink
      'linear-gradient(135deg, #00bcd4 0%, #4dd0e1 100%)', // Cyan
      'linear-gradient(135deg, #4caf50 0%, #81c784 100%)', // Green
      'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', // Orange
      'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)', // Purple
    ];

    // Utiliser l'ID pour sélectionner une couleur de manière déterministe
    const colorIndex = parseInt(eventId.toString().split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % colors.length;
    return colors[colorIndex];
  };

  // Format dates
  const formatDate = (dateString) => {
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Format time
  const formatTime = (dateString) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleTimeString('fr-FR', options);
  };

  // Truncate description
  const truncateDescription = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Vérifier si l'événement est à venir
  const isUpcoming = new Date(startDate) > new Date();

  // Vérifier si l'événement est aujourd'hui
  const isToday = () => {
    const today = new Date();
    const eventDate = new Date(startDate);
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  };

  // Gérer le clic sur le bouton de sauvegarde
  const handleSaveClick = (e) => {
    e.preventDefault(); // Empêcher la navigation
    e.stopPropagation(); // Empêcher la propagation
    setSaved(!saved);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: elevated ? 'translateY(-8px)' : 'none',
        boxShadow: elevated ? '0 12px 20px rgba(0,0,0,0.15)' : '0 6px 12px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
        }
      }}
      onMouseEnter={() => setElevated(true)}
      onMouseLeave={() => setElevated(false)}
    >
      {/* En-tête coloré avec date */}
      <Box
        sx={{
          background: getEventColor(id),
          color: 'white',
          p: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -15,
            right: -15,
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            zIndex: 0
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                {formatDate(startDate)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <TimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                <Typography variant="caption">
                  {formatTime(startDate)}
                </Typography>
              </Box>
            </Box>

            <Box>
              {isToday() && (
                <Chip
                  label="Aujourd'hui"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.25)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.7rem'
                  }}
                />
              )}
              {!isToday() && isUpcoming && (
                <Chip
                  label="À venir"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.25)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.7rem'
                  }}
                />
              )}
              {!isUpcoming && (
                <Chip
                  label="Passé"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.25)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.7rem'
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <CardActionArea
        component={Link}
        to={`/events/${id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              fontWeight: 'bold',
              fontSize: '1.25rem',
              lineHeight: 1.3,
              mb: 2
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
            sx={{
              fontSize: '0.875rem',
              lineHeight: 1.6,
              mb: 2
            }}
          >
            {truncateDescription(description)}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: 'primary.light',
                    mr: 1.5
                  }}
                >
                  <LocationIcon fontSize="small" />
                </Avatar>
                <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                  {location}
                </Typography>
              </Box>
            </Grid>

            {maxAttendees && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: 'secondary.light',
                      mr: 1.5
                    }}
                  >
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                    {maxAttendees} participants max
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </CardActionArea>

      <Divider />

      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
        <Box>
          <Tooltip title={saved ? "Retiré des favoris" : "Ajouter aux favoris"}>
            <IconButton
              size="small"
              color={saved ? "secondary" : "default"}
              onClick={handleSaveClick}
            >
              {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Partager">
            <IconButton size="small">
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Button
          size="small"
          color="primary"
          component={Link}
          to={`/events/${id}`}
          endIcon={<ArrowForwardIcon />}
          sx={{
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(63, 81, 181, 0.08)'
            }
          }}
        >
          Voir les détails
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;
