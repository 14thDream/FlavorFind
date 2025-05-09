import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { CommentButton, LikeButton } from "./Buttons";
import { colors, fonts, spacing } from "../styles";
import { ref, db } from "../firebaseConfig";
import { get } from "firebase/database";

const RecipePost = ({ recipe, onPress, onCommentPress }) => {
  const [username, setUsername] = useState("");
  useEffect(() => {
    const fetchUsername = async (id) => {
      const userRef = ref(db, `users/${id}`);
      const user = await get(userRef);
      setUsername(user.val().username);
    };

    fetchUsername(recipe.userId);
  }, [recipe.userId]);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={[styles.text, styles.usernameText]}>@{username}</Text>
      <Text style={[styles.text, styles.titleText]}>{recipe.title}</Text>
      <Image style={styles.image} source={{ uri: recipe.uri }} />
      <View style={styles.bar}>
        <LikeButton size={24} path={`posts/${recipe.id}`} />
        <CommentButton size={24} color="black" onPress={onCommentPress} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "1fr",
    minHeight: 286,
    borderRadius: 10,
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
  },
  text: {
    fontFamily: fonts.primary,
    fontSize: fonts.sm,
    fontWeight: "bold",
    marginHorizontal: spacing.sm,
  },
  usernameText: {
    marginVertical: spacing.xs,
  },
  titleText: {
    fontSize: fonts.md,
  },
  image: {
    width: "1fr",
    height: 210,
    borderRadius: 10,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.sm,
  },
  bar: {
    flexDirection: "row",
    marginHorizontal: spacing.sm + spacing.xs,
    paddingVertical: spacing.xs,
    gap: spacing.md + spacing.sm,
  },
});

export default RecipePost;
