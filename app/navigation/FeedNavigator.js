import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator()

const FeedNavigator = () => (

        <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen}/>
        </Stack.Navigator>
)

export default FeedNavigator