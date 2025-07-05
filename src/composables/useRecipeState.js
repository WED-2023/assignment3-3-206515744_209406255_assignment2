import { ref } from "vue";

export function useRecipeState(recipe) {
  const isLiked = ref(false);
  const isFavorited = ref(false);
  const isViewed = ref(false);
  const stateLoaded = ref(false);

  const loadRecipeState = async () => {
    // If user is not logged in, don't check state
    if (!window.store || !window.store.username) {
      stateLoaded.value = true;
      return;
    }

    try {
      // Check if recipe has pre-set state from parent (for optimization)
      if (recipe.liked !== undefined) {
        isLiked.value = recipe.liked;
      } else {
        // Fetch user's liked recipes to check if this recipe is liked
        await checkLikedState();
      }

      if (recipe.favorited !== undefined) {
        isFavorited.value = recipe.favorited;
      } else {
        // Fetch user's favorite recipes to check if this recipe is favorited
        await checkFavoritedState();
      }

      // Check viewed state
      if (recipe.viewed !== undefined) {
        isViewed.value = recipe.viewed;
      } else {
        await checkViewedState();
      }
    } catch (error) {
      console.error("Error loading recipe state:", error);
    } finally {
      stateLoaded.value = true;
    }
  };

  const checkLikedState = async () => {
    try {
      const response = await window.axios.get("/users/liked");
      const likedRecipes = response.data.recipes || response.data || [];
      isLiked.value = likedRecipes.some((r) => r.id === recipe.id);
    } catch (error) {
      console.error("Error checking liked state:", error);
      isLiked.value = false;
    }
  };

  const checkFavoritedState = async () => {
    try {
      const response = await window.axios.get("/users/favorites");
      const favoriteRecipes = response.data.recipes || response.data || [];
      isFavorited.value = favoriteRecipes.some((r) => r.id === recipe.id);
    } catch (error) {
      console.error("Error checking favorited state:", error);
      isFavorited.value = false;
    }
  };

  const checkViewedState = async () => {
    try {
      const response = await window.axios.get("/users/viewed");
      const viewedRecipes = response.data.recipes || response.data || [];
      isViewed.value = viewedRecipes.some((r) => r.id === recipe.id);
    } catch (error) {
      console.error("Error checking viewed state:", error);
      isViewed.value = false;
    }
  };

  const updateLikedState = (newState) => {
    isLiked.value = newState;
  };

  const updateFavoritedState = (newState) => {
    isFavorited.value = newState;
  };

  const updateViewedState = (newState) => {
    isViewed.value = newState;
  };

  return {
    isLiked,
    isFavorited,
    isViewed,
    stateLoaded,
    loadRecipeState,
    updateLikedState,
    updateFavoritedState,
    updateViewedState,
  };
}
