import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FeedNavigator from './FeedNavigator';
import OrderScreen from '../screens/OrderScreen';
import AccountNavigator from './AccountNavigator';
import NewOrderButton from './NewOrderButton';

const Tab = createBottomTabNavigator();

function MainNav () {
    return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Feed"
        component={FeedNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{
            headerShown: true,
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons name="cart" size={size} color={"white"} />
            ),
            tabBarButton: (props) => <NewOrderButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default MainNav;