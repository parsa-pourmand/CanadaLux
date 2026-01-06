import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import PointsScreen from "../screens/PointsScreen";
import FeaturedProductsScreen from "../screens/FeaturedProductsScreen";
import PromotionsScreen from "../screens/PromotionsScreen";
import StatementScreen from "../screens/StatementScreen";

const Stack = createNativeStackNavigator()

const FeedNavigator = () => (

        <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="Points" component={PointsScreen}/>
                <Stack.Screen name="FeaturedProducts" component={FeaturedProductsScreen}/>
                <Stack.Screen name="Promotions" component={PromotionsScreen}/>
                <Stack.Screen name="Statement" component={StatementScreen}/>
        </Stack.Navigator>
)

export default FeedNavigator