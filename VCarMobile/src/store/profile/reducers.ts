import {createSlice, PayloadAction} from '@reduxjs/toolkit';
const initialState = {};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<any>) {
      return action.payload;
    },
  },
});

export const {setProfile} = profileSlice.actions;
export default profileSlice.reducer;
