import React from "react";
import RegisterScreen from "./screens/register-screen";
import AddRecipeScreen from "./screens/add-recipe";
import LoginScreen from "./screens/login-screen";
import {
  Button,
  Alert,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
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
        <Stack.Screen name="Add Recipe" component={AddRecipeScreen}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />  
        <Stack.Screen name="Tabs" component={Tabs} />
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
