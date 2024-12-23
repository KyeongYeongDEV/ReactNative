import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Provider, useSelector} from 'react-redux';
import store from "./src/store";
import { RootState } from './src/store/reducer'
import AppInner from "./AppInner.tsx";

// 어떤 페이지가 있을지 개발 초기에 미리 다 정해주는 것이 좋다
export type LoggedInParamList = {
    Orders: undefined; // 주문화면
    Settings: undefined; // 정산 화면
    Delivery: undefined; // 배달 길 안내
    Complete: { orderId: string }; // 고객에게 완료 됐다고 알림 | 사진을 찍어서 할 거임 | 주문마다 고유한 아이디를 파라미터로 넘겨줄 거임
};
// 화면에 나타내는 조건이 달라서 나눠놨음
//
export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
};



function App() {
    //Provider 밖에서는 userSelector를 사용할 수 없다. 원래 안에 있는 Navigation 에서 사용하는 것임
    // 그래서 AppInner라는 것을 만들었음

    return (
        <Provider store={store}>
           <AppInner />
        </Provider>
    );
}

export default App;
