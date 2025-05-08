import { StyleSheet, View, Text } from "react-native";
import { spacing, colors, fonts } from "../styles";

const SectionHeader = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm + spacing.xs,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.highlight,
    borderRadius: 10,
  },
  text: {
    fontFamily: fonts.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SectionHeader;
