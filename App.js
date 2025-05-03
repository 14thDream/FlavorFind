import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
};

export default App;
