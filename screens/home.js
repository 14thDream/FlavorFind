import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import RecipePost from "../components/RecipePost";

import { spacing, fonts } from "../styles";
import Data from "../tests/mock";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>FlavorFind</Text>
        <TextInput style={styles.headerSearchBar} placeholder="Search Recipe" />
        <FontAwesome name="search" size={24} color="black" />
      </View>
      <FlatList
        data={Data}
        renderItem={({ item }) => (
          <View style={styles.recipePost}>
            <RecipePost
              username={item.username}
              title={item.title}
              uri={item.uri}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: spacing.xs,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  headerText: {
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
  },
  headerSearchBar: {
    flex: 1,
  },
  recipePost: {
    marginHorizontal: spacing.sm,
  },
});

export default HomeScreen;
