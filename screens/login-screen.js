import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ImageBackground,
} from "react-native";
import { db, ref } from "../firebaseConfig";
import { get, child } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { spacing, colors, fonts } from "../styles";

import {
  PoetsenOne_400Regular,
  useFonts,
} from "@expo-google-fonts/poetsen-one";
import { Oswald_400Regular } from "@expo-google-fonts/oswald";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loaded, error] = useFonts({
    PoetsenOne_400Regular,
    Oswald_400Regular,
  });

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

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const Background = require("../assets/images/authentication-background.jpg");

  return (
    <View style={styles.container}>
      <ImageBackground
        source={Background}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.card}>
          <Text style={styles.logoText}>FlavorFind</Text>
          <Text style={styles.loginText}>Login</Text>
          <View style={styles.inputGroup}>
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
          </View>
          <TouchableOpacity
            onPress={() => verifyLogin(email, password)}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.noAccount}>
            <Text style={styles.noAccountText}>Don't have an account?</Text>
            <Pressable onPress={() => navigator.navigate("Register")}>
              <Text style={[styles.noAccountText, styles.signUpText]}>
                Sign Up
              </Text>
            </Pressable>
          </View>
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
  loginText: {
    alignSelf: "flex-start",
    marginHorizontal: spacing.lg,
    marginTop: spacing.md + spacing.sm,
    marginBottom: spacing.md,
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
    height: 40,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 20,
    fontFamily: fonts.body,
  },
  loginButton: {
    height: 40,
    alignSelf: "stretch",
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg + spacing.md,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loginButtonText: {
    fontSize: 20,
    fontFamily: fonts.body,
    textTransform: "uppercase",
  },
  noAccount: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: 60,
  },
  noAccountText: {
    fontSize: 18,
    fontFamily: fonts.body,
  },
  signUpText: {
    marginLeft: spacing.xs,
    color: colors.link,
  },
});

export default LoginScreen;
