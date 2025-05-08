import { useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { RecipeContext, UserContext } from "../Contexts";
import { spacing, fonts, colors } from "../styles";
import { CommentButton, LikeButton } from "./Buttons";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";
import SectionHeader from "./SectionHeader";
import IngredientList from "./IngredientList";
import StepList from "./StepList";
import { ref, db, getNextId } from "../firebaseConfig";
import { set } from "firebase/database";

const RecipeDetails = ({ editable, onSave }) => {
  const [recipe, setRecipe] = useContext(RecipeContext);
  const [userId, setUserId] = useContext(UserContext);

  const uploadImage = async () => {
    const cloudName = "djrpuf5yu";
    const api = "https://api.cloudinary.com/v1_1/djrpuf5yu/image/upload";

    const imageData = new FormData();
    imageData.append("file", {
      uri: recipe.uri,
      type: "image/jpeg",
      name: "upload.jpg",
    }); // TODO: Parameters seem hardcoded?
    imageData.append("upload_preset", "Flavorfind");
    imageData.append("cloud_name", cloudName);

    try {
      const res = await fetch(api, {
        method: "POST",
        body: imageData,
      });
      const result = await res.json();

      if (result.secure_url) {
        Alert.alert("Upload Successful!");
        setRecipe({ ...recipe, uri: result.secure_url });
        return result.secure_url;
      } else {
        throw new Error("No secure URL in response");
      }
    } catch (err) {
      console.error("Upload failed: ", err);
    }
  };

  const saveRecipe = async () => {
    const ingredientsValid = recipe.ingredients.every(
      (ingredient) => ingredient.name.trim() && ingredient.amount.trim(),
    );
    const stepsValid = recipe.steps.every((step) => step.trim());

    if (
      !recipe.title.trim() ||
      !recipe.description.trim() ||
      !ingredientsValid ||
      !stepsValid
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!recipe.uri) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    let recipeId = recipe.id;
    let newRecipe = recipe;
    if (!recipe.id) {
      await uploadImage();
      recipeId = await getNextId("posts");
      newRecipe = { ...recipe, id: recipeId, userId: userId };
    }

    const recipesRef = ref(db, `posts/${recipeId}`);
    set(recipesRef, newRecipe);
    setRecipe(null);
  };

  return (
    <View style={styles.container}>
      <EditableImage editable={editable} />
      <View style={styles.buttons}>
        <LikeButton size={28} color="black" />
        <CommentButton size={28} color="black" />
      </View>
      <View
        style={[
          { marginBottom: spacing.sm },
          editable ? styles.editDescription : {},
        ]}
      >
        <EditableText
          multiline
          rows={6}
          isEditable={editable}
          placeholder="Add Description"
          style={styles.description}
          value={recipe?.description}
          onChangeText={(text) => setRecipe({ ...recipe, description: text })}
        />
      </View>
      <View style={styles.list}>
        <SectionHeader text="INGREDIENTS" />
        <IngredientList editable={editable} />
      </View>
      <View style={styles.list}>
        <SectionHeader text="STEPS" />
        <StepList editable={editable} />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={saveRecipe}>
        <Text style={styles.saveButtonText}>SAVE RECIPE</Text>
      </TouchableOpacity>
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
  buttons: {
    flexDirection: "row",
    marginHorizontal: spacing.xs,
    marginBottom: spacing.sm + spacing.xs,
    gap: spacing.md + spacing.sm,
  },
  description: {
    marginHorizontal: spacing.xs,
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
  },
  editDescription: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.highlight,
    borderRadius: 10,
  },
  list: {
    marginBottom: spacing.sm,
  },
  saveButton: {
    alignSelf: "flex-end",
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.highlight,
    borderRadius: 10,
  },
  saveButtonText: {
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
  },
});

export default RecipeDetails;
