<template>
  <div class="recipe-image-container">
    <img
      v-if="recipe.image"
      :src="recipe.image"
      class="card-img-top recipe-image"
      alt="Recipe image"
    />
    <div v-else class="no-image-placeholder">
      <i class="fas fa-utensils"></i>
    </div>
    
    <!-- Clickable indicator overlay -->
    <div class="clickable-indicator">
      <i class="fas fa-eye"></i>
      <span>Click to view</span>
    </div>
    
    <!-- Recipe indicators overlay -->
    <div class="recipe-indicators">
      <!-- Viewed indicator (Spoonacular recipes only) -->
      <div v-if="isViewed && !isUserRecipesRoute && !isFamilyRecipesRoute" class="indicator viewed-indicator" title="You've viewed this recipe">
        👁️
      </div>
      
      <!-- Favorite indicator (Spoonacular recipes only) -->
      <div v-if="isFavorited && !isUserRecipesRoute && !isFamilyRecipesRoute" class="indicator favorite-indicator" title="You've favorited this recipe">
        ❤️
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
</template>

<script>
export default {
  name: "RecipeImageSection",
  props: {
    recipe: {
      type: Object,
      required: true
    },
    isViewed: {
      type: Boolean,
      default: false
    },
    isFavorited: {
      type: Boolean,
      default: false
    },
    isUserRecipesRoute: {
      type: Boolean,
      default: false
    },
    isFamilyRecipesRoute: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.recipe-image-container {
  position: relative;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

.no-image-placeholder {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.recipe-card:hover .no-image-placeholder {
  transform: scale(1.05);
}

/* Clickable indicator overlay */
.clickable-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 123, 255, 0.9);
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease-in-out;
  z-index: 3;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  min-width: 160px;
  text-align: center;
  white-space: nowrap;
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

  .clickable-indicator {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    min-width: 140px;
  }
}
</style>
