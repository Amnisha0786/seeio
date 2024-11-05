import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessLevel: {}
};

const useAccessLevelSlice = createSlice({
  name: 'accessLevel',
  initialState,
  reducers: {
    updateAcessLevel(state, action) {
      return {
        ...state,
        accessLevel: {...action.payload}
      };
    },
  }
});

export const accessLevelActions = useAccessLevelSlice.actions;
export const accessLevelReducers = useAccessLevelSlice.reducer;
