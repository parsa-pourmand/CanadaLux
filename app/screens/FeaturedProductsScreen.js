import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CardComponent from '../components/CardComponent';

const products = [
  { id: 1, name: 'Product 1', image: require('../assets/Fuse-Board.jpg') },
  { id: 2, name: 'Product 2', image: require('../assets/Fuse-Board.jpg') },
  { id: 3, name: 'Product 3', image: require('../assets/Fuse-Board.jpg') },
]; 
function FeaturedProductsScreen(props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
        {products.map(product => (
            <View key={product.id}>
                <CardComponent cover image={product.image} title={product.name} />
            </View>
        ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  }
});

export default FeaturedProductsScreen;