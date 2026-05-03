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
import { getInvoices } from '../api/invoices';

function InvoicesScreen() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadInvoices = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const response = await getInvoices();
      setInvoices(response.data);
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not load invoices.');
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadInvoices();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInvoices(false);
    setRefreshing(false);
  };

  const openInvoiceModal = (invoice) => {
    setSelectedInvoice(invoice);
    setModalVisible(true);
  };

  const closeInvoiceModal = () => {
    setSelectedInvoice(null);
    setModalVisible(false);
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
        data={invoices}
        keyExtractor={(invoice) => invoice._id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No invoices found.</Text>
        }
        renderItem={({ item }) => (
          <ListItem
            title={`Invoice ${item.invoiceNumber || item.orderId || ''}`}
            subTitle={`${formatDate(item.createdAt || item.date)} | $${Number(
              item.amount || item.totalAmount || 0
            ).toFixed(2)} | ${item.status || 'Unpaid'}`}
            onPress={() => openInvoiceModal(item)}
            IconComponent={
              <Icon name="file-document" backgroundColor="black" iconColor="white" />
            }
          />
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invoice Details</Text>

              <Pressable onPress={closeInvoiceModal}>
                <Text style={styles.closeText}>X</Text>
              </Pressable>
            </View>

            <ScrollView>
              <Text style={styles.invoiceNumber}>
                Invoice {selectedInvoice?.invoiceNumber || ''}
              </Text>

              <Text style={styles.infoText}>
                Date: {formatDate(selectedInvoice?.dateIssued)}
              </Text>

              <Text style={styles.infoText}>
                Status: {selectedInvoice?.status || 'Unpaid'}
              </Text>

              {selectedInvoice?.orderId ? (
                <Text style={styles.infoText}>
                  Order: {selectedInvoice.orderId.orderNumber || ''}
                </Text>
              ) : null}

              <View style={styles.summaryBox}>
                <Text style={styles.summaryLine}>
                  Amount: ${Number(selectedInvoice?.amount || 0).toFixed(2)}
                </Text>

                <Text style={styles.summaryLine}>
                  Paid: ${Number(selectedInvoice?.paidAmount || 0).toFixed(2)}
                </Text>

                <Text style={styles.finalAmount}>
                  Balance: $
                  {Number(
                    selectedInvoice?.balance ??
                      Number(selectedInvoice?.amount || 0) -
                        Number(selectedInvoice?.paidAmount || 0)
                  ).toFixed(2)}
                </Text>

                <Text style={styles.summaryLine}>
                  Due Date: {formatDate(selectedInvoice?.dueDate)}
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
  invoiceNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  infoText: {
    marginTop: 6,
    color: '#555',
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

export default InvoicesScreen;