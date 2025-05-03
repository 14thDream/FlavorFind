import { StyleSheet, View, Text, TextInput, FlatList } from "react-native";
import { useState } from "react";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

import RecipePost from "../components/RecipePost";

import { spacing, fonts } from "../styles";
import DATA from "../tests/mock";

const containsKeyword = (title, keyword) => {
  return title
    .toLowerCase()
    .split(" ")
    .some((word) => word.startsWith(keyword));
};

const isSearchableBy = (title, keywords) => {
  return keywords
    .toLowerCase()
    .split(" ")
    .every((keyword) => containsKeyword(title, keyword));
};

const HomeScreen = () => {
  const [posts, setPosts] = useState(DATA);

  const handleChangeSearchText = (keywords) => {
    setPosts(DATA.filter(({ title }) => isSearchableBy(title, keywords)));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="menu" size={24} color="black" />
        <Text style={styles.headerText}>FlavorFind</Text>
        <TextInput
          style={styles.headerSearchBar}
          placeholder="Search Recipe"
          onChangeText={handleChangeSearchText}
        />
        <FontAwesome name="search" size={24} color="black" />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
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
    </View>
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
