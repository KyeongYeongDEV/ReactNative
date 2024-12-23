import Settings from './src/pages/Settings';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import {useState} from 'react';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {RootStackParamList} from "./App.tsx";
import {useSelector} from "react-redux";
import {RootState} from "./src/store/reducer.ts";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

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
