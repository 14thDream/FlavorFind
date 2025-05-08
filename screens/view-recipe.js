import { useContext, useState } from "react";
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import RecipeNavigationHeader from "../components/RecipeNavigationHeader";
import RecipeDetails from "../components/RecipeDetails";
import { spacing } from "../styles";
import { RecipeContext } from "../Contexts";
import { ref, db } from "../firebaseConfig";
import { set } from "firebase/database";

const RecipeView = ({ isEditable }) => {
  const [editable, setEditable] = useState(isEditable);
  const [recipe, setRecipe] = useContext(RecipeContext);

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

  const saveRecipe = () => {
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

    if (!recipe.id) {
      uploadImage();
    }

    const recipesRef = ref(db, `posts/${recipe.id}`);
    set(recipesRef, recipe);
    setRecipe(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RecipeNavigationHeader editable={editable} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollingContainer}
      >
        <RecipeDetails editable={editable} onSave={saveRecipe} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.sm,
  },
  scrollingContainer: {
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
});

export default RecipeView;
