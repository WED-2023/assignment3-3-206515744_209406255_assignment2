<template>
  <div 
    class="card h-100 recipe-card clickable-card"
    role="button"
    tabindex="0"
    :aria-label="`View recipe: ${recipe.title}`"
    @click="goToRecipe"
    @keydown.enter="goToRecipe"
    @keydown.space.prevent="goToRecipe"
  >
    <RecipeImageSection
      :recipe="recipe"
      :is-viewed="isViewed"
      :is-favorited="isFavorited"
      :is-user-recipes-route="isUserRecipesRoute"
      :is-family-recipes-route="isFamilyRecipesRoute"
    />
    
    <div class="card-body text-center clickable-area">
      <!-- Recipe title (grows to take available space) -->
      <h5 class="card-title">{{ recipe.title }}</h5>
      
      <!-- Bottom fixed container for info and actions -->
      <div class="bottom-actions">
        <RecipeInfoSection
          :recipe="recipe"
          :is-user-recipes-route="isUserRecipesRoute"
          :is-family-recipes-route="isFamilyRecipesRoute"
        />
        
        <RecipeActionsSection
          :recipe-id="recipe.id"
          :is-liked="isLiked"
          :is-favorited="isFavorited"
          :is-user-recipes-route="isUserRecipesRoute"
          :is-family-recipes-route="isFamilyRecipesRoute"
          :show-delete-button="showDeleteButton"
          @action-changed="onActionChanged"
          @delete-click="deleteRecipe"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RecipeImageSection from './RecipeImageSection.vue';
import RecipeInfoSection from './RecipeInfoSection.vue';
import RecipeActionsSection from './RecipeActionsSection.vue';
import { useRecipeState } from '../../composables/useRecipeState.js';

export default {
  name: "RecipePreview",
  components: {
    RecipeImageSection,
    RecipeInfoSection,
    RecipeActionsSection
  },
  props: {
    recipe: {
      type: Object,
      required: true
    },
    customRoutePrefix: {
      type: String,
      default: '/recipes'
    },
    showDeleteButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['recipe-action-changed', 'recipe-deleted'],
  setup(props) {
    const {
      isLiked,
      isFavorited,
      isViewed,
      stateLoaded,
      loadRecipeState,
      updateLikedState,
      updateFavoritedState,
      updateViewedState
    } = useRecipeState(props.recipe);

    return {
      isLiked,
      isFavorited,
      isViewed,
      stateLoaded,
      loadRecipeState,
      updateLikedState,
      updateFavoritedState,
      updateViewedState
    };
  },
  computed: {
    isUserRecipesRoute() {
      return this.customRoutePrefix === '/users/my-recipes';
    },
    isFamilyRecipesRoute() {
      return this.customRoutePrefix === '/users/family-recipes' || this.$route.path.includes('/family-recipes');
    }
  },
  async mounted() {
    await this.loadRecipeState();
  },
  methods: {
    async goToRecipe() {
      // Track view if user is logged in and recipe hasn't been viewed yet
      if (window.store && window.store.username && !this.isViewed) {
        try {
          await window.axios.post('/users/last-view', {
            recipe_id: parseInt(this.recipe.id)
          });
          
          // Update local state
          this.updateViewedState(true);
          
          console.log('Recipe view tracked successfully');
        } catch (error) {
          console.error('Error tracking recipe view:', error);
          // Continue with navigation even if tracking fails
        }
      }

      // Use custom route prefix if provided, otherwise default to /recipes
      const route = `${this.customRoutePrefix}/${this.recipe.id}`;
      console.log('Navigating to:', route);
      this.$router.push(route);
    },
    
    async deleteRecipe() {
      if (!confirm(`Are you sure you want to delete "${this.recipe.title}"? This action cannot be undone.`)) {
        return;
      }

      try {
        console.log('Deleting recipe:', this.recipe.id);
        
        const response = await window.axios.delete(`/users/my-recipes/`, {
          data: { recipe_id: this.recipe.id }
        });
        
        if (response.data.success || response.status === 200) {
          // Show success message
          if (window.toast) {
            window.toast("Success", "Recipe deleted successfully!", "success");
          }
          
          // Emit event to parent to remove recipe from list
          this.$emit('recipe-deleted', {
            recipeId: this.recipe.id,
            recipeName: this.recipe.title
          });
        } else {
          throw new Error(response.data.message || "Failed to delete recipe");
        }
        
      } catch (error) {
        console.error("Failed to delete recipe:", error);
        
        let errorMessage = "Failed to delete recipe. Please try again.";
        if (error.response?.status === 404) {
          errorMessage = "Recipe not found or already deleted.";
        } else if (error.response?.status === 403) {
          errorMessage = "You don't have permission to delete this recipe.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        if (window.toast) {
          window.toast("Error", errorMessage, "error");
        } else {
          alert(errorMessage);
        }
      }
    },
    
    onActionChanged(data) {
      console.log('Recipe action changed:', data);
      
      // Update local state based on the action
      if (data.actionType === 'like') {
        this.updateLikedState(data.isActive);
      } else if (data.actionType === 'favorite') {
        this.updateFavoritedState(data.isActive);
      }
      
      // Emit event to parent component
      this.$emit('recipe-action-changed', {
        recipeId: this.recipe.id,
        actionType: data.actionType,
        isActive: data.isActive
      });
    }
  }
}
</script>

<style scoped>
.recipe-card {
  cursor: pointer;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out,
    border-color 0.2s ease-in-out;
  position: relative;
  border: 2px solid #e9ecef;
}

.recipe-card.clickable-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #007bff;
}

.recipe-card.clickable-card:hover .clickable-indicator {
  opacity: 1;
  visibility: visible;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

.recipe-card:hover .no-image-placeholder {
  transform: scale(1.05);
}

.card-body {
  cursor: pointer;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  min-height: 180px; /* Ensure consistent minimum height */
}

.card-title {
  flex-grow: 1; /* Allow title to take up available space */
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Container to push info and actions to bottom */
.bottom-actions {
  margin-top: auto; /* This pushes the content to the bottom */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Add spacing between info section and actions */
}

/* Add a subtle pulse animation to indicate interactivity */
@keyframes pulse-border {
  0% {
    border-color: #e9ecef;
  }
  50% {
    border-color: #007bff;
  }
  100% {
    border-color: #e9ecef;
  }
}

.recipe-card:focus-within {
  animation: pulse-border 2s ease-in-out infinite;
  outline: none;
}
</style>
