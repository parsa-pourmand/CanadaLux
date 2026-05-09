import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import ImageInputList from '../../components/ImageInputList';
import {
  getFeaturedProducts,
  createFeaturedProduct,
  deleteFeaturedProduct,
} from '../../api/featuredProducts';

function AdminFeaturedProductsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [expectedArrivalDate, setExpectedArrivalDate] = useState('');
  const [status, setStatus] = useState('Coming Soon');
  const [images, setImages] = useState([]);

  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);

  const statusOptions = ['Coming Soon', 'Available', 'Cancelled'];

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await getFeaturedProducts();
      setProducts(response.data || []);
    } catch (err) {
      Alert.alert(
        'Error',
        err.response?.data || 'Could not load featured products.'
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const handleCreate = async () => {
    if (!name.trim()) {
      return Alert.alert('Validation', 'Name is required.');
    }

    try {
      setCreating(true);

      const response = await createFeaturedProduct({
        name: name.trim(),
        description: description.trim(),
        expectedPrice: Number(expectedPrice || 0),
        expectedArrivalDate: expectedArrivalDate || undefined,
        status,
        images,
      });

      setProducts((current) => [response.data, ...current]);

      setName('');
      setDescription('');
      setExpectedPrice('');
      setExpectedArrivalDate('');
      setStatus('Coming Soon');
      setImages([]);

      Alert.alert('Success', 'Featured product created.');
    } catch (err) {
      Alert.alert(
        'Error',
        err.response?.data || 'Could not create featured product.'
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Product',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFeaturedProduct(id);

              setProducts((current) =>
                current.filter((item) => item._id !== id)
              );
            } catch (err) {
              Alert.alert(
                'Error',
                err.response?.data || 'Could not delete product.'
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.sectionTitle}>Create Featured Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Product name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Expected price"
        keyboardType="numeric"
        value={expectedPrice}
        onChangeText={setExpectedPrice}
      />

      <TextInput
        style={styles.input}
        placeholder="Expected arrival date"
        value={expectedArrivalDate}
        onChangeText={setExpectedArrivalDate}
      />

      <Pressable
        style={styles.dropdownButton}
        onPress={() => setStatusDropdownVisible((current) => !current)}
      >
        <Text style={styles.dropdownButtonText}>{status}</Text>
        <Text style={styles.dropdownArrow}>
          {statusDropdownVisible ? '▲' : '▼'}
        </Text>
      </Pressable>

      {statusDropdownVisible && (
        <View style={styles.dropdownMenu}>
          {statusOptions.map((option) => (
            <Pressable
              key={option}
              style={styles.dropdownItem}
              onPress={() => {
                setStatus(option);
                setStatusDropdownVisible(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <ImageInputList
        imageUris={images}
        onAddImage={(uri) => setImages([...images, uri])}
        onRemoveImage={(uri) =>
          setImages(images.filter((image) => image !== uri))
        }
      />

      <Pressable
        style={styles.createButton}
        onPress={handleCreate}
        disabled={creating}
      >
        <Text style={styles.createButtonText}>
          {creating ? 'Creating...' : 'Create Product'}
        </Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Existing Featured Products</Text>

      <FlatList
        data={products}
        scrollEnabled={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{item.name}</Text>

            <Text>{item.status}</Text>

            <Text>
              ${Number(item.expectedPrice || 0).toFixed(2)}
            </Text>

            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDelete(item._id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </ScrollView>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f3f3f3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  productCard: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#D32F2F',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  dropdownButton: {
    backgroundColor: '#f3f3f3',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdownButtonText: {
    fontSize: 16,
    color: '#222',
  },

  dropdownArrow: {
    fontSize: 14,
    color: '#555',
  },

  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  dropdownItemText: {
    fontSize: 16,
  },
});

export default AdminFeaturedProductsScreen;