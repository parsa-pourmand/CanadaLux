import React, { useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, ScrollView } from 'react-native';
import CardComponent from '../components/CardComponent';
import AuthContext from '../context/AuthContext';

function HomeScreen({ navigation }) {
  const { user, refreshUser } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      refreshUser();
    }, [])
  );

  const points = user?.points || 0;
  const pointsWorth = points / 100;

  const balance = {
    balance: 350.75, // temporary until we connect statement/invoices
  };

  return (
    <ScrollView style={styles.container}>
      <CardComponent
        image={require('../assets/star.png')}
        title={`Available Points: ${points}`}
        subTitle={`worth up to $${pointsWorth.toFixed(2)}`}
        onPress={() => navigation.navigate('Points')}
      />

      <CardComponent
        image={require('../assets/graph_diagram.png')}
        title="Statement"
        subTitle={`$${balance.balance}`}
        onPress={() => navigation.navigate('Statement')}
      />

      <CardComponent
        image={require('../assets/Featured_Products.png')}
        title="Featured Products"
        onPress={() => navigation.navigate('FeaturedProducts')}
      />

      <CardComponent
        image={require('../assets/Promotion.jpg')}
        title="Promotions"
        onPress={() => navigation.navigate('Promotions')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
});

export default HomeScreen;