import { createSlice } from "@reduxjs/toolkit";

const configAppSlice = createSlice({
  name: "configApp",
  initialState: {
    isOpenMenu: false,
  },
  reducers: {
    setIsOpenMenu: (state) => {
      state.isOpenMenu = !state.isOpenMenu;
    },
  },
});

// export const {  } = userSlice.actions;
export default configAppSlice.reducer;
export const { setIsOpenMenu } = configAppSlice.actions;
