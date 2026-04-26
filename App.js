import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MainNav from './app/navigation/MainNav';
import AuthNavigator from './app/navigation/AuthNavigator';
import AuthContext from './app/context/AuthContext';
import { getToken, getUser, removeAuth } from './app/auth/storage';
import { setAuthToken } from './app/api/client';

export default function App() {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const restoreAuth = async () => {
    try {
      const token = await getToken();
      const storedUser = await getUser();

      if (token && storedUser) {
        setAuthToken(token);
        setUser(storedUser);
      }
    } catch (err) {
      console.log('Failed to restore auth:', err);
    } finally {
      setIsReady(true);
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
      <AuthContext.Provider value={{ user, setUser: logIn, logOut }}>
        <NavigationContainer>
          {user ? <MainNav /> : <AuthNavigator />}
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}