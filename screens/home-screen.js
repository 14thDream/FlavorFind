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
import { useState, useEffect, useMemo, useContext } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import RecipePost from "../components/RecipePost";
import { spacing, fonts, colors } from "../styles";
import { get, onValue, set } from "firebase/database";
import { ref, db, getNextId } from "../firebaseConfig";
import { CommentButton, LikeButton } from "../components/Buttons";
import { UserContext } from "../Contexts";

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
            userId={item.userId}
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
  const [username, setUsername] = useState("");
  const [recipe, setRecipe] = useState({});
  const ingredients =
    recipe && recipe.ingredients ? Object.values(recipe.ingredients) : [];
  const steps = recipe && recipe.steps ? Object.values(recipe.steps) : [];

  useEffect(() => {
    const loadRecipe = async (id) => {
      const recipeRef = ref(db, `posts/${id}`);
      const recipe = await get(recipeRef);
      setRecipe(recipe.val());

      const userRef = ref(db, `users/${recipe.val().userId}`);
      const user = await get(userRef);
      setUsername(user.val().username);
    };

    loadRecipe(id);
  }, [id]);

  const [userId, setUserId] = useContext(UserContext);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState({});

  const sendComment = async (comment) => {
    const commentPath = `posts/${recipe.id}/comments`;
    const id = await getNextId(commentPath);
    const commentRef = ref(db, `${commentPath}/${id}`);

    if (!comment.trim()) {
      return;
    }

    set(commentRef, {
      id: id,
      userId: userId,
      message: comment,
    });
    setComment("");
  };

  useEffect(() => {
    onValue(ref(db, `posts/${id}/comments`), (snapshot) => {
      const comments = Object.values(snapshot.val());
      setComments(comments);
    });
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
          <Text style={styles.recipeUserText}>@{username}</Text>
          <Text style={styles.recipeTitleText}>{recipe.title}</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.recipeCard}>
          <Image style={styles.recipeImage} source={{ uri: recipe.uri }} />
          <View style={styles.recipeButtons}>
            <LikeButton size={28} color="black" />
            <CommentButton size={28} color="black" />
          </View>
          <Text style={styles.recipeDescriptionText}>{recipe.description}</Text>
          <View style={styles.recipeSectionHeader}>
            <Text style={styles.recipeSectionText}>Ingredients</Text>
          </View>
          <View style={styles.recipeList}>
            {ingredients.map((item, index) => (
              <Text key={index} style={styles.recipeListText}>
                • {item.name} : {item.amount}
              </Text>
            ))}
          </View>
          <View style={styles.recipeSectionHeader}>
            <Text style={styles.recipeSectionText}>Steps</Text>
          </View>
          <View style={styles.recipeList}>
            {steps.map((item, index) => (
              <Text key={index} style={styles.recipeListText}>
                {index + 1}. {item}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.recipeCard}>
          <View style={styles.commentInput}>
            <TextInput
              multiline
              numberOfLines={1}
              value={comment}
              onChangeText={setComment}
              onSubmitEditing={() => sendComment(comment)}
              blurOnSubmit // submitBehavior does not trigger onSubmitEditing
              placeholder="Add comment"
              style={styles.commentInputText}
            />
            <Pressable onPress={() => sendComment(comment)}>
              <Ionicons name="caret-forward" size={28} color="black" />
            </Pressable>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={comments}
            renderItem={({ item }) => {
              return <Comment data={item} />;
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const Comment = ({ data }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadUsername = async (id) => {
      const userRef = ref(db, `users/${id}`);
      const user = await get(userRef);
      setUsername(user.val().username);
    };

    loadUsername(data.userId);
  }, [data]);

  return (
    <View style={styles.comment}>
      <Text style={styles.commentUserText}>@{username}</Text>
      <Text style={styles.commentText}>{data.message}</Text>
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
    marginVertical: spacing.sm,
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
    marginHorizontal: spacing.sm + spacing.xs,
    marginBottom: spacing.sm + spacing.xs,
    gap: spacing.md + spacing.sm,
  },
  recipeDescriptionText: {
    marginHorizontal: spacing.sm + spacing.xs,
    marginBottom: spacing.sm,
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
  },
  recipeSectionHeader: {
    marginTop: spacing.sm + spacing.xs,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.highlight,
    borderRadius: 10,
  },
  recipeSectionText: {
    fontFamily: fonts.primary,
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  recipeList: {
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
    gap: spacing.xs,
  },
  recipeListText: {
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    margin: spacing.sm,
    paddingLeft: spacing.sm,
    backgroundColor: colors.highlight,
    borderRadius: 20,
  },
  commentInputText: {
    flex: 1,
    fontFamily: fonts.primary,
    fontSize: fonts.md,
  },
  comment: {
    marginHorizontal: spacing.sm + spacing.xs,
    marginTop: spacing.sm,
    marginBottom: spacing.md - spacing.xs,
  },
  commentUserText: {
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
    marginBottom: 2,
  },
  commentText: {
    fontFamily: fonts.primary,
    fontSize: fonts.md,
  },
});

export default HomeScreen;
