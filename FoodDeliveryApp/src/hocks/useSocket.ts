import {useCallback} from 'react';
import SocketIOClient, {Socket} from 'socket.io-client';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

let socket: Socket | undefined;
const useSocket = (): [Socket | undefined, () => void] => {
    const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
    const disconnect = useCallback(() => {
        if (socket && !isLoggedIn) {
            console.log(socket && !isLoggedIn, '웹소켓 연결을 해제합니다.');
            socket.disconnect();
            socket = undefined;
        }
    }, [isLoggedIn]);
    if (!socket && isLoggedIn) {
        console.log(!socket && isLoggedIn, '웹소켓 연결을 진행합니다.');
        socket = SocketIOClient(`${Config.API_URL}`, {
            transports: ['websocket'], //longpolling 이라는 기법이 있다 // 소켓이 안 되면 http로 계속 요청을 보내서 실시간이 것처럼 할 수도 잇다 하지만 이 방법은 상당히 비효율적이라 옵션에서 제거를 했다.
        });
    }
    return [socket, disconnect];
};

export default useSocket;
