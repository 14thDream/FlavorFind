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
import EditableText from "./EditableText";

const RecipeView = ({ id, editable, onClose }) => {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [recipe, setRecipe] = useState({});

  const [newIngredient, setNewIngredient] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newStep, setNewStep] = useState("");

  const listStyle = editable
    ? StyleSheet.compose(styles.list, { marginRight: 0 })
    : styles.list;

  const handleIngredientsChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const handleStepsChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };

  const addStep = () => {
    if (!newStep.trim()) {
      return;
    }

    const updatedSteps = [...steps, newStep];
    setSteps(updatedSteps);

    setNewStep("");
  };

  const deleteIngredient = (index) => {
    const remainingIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(remainingIngredients);
  };

  const deleteStep = (index) => {
    const remainingSteps = steps.filter((_, i) => i !== index);
    setSteps(remainingSteps);
  };

  useEffect(() => {
    const loadRecipe = async (id) => {
      const recipeRef = ref(db, `posts/${id}`);
      const snapshot = await get(recipeRef);

      const recipe = snapshot.val();
      setRecipe(recipe);
      setTitle(recipe.title);
      setDescription(recipe.description);

      const ingredients = recipe?.ingredients
        ? Object.values(recipe.ingredients)
        : [];
      setIngredients(ingredients);

      const steps = recipe?.steps ? Object.values(recipe.steps) : [];
      setSteps(steps);

      const userRef = ref(db, `users/${recipe.userId}`);
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
    const listener = onValue(ref(db, `posts/${id}/comments`), (snapshot) => {
      const comments = Object.values(snapshot.val());
      setComments(comments);
    });

    return () => listener();
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
          <Text style={styles.username}>{username}</Text>
          <EditableText
            editable={editable}
            placeholder="Add Title"
            value={title}
            onChangeText={setTitle}
            style={styles.title}
          />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Image style={styles.image} source={{ uri: recipe.uri }} />
          <View style={styles.buttons}>
            <LikeButton size={28} color="black" />
            <CommentButton size={28} color="black" />
          </View>
          <EditableText
            multiline
            rows={6}
            editable={editable}
            placeholder="Add Description"
            value={description}
            onChangeText={setDescription}
            style={styles.description}
          />
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>Ingredients</Text>
          </View>
          <View style={listStyle}>
            {ingredients.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.listIndent}>•</Text>
                <EditableText
                  editable={editable}
                  style={styles.ingredientName}
                  placeholder="Add Ingredient"
                  value={ingredients[index].name}
                  onChangeText={(value) =>
                    handleIngredientsChange(index, "name", value)
                  }
                />
                <Text style={styles.ingredientSeparator}>:</Text>
                <View style={styles.ingredientAmount}>
                  <EditableText
                    editable={editable}
                    style={styles.listText}
                    placeholder="Enter amount"
                    value={ingredients[index].amount}
                    onChangeText={(value) =>
                      handleIngredientsChange(index, "amount", value)
                    }
                  />
                </View>
                {editable ? (
                  <IconButton
                    Icon={Ionicons}
                    name="remove"
                    size={24}
                    color="red"
                    style={styles.removeButton}
                    onPress={() => deleteIngredient(index)}
                  />
                ) : null}
              </View>
            ))}
          </View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>Steps</Text>
          </View>
          <View style={listStyle}>
            {steps.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.listIndent}>{index + 1}.</Text>
                <EditableText
                  editable={editable}
                  placeholder="Add step"
                  value={steps[index]}
                  style={styles.listText}
                  onChangeText={(value) => handleStepsChange(index, value)}
                />
                {editable ? (
                  <IconButton
                    Icon={Ionicons}
                    name="remove"
                    size={24}
                    color="red"
                    style={styles.removeButton}
                    onPress={() => deleteStep(index)}
                  />
                ) : null}
              </View>
            ))}
            {editable ? (
              <TextInput
                placeholder="Add step"
                value={newStep}
                onChangeText={setNewStep}
                onEndEditing={addStep}
                style={styles.listText}
              />
            ) : null}
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.commentInput}>
            <TextInput
              multiline
              rows={1}
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
  row: {
    flexDirection: "row",
  },
  listIndent: {
    marginRight: spacing.sm,
  },
  ingredientSeparator: {
    flex: 1,
    textAlign: "center",
  },
  ingredientName: {
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
    flex: 9,
  },
  ingredientAmount: {
    flex: 3,
  },
  list: {
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
    gap: spacing.xs,
  },
  listText: {
    flex: 1,
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
  removeButton: {
    marginLeft: spacing.xs,
    marginRight: spacing.sm,
  },
});

export default RecipeView;
