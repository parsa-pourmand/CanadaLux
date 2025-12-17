import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../screens/AccountScreen";
import OrderScreen from "../screens/OrderScreen";

const Stack = createNativeStackNavigator()

const AccountNavigator = () => (
        <Stack.Navigator>
                <Stack.Screen name="My Account" component={AccountScreen}/>
                <Stack.Screen name="Order" component={OrderScreen}/>
        </Stack.Navigator>
)

export default AccountNavigator