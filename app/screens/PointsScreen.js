import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Screen from '../components/Screen';
import ButtonComponent from '../components/ButtonComponent';
import colors from '../config/colors';
import BulletList from '../components/BulletList';

const point={
  point:200,
  worth:50
}

function PointsScreen(props) {
  return (
    <Screen>
    <View style={styles.container}>
        <Text style={styles.point}>
          {`${point.point}`}
        </Text>
         <Text style={styles.text}>
          Available Points
        </Text>
        <Text style={styles.text}>
          {`Worth up to $${point.worth}`}
        </Text>
        <ButtonComponent
          title="Redeem Points"
          onPress={() => console.log('Redeem Points pressed')}
          color="white"
          textColor="orange"
        />
    </View>
    <View style={styles.textContainer}>
        <Text style={styles.header}>How it works</Text>
        <BulletList items={[
          "Earn points for every purchase",
          "100 points = $1.00 credit",
          "Minimum 1000 points to redeem ($10)",
          "Redeemed as store credit"
        ]} />
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
  point:{
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text:{
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 5
  },
  header:{
    fontSize:22,
    fontWeight:'bold',
    marginBottom:10
  },
  textContainer:{
    marginTop:20, 
    paddingHorizontal:20,
    backgroundColor: colors.white,
    borderRadius:15,
    paddingVertical:15,
    width:"90%",
    alignSelf:"center"
  }
});

export default PointsScreen;