import Settings from './src/pages/Settings';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import {useState} from 'react';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useSelector} from "react-redux";
import {RootState} from "./src/store/reducer.ts";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

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



function AppInner () {
    const isLoggedIn = useSelector((state : RootState) => !!state.user.email);

    return (
        <NavigationContainer>
            {isLoggedIn ? (
                <Tab.Navigator>
                    <Tab.Screen
                        name="Orders"
                        component={Orders}
                        options={{title: '오더 목록'}}
                    />
                    <Tab.Group>
                        <Tab.Screen
                            name="Delivery"
                            component={Delivery}
                            options={{headerShown: false}}
                        />
                        <Tab.Screen
                            name="Settings"
                            component={Settings}
                            options={{title: '내 정보'}}
                        />
                    </Tab.Group>
                </Tab.Navigator>
            ) : (
                <Stack.Navigator>
                    <Stack.Screen
                        name="SignIn"
                        component={SignIn}
                        options={{title: '로그인'}}
                    />
                    <Stack.Screen
                        name="SignUp"
                        component={SignUp}
                        options={{title: '회원가입'}}
                    />
                </Stack.Navigator>
            )}
        </NavigationContainer>

    );
}

export default AppInner;
