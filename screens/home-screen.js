import { StyleSheet, View } from "react-native";
import { useState, useEffect, useMemo } from "react";
import SearchHeader from "../components/SearchHeader.js";
import RecipeFeed from "../components/RecipeFeed";
import RecipeView from "../screens/view-recipe.js";
import { colors, spacing } from "../styles";
import { onValue } from "firebase/database";
import { ref, db } from "../firebaseConfig";
import { RecipeContext } from "../Contexts.js";

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
  const [recipe, setRecipe] = useState(null);
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
      {recipe === null ? (
        <RecipeFeed
          itemStyle={styles.feed}
          data={visiblePosts}
          onPress={setRecipe}
        />
      ) : (
        <RecipeContext.Provider value={[recipe, setRecipe]}>
          <RecipeView isEditable />
        </RecipeContext.Provider>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  feed: {
    margin: spacing.sm,
  },
});

export default HomeScreen;
