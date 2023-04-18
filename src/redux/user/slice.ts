import { User, UserByKeywordResponse } from './user.model';
import { getUserByKeyword, loginAction } from './actions';
import { createSlice } from '@reduxjs/toolkit';
import { LocalStorage } from '../../common/enum/localstorage';

interface UsersState {
  userLogin: User;
  userByKeyword: UserByKeywordResponse[];
}
const userLocal = localStorage.getItem(LocalStorage.UserLogin);
let userLogin: User = {} as User;
if (userLocal) {
  userLogin = JSON.parse(userLocal);
}

const initialState = {
  userLogin: userLogin,
  userByKeyword: [],
} as UsersState;

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    signOut: (state) => {
      state.userLogin = {} as User;
      localStorage.clear();
      window.location.href = '/login';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAction.fulfilled, (state, { payload }) => {
      state.userLogin = payload;
    });
    builder.addCase(loginAction.rejected, (state) => {
      state.userLogin = {} as User;
    });
    builder.addCase(getUserByKeyword.fulfilled, (state, { payload }) => {
      state.userByKeyword = payload;
    });
    builder.addCase(getUserByKeyword.rejected, (state) => {
      state.userByKeyword = [];
    });
  },
});

export const { signOut } = usersSlice.actions;
export default usersSlice.reducer;
