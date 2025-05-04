import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { db, ref } from "../firebaseConfig";
import { get, child } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigator = useNavigation();

  const verifyLogin = async (email, password) => {
    const snapshot = await get(child(ref(db), "users"));
    if (!snapshot.exists()) {
      return;
    }

    const users = snapshot.val();
    const foundUser = Object.values(users).find(
      (user) => user.email === email && user.password === password,
    );

    if (foundUser) {
      Alert.alert(
        "Login successful, Welcome back, " + foundUser.firstName + "!",
      );
      navigator.navigate("Main");
    } else {
      Alert.alert(
        "Login failed, Incorrect password or Email. Please try again.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Text style={styles.titleText}>FlavorFind</Text>
        <Text style={styles.secondaryTitleText}>Login</Text>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email Address"
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.signIn}
          onPress={() => verifyLogin(email.toLowerCase(), password)}
        >
          <Text style={styles.signInText}>Login</Text>
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
    alignItems: "center",
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
  titleText: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  secondaryTitleText: {
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
  inputBox: {
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
  signIn: {
    height: 50,
    width: 100,
    backgroundColor: "#FFDB64",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  signInText: {
    fontFamily: "Oswald",
    fontSize: 20,
    color: "black",
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default LoginScreen;
