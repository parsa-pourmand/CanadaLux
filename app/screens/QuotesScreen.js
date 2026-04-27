import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ListItem from '../components/list/ListItem';
import Icon from '../components/Icon';
import { getQuotes } from '../api/quotes';

function QuotesScreen() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedQuote, setSelectedQuote] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getQuotes();
      setQuotes(response.data);
    } catch (err) {
      setError(err.response?.data || 'Could not load quotes.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadQuotes();
    }, [])
  );

  const openQuote = (quote) => {
    setSelectedQuote(quote);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedQuote(null);
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
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={quotes}
        keyExtractor={(quote) => quote._id}
        ListEmptyComponent={
          <Text style={styles.empty}>No quote requests yet.</Text>
        }
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subTitle={`${item.status}`}
            onPress={() => openQuote(item)}
            IconComponent={
              <Icon
                name="file-document-outline"
                backgroundColor="black"
                iconColor="white"
              />
            }
          />
        )}
      />

      {/* Modal Popup */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            
            {/* Close button */}
            <Pressable style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeText}>X</Text>
            </Pressable>

            {selectedQuote && (
              <>
                <Text style={styles.title}>{selectedQuote.title}</Text>

                <Text style={styles.label}>Details:</Text>
                <Text style={styles.text}>{selectedQuote.details}</Text>

                <Text style={styles.label}>Status:</Text>
                <Text style={styles.text}>{selectedQuote.status}</Text>

                <Text style={styles.label}>Response:</Text>
                <Text style={styles.text}>
                  {selectedQuote.retailerResponse || 'Waiting for response...'}
                </Text>
              </>
            )}
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
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
  },

  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  text: {
    marginTop: 4,
  },
});

export default QuotesScreen;