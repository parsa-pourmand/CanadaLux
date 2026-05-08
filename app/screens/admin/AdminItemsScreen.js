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
  Image,
  Switch,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getAdminItems, updateAdminItem } from '../../api/adminItems';

function AdminItemsScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [salePercentage, setSalePercentage] = useState('');
  const [onSale, setOnSale] = useState(false);

  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    try {
      setLoading(true);

      const response = await getAdminItems();
      setItems(response.data || []);
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not load items.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) =>
      item.name?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  const openItemModal = (item) => {
    setSelectedItem(item);
    setOnSale(item.onSale || false);
    setSalePercentage(String(item.salePercentage || 0));
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setSalePercentage('');
    setOnSale(false);
    setModalVisible(false);
  };

  const handleSave = async () => {
    const parsedDiscount = Number(salePercentage);

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
      setSaving(true);

      const response = await updateAdminItem(selectedItem._id, {
        onSale,
        salePercentage: parsedDiscount,
      });

      const updatedItem = response.data;

      setItems((current) =>
        current.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        )
      );

      setSelectedItem(updatedItem);

      Alert.alert('Success', 'Item updated successfully.');
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not update item.');
    } finally {
      setSaving(false);
    }
  };

  const getImages = (item) => {
    if (item?.images?.length > 0) return item.images;
    return [];
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
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items found.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.itemCard}
            onPress={() => openItemModal(item)}
          >
            <Text style={styles.itemName}>{item.name}</Text>

            <Text style={styles.itemInfo}>
              Stock: {item.stockQuantity}
            </Text>

            <Text style={styles.itemInfo}>
              ${Number(item.sellingPrice || 0).toFixed(2)}
            </Text>

            {item.onSale ? (
              <Text style={styles.saleText}>
                On Sale ({item.salePercentage}%)
              </Text>
            ) : null}
          </Pressable>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedItem?.name}</Text>

              <Pressable onPress={closeModal}>
                <Text style={styles.closeText}>X</Text>
              </Pressable>
            </View>

            <ScrollView>
              <ScrollView horizontal pagingEnabled>
                {getImages(selectedItem).map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.largeImage}
                    resizeMode="contain"
                  />
                ))}
              </ScrollView>

              <Text style={styles.detailText}>
                Description: {selectedItem?.description || 'N/A'}
              </Text>

              <Text style={styles.detailText}>
                Stock: {selectedItem?.stockQuantity}
              </Text>

              <Text style={styles.detailText}>
                Selling Price: $
                {Number(selectedItem?.sellingPrice || 0).toFixed(2)}
              </Text>

              <Text style={styles.detailText}>
                Purchasing Price: $
                {Number(selectedItem?.purchasingPrice || 0).toFixed(2)}
              </Text>

              <Text style={styles.detailText}>
                HST: {selectedItem?.hst || 0}%
              </Text>

              <Text style={styles.sectionTitle}>Sale Settings</Text>

              <View style={styles.switchRow}>
                <Text>On Sale</Text>
                <Switch value={onSale} onValueChange={setOnSale} />
              </View>

              <TextInput
                style={styles.discountInput}
                keyboardType="numeric"
                value={salePercentage}
                onChangeText={setSalePercentage}
                placeholder="Sale percentage"
              />

              <Pressable
                style={styles.saveButton}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? 'Saving...' : 'Update Item'}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 12, backgroundColor: 'white' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchInput: {
    backgroundColor: '#f3f3f3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  itemName: { fontSize: 17, fontWeight: 'bold' },
  itemInfo: { marginTop: 4, color: '#555' },
  saleText: { marginTop: 8, color: '#D32F2F', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#666' },
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
  closeText: { fontSize: 18, fontWeight: 'bold' },
  largeImage: {
    width: 280,
    height: 250,
    backgroundColor: '#f3f3f3',
    marginTop: 16,
    marginRight: 10,
  },
  detailText: { marginTop: 10, color: '#444' },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountInput: {
    backgroundColor: '#f3f3f3',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: { color: 'white', fontWeight: 'bold' },
});

export default AdminItemsScreen;