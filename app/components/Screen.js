import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'


function Screen(props) {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={props.style}>
        {props.children}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex:1,
  }
});

export default Screen;