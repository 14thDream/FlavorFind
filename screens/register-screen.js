import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { db, ref, set } from "../firebaseConfig";
import { get, child } from "firebase/database";

const getNextId = async () => {
  const snapshot = await get(child(ref(db), "users"));
  if (!snapshot.exists()) {
    return 1;
  }

  const users = snapshot.val();
  const keys = Object.keys(users);

  const validIds = keys.map((id) => parseInt(id)).filter((id) => !isNaN(id));
  return validIds.length > 0 ? Math.max(...validIds) + 1 : 1;
};

const checkIfEmailExisting = async (email) => {
  try {
    const snapshot = await get(child(ref(db), "users"));
    if (!snapshot.exists()) {
      return;
    }

    const users = snapshot.val(); // Get all users from the snapshot
    return Object.values(users).some((user) => user.email === email); // Check if any user has the same email
  } catch (error) {
    console.error("Error checking email: ", error);
    Alert.alert("Error", "Failed to check email");
  }
};

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const addDataToRealtimeDatabase = async () => {
    const id = await getNextId(); // Get the next available ID
    const emailExists = await checkIfEmailExisting(email.toLowerCase()); // Check if email already exists

    if (emailExists) {
      Alert.alert(
        "Error",
        "Email already exists. Please use a different email.",
      );
      return;
    }

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await set(ref(db, `users/${id}`), {
        id: id,
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        password: password,
        createdAt: new Date().toISOString(),
      });
      Alert.alert("Success", "Data added successfully!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Failed to add data");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.head_text}>FlavorFind User Registration</Text>/
      <Text style={styles.label}>First Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <Text style={styles.label}>Last Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
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
        onPress={() => addDataToRealtimeDatabase()}
        color="#6200ea"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
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

export default RegisterScreen;
