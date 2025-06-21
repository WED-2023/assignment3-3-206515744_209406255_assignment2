<template>
  <div class="container">
    <div v-if="loading" class="text-center mt-4">
      <p>Loading preparation details...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger mt-4">
      {{ error }}
    </div>
    <div v-else>
      <div class="prep-header mt-3 mb-4 text-center">
        <h1>{{ recipe.title }}</h1>
        <img :src="recipe.image" class="center" />
      </div>
      <div class="servings-control mb-3 text-center">
        <label for="servings"><strong>Servings:</strong></label>
        <input type="number" id="servings" v-model.number="servings" min="1" class="form-control d-inline-block ml-2" style="width: 80px;" />
      </div>
      <div class="steps">
        <div v-for="step in recipe.preparationSteps" :key="step.stepNumber" class="step mb-4">
          <h4>Step {{ step.stepNumber }}</h4>
          <p>{{ step.instruction }}</p>
          <div v-if="step.equipment.length">
            <strong>Equipment:</strong>
            <ul>
              <li v-for="(item, idx) in step.equipment" :key="idx">{{ item }}</li>
            </ul>
          </div>
          <div v-if="step.ingredients.length">
            <strong>Ingredients:</strong>
            <ul>
              <li v-for="(ing, idx) in step.ingredients" :key="idx">
                {{ formatAmount(ing.amount) }} {{ ing.unit }} {{ ing.name }}
                <span v-if="ing.description"> - {{ ing.description }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipe: null,
      loading: false,
      error: "",
      servings: 1,
    };
  },
  async created() {
    this.loading = true;
    try {
      const id = this.$route.params.recipeId;
      const res = await window.axios.get(`/recipes/${id}/preparation`);
      this.recipe = res.data;
      this.servings = this.recipe.numberOfPortions || 1;
    } catch (err) {
      this.error = err.response?.data?.message || 'Failed to load preparation details.';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatAmount(amount) {
      // if no amount provided, return empty string
      if (amount == null) return '';
      const total = this.recipe.numberOfPortions || 1;
      const ratio = total > 0 ? this.servings / total : 1;
      const val = amount * ratio;
      return Math.round(val * 100) / 100;
    }
  }
};
</script>

<style scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 50%;
}
.alert {
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}
.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
</style>
