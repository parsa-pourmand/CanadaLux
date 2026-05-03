import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Screen from '../components/Screen';
import colors from '../config/colors';
import BulletList from '../components/BulletList';
import AuthContext from '../context/AuthContext';

function PointsScreen() {
  const { user } = useContext(AuthContext);

  const points = user?.points || 0;
  const worth = points / 100;

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.point}>{points}</Text>

        <Text style={styles.text}>Available Points</Text>

        <Text style={styles.text}>
          Worth up to ${worth.toFixed(2)}
        </Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.header}>How it works</Text>

        <BulletList
          items={[
            'Earn points when you place orders',
            '100 points = $1.00 credit',
            'Points can be redeemed during checkout',
            'Redeemed points reduce your final order amount',
          ]}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    width: 350,
    height: 220,
    borderRadius: 20,
    alignSelf: 'center',
    padding: 10,
  },
  point: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingVertical: 15,
    width: '90%',
    alignSelf: 'center',
  },
});

export default PointsScreen;