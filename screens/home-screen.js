import { StyleSheet, View, Text, TextInput, FlatList } from "react-native";
import { useState, useEffect, useMemo } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import RecipePost from "../components/RecipePost";
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
      <View style={styles.headerContainer}>
        <Ionicons name="menu" size={24} color="black" />
        <Text style={styles.headerText}>FlavorFind</Text>
        <TextInput
          style={styles.headerSearchBar}
          placeholder="Search Recipe"
          onChangeText={setSearchQuery}
        />
        <FontAwesome name="search" size={24} color="black" />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={visiblePosts}
        keyExtractor={(item) => item.id}
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
    backgroundColor: colors.background,
  },
  headerContainer: {
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
