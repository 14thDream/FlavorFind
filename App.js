import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./screens/home-screen";
import LoginScreen from "./screens/login-screen";
import RegisterScreen from "./screens/register-screen";

import Ionicons from "@expo/vector-icons/Ionicons";

const Stack = createNativeStackNavigator();
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Main = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelStyle: { textTransform: "uppercase" },
        tabBarIcon: ({ focused, size }) => {
          const iconName = focused
            ? routeIcons[route.name]
            : `${routeIcons[route.name]}-outline`;
          return <Ionicons name={iconName} size={size} color="black" />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="My Recipes" component={HomeScreen} />
      <Tab.Screen name="Create" component={HomeScreen} />
      <Tab.Screen name="Profile" component={HomeScreen} />
    </Tab.Navigator>
  );
};

export default App;
