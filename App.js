import { useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

import LoginScreen from "./screens/login-screen";
import RegisterScreen from "./screens/register-screen";
import HomeScreen from "./screens/home-screen";
import CreateScreen from "./screens/create-screen";

import Ionicons from "@expo/vector-icons/Ionicons";
import { UserContext } from "./Contexts";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const routeIcons = {
  Home: "home",
  "My Recipes": "restaurant",
  Create: "add",
  Profile: "person",
};

const App = () => {
  const [userId, setUserId] = useState(null);

  return (
    <NavigationContainer>
      <UserContext.Provider value={[userId, setUserId]}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={Main} />
        </Stack.Navigator>
      </UserContext.Provider>
    </NavigationContainer>
  );
};

const Main = () => {
  return (
    <SafeAreaView style={styles.container}>
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
        <Tab.Screen name="Create" component={CreateScreen} />
        <Tab.Screen name="Profile" component={HomeScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
