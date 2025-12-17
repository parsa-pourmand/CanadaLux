import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import RegisterScreen from './app/screens/RegisterScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WelcomeScreen from './app/screens/WelcomeScreen';
import LoginScreen from './app/screens/LoginScreen';
import AccountScreen from './app/screens/AccountScreen';
import { NavigationContainer } from '@react-navigation/native';
import MainNav from './app/navigation/MainNav';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainNav />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}