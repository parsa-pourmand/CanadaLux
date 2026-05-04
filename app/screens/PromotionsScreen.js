import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import CardComponent from '../components/CardComponent';
import Screen from '../components/Screen';
import { getItems } from '../api/items';

function PromotionsScreen() {
  const [saleItems, setSaleItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const getItemImages = (item) => {
    if (item?.images?.length > 0) return item.images;
    return [];
  };

  const openItemModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeItemModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  const loadPromotions = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const response = await getItems();
      const items = response.data;

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

  const selectedOriginalPrice = Number(selectedItem?.sellingPrice || 0);
  const selectedSalePrice = selectedItem ? calculateSalePrice(selectedItem) : 0;
  const selectedAfterTaxPrice = selectedItem
    ? calculateAfterTaxPrice(selectedItem)
    : 0;

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
                      : require('../assets/Fuse-Board.jpg')
                  }
                  onPress={() => openItemModal(item)}
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

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedItem?.name}</Text>

              <Pressable onPress={closeItemModal}>
                <Text style={styles.closeText}>X</Text>
              </Pressable>
            </View>

            <ScrollView>
              <ScrollView horizontal pagingEnabled style={styles.imagesScroll}>
                {getItemImages(selectedItem).length > 0 ? (
                  getItemImages(selectedItem).map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      style={styles.largeImage}
                      resizeMode="contain"
                    />
                  ))
                ) : (
                  <Image
                    source={require('../assets/Fuse-Board.jpg')}
                    style={styles.largeImage}
                    resizeMode="contain"
                  />
                )}
              </ScrollView>

              <View style={styles.detailsBox}>
                <Text style={styles.detailLabel}>Price</Text>

                <Text>
                  <Text style={styles.originalPrice}>
                    ${selectedOriginalPrice.toFixed(2)}
                  </Text>
                  <Text>  </Text>
                  <Text style={styles.finalPrice}>
                    ${selectedSalePrice.toFixed(2)}
                  </Text>
                </Text>

                <Text style={styles.saleText}>
                  {selectedItem?.salePercentage}% off
                </Text>

                <Text style={styles.detailText}>
                  After tax: ${selectedAfterTaxPrice.toFixed(2)}
                </Text>

                <Text style={styles.detailText}>
                  Quantity in stock: {selectedItem?.stockQuantity || 0}
                </Text>

                {selectedItem?.description ? (
                  <>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailText}>
                      {selectedItem.description}
                    </Text>
                  </>
                ) : null}

                {selectedItem?.hst ? (
                  <Text style={styles.detailText}>
                    HST: {selectedItem.hst}%
                  </Text>
                ) : null}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    paddingRight: 10,
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagesScroll: {
    marginTop: 16,
  },
  largeImage: {
    width: 300,
    height: 280,
    borderRadius: 12,
    backgroundColor: '#f1f1f1',
  },
  detailsBox: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
  },
  detailText: {
    marginTop: 8,
    color: '#555',
    fontSize: 15,
  },
});

export default PromotionsScreen;