import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { db, ref, set } from "../firebaseConfig";
import { get, child } from "firebase/database";
import { getId } from "firebase/installations";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const findUserByEmail = async (email) => {};

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.head_text}>FlavorFind User Sign In</Text>/
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
        title="Add Data"
        onPress={() => checkIfEmailExisting(email)}
        color="#6200ea"
      />
    </View>
  );
};

const checkIfEmailExisting = async (email) => {
  try {
    const snapshot = await get(child(ref(db), "users"));
    if (snapshot.exists()) {
      const users = snapshot.val(); // Get all users from the snapshot
      const emailExists = Object.values(users).some(
        (user) => user.email === email
      ); // Check if any user has the same email
      if (emailExists) {
        Alert.alert("Email found within the database: " + email);
        return true;
      } else {
        Alert.alert("Email not found within the database: " + email);
        return false;
      }
    }
  } catch (error) {
    console.error("Error checking email: ", error);
    Alert.alert("Error", "Failed to check email");
  }
};

const checkIfCorrectPassword = async (email, password) => {
  try {
  } catch (error) {
    console.error("Error checking password: ", error);
    Alert.alert("Error", "Failed to check password");
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
