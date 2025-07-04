<template>
  <div class="container fade-in">
    <div v-if="loading" class="text-center mt-4">
      <div class="loading-animation">
        <div class="spinner"></div>
        <p class="pulse-text">Loading preparation details...</p>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger mt-4 slide-in-left">
      {{ error }}
    </div>
    <div v-else class="slide-in-up">
      <div class="prep-header mt-3 mb-4 text-center">
        <h1 class="fade-in-down">{{ recipeTitle }}</h1>
        <div class="image-container">
          <img 
            v-if="recipe.image" 
            :src="recipe.image" 
            class="center recipe-image hover-lift" 
            :alt="recipeTitle"
          />
          <div v-else class="center no-image-placeholder hover-lift pulse-slow">
            <i class="fas fa-utensils"></i>
            <p>No image available</p>
          </div>
        </div>
      </div>
      <div v-if="!isFamilyRecipe" class="servings-control mb-3 text-center">
        <label for="servings"><strong>Servings:</strong></label>
        <input 
          type="number" 
          id="servings" 
          v-model.number="servings" 
          min="1" 
          class="form-control d-inline-block ml-2 hover-scale" 
          style="width: 80px;" 
        />
      </div>
      <!-- Single step view -->
      <div class="step-wrapper fade-in-up-delayed">
        <RecipePreparationComponent
          v-if="recipe.preparationSteps.length"
          :step="recipe.preparationSteps[currentStepIndex]"
          :current="currentStepIndex + 1"
          :total="recipe.preparationSteps.length"
          :servings-ratio="servingsRatio"
          @prev="prevStep"
          @next="nextStep"
          @toggleComplete="toggleCompleteStep"
          :completed="entry.completedSteps[currentStepIndex]"
        />
      </div>
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
      
      // Determine API endpoint based on route
      const isUserRecipe = this.$route.path.includes('/users/my-recipes/');
      const isFamilyRecipe = this.$route.path.includes('/users/family-recipes/');
      
      let endpoint;
      if (isUserRecipe) {
        endpoint = `/users/my-recipes/${id}/preparation`;
      } else if (isFamilyRecipe) {
        endpoint = `/users/family-recipes/${id}/preparation`;
      } else {
        endpoint = `/recipes/${id}/preparation`;
      }
      
      const res = await window.axios.get(endpoint);
      this.recipe = res.data;
      this.servings = this.recipe.numberOfPortions || this.recipe.servings || 1;
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
    },
    isFamilyRecipe() {
      return this.$route.path.includes('/users/family-recipes/');
    },
    recipeTitle() {
      if (this.isFamilyRecipe && this.recipe.familyMember && this.recipe.occasion) {
        return `${this.recipe.familyMember}'s ${this.recipe.occasion} Recipe`;
      }
      return this.recipe.title || 'Recipe';
    },
    servingsRatio() {
      if (!this.recipe) return 1;
      const originalServings = this.recipe.numberOfPortions || this.recipe.servings || 1;
      return this.servings / originalServings;
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

.no-image-placeholder {
  margin: 2rem auto;
  padding: 3rem;
  background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
  color: white;
  text-align: center;
  border-radius: 10px;
  max-width: 400px;
}

.no-image-placeholder i {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
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
