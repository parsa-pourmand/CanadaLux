import React from 'react';
import {
  ImageBackground,
  View,
  StyleSheet,
  Image,
} from 'react-native';

import ButtonComponent from '../components/ButtonComponent';

function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/welcomeScreen.jpg")}
      blurRadius={10}
      style={styles.background}
    >
      {/* LOGO */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/icon-512.png")} // 👈 replace with your logo file
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* BUTTONS */}
      <View style={styles.container}>
        <ButtonComponent
          title="LOGIN"
          color="black"
          onPress={() => navigation.navigate("Login")}
        />
        <ButtonComponent
          title="REGISTER"
          color="black"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'space-between', // 👈 important change
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  logo: {
    width: 250,
    height: 200,
  },
  container: {
    width: '100%',
    padding: 10,
    marginBottom: 5,
  },
});

export default WelcomeScreen;