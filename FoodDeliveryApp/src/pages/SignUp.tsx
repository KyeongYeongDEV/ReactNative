import React, {useCallback, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import DismissKeyboardView from '../components/DismissKeyboardView';
import axios, {AxiosError} from "axios";

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp({navigation}: SignUpScreenProps) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef<TextInput | null>(null);
    const nameRef = useRef<TextInput | null>(null);
    const passwordRef = useRef<TextInput | null>(null);

    const onChangeEmail = useCallback((text: string) => {
        setEmail(text.trim());
    }, []);
    const onChangeName = useCallback((text: string) => {
        setName(text.trim());
    }, []);
    const onChangePassword = useCallback((text: string) => {
        setPassword(text.trim());
    }, []);
    const onSubmit = useCallback(async () => {
        if (!email || !email.trim()) {
            return Alert.alert('알림', '이메일을 입력해주세요.');
        }
        if (!name || !name.trim()) {
            return Alert.alert('알림', '이름을 입력해주세요.');
        }
        if (!password || !password.trim()) {
            return Alert.alert('알림', '비밀번호를 입력해주세요.');
        }
        if (
            !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
                email,
            )
        ) {
            return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
        }
        if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
            return Alert.alert(
                '알림',
                '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
            );
        }
        console.log(email, name, password);

        try {
            setLoading(true);
            const response = await axios.post('/user', {email, name, password}, {
                headers : {
                    token : '고유한 값',
                } // 여러 값의 안정장치가 있는 것이 좋다
            });
            setLoading(false);
        } catch (error) {
            const errorResponse = (error as AxiosError).response;
            console.error();
            if (errorResponse) {
                Alert.alert('알림', errorResponse.data.message);
            }
        } finally {
            setLoading(false); // 실패하든 성공하든 로딩은 false가 되어야 함
        }

        Alert.alert('알림', '회원가입 되었습니다.');
    }, [email, name, password]);

    const canGoNext = email && name && password;
    return (
        <DismissKeyboardView>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>이메일</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={onChangeEmail}
                    placeholder="이메일을 입력해주세요"
                    placeholderTextColor="#666"
                    textContentType="emailAddress"
                    value={email}
                    returnKeyType="next"
                    clearButtonMode="while-editing"
                    ref={emailRef}
                    onSubmitEditing={() => nameRef.current?.focus()}
                    blurOnSubmit={false}
                />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>이름</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="이름을 입력해주세요."
                    placeholderTextColor="#666"
                    onChangeText={onChangeName}
                    value={name}
                    textContentType="name"
                    returnKeyType="next"
                    clearButtonMode="while-editing"
                    ref={nameRef}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    blurOnSubmit={false}
                />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>비밀번호</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="비밀번호를 입력해주세요(영문,숫자,특수문자)"
                    placeholderTextColor="#666"
                    onChangeText={onChangePassword}
                    value={password}
                    keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
                    textContentType="password"
                    secureTextEntry
                    returnKeyType="send"
                    clearButtonMode="while-editing"
                    ref={passwordRef}
                    onSubmitEditing={onSubmit}
                />
            </View>
            <View style={styles.buttonZone}>
                <Pressable
                    style={
                        canGoNext
                            ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
                            : styles.loginButton
                    }
                    disabled={!canGoNext || loading} // loading 중에는 버튼을 쓰지 못하게 한다. 로그인 버튼을 광클하는 경우 그 수만큼 회원가입이 진행이 됨
                    onPress={onSubmit}>

                    {loading ? (<ActivityIndicator color='white'/>) : (<Text style={styles.loginButtonText}>회원가입</Text>)}


                </Pressable>
            </View>
        </DismissKeyboardView>
    );
}

const styles = StyleSheet.create({
    textInput: {
        padding: 5,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    inputWrapper: {
        padding: 20,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 20,
    },
    buttonZone: {
        alignItems: 'center',
    },
    loginButton: {
        backgroundColor: 'gray',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    loginButtonActive: {
        backgroundColor: 'blue',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default SignUp;
