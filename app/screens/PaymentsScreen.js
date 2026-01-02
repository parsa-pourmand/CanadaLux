import React from 'react';
import { View, StyleSheet, Text, FlatList, ScrollView } from 'react-native';
import ListItemSeparator from '../components/list/ListItemSeparator';

const payments = [
  { id: 1556, amount: 49.99, date: "2024-05-01", method: "Credit Card" },
  { id: 2053, amount: 19.99, date: "2024-04-15", method: "PayPal" }
];

function PaymentsScreen(props) {
  return (
    <View style={styles.screen}>
      
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerCell]}>Payment</Text>
        <Text style={[styles.cell, styles.headerCell]}>Date</Text>
        <Text style={[styles.cell, styles.headerCell, styles.methodCell]}>Method</Text>
        <Text style={[styles.cell, styles.headerCell, styles.amountCell]}>Amount</Text>
      </View>
      
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={ListItemSeparator}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.id}</Text>
            <Text style={styles.cell}>{item.date}</Text>
            <Text style={[styles.cell, styles.methodCell]}>{item.method}</Text>
            <Text style={[styles.cell, styles.amountCell]}>
              ${item.amount.toFixed(2)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: '#eee',
  },
  headerRow: {
    borderBottomWidth: 2,
    borderColor: '#ccc',
  },
  cell: {
    flex: 1,
    fontSize: 14,
  },
  headerCell: {
    fontWeight: 'bold',
  },
  amountCell: {
    textAlign: 'right',
  },
  methodCell: {
    paddingLeft: 12,
  },
});
export default PaymentsScreen;