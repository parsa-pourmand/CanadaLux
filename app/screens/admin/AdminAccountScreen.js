import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AuthContext from '../../context/AuthContext';
import { removeAuth } from '../../auth/storage';

function AdminAccountScreen() {
  const { user, logOut } = useContext(AuthContext);

  const handleLogout = async () => {
    await removeAuth();
    logOut();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.Firstname?.[0]}
            {user?.Lastname?.[0]}
          </Text>
        </View>

        <Text style={styles.name}>
          {user?.Firstname} {user?.Lastname}
        </Text>

        <Text style={styles.email}>
          {user?.email}
        </Text>

        <Text style={styles.role}>
          Administrator
        </Text>
      </View>

      <Pressable
        style={styles.logoutCard}
        onPress={handleLogout}
      >
        <MaterialCommunityIcons
          name="logout"
          size={24}
          color="#D32F2F"
        />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    color: '#666',
    marginTop: 4,
  },
  role: {
    marginTop: 8,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  menuCard: {
    backgroundColor: '#f7f7f7',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutCard: {
    backgroundColor: '#fff5f5',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
  },
});

export default AdminAccountScreen;