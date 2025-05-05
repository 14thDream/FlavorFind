import { View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export const LikeButton = ({ size, color }) => {
  return (
    <View>
      <FontAwesome name="heart-o" size={size} color={color} />
    </View>
  );
};

export const CommentButton = ({ size, color }) => {
  return (
    <View>
      <FontAwesome name="comment-o" size={size} color={color} />
    </View>
  );
};
