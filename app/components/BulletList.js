import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BulletList({ items }) {
  return (
    <View>
      {items.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    fontSize: 16,
    marginRight: 6,
    lineHeight: 22,
  },
  text: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
});
