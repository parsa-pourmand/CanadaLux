import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import PointsScreen from "../screens/PointsScreen";

const Stack = createNativeStackNavigator()

const FeedNavigator = () => (

        <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="Points" component={PointsScreen}/>
        </Stack.Navigator>
)

export default FeedNavigator