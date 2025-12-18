import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../screens/AccountScreen";
import OrdersScreen from "../screens/OrdersScreen";
import InvoicesScreen from "../screens/InvoicesScreen";

const Stack = createNativeStackNavigator()

const AccountNavigator = () => (
        <Stack.Navigator>
                <Stack.Screen name="My Account" component={AccountScreen}/>
                <Stack.Screen name="Orders" component={OrdersScreen}/>
                <Stack.Screen name="Invoice" component={InvoicesScreen}/>
        </Stack.Navigator>
)

export default AccountNavigator