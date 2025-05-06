import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Pressable,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { db, getNextId, ref, set } from "../firebaseConfig";
import { get, child } from "firebase/database";
import { colors, spacing, fonts } from "../styles";

import {
  PoetsenOne_400Regular,
  useFonts,
} from "@expo-google-fonts/poetsen-one";
import { Oswald_400Regular } from "@expo-google-fonts/oswald";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";

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

SplashScreen.preventAutoHideAsync();

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigator = useNavigation();

  const [loaded, error] = useFonts({
    PoetsenOne_400Regular,
    Oswald_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const addDataToRealtimeDatabase = async () => {
    const id = await getNextId("users"); // Get the next available ID
    const emailExists = await checkIfEmailExisting(email.toLowerCase()); // Check if email already exists

    if (emailExists) {
      Alert.alert(
        "Error",
        "Email already exists. Please use a different email.",
      );
      return;
    }

    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      Alert.alert("Error", "Password does not match.");
      return;
    }

    try {
      await set(ref(db, `users/${id}`), {
        id: id,
        username: username,
        email: email.toLowerCase(),
        password: password,
        createdAt: new Date().toISOString(),
      });
      Alert.alert("Success", "User added successfully!");
      setUsername("");
      setEmail("");
      setPassword("");
      navigator.goBack();
    } catch (error) {
      console.error("Error adding user: ", error);
      Alert.alert("Error", "Failed to add user");
    }
  };

  const Background = require("../assets/images/authentication-background.jpg");

  return (
    <View style={styles.container}>
      <ImageBackground
        source={Background}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <Pressable style={styles.backButton} onPress={() => navigator.goBack()}>
          <MaterialCommunityIcons
            name="chevron-double-left"
            size={48}
            color="black"
          />
        </Pressable>
        <View style={styles.card}>
          <Text style={styles.logoText}>FlavorFind</Text>
          <Text style={styles.signUpText}>Sign Up</Text>
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="username"
              onChangeText={setUsername}
              style={styles.input}
            />
            <TextInput
              placeholder="email"
              onChangeText={setEmail}
              style={styles.input}
            />
            <TextInput
              placeholder="password"
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
            />
            <TextInput
              placeholder="confirm password"
              secureTextEntry
              onChangeText={setConfirmPassword}
              style={styles.input}
            />
          </View>
          <TouchableOpacity
            onPress={addDataToRealtimeDatabase}
            style={styles.signUpButton}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  background: {
    width: "100%",
    height: "100%",
    paddingHorizontal: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    opacity: 0.2,
  },
  card: {
    width: "100%",
    opacity: 1,
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  logoText: {
    marginTop: spacing.xl,
    fontSize: 48,
    fontFamily: fonts.primary,
    fontWeight: "bold",
  },
  signUpText: {
    alignSelf: "flex-start",
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    fontSize: 40,
    fontFamily: fonts.stylized,
  },
  inputGroup: {
    alignSelf: "stretch",
    marginHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  input: {
    alignSelf: "stretch",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 20,
    fontFamily: fonts.body,
  },
  signUpButton: {
    height: 40,
    alignSelf: "stretch",
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg + spacing.md,
    marginBottom: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  signUpButtonText: {
    fontSize: 20,
    fontFamily: fonts.body,
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default RegisterScreen;
