import {
  useContext,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, fonts } from "../styles";
import { IconButton } from "./Buttons";
import { RecipeContext, ScrollEffectContext, UserContext } from "../Contexts";
import { ref, db, getNextId } from "../firebaseConfig";
import { onValue, set } from "firebase/database";
import Comment from "./Comment";

const CommentSection = () => {
  const [userId, setUserId] = useContext(UserContext);
  const [recipe, setRecipe] = useContext(RecipeContext);

  const [commentList, setCommentList] = useState({});
  const [comment, setComment] = useState("");

  const commentRef = useRef(null);
  const { setTargetCoordinates } = useContext(ScrollEffectContext);

  const sendComment = async () => {
    if (!comment.trim()) {
      return;
    }

    const commentPath = `posts/${recipe.id}/comments`;
    const id = await getNextId(commentPath);

    const newComment = {
      id: id,
      userId: userId,
      message: comment,
    };

    const commentRef = ref(db, `${commentPath}/${userId}`);
    set(commentRef, newComment);
    setComment("");
  };

  useEffect(() => {
    const commentsRef = ref(db, `posts/${recipe.id}/comments`);
    const listener = onValue(commentsRef, (snapshot) => {
      const comments = snapshot.exists() ? Object.values(snapshot.val()) : [];
      setCommentList(comments);
    });

    return () => listener();
  }, [recipe]);

  useLayoutEffect(() => {
    commentRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setTargetCoordinates({ x: x, y: y });
    });
  }, [commentList]);

  return (
    <View ref={commentRef} style={styles.container}>
      <View style={styles.input}>
        <TextInput
          multiline
          rows={1}
          placeholder="Add comment"
          value={comment}
          onChangeText={setComment}
          blurOnSubmit // submitBehavior does not trigger onSubmitEditing
          onSubmitEditing={() => sendComment(comment)}
          style={styles.inputText}
        />
        <IconButton
          Icon={Ionicons}
          name="caret-forward"
          size={28}
          color="black"
          onPress={() => sendComment(comment)}
        />
      </View>
      <FlatList
        data={commentList}
        keyExtractor={(comment) => comment.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Comment data={item} style={styles.comment} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    padding: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm + spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.highlight,
    borderRadius: 20,
  },
  inputText: {
    flex: 1,
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
  },
  comment: {
    marginHorizontal: spacing.xs,
    marginTop: spacing.sm,
    marginBottom: spacing.md - spacing.xs,
  },
});

export default CommentSection;
