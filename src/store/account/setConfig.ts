import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  config: false
};

const setConfigSlice = createSlice({
  name: 'accessLevel',
  initialState,
  reducers: {
    setConfig(state, action) {
      return {
        config: action.payload
      };
    },
  }
});

export const setConfigActions = setConfigSlice.actions;
export const setCongifReducers = setConfigSlice.reducer;
