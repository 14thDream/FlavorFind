import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./screens/home";
import LoginScreen from "./screens/login-screen";

import Ionicons from "@expo/vector-icons/Ionicons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // This removes the default header
        />
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
        tabBarIcon: ({ size }) => {
          let iconName;

          switch (route.name) {
            case "My Recipes":
              iconName = "restaurant";
              break;
            case "Create":
              iconName = "add";
              break;
            case "Profile":
              iconName = "person";
              break;
            default:
              iconName = "home";
          }

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
