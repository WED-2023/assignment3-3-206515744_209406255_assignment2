<template>
  <div class="card h-100 recipe-card">
    <div class="recipe-image-container">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        class="card-img-top recipe-image"
        alt="Recipe image"
        @click="goToRecipe"
      />
    </div>
    
    <div class="card-body text-center" @click="goToRecipe">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text">{{ recipe.readyInMinutes }} minutes</p>
      
      <!-- Action buttons in their own row -->
      <div class="action-buttons-row">
        <!-- Like button -->
        <ActionButton
          :item-id="recipe.id"
          action-type="like"
          :initial-active-state="isLiked"
          active-emoji="❤️"
          inactive-emoji="🤍"
          color="red"
          size="medium"
          active-tooltip="Remove from liked"
          inactive-tooltip="Add to liked"
          add-endpoint="/users/liked"
          @action-changed="onActionChanged"
          @click.stop
        />
        
        <!-- Favorite button -->
        <ActionButton
          :item-id="recipe.id"
          action-type="favorite"
          :initial-active-state="isFavorited"
          active-emoji="⭐"
          inactive-emoji="☆"
          color="yellow"
          size="medium"
          active-tooltip="Remove from favorites"
          inactive-tooltip="Add to favorites"
          add-endpoint="/users/favorites"
          @action-changed="onActionChanged"
          @click.stop
        />
        
        <!-- Delete button (only show if showDeleteButton prop is true) -->
        <button
          v-if="showDeleteButton"
          type="button"
          class="btn btn-danger btn-sm delete-recipe-btn"
          @click.stop="deleteRecipe"
          title="Delete recipe"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ActionButton from './ActionButton.vue';

export default {
  name: "RecipePreview",
  components: {
    ActionButton
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
  data() {
    return {
      isLiked: false,
      isFavorited: false,
      stateLoaded: false
    };
  },
  async mounted() {
    await this.loadRecipeState();
  },
  methods: {
    async loadRecipeState() {
      // If user is not logged in, don't check state
      if (!window.store || !window.store.username) {
        this.stateLoaded = true;
        return;
      }

      try {
        // Check if recipe has pre-set state from parent (for optimization)
        if (this.recipe.liked !== undefined) {
          this.isLiked = this.recipe.liked;
        } else {
          // Fetch user's liked recipes to check if this recipe is liked
          await this.checkLikedState();
        }

        if (this.recipe.favorited !== undefined) {
          this.isFavorited = this.recipe.favorited;
        } else {
          // Fetch user's favorite recipes to check if this recipe is favorited
          await this.checkFavoritedState();
        }
      } catch (error) {
        console.error('Error loading recipe state:', error);
      } finally {
        this.stateLoaded = true;
      }
    },

    async checkLikedState() {
      try {
        const response = await window.axios.get('/users/liked');
        const likedRecipes = response.data.recipes || response.data || [];
        this.isLiked = likedRecipes.some(r => r.id === this.recipe.id);
      } catch (error) {
        console.error('Error checking liked state:', error);
        this.isLiked = false;
      }
    },

    async checkFavoritedState() {
      try {
        const response = await window.axios.get('/users/favorites');
        const favoriteRecipes = response.data.recipes || response.data || [];
        this.isFavorited = favoriteRecipes.some(r => r.id === this.recipe.id);
      } catch (error) {
        console.error('Error checking favorited state:', error);
        this.isFavorited = false;
      }
    },

    goToRecipe() {
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
        this.isLiked = data.isActive;
      } else if (data.actionType === 'favorite') {
        this.isFavorited = data.isActive;
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
    box-shadow 0.2s ease-in-out;
  position: relative;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.recipe-image-container {
  position: relative;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
}

.card-body {
  cursor: pointer;
  padding: 1rem;
}

.card-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.card-text {
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.action-buttons-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.delete-recipe-btn {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-recipe-btn:hover {
  background-color: #c82333;
  border-color: #bd2130;
}
</style>
