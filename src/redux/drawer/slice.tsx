import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type CloseDrawerFunc = () => void;

interface DrawerStateCommon {
  DrawerContent: JSX.Element;
  title: string;
  onClose: CloseDrawerFunc;
}

interface DrawerState extends DrawerStateCommon {
  open: boolean;
}

export type DrawerPayload = DrawerStateCommon;

const initialState = {
  open: false,
  title: '',
  DrawerContent: <></>,
  onClose: () => {
    //
  },
} as DrawerState;

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    showDrawer: (state, action: PayloadAction<DrawerPayload>) => {
      for (const [key, value] of Object.entries(action.payload)) {
        state[key] = value;
      }
      state.open = true;
    },
    hideDrawer: (state) => {
      for (const [key, value] of Object.entries(initialState)) {
        state[key] = value;
      }
    },
  },
});

export const { showDrawer, hideDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;
