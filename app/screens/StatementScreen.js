import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '../config/colors';

const outstandingBalance = 350.75;
const netBalance = 150.25;
const paymentsThisYear = 500.00;

function StatementScreen(props) {
  return (
    <>
    <View style={styles.container}>
        <Text style={styles.header}>Outstanding Balance</Text>
        <Text style={styles.balance}>${outstandingBalance}</Text>
    </View>

    <View style={styles.container}>
        <Text style={styles.header}>Net Balance</Text>
        <Text style={styles.balance}>${netBalance}</Text>
    </View>

    <View style={styles.total}>
        <Text style={styles.header}>Payments This Year({new Date().getFullYear()})</Text>
        <Text style={styles.balance}>${paymentsThisYear}</Text>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:20,
    width:"90%",
    borderRadius:30,
    alignSelf:"center",
    padding:20,
  },
  header:{
    fontSize:18,
    fontWeight:"600",
    borderBottomWidth: 2,
    borderColor: '#878585ff',    
  },
  balance:{
    fontSize:32,
    fontWeight:"700",
    marginTop:10,
    color:colors.primary
  },
    total:{
    backgroundColor: '#7358e1ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:20,
    width:"90%",
    borderRadius:30,
    alignSelf:"center",
    padding:20,

    } 
});

export default StatementScreen;