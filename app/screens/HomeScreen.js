import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CardComponent from '../components/CardComponent';

const point={
  point:200,
  worth:50
}
const balance={
  balance:350.75
}

function HomeScreen({navigation}) {
  return (
    <ScrollView style={styles.container}>
        <CardComponent image={require('../assets/star.png')} title={`Available Points: ${point.point}`} subTitle={`worth up to $${point.worth}`}
            onPress={() => navigation.navigate("Points")}
        />

        <CardComponent image={require('../assets/graph_diagram.png')} title="Statement" subTitle={`$${balance.balance}`}
            onPress={() => navigation.navigate("Statement")}
        />

        <CardComponent image={require('../assets/Featured_Products.png')} title="Featured Products"
            onPress={() => navigation.navigate("FeaturedProducts")}
        />
        <CardComponent image={require('../assets/Promotion.jpg')} title="Promotions"
            onPress={() => navigation.navigate("Promotions")}
        />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  }
});

export default HomeScreen;