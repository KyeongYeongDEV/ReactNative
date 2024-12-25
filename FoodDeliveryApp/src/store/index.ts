import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import rootReducer from './reducer';

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
        if (__DEV__) {
            const createDebugger = require('redux-flipper').default;
            return getDefaultMiddleware().concat(createDebugger());
        }
        return getDefaultMiddleware();
    },
});
export default store;

export type AppDispatch = typeof store.dispatch;

// 랩핑 : 기존 함수를 새로운 형대로 감싸주는 형식
export const useAppDispatch = () => useDispatch<AppDispatch>();
