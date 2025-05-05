import { StyleSheet, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export const LikeButton = ({ size, color }) => {
  return (
    <View style={styles.basic}>
      <FontAwesome name="heart-o" size={size} color={color} />
    </View>
  );
};

export const CommentButton = ({ size, color }) => {
  return (
    <View style={styles.basic}>
      <FontAwesome name="comment-o" size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  basic: {
    width: 53,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
