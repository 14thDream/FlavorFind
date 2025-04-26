import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
} from "react-native";
import { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import RecipePost from "../components/RecipePost";

import { spacing, fonts } from "../styles";
import DATA from "../tests/mock";

const isTitleSearchableFrom = (title, searchText) => {
  return searchText
    .toLowerCase()
    .split(" ")
    .every((word) => title.toLowerCase().includes(word));
};

const HomeScreen = () => {
  const [posts, setPosts] = useState(DATA);

  const handleChangeSearchText = (text) => {
    setPosts(DATA.filter(({ title }) => isTitleSearchableFrom(title, text)));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>FlavorFind</Text>
        <TextInput
          style={styles.headerSearchBar}
          placeholder="Search Recipe"
          onChangeText={handleChangeSearchText}
        />
        <FontAwesome name="search" size={24} color="black" />
      </View>
      <FlatList
        data={posts}
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
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  headerText: {
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
  },
  headerSearchBar: {
    flex: 1,
    paddingHorizontal: spacing.xs,
    fontFamily: fonts.primary,
    borderWidth: 1,
  },
  recipePost: {
    margin: spacing.sm,
  },
});

export default HomeScreen;
