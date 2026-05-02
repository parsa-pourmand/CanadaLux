import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import CardComponent from '../components/CardComponent';
import Screen from '../components/Screen';
import { getItems } from '../api/items';

function PromotionsScreen() {
  const [saleItems, setSaleItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const calculateSalePrice = (item) => {
    const sellingPrice = Number(item.sellingPrice || 0);
    const salePercentage = Number(item.salePercentage || 0);

    return sellingPrice * (1 - salePercentage / 100);
  };

  const calculateAfterTaxPrice = (item) => {
    const salePrice = calculateSalePrice(item);
    const taxMultiplier = Number(item.hst) === 13 ? 1.13 : 1;

    return salePrice * taxMultiplier;
  };

  const loadPromotions = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const response = await getItems();

      const items = response.data

      const filteredSaleItems = items.filter(
        (item) => item.onSale && Number(item.salePercentage || 0) > 0
      );

      setSaleItems(filteredSaleItems);
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not load promotions.');
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPromotions();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPromotions(false);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator />
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {saleItems.length === 0 ? (
          <Text style={styles.emptyText}>No promotions available right now.</Text>
        ) : (
          saleItems.map((item) => {
            const originalPrice = Number(item.sellingPrice || 0);
            const salePrice = calculateSalePrice(item);
            const afterTaxPrice = calculateAfterTaxPrice(item);

            return (
              <View key={item._id} style={styles.cardWrapper}>
                <CardComponent
                  cover
                  image={
                    item.images?.[0]
                      ? { uri: item.images[0] }
                      : item.imageUrl
                      ? { uri: item.imageUrl }
                      : require('../assets/Fuse-Board.jpg')
                  }
                  title={item.name}
                  subTitle={
                    <View>
                      <Text>
                        <Text style={styles.originalPrice}>
                          ${originalPrice.toFixed(2)}
                        </Text>
                        <Text>  </Text>
                        <Text style={styles.finalPrice}>
                          ${salePrice.toFixed(2)}
                        </Text>
                      </Text>

                      <Text style={styles.saleText}>
                        {item.salePercentage}% off
                      </Text>

                      <Text style={styles.afterTaxText}>
                        After tax: ${afterTaxPrice.toFixed(2)}
                      </Text>
                    </View>
                  }
                />
              </View>
            );
          })
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
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
  saleText: {
    marginTop: 4,
    color: '#E53935',
    fontWeight: '600',
  },
  afterTaxText: {
    marginTop: 4,
    color: '#555',
  },
});

export default PromotionsScreen;