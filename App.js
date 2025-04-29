import HomeScreen from "./screens/home";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  return <SafeAreaView style={styles.container}>
      <HomeScreen />
    </SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default App;
