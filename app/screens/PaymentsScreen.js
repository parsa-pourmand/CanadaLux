import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ListItemSeparator from '../components/list/ListItemSeparator';
import { getPayments } from '../api/payments';

function PaymentsScreen() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadPayments = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const response = await getPayments();
      setPayments(response.data);
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not load payments.');
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPayments();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPayments(false);
    setRefreshing(false);
  };

  const formatDate = (date) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerCell]}>Payment</Text>
        <Text style={[styles.cell, styles.headerCell]}>Date</Text>
        <Text style={[styles.cell, styles.headerCell, styles.methodCell]}>
          Method
        </Text>
        <Text style={[styles.cell, styles.headerCell, styles.amountCell]}>
          Amount
        </Text>
      </View>

      <FlatList
        data={payments}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ItemSeparatorComponent={ListItemSeparator}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No payments found.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>
              {item.paymentNumber}
            </Text>

            <Text style={styles.cell}>
              {formatDate(item.date)}
            </Text>

            <Text style={[styles.cell, styles.methodCell]}>
              {item.method || item.method || 'N/A'}
            </Text>

            <Text style={[styles.cell, styles.amountCell]}>
              ${Number(item.amount || 0).toFixed(2)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
  },
});

export default PaymentsScreen;