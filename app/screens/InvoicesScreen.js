import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import ListItem from '../components/list/ListItem';
import Icon from '../components/Icon';

const Invoices = [
    {
        id:1,
        orderId:12345,
        date:"2024-01-15",
        amount:250.00,
    }, {
        id:2,
        orderId:12346,
        date:"2024-01-20",
        amount:180.00,
    }
]
function InvoicesScreen(props) {
  return (
    <View style={styles.container}>
        <FlatList
        data={Invoices}
        keyExtractor={invoice => invoice.id.toString()}
        renderItem={({ item }) => (
          <ListItem title={`Invoice #${item.orderId}`} subTitle={`${item.date} | $${item.amount}`} 
            IconComponent={<Icon name="file" backgroundColor="black" iconColor="white"/>}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default InvoicesScreen;