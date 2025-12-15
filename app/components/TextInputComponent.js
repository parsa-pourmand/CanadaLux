import React from 'react';
import { View, StyleSheet, TextInput, Platform } from 'react-native';
import Icon from './Icon';
import colors from '../config/colors';

export default function TextInputComponent({icon, width='100%', ...otherprops }) {
  return (
    <View style={[{width:width}, styles.container]}>
        {icon && <Icon name={icon} iconColor={colors.medium} backgroundColor={colors.light}/>}
        <TextInput style = {styles.text} {...otherprops}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    padding:10,
    marginVertical:10,
    borderRadius:25,
    backgroundColor:colors.light
  },
  text:{
    color:colors.dakr,
    fontSize:18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir"
    }
});

