import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { db, ref, set } from "../firebaseConfig";
import { get, child } from "firebase/database";
import { getId } from "firebase/installations";
import { getDatabase } from "firebase/database";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.head_text}>Sign in to FlavorFind</Text>
      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email Address"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title="Sign In"
        onPress={() => verifyLogin(email.toLowerCase(), password)}
        color="#6200ea"
      />
    </View>
  );
};

const verifyLogin = async (email, password) => {
  const currEmail = email.toLowerCase();
  const db = getDatabase();
  const dbRef = ref(db);

  const snapshot = await get(child(dbRef, "users"));

  if (snapshot.exists()) {
    const users = snapshot.val();
    const foundUser = Object.values(users).find(
      (user) => user.email === currEmail && user.password === password
    );

    if (foundUser) {
      Alert.alert(
        "Login successful, Welcome back, " + foundUser.firstName + "!"
      );
    } else {
      Alert.alert(
        "Login failed, Incorrect password or Email. Please try again."
      );
    }
  }
};

const checkIfEmailExisting = async (email) => {
  try {
    const snapshot = await get(child(ref(db), "users"));
    if (snapshot.exists()) {
      const users = snapshot.val(); // Get all users from the snapshot
      const emailExists = Object.values(users).some(
        (user) => user.email === email
      );

      if (emailExists) {
        //Alert.alert("Email found within the database: " + email);
        return true;
      } else {
        // Alert.alert("Email not found within the database: " + email);
        return false;
      }
    }
  } catch (error) {
    console.error("Error checking email: ", error);
    // Alert.alert("Error", "Failed to check email");
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alightItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  head_text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
});

export default LoginScreen;
