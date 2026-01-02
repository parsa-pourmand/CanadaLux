import React from 'react';
import {View, StyleSheet, ScrollView, Text } from 'react-native';
import CardComponent from '../components/CardComponent';

const promotions = [
    { id: 1, name: 'Product 1', OriginalPrice: '49.99', FinalPrice: '29.99', image: require('../assets/Fuse-Board.jpg') },
    { id: 2, name: 'Product 2', OriginalPrice: '59.99', FinalPrice: '39.99', image: require('../assets/Fuse-Board.jpg') },
    { id: 3, name: 'Product 3', OriginalPrice: '69.99', FinalPrice: '49.99', image: require('../assets/Fuse-Board.jpg') },
  ];

function PromotionsScreen(props) {
  return (
    <ScrollView style={styles.container}>
        {promotions.map(promotion => (
            <View key={promotion.id}>
                <CardComponent cover image={promotion.image} title={promotion.name} subTitle={
                    <Text>
                        <Text style={styles.originalPrice}>
                            ${promotion.OriginalPrice}
                        </Text>
                        <Text>  </Text>
                        <Text style={styles.finalPrice}>
                            ${promotion.FinalPrice}
                        </Text>
                    </Text>
                } />
            </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 14,
  },
  finalPrice: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PromotionsScreen;