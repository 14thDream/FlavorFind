import { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "./Buttons";
import EditableText from "./EditableText";
import { RecipeContext, UserContext } from "../Contexts";
import { spacing, fonts, colors } from "../styles";
import { ref, db } from "../firebaseConfig";
import { get } from "firebase/database";

const RecipeNavigationHeader = ({ editable, onEdit, onDelete }) => {
  const [recipe, setRecipe] = useContext(RecipeContext);
  const [userId, setUserId] = useContext(UserContext);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async (id) => {
      const userRef = ref(db, `users/${id}`);
      const snapshot = await get(userRef);
      const username = snapshot.exists() ? snapshot.val().username : "Deleted";
      setUsername(username);
    };

    if (recipe) {
      fetchUsername(recipe.userId);
    } else {
      fetchUsername(userId);
    }
  }, []);

  return (
    <View style={styles.container}>
      {recipe?.id ? (
        <IconButton
          name="arrow-back-circle"
          Icon={Ionicons}
          size={30}
          color="black"
          onPress={() => setRecipe(null)}
          style={styles.backButton}
        />
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.username}>@{username}</Text>
        <EditableText
          isEditable={editable}
          placeholder="Add Title"
          value={recipe?.title}
          onChangeText={(title) => setRecipe({ ...recipe, title: title })}
          style={styles.title}
        />
      </View>
      {recipe?.userId === userId && (
        <View style={styles.ownedRecipeButtons}>
          <IconButton
            Icon={Ionicons}
            name={editable ? "checkmark" : "pencil"}
            size={28}
            color={editable ? "green" : "red"}
            onPress={() => onEdit(!editable)}
          />
          <IconButton
            Icon={Ionicons}
            name="trash"
            size={28}
            color="red"
            onPress={onDelete}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
    borderWidth: 2,
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
  ownedRecipeButtons: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: spacing.sm,
  },
});

export default RecipeNavigationHeader;
