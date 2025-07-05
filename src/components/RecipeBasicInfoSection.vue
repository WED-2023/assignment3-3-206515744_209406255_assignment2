<template>
  <div class="recipe-basic-info mb-3">
    <div><strong>Ready in:</strong> {{ recipe.readyInMinutes }} minutes</div>
    <div v-if="recipe.spoonacularScore && !isUserOrFamilyRecipe">
      <strong>Spoonacular Score:</strong> {{ recipe.spoonacularScore }}
    </div>
    <div v-if="viewType === 'full' && recipe.numberOfPortions">
      <strong>Serves:</strong> {{ recipe.numberOfPortions }} portions
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeBasicInfoSection",
  props: {
    recipe: {
      type: Object,
      required: true
    },
    viewType: {
      type: String,
      required: true
    },
    isUserOrFamilyRecipe: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.recipe-basic-info {
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.recipe-basic-info div {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.recipe-basic-info div:last-child {
  margin-bottom: 0;
}
</style>
