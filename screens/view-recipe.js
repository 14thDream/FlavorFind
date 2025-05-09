import { useState, useRef, useEffect, useContext } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import RecipeNavigationHeader from "../components/RecipeNavigationHeader";
import RecipeDetails from "../components/RecipeDetails";
import { spacing } from "../styles";
import CommentSection from "../components/CommentSection";
import { RecipeContext, ScrollEffectContext } from "../Contexts";
import { ref, db } from "../firebaseConfig";
import { child, get, set } from "firebase/database";

const RecipeView = ({ isEditable, scrollToComments, afterScroll }) => {
  const [recipe, setRecipe] = useContext(RecipeContext);
  const [editable, setEditable] = useState(isEditable);
  const scrollRef = useRef(null);
  const [targetCoordinates, setTargetCoordinates] = useState(null);

  const deleteRecipe = async () => {
    const recipeRef = ref(db, `posts/${recipe.id}`);

    const likesRef = child(recipeRef, "likedBy");
    const snapshotLikes = await get(likesRef);

    if (snapshotLikes.exists()) {
      const likes = Object.keys(snapshotLikes.val());

      const userRef = ref(db, "users");
      const snapshotUsers = await get(userRef);
      likes.forEach((id) => {
        const likeRef = child(userRef, `${id}/likes/posts/${recipe.id}`);
        set(likeRef, null);
      });
    }

    set(recipeRef, null);
    setRecipe(null);
  };

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
            <RecipeNavigationHeader
              editable={editable}
              onEdit={setEditable}
              onDelete={deleteRecipe}
            />
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
