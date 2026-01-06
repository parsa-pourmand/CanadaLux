import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import {MaterialCommunityIcons} from '@expo/vector-icons'


function NewOrderButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
        <View style={styles.container}>
            <MaterialCommunityIcons name="cart" size={40} color={colors.white}/>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems:'center',
    alignSelf:'center',
    backgroundColor:colors.black,
    width:80,
    height:80,
    borderRadius:40,
    borderColor:colors.white,
    borderWidth:10,
    bottom:20,
    justifyContent:'center'
  }
});

export default NewOrderButton;