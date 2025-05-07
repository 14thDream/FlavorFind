import { StyleSheet, View, Text, TextInput } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { colors, spacing, fonts } from "../styles";

const SearchHeader = ({ size, color, onChangeText }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="menu" size={size} color={color} />
      <Text style={styles.text}>FlavorFind</Text>
      <TextInput
        style={styles.bar}
        placeholder="Search Recipe"
        onChangeText={onChangeText}
      />
      <FontAwesome name="search" size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    padding: spacing.xs,
    gap: spacing.sm,
    backgroundColor: colors.primary,
  },
  headerText: {
    fontFamily: fonts.primary,
    fontSize: fonts.md,
    fontWeight: "bold",
  },
  bar: {
    flex: 1,
    paddingHorizontal: spacing.xs,
    fontFamily: fonts.primary,
    borderWidth: 1,
  },
});

export default SearchHeader;
