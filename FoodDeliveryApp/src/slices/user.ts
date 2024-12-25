import {createSlice} from '@reduxjs/toolkit';

// store -> roor reducer(state) -> user slice , order slice
// state.user.email
// state.order
// state.ui.loading


// action : state를 바꾸는 행위/동작
// dispatch : 그 액션을 실제로 실행하는 함수
// reducer : 액션이 실제로 실행되면 state를 바꾸는 로직

//전체 적인 틀은 미리 다 설계를 하고 코딩 시작하기
const initialState = {
    name: '',
    email: '',
    accessToken: '',
    refreshToken : '',
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.accessToken = action.payload.accessToken;
        },
        setName(state, action){
            state.name = action.payload;
        },
        setEmail(state, action){
            state.email = action.payload;
        }
    },
    extraReducers: builder => {},
});

export default userSlice;
