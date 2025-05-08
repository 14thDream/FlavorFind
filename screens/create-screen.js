import { useCallback, useContext, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { colors, spacing } from "../styles";
import { RecipeContext } from "../Contexts";
import RecipeDetails from "../components/RecipeDetails";
import RecipeNavigationHeader from "../components/RecipeNavigationHeader";
import { useFocusEffect } from "@react-navigation/native";

const CreateScreen = () => {
  const [recipe, setRecipe] = useContext(RecipeContext);

  // This might not be the best way to go about it.
  // But I want to clear the details on switch in.
  const [forceRenderKey, setForceRenderKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRecipe(null);
      setForceRenderKey((key) => !key);
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RecipeNavigationHeader key={forceRenderKey} editable />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <RecipeDetails key={forceRenderKey} editable />
      </ScrollView>
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
