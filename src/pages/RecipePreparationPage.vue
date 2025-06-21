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
      <!-- Single step view -->
      <RecipePreparationComponent
        v-if="recipe.preparationSteps.length"
        :step="recipe.preparationSteps[currentStepIndex]"
        :current="currentStepIndex + 1"
        :total="recipe.preparationSteps.length"
        @prev="prevStep"
        @next="nextStep"
        @toggleComplete="toggleCompleteStep"
        :completed="entry.completedSteps[currentStepIndex]"
      />
    </div>
  </div>
</template>

<script>
import RecipePreparationComponent from "../components/RecipePreparationComponent.vue";
export default {
  components: { RecipePreparationComponent },
  data() {
    return {
      recipe: null,
      loading: false,
      error: "",
      servings: 1,
      currentStepIndex: 0
    };
  },
  async created() {
    this.loading = true;
    try {
      const id = this.$route.params.recipeId;
      const res = await window.axios.get(`/recipes/${id}/preparation`);
      this.recipe = res.data;
      this.servings = this.recipe.numberOfPortions || 1;
      this.currentStepIndex = 0;
      // initialize meal plan steps in store
      window.store.initMealPlanSteps(this.recipe.id, this.recipe.preparationSteps.length);
    } catch (err) {
      this.error = err.response?.data?.message || 'Failed to load preparation details.';
    } finally {
      this.loading = false;
    }
  },
  computed: {
    entry() {
      return window.store.mealPlan.find(r => r.id === this.recipe.id) || { completedSteps: [], totalSteps: 0 };
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
    },
    prevStep() {
      if (this.currentStepIndex > 0) this.currentStepIndex--;
    },
    nextStep() {
      if (this.currentStepIndex < this.recipe.preparationSteps.length - 1)
        this.currentStepIndex++;
    },
    toggleCompleteStep() {
      // toggle completion in store
      window.store.toggleMealPlanStep(this.recipe.id, this.currentStepIndex);
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
