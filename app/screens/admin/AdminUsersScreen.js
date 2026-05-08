import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  getAdminUsers,
  updateUserDiscount,
  getAdminUserDetails,
} from '../../api/adminUsers';

function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [discountValue, setDiscountValue] = useState('');
  const [savingDiscount, setSavingDiscount] = useState(false);


  const [userOrders, setUserOrders] = useState([]);
  const [userQuotes, setUserQuotes] = useState([]);
  const [totalOwed, setTotalOwed] = useState(0);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getAdminUsers();
      setUsers(response.data || []);
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not load users.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) => {
      const fullName =
        `${user.Firstname || ''} ${user.Lastname || ''}`.toLowerCase();

      return (
        fullName.includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.companyName?.toLowerCase().includes(query)
      );
    });
  }, [users, searchQuery]);

  const openUserModal = async (user) => {
    try {
      setSelectedUser(user);
      setDiscountValue(String(user.discount || 0));
      setModalVisible(true);

      setDetailsLoading(true);

      const response = await getAdminUserDetails(user._id);

      setUserOrders(response.data.orders || []);
      setUserQuotes(response.data.quotes || []);
      setTotalOwed(response.data.totalOwed || 0);
    } catch (err) {
      Alert.alert(
        'Error',
        err.response?.data || 'Could not load user details.'
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setDiscountValue('');
    setUserOrders([]);
    setUserQuotes([]);
    setTotalOwed(0);
    setModalVisible(false);
  };

  const handleSaveDiscount = async () => {
    const parsedDiscount = Number(discountValue);

    if (
      Number.isNaN(parsedDiscount) ||
      parsedDiscount < 0 ||
      parsedDiscount > 100
    ) {
      return Alert.alert(
        'Invalid Discount',
        'Discount must be between 0 and 100.'
      );
    }

    try {
      setSavingDiscount(true);

      const response = await updateUserDiscount(
        selectedUser._id,
        parsedDiscount
      );

      const updatedUser = response.data;

      setUsers((current) =>
        current.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );

      setSelectedUser(updatedUser);

      Alert.alert('Success', 'Discount updated successfully.');
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not update discount.');
    } finally {
      setSavingDiscount(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No users found.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.userCard}
            onPress={() => openUserModal(item)}
          >
            <Text style={styles.userName}>
              {item.Firstname} {item.Lastname}
            </Text>

            <Text style={styles.userInfo}>{item.email}</Text>

            {item.companyName ? (
              <Text style={styles.userInfo}>{item.companyName}</Text>
            ) : null}

            <Text style={styles.discountText}>
              Discount: {item.discount || 0}%
            </Text>
          </Pressable>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedUser?.Firstname} {selectedUser?.Lastname}
              </Text>

              <Pressable onPress={closeModal}>
                <Text style={styles.closeText}>X</Text>
              </Pressable>
            </View>

            <ScrollView>
              <Text style={styles.sectionTitle}>User Info</Text>

              <Text style={styles.detailText}>
                Email: {selectedUser?.email}
              </Text>

              <Text style={styles.detailText}>
                Company: {selectedUser?.companyName || 'N/A'}
              </Text>

              <Text style={styles.detailText}>
                Points: {selectedUser?.points || 0}
              </Text>

              <Text style={styles.detailText}>
                Shipping Address: {selectedUser?.shippingAddress || 'N/A'}
              </Text>

              <Text style={styles.sectionTitle}>Discount</Text>

              <TextInput
                style={styles.discountInput}
                keyboardType="numeric"
                value={discountValue}
                onChangeText={setDiscountValue}
                placeholder="Discount %"
              />

              <Pressable
                style={styles.saveButton}
                onPress={handleSaveDiscount}
                disabled={savingDiscount}
              >
                <Text style={styles.saveButtonText}>
                  {savingDiscount ? 'Saving...' : 'Update Discount'}
                </Text>
              </Pressable>

              {detailsLoading ? (
                <ActivityIndicator style={{ marginTop: 20 }} />
              ) : (
                <>
                  <Text style={styles.sectionTitle}>Total Owed</Text>
                  <Text style={styles.totalOwedText}>
                    ${Number(totalOwed).toFixed(2)}
                  </Text>

                  <Text style={styles.sectionTitle}>Orders</Text>

                  {userOrders.length === 0 ? (
                    <Text style={styles.placeholderText}>No orders.</Text>
                  ) : (
                    userOrders.map((order) => (
                      <View key={order._id} style={styles.recordCard}>
                        <Text style={styles.recordTitle}>
                          Order #{order.orderNumber || order._id.slice(-6)}
                        </Text>

                        <Text style={styles.recordText}>
                          Amount: ${Number(order.amount || 0).toFixed(2)}
                        </Text>

                        <Text style={styles.recordText}>
                          Status: {order.status || 'N/A'}
                        </Text>
                      </View>
                    ))
                  )}

                  <Text style={styles.sectionTitle}>Quotes</Text>

                  {userQuotes.length === 0 ? (
                    <Text style={styles.placeholderText}>No quotes.</Text>
                  ) : (
                    userQuotes.map((quote) => (
                      <View key={quote._id} style={styles.recordCard}>
                        <Text style={styles.recordTitle}>
                          Quote #{quote._id.slice(-6)}
                        </Text>

                        <Text style={styles.recordText}>
                          Status: {quote.status || 'Pending'}
                        </Text>
                      </View>
                    ))
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#f3f3f3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  userCard: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  userName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  userInfo: {
    marginTop: 4,
    color: '#555',
  },
  discountText: {
    marginTop: 8,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 10,
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailText: {
    marginTop: 4,
    color: '#444',
  },
  discountInput: {
    backgroundColor: '#f3f3f3',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  placeholderText: {
    color: '#777',
  },
  totalOwedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
  },

  recordCard: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },

  recordTitle: {
    fontWeight: 'bold',
  },

  recordText: {
    color: '#555',
    marginTop: 4,
  },
});

export default AdminUsersScreen;