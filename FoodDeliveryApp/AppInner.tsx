import messaging from '@react-native-firebase/messaging';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import Settings from './src/pages/Settings';
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';
import useSocket from './src/hooks/useSocket';
import {useEffect} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import {Alert} from 'react-native';
import userSlice from './src/slices/user';
import {useAppDispatch} from './src/store';
import Config from 'react-native-config';
import orderSlice from './src/slices/order';
import usePermissions from './src/hooks/usePermissions';
import SplashScreen from 'react-native-splash-screen';

// 사용하지 않는 아이콘은 저장해 놓은 거 지워주는 게 좋다
// 여러 모듈에서 쇼핑하지 말고 하나만 정해서 해주는 것이 어플의 용량을 줄이는 데 도움이 된다.
// 앱에서 용량을 많이 차지하는 부분은 폰트, 이미지, 비디오 같은 것이다.
// 코드가 암만 길어봐야 용량 차지를 많이 하지는 않는다.
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';//

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};
export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

  const [socket, disconnect] = useSocket();

  usePermissions();

  // 앱 실행 시 토큰 있으면 로그인하는 코드
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          SplashScreen.hide(); // hide를 해주지 않으면 앱은 돌아가고 있지만 스크린에 가려져서 사람들은 어플이 고장이 난 줄 안다.
          return;
        }
        const response = await axios.post(
          `${Config.API_URL}/refreshToken`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );
      } catch (error) {
        console.error(error);
        if ((error as AxiosError).response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.');
        }
      } finally {
        SplashScreen.hide();
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);

  useEffect(() => {
    const callback = (data: any) => {
      console.log(data);
      dispatch(orderSlice.actions.addOrder(data));
    };
    if (socket && isLoggedIn) {
      socket.emit('acceptOrder', 'hello');
      socket.on('order', callback);
    }
    return () => {
      if (socket) {
        socket.off('order', callback);
      }
    };
  }, [dispatch, isLoggedIn, socket]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  useEffect(() => {
    axios.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const {
          config,
          response: {status},
        } = error;
        if (status === 419) {
          if (error.response.data.code === 'expired') {
            const originalRequest = config;
            const refreshToken = await EncryptedStorage.getItem('refreshToken');
            // token refresh 요청
            const {data} = await axios.post(
              `${Config.API_URL}/refreshToken`, // token refresh api
              {},
              {headers: {authorization: `Bearer ${refreshToken}`}},
            );
            // 새로운 토큰 저장
            dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
            originalRequest.headers.authorization = `Bearer ${data.data.accessToken}`;
            // 419로 요청 실패했던 요청 새로운 토큰으로 재요청
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      },
    );
  }, [dispatch]);

  // 토큰 설정
  useEffect(() => {
    async function getToken() {
      try {
        if (!messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerDeviceForRemoteMessages();
        }
        const token = await messaging().getToken();
        console.log('phone token', token);
        dispatch(userSlice.actions.setPhoneToken(token));
        return axios.post(`${Config.API_URL}/phonetoken`, {token});
      } catch (error) {
        console.error(error);
      }
    }
    getToken();
  }, [dispatch]);

  return isLoggedIn ? (
    <Tab.Navigator>
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{
          title: '오더 목록',
          tabBarIcon: ({color}) => (
            <FontAwesome5 name="list" size={20} style={{color}} />
          ),
          tabBarActiveTintColor: 'blue',
        }}
      />
      <Tab.Screen
        name="Delivery"
        component={Delivery}
        options={{
          headerShown: false,
          title: '지도',
          tabBarIcon: ({color}) => (
            <FontAwesome5 name="map" size={20} style={{color}} />
          ),
          tabBarActiveTintColor: 'blue',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: '내 정보',
          tabBarIcon: ({color}) => (
            <FontAwesome name="gear" size={20} style={{color}} />
          ),
          tabBarActiveTintColor: 'blue',
        // 리액트는 한 번 마운트 되면 걔를 그냥 계속 가지고 있으려고한다.
        // 그렇기 때문에 계속 업데이트가 일어나야 하는 부분에서는 최신화가 되질 않는다.
        // unmountOnBlur 를 통해 이 탭에서 빠져나갔을 때 unmount를 시켜준다.
          unmountOnBlur: true,
        }}
      />
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
  );
}

export default AppInner;
