import React from 'react';
import {
    TouchableWithoutFeedback,
    Keyboard,
    StyleProp,
    ViewStyle, Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

// TouchableWithoutFeedback 얘네가 가장 상위이기 때문에 키보드가 올라와 있을 때 다른 곳을 터치할 경우 키보드가 내려간다.
// behavior={Platform.OS === 'android' ? 'position' : 'padding' 안드로이드에서는 'position'이 잘 먹고 애플에서는 'padding'이 잘 먹는다.

//children이 있는 부분은 React.FC를 사용하는 것을 추천한다.
// 이것을 사용하지 않는 방법으로는 function으로 하는 방법이 있다.
const DismissKeyboardView : React.FC = ({children, ...props}) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAwareScrollView {...props} behavior={Platform.OS === 'android' ? 'position' : 'padding'}
                                 style={props.style}>
            {children}
        </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
