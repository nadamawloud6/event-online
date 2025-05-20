import { createSlice } from '@reduxjs/toolkit';
import { getCurrentPath } from '../../services/storageService';

const initialState = {
  currentPath: getCurrentPath(),
  previousPath: null,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentPath: (state, action) => {
      state.previousPath = state.currentPath;
      state.currentPath = action.payload;
      // Utiliser le service de stockage pour stocker le chemin actuel
      import('../../services/storageService').then(module => {
        module.storeCurrentPath(action.payload);
      });
    },
    clearNavigationHistory: (state) => {
      state.currentPath = '/';
      state.previousPath = null;
      // Utiliser le service de stockage pour supprimer le chemin actuel
      import('../../services/storageService').then(module => {
        module.storeCurrentPath('/');
      });
    },
  },
});

export const { setCurrentPath, clearNavigationHistory } = navigationSlice.actions;

export default navigationSlice.reducer;
