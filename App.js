import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/home-screen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createBottomTabNavigator();
const routeIcons = {
  Home: "home",
  "My Recipes": "restaurant",
  Create: "add",
  Profile: "person",
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarLabelStyle: { textTransform: "uppercase" },
          tabBarIcon: ({ focused, size }) => {
            const iconName = focused ? routeIcons[route.name] : `${routeIcons[route.name]}-outline`;
            return <Ionicons name={iconName} size={size} color="black" />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="My Recipes" component={HomeScreen} />
        <Tab.Screen name="Create" component={HomeScreen} />
        <Tab.Screen name="Profile" component={HomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
