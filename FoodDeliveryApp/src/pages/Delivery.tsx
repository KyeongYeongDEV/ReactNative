import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ing from './Ing.tsx';
import Complete from './Complete.tsx';

const Stack = createNativeStackNavigator();

function Delivery() {
  return (
    //Complete 화면을 지도 위에 스택터럼 띄우기 위해 이렇게 구성
    // 지도는 한 번 로딩하고 하는데 시간과 메모리를 많이 잡아먹는다 그렇기 때문에
    // 지도를 안 끄고 완료 목록을 지도 위에 뜨도록 했다
    // 중첩된 네비게이션
    //초반에 설계 잘해주기
    <Stack.Navigator>
      <Stack.Screen
        name={'Ing'}
        component={Ing}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'Complete'}
        component={Complete}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default Delivery;
