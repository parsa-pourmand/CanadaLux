import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Icon({size=40, name, backgroundColor="#000", iconColor="#fff", style}) {
  return (
    <View style={[{height:size, width:size, borderRadius:size/2, backgroundColor, justifyContent:'center', alignItems:'center'}, style]}>
        <MaterialCommunityIcons name={name} color={iconColor} size={size*0.5}/>
    </View>
  );
}

export default Icon;