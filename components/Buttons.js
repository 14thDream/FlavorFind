import { StyleSheet, View } from "react-native";

export const BasicButton = ({ children }) => {
  return <View style={styles.basicButton}>{children}</View>;
};

const styles = StyleSheet.create({
  basicButton: {
    width: 53,
    height: 21,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
