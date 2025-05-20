import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { fr } from 'date-fns/locale';

const EventForm = ({ initialValues, onSubmit, isSubmitting, submitError, mode = 'create' }) => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    location: initialValues?.location || '',
    maxAttendees: initialValues?.maxAttendees || '',
    startDate: initialValues?.startDate ? new Date(initialValues.startDate) : new Date(),
    endDate: initialValues?.endDate ? new Date(initialValues.endDate) : new Date(Date.now() + 3600000), // +1 heure par défaut
    isPublished: initialValues?.isPublished !== undefined ? initialValues.isPublished : true,
  });
  const [errors, setErrors] = useState({});

  // Gestion des changements de champs
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Gestion des changements de date
  const handleDateChange = (name, date) => {
    setFormValues({
      ...formValues,
      [name]: date,
    });

    // Effacer l'erreur lorsque l'utilisateur modifie la date
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formValues.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formValues.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formValues.location.trim()) {
      newErrors.location = 'Le lieu est requis';
    }

    if (formValues.maxAttendees && (isNaN(formValues.maxAttendees) || parseInt(formValues.maxAttendees) <= 0)) {
      newErrors.maxAttendees = 'Le nombre maximum de participants doit être un nombre positif';
    }

    if (!formValues.startDate) {
      newErrors.startDate = 'La date de début est requise';
    }

    if (!formValues.endDate) {
      newErrors.endDate = 'La date de fin est requise';
    }

    if (formValues.startDate && formValues.endDate && formValues.startDate > formValues.endDate) {
      newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Convertir les dates en chaînes ISO pour le stockage
      const formattedValues = {
        ...formValues,
        startDate: formValues.startDate.toISOString(),
        endDate: formValues.endDate.toISOString(),
        maxAttendees: formValues.maxAttendees ? parseInt(formValues.maxAttendees) : null,
      };

      await onSubmit(formattedValues);
    }
  };

  // Annulation du formulaire
  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {mode === 'create' ? 'Créer un nouvel événement' : 'Modifier l\'événement'}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="title"
              name="title"
              label="Titre de l'événement"
              value={formValues.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formValues.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="location"
              name="location"
              label="Lieu"
              value={formValues.location}
              onChange={handleChange}
              error={!!errors.location}
              helperText={errors.location}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
              <DateTimePicker
                label="Date et heure de début"
                value={formValues.startDate}
                onChange={(date) => handleDateChange('startDate', date)}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
              <DateTimePicker
                label="Date et heure de fin"
                value={formValues.endDate}
                onChange={(date) => handleDateChange('endDate', date)}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    error: !!errors.endDate,
                    helperText: errors.endDate
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="maxAttendees"
              name="maxAttendees"
              label="Nombre maximum de participants"
              type="number"
              value={formValues.maxAttendees}
              onChange={handleChange}
              error={!!errors.maxAttendees}
              helperText={errors.maxAttendees || 'Laissez vide pour un nombre illimité'}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formValues.isPublished}
                  onChange={handleChange}
                  name="isPublished"
                  color="primary"
                />
              }
              label="Publier l'événement"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : mode === 'create' ? (
                  'Créer l\'événement'
                ) : (
                  'Enregistrer les modifications'
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default EventForm;
