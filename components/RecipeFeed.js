import { StyleSheet, View, FlatList } from "react-native";
import RecipePost from "./RecipePost";
import { spacing } from "../styles";

const RecipeFeed = ({ data, onPress }) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.post}>
          <RecipePost
            userId={item.userId}
            title={item.title}
            uri={item.uri}
            onPress={() => onPress(item.id)}
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  post: {
    margin: spacing.sm,
  },
});

export default RecipeFeed;
