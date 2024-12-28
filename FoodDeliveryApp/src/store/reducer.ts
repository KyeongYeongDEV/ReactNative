import {combineReducers} from "@reduxjs/toolkit";

import UserSlice from '../slices/user';
import orderSlice from "../slices/order.ts";


const rootReducer = combineReducers({
    user : UserSlice.reducer,
    order : orderSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
