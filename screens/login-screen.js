import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { db, ref, set } from "../firebaseConfig";
import { get, child } from "firebase/database";
import { getId } from "firebase/installations";
import { getDatabase } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const verifyLogin = async (email, password) => {
    const currEmail = email.toLowerCase();
    const db = getDatabase();
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "users"));
    if (snapshot.exists()) {
      const users = snapshot.val();
      const foundUser = Object.values(users).find(
        (user) => user.email === currEmail && user.password === password,
      );

      if (foundUser) {
        Alert.alert(
          "Login successful, Welcome back, " + foundUser.firstName + "!",
        );
        navigation.navigate("Tabs");
      } else {
        Alert.alert(
          "Login failed, Incorrect password or Email. Please try again.",
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Text style={styles.title_text}>FlavorFind</Text>
        <Text style={styles.secondary_title_text}>Login</Text>

        <View style={styles.input_box}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email Address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.sign_in}
          onPress={() => verifyLogin(email.toLowerCase(), password)}
        >
          <Text style={styles.sign_in_text}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center", // was misspelled as alightItems
  },

  container2: {
    backgroundColor: "white",
    height: "60%",
    width: "100%",
    borderRadius: 40,
    padding: 20,
    justifyContent: "center",
    flex: 1,
  },

  title_text: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },

  secondary_title_text: {
    fontSize: 28,
    textAlign: "left",
    fontWeight: "bold",
    color: "#444",
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
  },

  input_box: {
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },

  sign_in: {
    height: 50,
    width: 100,
    backgroundColor: "#FFDB64",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  sign_in_text: {
    fontFamily: "Oswald",
    fontSize: 20,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default LoginScreen;
