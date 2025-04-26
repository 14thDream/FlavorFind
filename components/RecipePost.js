import { StyleSheet, View, Text, Image } from "react-native";
import { BasicButton } from "./Buttons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { colors, fonts, spacing } from "../styles";

const RecipePost = ({ username, title, uri }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>@{username}</Text>
      <Text style={styles.text}>{title}</Text>
      <Image style={styles.image} source={{ uri: uri }} />
      <View style={styles.bar}>
        <BasicButton>
          <FontAwesome name="heart-o" size={18} color="black" />
        </BasicButton>
        <BasicButton>
          <FontAwesome name="comment-o" size={18} color="black" />
        </BasicButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "1fr",
    height: 286,
    borderRadius: 10,
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
  },
  text: {
    fontFamily: fonts.primary,
    fontSize: fonts.sm,
    fontWeight: "bold",
    marginHorizontal: spacing.sm,
  },
  image: {
    width: "1fr",
    height: 210,
    borderRadius: 10,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.sm,
  },
  bar: {
    flexDirection: "row",
    marginHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    columnGap: spacing.sm,
  },
});

export default RecipePost;
