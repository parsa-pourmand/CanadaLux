import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ListItem from '../components/list/ListItem';
import Icon from '../components/Icon';
import Screen from '../components/Screen';
import { getOrders } from '../api/orders';

function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const response = await getOrders();
      setOrders(response.data);
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not load orders.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeOrderModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const formatDate = (date) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(order) => order._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders found.</Text>
        }
        renderItem={({ item }) => (
          <ListItem
            title={`Order ${item.orderNumber || ''}`}
            subTitle={`${formatDate(item.createdAt)} | $${Number(
              item.amount || 0
            ).toFixed(2)} | ${item.status || 'Pending'}`}
            onPress={() => openOrderModal(item)}
            IconComponent={
              <Icon
                name="shopping"
                backgroundColor="black"
                iconColor="white"
              />
            }
          />
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>

              <Pressable onPress={closeOrderModal}>
                <Text style={styles.closeText}>X</Text>
              </Pressable>
            </View>

            <ScrollView>
              <Text style={styles.orderNumber}>
                Order {selectedOrder?.orderNumber || ''}
              </Text>

              <Text style={styles.infoText}>
                Date: {formatDate(selectedOrder?.createdAt)}
              </Text>

              <Text style={styles.infoText}>
                Status: {selectedOrder?.status || 'Pending'}
              </Text>

              {selectedOrder?.project ? (
                <Text style={styles.infoText}>
                  Project:{' '}
                  {selectedOrder.project.name || selectedOrder.project}
                </Text>
              ) : null}

              <Text style={styles.sectionTitle}>Items</Text>

              {selectedOrder?.lineItems?.map((lineItem, index) => {
                const item = lineItem.itemId;
                const itemName =
                  item?.name || `Item ${index + 1}`;

                const unitPrice = Number(lineItem.unitPrice || 0);
                const quantity = Number(lineItem.quantity || 0);
                const lineTotal = unitPrice * quantity;

                return (
                  <View key={index} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{itemName}</Text>
                      <Text style={styles.itemSubText}>
                        Qty: {quantity} × ${unitPrice.toFixed(2)}
                      </Text>
                    </View>

                    <Text style={styles.itemTotal}>
                      ${lineTotal.toFixed(2)}
                    </Text>
                  </View>
                );
              })}

              <View style={styles.summaryBox}>
                <Text style={styles.summaryLine}>
                  Discount: ${Number(selectedOrder?.discount || 0).toFixed(2)}
                </Text>

                <Text style={styles.summaryLine}>
                  Redeemed Amount: $
                  {Number(selectedOrder?.redeemedAmount || 0).toFixed(2)}
                </Text>

                <Text style={styles.finalAmount}>
                  Final Price: $
                  {Number(selectedOrder?.amount || 0).toFixed(2)}
                </Text>

                <Text style={styles.summaryLine}>
                  Earned Points: {selectedOrder?.pointsEarned || 0}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  infoText: {
    marginTop: 6,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f7f7f7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemSubText: {
    marginTop: 4,
    color: '#555',
  },
  itemTotal: {
    fontWeight: 'bold',
  },
  summaryBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 6,
  },
  summaryLine: {
    fontSize: 15,
  },
  finalAmount: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default OrdersScreen;