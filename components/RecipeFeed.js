import { View, FlatList } from "react-native";
import RecipePost from "./RecipePost";

const RecipeFeed = ({
  itemStyle,
  data,
  scrollEnabled = true,
  onPress,
  onCommentPress,
}) => {
  const renderItem = ({ item }) => {
    return (
      <View style={itemStyle}>
        <RecipePost
          recipe={item}
          onPress={() => onPress(item)}
          onCommentPress={() => {
            onPress(item);
            onCommentPress();
          }}
        />
      </View>
    );
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
};

export default RecipeFeed;
