import { createSlice } from '@reduxjs/toolkit';

interface Loading {
    isLoading: boolean
}

const initialState: Loading = {
  isLoading:false
}

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    showLoading: (state) => {
        state.isLoading = true
    },
    hideLoading: (state) => {
        state.isLoading = false
    }
  },
  },
);

export const { showLoading, hideLoading } = loadingSlice.actions
export default loadingSlice.reducer;