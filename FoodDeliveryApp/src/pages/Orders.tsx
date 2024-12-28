import React, {useCallback} from 'react';
import {FlatList, View} from 'react-native';
import {Order} from '../slices/order';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import EachOrder from '../components/EachOrder';

function Orders() {
    const orders = useSelector((state: RootState) => state.order.orders);
    const renderItem = useCallback(({item}: {item: Order}) => {
        return <EachOrder item={item} />;
    }, []);
    // 효율적인 게 화면에 보이는 것만 랜더링을 하면 가장 좋다
    // 하지만 ScrollView를 사용하면 모든 요소들을 랜더를 하기 때문에 비효율 적이다
    // 그래서 FlatList를 사용한다.
    return (
        <View>
            <FlatList
                data={orders}
                keyExtractor={item => item.orderId}
                renderItem={renderItem}
            />
        </View>
    );
}

export default Orders;
