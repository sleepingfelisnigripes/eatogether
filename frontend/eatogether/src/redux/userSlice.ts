import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUserSliceState {
  user_id: string;
  username: string;
  user_photo: string;
  token: string;
}

const initialState: IUserSliceState = {
  user_id: "",
  username: "",
  user_photo: "",
  token: ""
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedInUser: (state, action: PayloadAction<IUserSliceState>) => {
      state.user_id = action.payload.user_id,
      state.username = action.payload.username,
      state.user_photo = action.payload.user_photo,
      state.token = action.payload.token 
    }
  }
})

export const { setLoggedInUser } = userSlice.actions

export default userSlice.reducer;