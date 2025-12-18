import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import ListItem from '../components/list/ListItem';
import Icon from '../components/Icon';

const orders = [
    {
        id:1,
        title:"Order1",
        date:"2023-10-01",
        total:"$150.00",
        status:"Shipped"
    },
    {
        id:2,
        title:"Order2",
        date:"2023-10-15",
        total:"$85.00",
        status:"Processing" 
    }
]

function OrdersScreen(props) {
  return (
    <View style={styles.container}>
        <FlatList
        data={orders}
        keyExtractor={order => order.id.toString()}
        renderItem={({ item }) => (
          <ListItem title={item.title} subTitle={`${item.date} | ${item.total} | ${item.status}`} 
            IconComponent={<Icon name="shopping" backgroundColor="black" iconColor="white"/>}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default OrdersScreen;