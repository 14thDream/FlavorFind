import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { useState, useEffect, useMemo } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import RecipePost from "../components/RecipePost";
import { spacing, fonts, colors } from "../styles";
import { get, onValue } from "firebase/database";
import { ref, db } from "../firebaseConfig";
import { CommentButton, LikeButton } from "../components/Buttons";

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

const RecipeFeed = ({ data, onPress }) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.recipePost}>
          <RecipePost
            username={item.username}
            title={item.title}
            uri={item.uri}
            onPress={() => onPress(item.id)}
          />
        </View>
      )}
    />
  );
};

const RecipeView = ({ id, onClose }) => {
  const [recipe, setRecipe] = useState({});

  useEffect(() => {
    const loadRecipe = async (id) => {
      const recipeRef = ref(db, `posts/${id}`);
      const recipe = await get(recipeRef);
      setRecipe(recipe.val());
    };

    loadRecipe(id);
  }, [id]);

  return (
    <View style={styles.recipeContainer}>
      <View style={styles.recipeHeader}>
        <Pressable onPress={onClose} style={styles.recipeBackButton}>
          {({ pressed }) => {
            const iconName = `arrow-back-circle${pressed ? "" : "-outline"}`;
            return <Ionicons name={iconName} size={30} color="black" />;
          }}
        </Pressable>
        <View>
          <Text style={styles.recipeUserText}>@{recipe.username}</Text>
          <Text style={styles.recipeTitleText}>{recipe.title}</Text>
        </View>
      </View>
      <ScrollView>
        <View style={styles.recipeCard}>
          <Image style={styles.recipeImage} source={{ uri: recipe.uri }} />
          <View style={styles.recipeButtons}>
            <LikeButton size={28} color="black" />
            <CommentButton size={28} color="black" />
          </View>
        </View>
      </ScrollView>
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
  recipeContainer: {
    flex: 1,
  },
  recipeHeader: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  recipeUserText: {
    fontFamily: fonts.primary,
    fontSize: fonts.sm,
    fontWeight: "bold",
  },
  recipeTitleText: {
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
  },
  recipeBackButton: {
    marginRight: spacing.sm,
  },
  recipeCard: {
    alignSelf: "stretch",
    marginHorizontal: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  recipeImage: {
    height: 269,
    alignSelf: "stretch",
    borderRadius: 10,
    marginHorizontal: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  recipeButtons: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
});

export default HomeScreen;
