import { View, Pressable } from "react-native";
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

export const IconButton = ({ Icon, name, size, color, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => {
        const iconName = `${name}${pressed ? "" : "-outline"}`;
        return <Icon name={iconName} size={size} color={color} />;
      }}
    </Pressable>
  );
};
