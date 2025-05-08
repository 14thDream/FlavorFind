import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  Image,
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
import { UserContext } from "../Contexts";

const Background = require("../assets/images/authentication-background.jpg");
const DefaultProfileURL = "https://res.cloudinary.com/djrpuf5yu/image/upload/v1746711602/28-05_uaqupm.jpg";

const containsKeyword = (title, keyword) => {
  return title
    .toLowerCase()
    .split(" ")
    .some((word) => word.startsWith(keyword));
};

const isSearchableBy = (title, keywords) => {
  return keywords
    .toLowerCase()
    .split(" ")
    .every((keyword) => containsKeyword(title, keyword));
};

const ProfileScreen = () => {
 
  return (
    <View style={styles.container}>


        <View style={styles.container2}>
            <View style={styles.profile_box}>
                <Image source={{ uri: DefaultProfileURL }} style={styles.image} />
            </View>
            <Text style={styles.username_text}>@ + username goes here</Text>
        </View>


        
    </View>
  );
};






const styles = StyleSheet.create({
  profile_box: {
    height: '15%', // or any fixed height
    width: '50%',  // match the height for a square box
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 150,
    overflow: 'hidden', // ensures image is clipped within the border radius
  },
  
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // or 'contain' depending on the desired fit
  },
  username_text: {
    fontSize: 12, 
    fontFamily: fonts.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center', 
  },
  container2: {
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 5,
    marginTop: '20%',
    padding: 10, 
    height: '50%',
    width: '90%',
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
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 20,
    fontFamily: fonts.body,
  },
  loginButton: {
    minHeight: 40,
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

export default ProfileScreen;
