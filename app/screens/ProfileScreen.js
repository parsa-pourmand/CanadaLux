import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import ImageInput from '../components/ImageInput';
import AuthContext from '../context/AuthContext';
import { updateProfile } from '../api/users';
import { setAuthToken } from '../api/client';
import {storeAuth} from '../auth/storage';

function ProfileScreen() {
  const { user, setUser } = useContext(AuthContext);

  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [email, setEmail] = useState(user?.email || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [shippingAddress, setShippingAddress] = useState(
    user?.shippingAddress || ''
  );
  const [submitting, setSubmitting] = useState(false);

  const emailChanged = email.trim().toLowerCase() !== user?.email?.toLowerCase();
  const passwordChanged = newPassword.trim().length > 0;

  const hasChanges = useMemo(() => {
    return (
      profileImage !== (user?.profileImage || '') ||
      emailChanged ||
      companyName.trim() !== (user?.companyName || '') ||
      shippingAddress.trim() !== (user?.shippingAddress || '') ||
      passwordChanged
    );
  }, [
    profileImage,
    emailChanged,
    companyName,
    shippingAddress,
    passwordChanged,
    user,
  ]);

  const handleDeleteShippingAddress = () => {
    Alert.alert(
      'Delete Shipping Address',
      'Are you sure you want to remove your shipping address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setShippingAddress('') },
      ]
    );
  };

  const handleSave = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!hasChanges) {
      return Alert.alert('No Changes', 'There is nothing to update.');
    }

    if (!trimmedEmail) {
      return Alert.alert('Email Required', 'Please enter your email.');
    }

    if (passwordChanged && newPassword.trim().length < 5) {
      return Alert.alert(
        'Weak Password',
        'New password must be at least 5 characters.'
      );
    }

    if ((emailChanged || passwordChanged) && !currentPassword) {
      return Alert.alert(
        'Current Password Required',
        'Please enter your current password to update your email or password.'
      );
    }

    try {
      setSubmitting(true);

      const body = {
        companyName: companyName.trim(),
        shippingAddress: shippingAddress.trim(),
        profileImage,
      };

      if (emailChanged) {
        body.email = trimmedEmail;
        body.currentPassword = currentPassword;
      }

      if (passwordChanged) {
        body.password = newPassword.trim();
        body.currentPassword = currentPassword;
      }

      const response = await updateProfile(body);
      const token = response.headers['x-auth-token'];
      const updatedUser = response.data;

      if (token) {
        await storeAuth(token, updatedUser);
        setAuthToken(token);
      }

      setUser(updatedUser);

      setCurrentPassword('');
      setNewPassword('');
      setEmail(updatedUser.email || trimmedEmail);
      setCompanyName(updatedUser.companyName || '');
      setShippingAddress(updatedUser.shippingAddress || '');
      setProfileImage(updatedUser.profileImage || '');

      Alert.alert('Profile Updated', 'Your profile was updated successfully.');
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not update profile.');
      
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.imageContainer}>
        <ImageInput
          imageUri={profileImage}
          onChangeImage={(uri) => setProfileImage(uri || '')}
        />
        <Text style={styles.changePhotoText}>Tap to update profile picture</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Info</Text>

        <Text style={styles.label}>First Name</Text>
        <Text style={styles.readOnlyText}>{user?.Firstname || 'N/A'}</Text>

        <Text style={styles.label}>Last Name</Text>
        <Text style={styles.readOnlyText}>{user?.Lastname || 'N/A'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account Info</Text>

        <Text style={styles.label}>Company Name</Text>
        <TextInput
          style={styles.input}
          value={companyName}
          onChangeText={setCompanyName}
          placeholder="Company name"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <Text style={styles.helperText}>
          Current password is required only when changing email or password.
        </Text>

        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Current password"
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Leave empty if unchanged"
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>

        <TextInput
          style={[styles.input, styles.addressInput]}
          value={shippingAddress}
          onChangeText={setShippingAddress}
          placeholder="Enter shipping address"
          multiline
        />

        {shippingAddress ? (
          <Pressable
            style={styles.deleteAddressButton}
            onPress={handleDeleteShippingAddress}
          >
            <Text style={styles.deleteAddressText}>Delete Shipping Address</Text>
          </Pressable>
        ) : null}
      </View>

      <Pressable
        style={[
          styles.saveButton,
          (!hasChanges || submitting) && styles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={!hasChanges || submitting}
      >
        {submitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: 'white',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  changePhotoText: {
    marginTop: 10,
    fontWeight: '600',
    color: '#555',
  },
  card: {
    backgroundColor: '#f7f7f7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 8,
  },
  readOnlyText: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 10,
    color: '#555',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  helperText: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },
  addressInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  deleteAddressButton: {
    borderWidth: 1,
    borderColor: '#ff5a5f',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteAddressText: {
    color: '#ff5a5f',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ProfileScreen;