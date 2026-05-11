import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { View, StyleSheet, Image, Text, ImageBackground } from 'react-native';
import * as Yup from 'yup';

import Screen from '../components/Screen';
import FormComponent from '../components/form/FormComponent';
import FormFieldComponent from '../components/form/FormFieldComponent';
import SubmitButton from '../components/form/SubmitButton';

import { login } from '../api/auth';
import { storeAuth } from '../auth/storage';
import { setAuthToken } from '../api/client';

import registerForPushNotificationsAsync from '../utils/registerForPushNotifications';
import { savePushToken } from '../api/pushNotifications';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(5).label('Password'),
});

function LoginScreen({ navigation }) {
  const [error, setError] = useState('');
  const authContext = useContext(AuthContext);

  const handleLogin = async (userInfo) => {
    try {
      setError('');

      const response = await login(userInfo.email, userInfo.password);
      const { token, user } = response.data;

      await storeAuth(token, user);
      setAuthToken(token);
      authContext.setUser(user);

      try {
        const pushToken = await registerForPushNotificationsAsync();

        if (pushToken) {
          await savePushToken(pushToken);
        }
      } catch (err) {
        console.log('Push registration failed:', err);
      }

    } catch (err) {
      setError(err.response?.data || 'Login failed. Please try again.');
    }
  };

  return (
    <ImageBackground
          source={require("../assets/welcomeScreen.jpg")}
          blurRadius={10}
          style={styles.background}
    >
      <Screen style={styles.container}>
          <View style={styles.topSection}>
            <Image
              source={require('../assets/icon-512.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.middleSection}>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <FormComponent
              initialValues={{ email: '', password: '' }}
              onSubmit={handleLogin}
              validationSchema={validationSchema}
            >
              <FormFieldComponent
                name="email"
                icon="email"
                placeholder="Email"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCorrect={false}
                autoCapitalize="none"
              />

              <FormFieldComponent
                name="password"
                icon="lock"
                placeholder="Password"
                textContentType="password"
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry
              />

              <View style={styles.loginButtonContainer}>
                <SubmitButton title="LOGIN" />
              </View>
            </FormComponent>
          </View>
        </Screen>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
  },

  topSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },

  middleSection: {
    flex: 2,
    justifyContent: 'center',
    marginBottom: 60,
  },

  logo: {
    width: 200,
    height: 200,
  },

  loginButtonContainer: {
    marginTop: 50,
  },

  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen;