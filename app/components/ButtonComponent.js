import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import colors from '../config/colors';

function ButtonComponent({onPress, title, color = "black", textColor = "white"}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, {backgroundColor: colors[color]}]}>
      <Text style={[styles.text, {color: colors[textColor]}]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container:{
        width:"100%",
        padding:15,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:30,
        marginVertical:15
    },
    text:{
        color:"white",
        fontSize:18,
        textTransform:'uppercase',
        fontWeight:'bold'
    }
});

export default ButtonComponent;