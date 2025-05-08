import { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import { RecipeContext } from "../Contexts";
import { spacing, colors, fonts } from "../styles";

const EditableImage = ({ editable }) => {
  const [recipe, setRecipe] = useContext(RecipeContext);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <View style={styles.container}>
      {editable ? (
        <Pressable
          style={styles.pressable}
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
        >
          <ImageBackground style={styles.image} source={{ uri: recipe.uri }}>
            {isHovered || !recipe.uri ? (
              <View style={styles.whileHovered}>
                <Text style={styles.whileHoverText}>Insert Picture</Text>
              </View>
            ) : null}
          </ImageBackground>
        </Pressable>
      ) : (
        <Image style={styles.image} source={{ uri: recipe.uri }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    height: 269,
    marginBottom: spacing.xs,
    borderRadius: 10,
    overflow: "hidden",
  },
  pressable: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  whileHovered: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.highlight,
    opacity: 0.75,
  },
  whileHoverText: {
    fontFamily: fonts.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditableImage;
