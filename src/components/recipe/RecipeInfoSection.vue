<template>
  <div class="recipe-info-section">
    <!-- Recipe title -->
    <h5 class="card-title">{{ recipe.title }}</h5>
    
    <!-- Recipe time and score info -->
    <div class="recipe-info">
      <p class="card-text time-info">
        <i class="fas fa-clock"></i> {{ recipe.readyInMinutes }} min
      </p>
      <p v-if="recipe.spoonacularScore && !isUserRecipesRoute && !isFamilyRecipesRoute" class="card-text score-info">
        <i class="fas fa-star"></i> {{ Math.round(recipe.spoonacularScore) }}/100
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeInfoSection",
  props: {
    recipe: {
      type: Object,
      required: true
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
.recipe-info-section {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  margin-bottom: 1rem;
}

.recipe-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
}

.recipe-info:has(.time-info:only-child) {
  justify-content: center;
}

/* Fallback for browsers that don't support :has() */
.recipe-info .time-info:only-child {
  margin: 0 auto;
}

.time-info {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.time-info i {
  color: #007bff;
}

.score-info {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 600;
}

.score-info i {
  color: #ffc107;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .recipe-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
