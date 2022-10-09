import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IUserSliceState {
  userName: string;
}

type UserPayload = {
  userName: string
}

const initialState: IUserSliceState = {
  userName: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserPayload>) => {
      state.userName = action.payload.userName
    }
  }
})

export const { setUsers } = userSlice.actions

export default userSlice.reducer;