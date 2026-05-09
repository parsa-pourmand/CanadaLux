import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  getAdminQuotes,
  respondToQuote,
} from '../../api/adminQuotes';

function AdminQuotesScreen() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedQuote, setSelectedQuote] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [responseText, setResponseText] = useState('');
  const [sending, setSending] = useState(false);

  const loadQuotes = async () => {
    try {
      setLoading(true);

      const response = await getAdminQuotes();

      const pendingQuotes = response.data.filter(
        (q) => q.status === 'Pending'
      );

      setQuotes(pendingQuotes);
    } catch (err) {
      Alert.alert(
        'Error',
        err.response?.data || 'Could not load quotes.'
      );
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
    setResponseText('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedQuote(null);
    setResponseText('');
    setModalVisible(false);
  };

  const handleRespond = async () => {
    if (!responseText.trim()) {
      return Alert.alert('Validation', 'Response is required.');
    }

    try {
      setSending(true);

      await respondToQuote(
        selectedQuote._id,
        responseText.trim()
      );

      setQuotes((current) =>
        current.filter((q) => q._id !== selectedQuote._id)
      );

      closeModal();

      Alert.alert('Success', 'Response sent.');
    } catch (err) {
      Alert.alert(
        'Error',
        err.response?.data || 'Could not send response.'
      );
    } finally {
      setSending(false);
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
      <FlatList
        data={quotes}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No pending quotes.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.quoteCard}
            onPress={() => openQuote(item)}
          >
            <Text style={styles.quoteTitle}>
              {item.title}
            </Text>

            <Text style={styles.quoteUser}>
              {item.userId?.Firstname} {item.userId?.Lastname}
            </Text>

            <Text style={styles.quoteEmail}>
              {item.userId?.email}
            </Text>
          </Pressable>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedQuote?.title}
                </Text>

                <Pressable onPress={closeModal}>
                  <Text style={styles.closeText}>X</Text>
                </Pressable>
              </View>

              <Text style={styles.label}>User</Text>
              <Text style={styles.text}>
                {selectedQuote?.userId?.Firstname}{' '}
                {selectedQuote?.userId?.Lastname}
              </Text>

              <Text style={styles.label}>Details</Text>
              <Text style={styles.text}>
                {selectedQuote?.details}
              </Text>

              {selectedQuote?.images?.length > 0 && (
                <>
                  <Text style={styles.label}>Images</Text>

                  <ScrollView horizontal>
                    {selectedQuote.images.map((img, index) => (
                      <Image
                        key={index}
                        source={{ uri: img }}
                        style={styles.image}
                      />
                    ))}
                  </ScrollView>
                </>
              )}

              <Text style={styles.label}>Response</Text>

              <TextInput
                style={styles.responseInput}
                multiline
                value={responseText}
                onChangeText={setResponseText}
                placeholder="Type response..."
              />

              <Pressable
                style={styles.sendButton}
                onPress={handleRespond}
                disabled={sending}
              >
                <Text style={styles.sendButtonText}>
                  {sending ? 'Sending...' : 'Send Response'}
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
  emptyText: { textAlign: 'center', marginTop: 40 },
  quoteCard: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  quoteTitle: { fontSize: 16, fontWeight: 'bold' },
  quoteUser: { marginTop: 6 },
  quoteEmail: { color: '#666' },
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
  },
  modalTitle: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 18,
    paddingRight: 10,
  },
  closeText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  label: {
    marginTop: 14,
    fontWeight: 'bold',
  },
  text: {
    marginTop: 6,
    color: '#444',
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  responseInput: {
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    padding: 12,
    minHeight: 120,
    marginTop: 10,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AdminQuotesScreen;