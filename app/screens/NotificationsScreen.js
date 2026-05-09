import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  getNotifications,
  markNotificationRead,
} from '../api/notifications';

function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      setNotifications(response.data || []);
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const handlePress = async (notification) => {
    if (!notification.read) {
      await markNotificationRead(notification._id);
      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id ? { ...item, read: true } : item
        )
      );
    }

    Alert.alert(notification.title, notification.message);
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
        data={notifications}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications yet.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, !item.read && styles.unreadCard]}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            {!item.read && <Text style={styles.unreadText}>New</Text>}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  unreadCard: {
    borderWidth: 1,
    borderColor: 'black',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    marginTop: 5,
    color: '#555',
  },
  unreadText: {
    marginTop: 8,
    fontWeight: 'bold',
    color: 'black',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
  },
});

export default NotificationsScreen;