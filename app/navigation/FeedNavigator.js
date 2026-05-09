import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import PointsScreen from "../screens/PointsScreen";
import FeaturedProductsScreen from "../screens/FeaturedProductsScreen";
import PromotionsScreen from "../screens/PromotionsScreen";
import StatementScreen from "../screens/StatementScreen";
import QuoteScreen from "../screens/QuoteScreen";

import NotificationsScreen from '../screens/NotificationsScreen';

import React, { useCallback, useState } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getNotifications } from '../api/notifications';


function NotificationBell({ navigation }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = async () => {
    try {
      const response = await getNotifications();
      const notifications = response.data || [];

      const count = notifications.filter(
        (notification) => !notification.read
      ).length;

      setUnreadCount(count);
    } catch (err) {
      console.log('Could not load notification count:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUnreadCount();
    }, [])
  );

  return (
    <Pressable
      onPress={() => navigation.navigate('Notifications')}
      style={styles.bellContainer}
    >
      <MaterialCommunityIcons
        name="bell-outline"
        size={26}
        color="black"
      />

      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const Stack = createNativeStackNavigator()

const FeedNavigator = () => (

        <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} 
                        options={({ navigation }) => ({
                                headerRight: () => <NotificationBell navigation={navigation} />
                        })}
                />
                <Stack.Screen name="Quote" component={QuoteScreen}/>
                <Stack.Screen name="Points" component={PointsScreen}/>
                <Stack.Screen name="FeaturedProducts" component={FeaturedProductsScreen}/>
                <Stack.Screen name="Promotions" component={PromotionsScreen}/>
                <Stack.Screen name="Statement" component={StatementScreen}/>
                <Stack.Screen name="Notifications" component={NotificationsScreen}/>
        </Stack.Navigator>
)

const styles = StyleSheet.create({
  bellContainer: {
    marginRight: 14,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default FeedNavigator