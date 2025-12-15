import React from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import ButtonComponent from '../components/ButtonComponent';

function WelcomeScreen(props) {
  return (
    <ImageBackground source={require("../assets/White.jpg")} style={styles.background} >
        <View style={styles.container}>
            <ButtonComponent title="LOGIN" color="black"/>
            <ButtonComponent title="REGISTER" color="black"/>

        </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background:{
    flex:1,
    justifyContent:'flex-end',
    alignItems:'center'
  },
  container: {
    width:'100%',
    padding:10,
    marginBottom:5
  },
  
});

export default WelcomeScreen;