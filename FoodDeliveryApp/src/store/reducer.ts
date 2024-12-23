import {combineReducers} from "@reduxjs/toolkit";

import UserSlice from '../slices/user';


const rootReducer = combineReducers({
    User : UserSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
