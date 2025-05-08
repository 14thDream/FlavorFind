import { useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { RecipeContext } from "../Contexts";
import { spacing, fonts, colors } from "../styles";
import { CommentButton, LikeButton } from "./Buttons";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";
import SectionHeader from "./SectionHeader";
import IngredientList from "./IngredientList";
import StepList from "./StepList";

const RecipeDetails = ({ editable, onSave }) => {
  const [recipe, setRecipe] = useContext(RecipeContext);

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
          value={recipe.description}
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
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
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
