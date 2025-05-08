import { useContext, useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { spacing, colors, fonts } from "../styles";
import { RecipeContext } from "../Contexts";
import { IconButton } from "./Buttons";
import EditableText from "./EditableText";

const IngredientList = ({ editable }) => {
  const [recipe, setRecipe] = useContext(RecipeContext);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const addIngredient = () => {
    if (!name.trim() || !amount.trim()) {
      return;
    }

    const newIngredient = { name: name, amount: amount };
    const updatedIngredients = [
      ...Object.values(recipe.ingredients),
      newIngredient,
    ];

    setRecipe({ ...recipe, ingredients: updatedIngredients });
    setName("");
    setAmount("");
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = recipe.ingredients;
    updatedIngredients[index][field] = value;

    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const deleteIngredient = (index) => {
    const remainingIngredients = recipe.ingredients.filter(
      (_, i) => i !== index
    );

    setRecipe({ ...recipe, ingredients: remainingIngredients });
  };

  return (
    <View style={styles.container}>
      {recipe.ingredients.map((ingredient, index) => (
        <View style={styles.item}>
          <View style={styles.nameContainer}>
            <Text style={styles.indent}>•</Text>
            <EditableText
              isEditable={editable}
              style={styles.text}
              placeholder="Add Ingredient"
              value={ingredient.name}
              onChangeText={(value) =>
                handleIngredientChange(index, "name", value)
              }
            />
          </View>
          <Text style={styles.separator}>:</Text>
          <View style={styles.amountContainer}>
            <EditableText
              isEditable={editable}
              style={styles.text}
              placeholder="Enter Amount"
              value={ingredient.amount}
              onChangeText={(value) =>
                handleIngredientChange(index, "amount", value)
              }
            />
          </View>
          {editable ? (
            <IconButton
              Icon={Ionicons}
              name="remove"
              size={24}
              color="red"
              style={styles.button}
              onPress={() => deleteIngredient(index)}
            />
          ) : null}
        </View>
      ))}
      {editable ? (
        <View style={styles.newItem}>
          <View style={styles.nameContainer}>
            <TextInput
              placeholder="Add Name"
              placeholderTextColor="gray"
              value={name}
              onChangeText={setName}
              onBlur={addIngredient}
              style={styles.input}
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.amountContainer}>
            <TextInput
              placeholder="Enter Amount"
              placeholderTextColor="gray"
              value={amount}
              onChangeText={setAmount}
              onBlur={addIngredient}
              style={styles.input}
            />
          </View>
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
  nameContainer: {
    flex: 9,
    flexDirection: "row",
  },
  amountContainer: {
    flex: 4,
  },
  separator: {
    flex: 1,
    textAlign: "center",
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

export default IngredientList;
