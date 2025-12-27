import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CardComponent from '../components/CardComponent';

const point={
  point:200,
  worth:50
}

function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
        <CardComponent image={require('../assets/star.png')} title={`Available Points: ${point.point}`} subTitle={`worth up to $${point.worth}`}
            onPress={() => navigation.navigate("Points")}
        />

        <CardComponent image={require('../assets/Featured_Products.png')} title="Featured Products"
            onPress={() => navigation.navigate("FeaturedProducts")}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default HomeScreen;