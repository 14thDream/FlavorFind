import { StyleSheet, View } from "react-native";
import { useState, useEffect, useMemo } from "react";
import SearchHeader from "../components/SearchHeader.js";
import RecipeFeed from "../components/RecipeFeed";
import RecipeView from "../components/RecipeView";
import { colors } from "../styles";
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
      <SearchHeader size={24} color="black" onChangeText={setSearchQuery} />
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
});

export default HomeScreen;
