<template>
  <div class="recipe-info-section">
    <!-- Recipe time and score info -->
    <div class="recipe-info">
      <p class="card-text time-info">
        <i class="fas fa-clock"></i> 
        <span class="info-label">Time to prepare:</span>
        <span class="info-value">{{ recipe.readyInMinutes }} min</span>
      </p>
      <p v-if="recipe.spoonacularScore && !isUserRecipesRoute && !isFamilyRecipesRoute" class="card-text score-info">
        <i class="fas fa-star"></i> 
        <span class="info-label">Score:</span>
        <span class="info-value">{{ Math.round(recipe.spoonacularScore) }}/100</span>
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
}

.recipe-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 8px;
  border: 1px solid #e9ecef;
  position: relative;
  z-index: 2;
}

.time-info,
.score-info {
  color: #495057;
  font-size: 0.875rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.4;
}

.time-info i {
  color: #007bff;
  min-width: 16px;
}

.score-info i {
  color: #ffc107;
  min-width: 16px;
}

.info-label {
  font-weight: 500;
  color: #6c757d;
}

.info-value {
  font-weight: 600;
  color: #212529;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .recipe-info {
    padding: 0.5rem;
    gap: 0.375rem;
  }

  .time-info,
  .score-info {
    font-size: 0.8rem;
  }

  .info-label {
    font-size: 0.75rem;
  }
}
</style>
