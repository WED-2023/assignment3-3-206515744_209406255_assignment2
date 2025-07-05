<template>
  <div class="family-recipe-info-section">
    <!-- Recipe title -->
    <h5 class="card-title">{{ recipeTitle }}</h5>
    
    <!-- Family member and occasion info -->
    <div class="family-info">
      <span class="badge badge-primary">{{ recipe.occasion }}</span>
      <span v-if="recipe.familyMember" class="badge badge-secondary">{{ recipe.familyMember }}</span>
    </div>
    
    <!-- Recipe time info -->
    <div v-if="recipe.readyInMinutes" class="recipe-info">
      <p class="card-text time-info">
        <i class="fas fa-clock"></i> {{ recipe.readyInMinutes }} min
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "FamilyRecipeInfoSection",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  computed: {
    recipeTitle() {
      return this.recipe.title || `${this.recipe.familyMember}'s Recipe`;
    }
  }
}
</script>

<style scoped>
.family-recipe-info-section {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  margin-bottom: 1rem;
}

.family-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.badge {
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.badge-primary {
  background-color: #007bff;
  color: white;
}

.badge-secondary {
  background-color: #6c757d;
  color: white;
}

.recipe-info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
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
</style>
