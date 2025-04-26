import { StyleSheet, SafeAreaView, View, Text, TextInput } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { spacing, fonts } from "../styles";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>FlavorFind</Text>
        <TextInput style={styles.headerSearchBar} placeholder="Search Recipe" />
        <FontAwesome name="search" size={24} color="black" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: spacing.xs,
    gap: spacing.sm,
  },
  headerText: {
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
  },
  headerSearchBar: {
    flex: 1,
  },
});

export default HomeScreen;
