import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { db, ref, set } from "../firebaseConfig";
import { get, child } from "firebase/database";
import { getId } from "firebase/installations";

const RegisterScreen = () => {
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const addDataToRealtimeDatabase = async () => {
    const nextId = await getIdCount(); // Get the next available ID
    const emailExists = await checkIfEmailExisting(email.toLowerCase()); // Check if email already exists
    if (emailExists) {
      Alert.alert(
        "Error",
        "Email already exists. Please use a different email.",
      );
      return;
    }
    let id = nextId.toString(); // Convert nextId to string for the database key
    if (
      !id.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      await set(ref(db, "users/" + id), {
        id: nextId,
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        password: password,
        createdAt: new Date().toISOString(),
      });
      Alert.alert("Success", "Data added successfully!");
      setId("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Failed to add data");
    }
  };

  const checkIfExisting = async (id) => {
    if (!id) return false;
    const snapshot = await get(child(ref(db), `users/${id}`));
    if (snapshot.exists()) return true;
    return false;
  };

  //Bad bad bad code, but it works for now. As long as we dont delete any users, it will work.
  const getIdCount = async () => {
    try {
      const snapshot = await get(child(ref(db), "users"));
      if (snapshot.exists()) {
        const users = snapshot.val();
        let nextId = Object.keys(users).length + 1; // Start with user count + 1
        // Keep incrementing if ID already exists
        while (await checkIfExisting(nextId.toString())) {
          nextId += 1;
        }
        return nextId;
      } else {
        return 1;
      }
    } catch (error) {
      console.error("Error fetching user count: ", error);
      Alert.alert("Error", "Failed to fetch user count");
      return null;
    }
  };

  const checkIfEmailExisting = async (email) => {
    try {
      const snapshot = await get(child(ref(db), "users"));
      if (snapshot.exists()) {
        const users = snapshot.val(); // Get all users from the snapshot
        const emailExists = Object.values(users).some(
          (user) => user.email === email,
        ); // Check if any user has the same email
        if (emailExists) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.error("Error checking email: ", error);
      Alert.alert("Error", "Failed to check email");
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
