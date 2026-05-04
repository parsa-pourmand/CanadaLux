import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import colors from '../config/colors';
import { getInvoices } from '../api/invoices';
import { getPayments } from '../api/payments';

function StatementScreen() {
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadStatement = async (showLoader = true) => {
    const [invoicesResponse, paymentsResponse] = await Promise.all([
      getInvoices(),
      getPayments(),
    ]);

    const invoices = invoicesResponse.data;
    const payments = paymentsResponse.data;

    const outstandingBalance = invoices.reduce((sum, invoice) => {
      const balance =
        invoice.balance !== undefined ? Number(invoice.balance) : 0;

      const status = invoice.status?.toLowerCase();

      if (status === 'paid') return sum;

      return sum + Math.max(0, balance);
    }, 0);

    const currentYear = new Date().getFullYear();

    const paymentsThisYear = payments.reduce((sum, payment) => {
      const paymentDate = new Date(payment.date);
      const paymentYear = paymentDate.getFullYear();

      if (paymentYear !== currentYear) return sum;

      return sum + Number(payment.amount || 0);
    }, 0);

    setStatement({
      outstandingBalance,
      netBalance: outstandingBalance,
      paymentsThisYear,
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadStatement();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStatement(false);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const outstandingBalance = Number(statement?.outstandingBalance || 0);
  const netBalance = Number(statement?.netBalance || 0);
  const paymentsThisYear = Number(statement?.paymentsThisYear || 0);

  return (
    <ScrollView
      contentContainerStyle={styles.screen}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.header}>Outstanding Balance</Text>
        <Text style={styles.balance}>${outstandingBalance.toFixed(2)}</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.header}>Net Balance</Text>
        <Text style={styles.balance}>${netBalance.toFixed(2)}</Text>
      </View>

      <View style={styles.total}>
        <Text style={styles.totalHeader}>
          Payments This Year ({new Date().getFullYear()})
        </Text>
        <Text style={styles.totalBalance}>${paymentsThisYear.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: '90%',
    borderRadius: 30,
    alignSelf: 'center',
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    borderBottomWidth: 2,
    borderColor: '#878585ff',
  },
  balance: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 10,
    color: colors.primary,
  },
  total: {
    backgroundColor: '#7358e1ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: '90%',
    borderRadius: 30,
    alignSelf: 'center',
    padding: 20,
  },
  totalHeader: {
    fontSize: 18,
    fontWeight: '600',
    borderBottomWidth: 2,
    borderColor: '#fff',
    color: 'white',
  },
  totalBalance: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 10,
    color: 'white',
  },
});

export default StatementScreen;