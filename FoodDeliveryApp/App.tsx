import * as React from 'react';
import {NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {Pressable, Text, TouchableHighlight, View} from 'react-native';
import {useCallback} from 'react';

type RootStackParamList = {
  Home: undefined; // Home 은 파라미터 없음 | 있다면 추가해줘야 함
  Details: undefined;
};

// HomeScreen과 DetailsScreen의 Props 타입
// 공식 문서를 참고해서 type을 지정해야 한다.
// React navigate 공식문서 보기 -> 사이트에 들엇가서 type checking list 검색
// 강의 제목 '리액ㅌ느 내비게이션 화면 전환하기' 참고
//  https://reactnavigation.org/docs/typescript/      | 공식 사이트
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;

function HomeScreen({navigation}: HomeScreenProps) {
  const onClick = useCallback(() => {
    // 아래의 코드를 이용해 버튼이 눌렸을 때 Details로 가도록 설정되었다.
    navigation.navigate('Details');
  }, [navigation]);
  // flex = 서로간의 차지하는 비율, 1일 경우 전부를 뜻한다.
  //코딩을 할 때 backgroundColor를 주는 것이 좋다
  //flex 같은 함수 안에 있을 때 전체를 더한 것 분의 해당하는 수만큼 나눠 가짐 Ex) 1과 2 이렇게 두개 가 잇으면 1/3, 2/3나눠가짐
  // justifyContent: 'center' 세로 중앙 정렬 / flex-end = 젤 밑에 정렬 / flex-start = 젤 위에 정렬
  // alignItems: 'center' 가로 가운데 정렬 나머지도 위와 동일
  // TouchableHighlight 버튼과 동일 = 화면에 글씨 꾹 누르면 됨 Touchable 종류가 많음
  // 전체를 View로 묶고 flexDirection : 'row'로 주면 가로로 설정된다.
  // flexDirection 얘에 따라서 alignItems, justifyContent 얘네들의 역할이 서로 달라진다.

  return (
    <View style={{flexDirection : 'row'}}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'yellow',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
        <Pressable
          onPress={onClick}
          style={{
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 40,
            paddingRight: 40,
            backgroundColor: 'blue',
          }}>
          <Text style={{color: 'white'}}>Home Screen</Text>
        </Pressable>
      </View>
      <View style={{flex: 2, backgroundColor: 'orange'}}>
        {' '}
        <Text>Second</Text>{' '}
      </View>
    </View>
  );
}

function DetailsScreen({navigation}: DetailsScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableHighlight onPress={onClick}>
        <Text>Details Screen</Text>
      </TouchableHighlight>
    </View>
  );
}

// Stack.Navigator initialRouteName="Home" 현재스크린이 두 개가 있는데 누구를 기본으로 둘 거냐
// 코딩을 시작할 때 어떤 네비게이터들이 필요한지 생각을 하고 미리 깔아놔라
// Stack으로 네비게이션 인스턴스를 만들고 불러오면 네비게이션을 만든다. 내부는 아래와 같음
// function Stack() {
//   return <View></View>
// }
//
// function Navigator() {
//   return <View></View>
// }
//
// function Screen {
//   return <View> </View>
// }
//
// Stack.Navigator = Navigator;
// Stack.Navigator =Screen;

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen} // component를 이용해 HomeScreen 을 이용해 네비게이션과 라우트라는 props를 전달해준다.
          options={{title: '홈화면'}}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
