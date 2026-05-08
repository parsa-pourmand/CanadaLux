import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function AdminFeaturedProductsScreen() {
  return (
    <View style={styles.container}>
      <Text>Admin Featured Products Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminFeaturedProductsScreen;