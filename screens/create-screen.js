import { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { colors, spacing } from "../styles";
import { RecipeContext } from "../Contexts";
import RecipeDetails from "../components/RecipeDetails";
import RecipeNavigationHeader from "../components/RecipeNavigationHeader";

const CreateScreen = () => {
  const [recipe, setRecipe] = useState(null);

  return (
    <View style={styles.container}>
      <RecipeContext.Provider value={[recipe, setRecipe]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <RecipeNavigationHeader editable />
          </View>
          <RecipeDetails editable />
        </ScrollView>
      </RecipeContext.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.sm,
  },
  header: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
});

export default CreateScreen;
