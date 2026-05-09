import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminItemsScreen from '../screens/admin/AdminItemsScreen';
import AdminFeaturedProductsScreen from '../screens/admin/AdminFeaturedProductsScreen';
import AdminAccountScreen from '../screens/admin/AdminAccountScreen';
import AdminQuotesScreen from '../screens/admin/AdminQuotesScreen';

const Tab = createBottomTabNavigator();

function AdminNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen
        name="Users"
        component={AdminUsersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-group"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Items"
        component={AdminItemsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="package-variant"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Quotes"
        component={AdminQuotesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="file-document-edit-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="Featured Products"
        component={AdminFeaturedProductsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="star"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Account"
        component={AdminAccountScreen}
        options={{
            tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
                name="account-circle"
                size={size}
                color={color}
            />
            ),
        }}
        />
    </Tab.Navigator>
  );
}

export default AdminNavigator;