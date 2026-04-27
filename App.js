import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MainNav from './app/navigation/MainNav';
import AuthNavigator from './app/navigation/AuthNavigator';
import AuthContext from './app/context/AuthContext';
import { getToken, getUser, removeAuth } from './app/auth/storage';
import { setAuthToken } from './app/api/client';
import { getMe } from './app/api/users';

export default function App() {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const restoreAuth = async () => {
    try {
      const token = await getToken();

      if (token) {
        setAuthToken(token);

        const response = await getMe();
        setUser(response.data);
      }
    } catch (err) {
      await removeAuth();
      setAuthToken(null);
      setUser(null);
    } finally {
      setIsReady(true);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await getMe();
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.log('Failed to refresh user:', err.response?.data || err.message);
      return null;
    }
  };

  useEffect(() => {
    restoreAuth();
  }, []);

  const logIn = (user) => {
    setUser(user);
  };

  const logOut = async () => {
    await removeAuth();
    setAuthToken(null);
    setUser(null);
  };

  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={{ user, setUser: logIn, logOut, refreshUser }}>
        <NavigationContainer>
          {user ? <MainNav /> : <AuthNavigator />}
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}