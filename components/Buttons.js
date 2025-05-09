import { useState, useMemo, useContext, useEffect, useCallback } from "react";
import { View, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { UserContext } from "../Contexts";
import { ref, db } from "../firebaseConfig";
import { get, set } from "firebase/database";
import { useFocusEffect } from "@react-navigation/native";

export const LikeButton = ({ size, path }) => {
  const [userId, setUserId] = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);

  const toggleLiked = async () => {
    const likedByRef = ref(db, `${path}/likedBy/${userId}`);
    const userRef = ref(db, `users/${userId}/likes/${path}`);

    set(likedByRef, isLiked ? null : true);
    set(userRef, isLiked ? null : true);
    setIsLiked(!isLiked);
  };

  const fetchLikes = async () => {
    const likedByRef = ref(db, `${path}/likedBy`);
    const snapshot = await get(likedByRef);
    const isLiked = snapshot.exists() && snapshot.val()[userId];
    setIsLiked(isLiked);
  };

  useEffect(() => {
    fetchLikes();
  }, [path]);

  useFocusEffect(useCallback(fetchLikes, [path]));

  return (
    <View>
      <Pressable onPress={toggleLiked}>
        <FontAwesome
          name={isLiked ? "heart" : "heart-o"}
          size={size}
          color={isLiked ? "red" : "black"}
        />
      </Pressable>
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

export const IconButton = ({ Icon, name, size, color, style, onPress }) => {
  return (
    <Pressable style={style} onPress={onPress}>
      {({ pressed }) => {
        const iconName = `${name}${pressed ? "" : "-outline"}`;
        return <Icon name={iconName} size={size} color={color} />;
      }}
    </Pressable>
  );
};
