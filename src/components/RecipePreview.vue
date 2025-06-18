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
      <div v-else class="no-image-placeholder" @click="goToRecipe">
        <i class="fas fa-utensils"></i>
      </div>
      
      <!-- Recipe indicators overlay -->
      <div class="recipe-indicators">
        <!-- Viewed indicator -->
        <div v-if="isViewed" class="indicator viewed-indicator" title="You've viewed this recipe">
          👁️
        </div>
        
        <!-- Vegan indicator -->
        <div v-if="recipe.vegan" class="indicator vegan-indicator" title="Vegan">
          🌱
        </div>
        
        <!-- Vegetarian indicator (only if not vegan) -->
        <div v-else-if="recipe.vegetarian" class="indicator vegetarian-indicator" title="Vegetarian">
          🥬
        </div>
        
        <!-- Gluten-free indicator -->
        <div v-if="recipe.glutenFree" class="indicator gluten-free-indicator" title="Gluten Free">
          🌾
        </div>
      </div>
    </div>
    
    <div class="card-body text-center" @click="goToRecipe">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text">{{ recipe.readyInMinutes }} minutes</p>
      
      <!-- Diet information row -->
      <div class="diet-info">
        <span v-if="recipe.vegan" class="diet-badge vegan">🌱 Vegan</span>
        <span v-else-if="recipe.vegetarian" class="diet-badge vegetarian">🥬 Vegetarian</span>
        <span v-if="recipe.glutenFree" class="diet-badge gluten-free">🌾 Gluten Free</span>
        <span v-if="isViewed" class="diet-badge viewed">👁️ Viewed</span>
      </div>
      
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
      isViewed: false,
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

        // Check viewed state
        if (this.recipe.viewed !== undefined) {
          this.isViewed = this.recipe.viewed;
        } else {
          await this.checkViewedState();
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

    async checkViewedState() {
      try {
        const response = await window.axios.get('/users/viewed');
        const viewedRecipes = response.data.recipes || response.data || [];
        this.isViewed = viewedRecipes.some(r => r.id === this.recipe.id);
      } catch (error) {
        console.error('Error checking viewed state:', error);
        this.isViewed = false;
      }
    },

    async goToRecipe() {
      // Track view if user is logged in and recipe hasn't been viewed yet
      if (window.store && window.store.username && !this.isViewed) {
        try {
          await window.axios.post('/users/last-view', {
            recipe_id: parseInt(this.recipe.id)
          });
          
          // Update local state
          this.isViewed = true;
          
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

.no-image-placeholder {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  cursor: pointer;
}

/* Recipe indicators overlay */
.recipe-indicators {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 2;
}

.indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.indicator:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 1);
}

.viewed-indicator {
  border-color: #6c757d;
}

.vegan-indicator {
  border-color: #28a745;
}

.vegetarian-indicator {
  border-color: #ffc107;
}

.gluten-free-indicator {
  border-color: #17a2b8;
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
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

/* Diet information badges */
.diet-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  min-height: 20px;
}

.diet-badge {
  background-color: #f8f9fa;
  color: #495057;
  padding: 0.15rem 0.4rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  border: 1px solid #dee2e6;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

.diet-badge.vegan {
  background-color: #d4eddd;
  color: #155724;
  border-color: #c3e6cb;
}

.diet-badge.vegetarian {
  background-color: #fff3cd;
  color: #856404;
  border-color: #ffeaa7;
}

.diet-badge.gluten-free {
  background-color: #d1ecf1;
  color: #0c5460;
  border-color: #bee5eb;
}

.diet-badge.viewed {
  background-color: #e2e3e5;
  color: #495057;
  border-color: #ced4da;
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

/* Responsive adjustments */
@media (max-width: 576px) {
  .recipe-indicators {
    top: 4px;
    right: 4px;
  }
  
  .indicator {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
  
  .diet-badge {
    font-size: 0.65rem;
    padding: 0.1rem 0.3rem;
  }
}
</style>
