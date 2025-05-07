import { StyleSheet, View, Text, TextInput } from "react-native";
import { useState, useEffect, useMemo } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import RecipeFeed from "../components/RecipeFeed";
import RecipeView from "../components/RecipeView";
import { spacing, fonts, colors } from "../styles";
import { onValue } from "firebase/database";
import { ref, db } from "../firebaseConfig";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const [posts, setPosts] = useState([]);
  const visiblePosts = useMemo(() => {
    return posts.filter(({ title }) => isSearchableBy(title, searchQuery));
  }, [posts, searchQuery]);

  useEffect(() => {
    const listener = onValue(ref(db, "posts"), (snapshot) => {
      const posts = Object.values(snapshot.val());
      setPosts(posts);
    });

    return () => listener();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="menu" size={24} color="black" />
        <Text style={styles.headerText}>FlavorFind</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Recipe"
          onChangeText={setSearchQuery}
        />
        <FontAwesome name="search" size={24} color="black" />
      </View>
      {selectedRecipeId === null ? (
        <RecipeFeed data={visiblePosts} onPress={setSelectedRecipeId} />
      ) : (
        <RecipeView
          id={selectedRecipeId}
          onClose={() => setSelectedRecipeId(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    padding: spacing.xs,
    gap: spacing.sm,
    backgroundColor: colors.primary,
  },
  headerText: {
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: spacing.xs,
    fontFamily: fonts.primary,
    borderWidth: 1,
  },
});

export default HomeScreen;
