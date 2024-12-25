import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

import {Provider, useSelector} from 'react-redux';
import store from "./src/store";
import { RootState } from './src/store/reducer'
import AppInner from "./AppInner.tsx";




function App() {
    //Provider 밖에서는 userSelector를 사용할 수 없다. 원래 안에 있는 Navigation 에서 사용하는 것임
    // 그래서 AppInner라는 것을 만들었음

    return (
        <Provider store={store}>
            <NavigationContainer>
                <AppInner />
            </NavigationContainer>
        </Provider>
    );
}

export default App;
