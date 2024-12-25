import React, {useCallback} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';

function Settings() {
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const dispatch = useAppDispatch();
    const onLogout = useCallback(async () => {
        try {
            await axios.post(
                `${Config.API_URL}/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // 로그인이 된 사람만이 로그아웃이 가능하다 -> 로그인을 해야 accessTOken을 발급받을 수 있기 때문
                    },
                },
            );
            Alert.alert('알림', '로그아웃 되었습니다.');
            dispatch(
                userSlice.actions.setUser({
                    name: '',
                    email: '',
                    accessToken: '',
                }),
            );
            await EncryptedStorage.removeItem('refreshToken'); // refreshToken 지워주는 거 잊지 말기!!
        } catch (error) {
            const errorResponse = (error as AxiosError).response;
            console.error(errorResponse);
        }
    }, [accessToken, dispatch]);

    return (
        <View>
            <View style={styles.buttonZone}>
                <Pressable
                    style={StyleSheet.compose(
                        styles.loginButton,
                        styles.loginButtonActive,
                    )}
                    onPress={onLogout}>
                    <Text style={styles.loginButtonText}>로그아웃</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonZone: {
        alignItems: 'center',
        paddingTop: 20,
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

export default Settings;
