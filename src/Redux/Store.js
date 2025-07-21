import { configureStore } from '@reduxjs/toolkit';
import navReducer from "./reducer"
const store = configureStore({
  reducer: {
    navReducer
  },
});

export default store;
