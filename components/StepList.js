import { useContext, useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { spacing, colors, fonts } from "../styles";
import { RecipeContext } from "../Contexts";
import { IconButton } from "./Buttons";
import EditableText from "./EditableText";

const StepList = ({ editable }) => {
  const [recipe, setRecipe] = useContext(RecipeContext);
  const [step, setStep] = useState("");

  const addStep = () => {
    if (!step.trim()) {
      return;
    }

    const updatedSteps = [
      ...Object.values(recipe.steps ? recipe.steps : []),
      step,
    ];

    setRecipe({ ...recipe, steps: updatedSteps });
    setStep("");
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = recipe.steps;
    updatedSteps[index] = value;

    setRecipe({ ...recipe, steps: updatedSteps });
  };

  const deleteStep = (index) => {
    const remainingSteps = recipe.steps.filter((_, i) => i !== index);

    setRecipe({ ...recipe, steps: remainingSteps });
  };

  return (
    <View style={styles.container}>
      {recipe?.steps?.map((step, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.indent}>{index + 1}.</Text>
          <EditableText
            isEditable={editable}
            style={styles.text}
            placeholder="Add Step"
            value={step}
            onChangeText={(value) => handleStepChange(index, value)}
          />
          {editable ? (
            <IconButton
              Icon={Ionicons}
              name="remove"
              size={24}
              color="red"
              style={styles.button}
              onPress={() => deleteStep(index)}
            />
          ) : null}
        </View>
      ))}
      {editable ? (
        <View style={styles.newItem}>
          <TextInput
            placeholder="Add Step"
            placeholderTextColor="gray"
            value={step}
            onChangeText={setStep}
            onBlur={addStep}
            style={styles.input}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: spacing.xs,
    gap: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  text: {
    flex: 1,
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
  },
  newItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    marginRight: 24,
  },
  indent: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
    backgroundColor: colors.highlight,
    borderRadius: 20,
  },
  button: {
    marginLeft: spacing.xs,
  },
});

export default StepList;
