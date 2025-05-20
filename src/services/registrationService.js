import api from './api';
import {
  fetchRegistrationsStart,
  fetchRegistrationsSuccess,
  fetchRegistrationsFailure,
  registerForEventStart,
  registerForEventSuccess,
  registerForEventFailure,
  cancelRegistrationStart,
  cancelRegistrationSuccess,
  cancelRegistrationFailure,
} from '../store/slices/registrationSlice';

// Importer le service de stockage pour la persistance des données
import { getRegistrations, storeRegistrations } from './storageService';

export const fetchRegistrations = (userId) => async (dispatch) => {
  try {
    dispatch(fetchRegistrationsStart());

    // In a real app, this would be an API call
    // const response = await api.get(`/users/${userId}/registrations`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Récupérer les inscriptions depuis le localStorage
    const registrations = getRegistrations();

    // Filtrer les inscriptions pour l'utilisateur actuel
    const userRegistrations = registrations.filter(reg => String(reg.userId) === String(userId));

    dispatch(fetchRegistrationsSuccess(userRegistrations));
  } catch (error) {
    dispatch(fetchRegistrationsFailure(error.message));
  }
};

export const fetchEventRegistrations = (eventId) => async (dispatch) => {
  try {
    dispatch(fetchRegistrationsStart());

    // In a real app, this would be an API call
    // const response = await api.get(`/events/${eventId}/registrations`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Récupérer les inscriptions depuis le localStorage
    const registrations = getRegistrations();

    // Filtrer les inscriptions pour l'événement spécifié
    const eventRegistrations = registrations.filter(reg => String(reg.eventId) === String(eventId));

    dispatch(fetchRegistrationsSuccess(eventRegistrations));
  } catch (error) {
    dispatch(fetchRegistrationsFailure(error.message));
  }
};

export const registerForEvent = (eventId, userId) => async (dispatch) => {
  try {
    // Validate input parameters
    if (!eventId) {
      throw new Error('ID de l\'événement manquant');
    }

    if (!userId) {
      throw new Error('Vous devez être connecté pour vous inscrire à un événement');
    }

    dispatch(registerForEventStart());

    // In a real app, this would be an API call
    // const response = await api.post('/registrations', { eventId, userId });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Récupérer les inscriptions depuis le localStorage
    const registrations = getRegistrations();

    // Vérifier si l'utilisateur est déjà inscrit - utiliser String() pour assurer une comparaison cohérente des types
    const existingRegistration = registrations.find(
      reg => String(reg.eventId) === String(eventId) && String(reg.userId) === String(userId)
    );

    if (existingRegistration) {
      throw new Error('Vous êtes déjà inscrit à cet événement');
    }

    const newRegistration = {
      id: Date.now().toString(),
      eventId: String(eventId),
      userId: String(userId),
      registrationDate: new Date().toISOString(),
      status: 'Confirmed',
      checkedIn: false,
    };

    // Ajouter la nouvelle inscription à la liste et sauvegarder dans le localStorage
    const updatedRegistrations = [...registrations, newRegistration];
    storeRegistrations(updatedRegistrations);

    dispatch(registerForEventSuccess(newRegistration));
    return { success: true, registration: newRegistration };
  } catch (error) {
    dispatch(registerForEventFailure(error.message));
    return { success: false, error: error.message };
  }
};

export const cancelRegistration = (registrationId) => async (dispatch) => {
  try {
    dispatch(cancelRegistrationStart());

    // In a real app, this would be an API call
    // await api.delete(`/registrations/${registrationId}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Récupérer les inscriptions depuis le localStorage
    const registrations = getRegistrations();

    // Filtrer pour supprimer l'inscription
    const updatedRegistrations = registrations.filter(reg => String(reg.id) !== String(registrationId));

    // Sauvegarder les inscriptions mises à jour dans le localStorage
    storeRegistrations(updatedRegistrations);

    dispatch(cancelRegistrationSuccess(registrationId));
    return { success: true };
  } catch (error) {
    dispatch(cancelRegistrationFailure(error.message));
    return { success: false, error: error.message };
  }
};
