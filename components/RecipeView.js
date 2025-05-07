import { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Text,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import { LikeButton, CommentButton, IconButton } from "./Buttons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { get, set, onValue } from "firebase/database";
import { ref, db, getNextId } from "../firebaseConfig";
import { spacing, colors, fonts } from "../styles";
import { UserContext } from "../Contexts";

const RecipeView = ({ id, mode, onClose }) => {
  const [username, setUsername] = useState("");
  const [recipe, setRecipe] = useState({});
  const ingredients = recipe?.ingredients
    ? Object.values(recipe.ingredients)
    : [];
  const steps = recipe?.steps ? Object.values(recipe.steps) : [];

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
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          name="arrow-back-circle"
          Icon={Ionicons}
          size={30}
          color="black"
          onPress={onClose}
          style={styles.backButton}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>@{username}</Text>
          <TextInput editable style={styles.title} value={recipe.title} />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Image style={styles.image} source={{ uri: recipe.uri }} />
          <View style={styles.buttons}>
            <LikeButton size={28} color="black" />
            <CommentButton size={28} color="black" />
          </View>
          <Text style={styles.description}>{recipe.description}</Text>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>Ingredients</Text>
          </View>
          <View style={styles.list}>
            {ingredients.map((item, index) => (
              <Text key={index} style={styles.listText}>
                • {item.name} : {item.amount}
              </Text>
            ))}
          </View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>Steps</Text>
          </View>
          <View style={styles.list}>
            {steps.map((item, index) => (
              <Text key={index} style={styles.listText}>
                {index + 1}. {item}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.card}>
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
    <View style={styles.commentContainer}>
      <Text style={styles.commentUsername}>@{username}</Text>
      <Text style={styles.commentText}>{data.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  username: {
    fontFamily: fonts.primary,
    fontSize: fonts.sm,
    fontWeight: "bold",
  },
  title: {
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
  },
  backButton: {
    marginRight: spacing.xs,
  },
  card: {
    alignSelf: "stretch",
    margin: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  image: {
    height: 269,
    alignSelf: "stretch",
    borderRadius: 10,
    marginHorizontal: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  buttons: {
    flexDirection: "row",
    marginHorizontal: spacing.sm + spacing.xs,
    marginBottom: spacing.sm + spacing.xs,
    gap: spacing.md + spacing.sm,
  },
  description: {
    marginHorizontal: spacing.sm + spacing.xs,
    marginBottom: spacing.sm,
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
  },
  sectionHeader: {
    marginTop: spacing.sm + spacing.xs,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.highlight,
    borderRadius: 10,
  },
  sectionText: {
    fontFamily: fonts.primary,
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  list: {
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
    gap: spacing.xs,
  },
  listText: {
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
  commentContainer: {
    marginHorizontal: spacing.sm + spacing.xs,
    marginTop: spacing.sm,
    marginBottom: spacing.md - spacing.xs,
  },
  commentUsername: {
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

export default RecipeView;
