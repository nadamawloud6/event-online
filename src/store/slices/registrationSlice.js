import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  registrations: [],
  loading: false,
  error: null,
};

const registrationSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    fetchRegistrationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRegistrationsSuccess: (state, action) => {
      state.loading = false;
      state.registrations = action.payload;
    },
    fetchRegistrationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerForEventStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerForEventSuccess: (state, action) => {
      state.loading = false;
      state.registrations = [...state.registrations, action.payload];
    },
    registerForEventFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    cancelRegistrationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    cancelRegistrationSuccess: (state, action) => {
      state.loading = false;
      state.registrations = state.registrations.filter(
        (registration) => registration.id !== action.payload
      );
    },
    cancelRegistrationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchRegistrationsStart,
  fetchRegistrationsSuccess,
  fetchRegistrationsFailure,
  registerForEventStart,
  registerForEventSuccess,
  registerForEventFailure,
  cancelRegistrationStart,
  cancelRegistrationSuccess,
  cancelRegistrationFailure,
} = registrationSlice.actions;

export default registrationSlice.reducer;
