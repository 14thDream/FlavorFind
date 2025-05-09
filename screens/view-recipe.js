import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import RecipeNavigationHeader from "../components/RecipeNavigationHeader";
import RecipeDetails from "../components/RecipeDetails";
import { spacing } from "../styles";
import CommentSection from "../components/CommentSection";
import { ScrollEffectContext } from "../Contexts";

const RecipeView = ({ isEditable, scrollToComments, afterScroll }) => {
  const [editable, setEditable] = useState(isEditable);
  const scrollRef = useRef(null);
  const [targetCoordinates, setTargetCoordinates] = useState(null);

  useEffect(() => {
    if (!scrollToComments || !scrollRef || !targetCoordinates) {
      return;
    }

    scrollRef.current?.scrollTo(targetCoordinates);
    afterScroll();
  }, [scrollToComments, scrollRef, targetCoordinates]);

  return (
    <View style={styles.container}>
      <ScrollEffectContext.Provider
        value={{
          scrollRef: scrollRef,
          targetCoordinates: targetCoordinates,
          setTargetCoordinates: setTargetCoordinates,
        }}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollingContainer}
          stickyHeaderIndices={[0]}
        >
          <View style={styles.header}>
            <RecipeNavigationHeader editable={editable} onEdit={setEditable} />
          </View>
          <RecipeDetails editable={editable} />
          <CommentSection />
        </ScrollView>
      </ScrollEffectContext.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.sm,
  },
  scrollingContainer: {
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
});

export default RecipeView;
