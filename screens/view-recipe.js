import { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import RecipeNavigationHeader from "../components/RecipeNavigationHeader";
import RecipeDetails from "../components/RecipeDetails";
import { spacing } from "../styles";

const RecipeView = ({ isEditable }) => {
  const [editable, setEditable] = useState(isEditable);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollingContainer}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.header}>
          <RecipeNavigationHeader editable={editable} onEdit={setEditable} />
        </View>
        <RecipeDetails editable={editable} />
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
