import { View, FlatList } from "react-native";
import RecipePost from "./RecipePost";

const RecipeFeed = ({ itemStyle, data, onPress }) => {
  const renderItem = ({ item }) => {
    return (
      <View style={itemStyle}>
        <RecipePost recipe={item} onPress={() => onPress(item)} />
      </View>
    );
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
};

export default RecipeFeed;
