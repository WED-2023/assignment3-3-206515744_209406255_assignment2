<template>
  <div class="form-section">
    <h5><i class="fas fa-leaf"></i> Dietary Information</h5>
    <div class="dietary-checkboxes">
      <div class="form-check form-check-inline">
        <input
          id="vegan"
          :checked="recipeData.vegan"
          class="form-check-input"
          type="checkbox"
          name="vegan"
          @change="updateRecipe('vegan', $event.target.checked)"
        >
        <label class="form-check-label" for="vegan">
          Vegan
        </label>
      </div>
      
      <div class="form-check form-check-inline">
        <input
          id="vegetarian"
          :checked="recipeData.vegetarian"
          class="form-check-input"
          type="checkbox"
          name="vegetarian"
          @change="updateRecipe('vegetarian', $event.target.checked)"
        >
        <label class="form-check-label" for="vegetarian">
          Vegetarian
        </label>
      </div>
      
      <div class="form-check form-check-inline">
        <input
          id="glutenFree"
          :checked="recipeData.glutenFree"
          class="form-check-input"
          type="checkbox"
          name="glutenFree"
          @change="updateRecipe('glutenFree', $event.target.checked)"
        >
        <label class="form-check-label" for="glutenFree">
          Gluten Free
        </label>
      </div>
      
      <div class="form-check form-check-inline">
        <input
          id="favorite"
          :checked="recipeData.favorite"
          class="form-check-input"
          type="checkbox"
          name="favorite"
          @change="updateRecipe('favorite', $event.target.checked)"
        >
        <label class="form-check-label" for="favorite">
          Mark as Favorite
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeDietaryInfoForm",
  props: {
    recipeData: {
      type: Object,
      required: true
    }
  },
  emits: ['update-recipe'],
  methods: {
    updateRecipe(field, value) {
      this.$emit('update-recipe', { field, value });
    }
  }
}
</script>

<style scoped>
.form-section {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #28a745;
}

.form-section h5 {
  color: #28a745;
  margin-bottom: 1rem;
  font-weight: 600;
}

.form-section h5 i {
  margin-right: 0.5rem;
}

.dietary-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-check {
  margin-bottom: 0;
}

.form-check-input {
  margin-right: 0.5rem;
}

.form-check-label {
  font-weight: 500;
  cursor: pointer;
}

@media (max-width: 576px) {
  .dietary-checkboxes {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
