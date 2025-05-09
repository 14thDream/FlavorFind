import { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ref, db } from "../firebaseConfig";
import { get } from "firebase/database";
import { fonts } from "../styles";

const Comment = ({ data, style }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async (id) => {
      const userRef = ref(db, `users/${id}`);
      const snapshot = await get(userRef);
      const username = snapshot.exists() ? snapshot.val().username : "Deleted";
      setUsername(username);
    };

    fetchUsername(data.userId);
  }, [data]);

  return (
    <View style={style}>
      <Text style={styles.username}>@{username}</Text>
      <Text style={styles.message}>{data.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  username: {
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
    marginBottom: 2,
  },
  message: {
    fontFamily: fonts.primary,
    fontWeight: "bold",
  },
});

export default Comment;
