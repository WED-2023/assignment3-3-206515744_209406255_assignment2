<template>
  <div class="container">
    <div v-if="loading" class="text-center mt-4">
      <p>Loading family recipe...</p>
    </div>
    
    <div v-if="recipe && !loading">
      <div class="recipe-header mt-3 mb-4">
        <h1>{{ recipe.familyMember }}'s {{ recipe.occasion }} Recipe</h1>
        <img 
          v-if="recipe.image" 
          :src="recipe.image" 
          class="center" 
          :alt="`${recipe.familyMember}'s recipe`"
        />
        <div v-else class="center no-image-placeholder">
          <i class="fas fa-utensils"></i>
          <p>No image available</p>
        </div>
        
        <!-- Family recipe badges -->
        <div class="diet-info mt-2">
          <span class="badge badge-primary">👨‍👩‍👧‍👦 Family Recipe</span>
          <span class="badge badge-success">{{ recipe.occasion }}</span>
        </div>
        
        <!-- Toggle for full/basic view -->
        <div class="view-toggle mt-3 text-center">
          <div class="form-check form-check-inline">
            <input 
              class="form-check-input" 
              type="radio" 
              name="viewType" 
              id="basicView" 
              value="basic"
              v-model="viewType"
            >
            <label class="form-check-label" for="basicView">
              Basic View
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input 
              class="form-check-input" 
              type="radio" 
              name="viewType" 
              id="fullView" 
              value="full"
              v-model="viewType"
            >
            <label class="form-check-label" for="fullView">
              Full Details
            </label>
          </div>
        </div>
      </div>
      
      <div class="recipe-body">
        <div class="wrapper">
          <div class="wrapped">
            <!-- Basic view information - always shown -->
            <div class="mb-3">
              <div><strong>Family Member:</strong> {{ recipe.familyMember }}</div>
              <div><strong>Special Occasion:</strong> {{ recipe.occasion }}</div>
            </div>
            
            <!-- Ingredients section - only show in full view -->
            <div v-if="viewType === 'full'" class="ingredients-section">
              <h4>Ingredients:</h4>
              <div v-if="!recipe.ingredients || recipe.ingredients.length === 0">
                <p>No ingredients available</p>
              </div>
              <ul v-else>
                <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
                  <span v-if="typeof ingredient === 'object'">
                    {{ ingredient.amount }} {{ ingredient.unit }} {{ ingredient.name }}
                    <span v-if="ingredient.description"> - {{ ingredient.description }}</span>
                  </span>
                  <span v-else>
                    {{ ingredient }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="wrapped">
            <!-- Instructions section - only show in full view -->
            <div v-if="viewType === 'full'" class="instructions-section">
              <h4>Instructions:</h4>
              <div v-if="!recipe.instructions || recipe.instructions.length === 0">
                <p>No instructions available</p>
              </div>
              <ol v-else>
                <li v-for="(instruction, index) in recipe.instructions" :key="index">
                  {{ instruction }}
                </li>
              </ol>
            </div>
            
            <!-- Equipment section - only show in full view -->
            <div v-if="viewType === 'full' && recipe.equipment && recipe.equipment.length > 0" class="equipment-section mt-3">
              <h4>Equipment needed:</h4>
              <ul>
                <li v-for="(item, index) in recipe.equipment" :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Message for basic view -->
        <div v-if="viewType === 'basic'" class="basic-view-message mt-4 text-center">
          <p class="text-muted">Switch to "Full Details" to see ingredients, instructions, and equipment details.</p>
        </div>
      </div>
      
      <!-- Prepare button -->
      <div class="text-center mb-4">
        <button class="btn btn-primary" @click="goToPreparation">Prepare this recipe</button>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="alert alert-danger mt-4">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FamilyRecipeViewPage',
  data() {
    return {
      recipe: null,
      loading: false,
      errorMessage: "",
      viewType: "basic"
    };
  },
  async created() {
    await this.loadRecipeData();
  },
  methods: {
    async loadRecipeData() {
      this.loading = true;
      this.errorMessage = "";
      
      try {
        const recipeId = this.$route.params.recipeId;
        console.log('Loading family recipe with ID:', recipeId);
        
        // Validate that we have a recipe ID
        if (!recipeId) {
          console.error('No recipe ID found in route params');
          this.$router.replace({ name: 'notFound' });
          return;
        }
        
        // Check if recipe data was passed via navigation state
        if (history.state && history.state.recipe) {
          console.log('Using recipe data from navigation state:', history.state.recipe);
          this.recipe = history.state.recipe;
          return;
        }
        
        // If no recipe data in state, try to get from parent component's data
        // This would happen if user navigates directly to URL or refreshes page
        console.log('No recipe data in navigation state, fetching from parent...');
        
        // Get family recipes from the API (same call as parent makes)
        const response = await window.axios.get('/users/family-recipes');
        
        if (response.status === 200) {
          const familyRecipes = response.data || [];
          
          // Find the specific recipe by ID
          const foundRecipe = familyRecipes.find(recipe => recipe.id.toString() === recipeId);
          
          if (foundRecipe) {
            console.log('Found recipe in family recipes list:', foundRecipe);
            this.recipe = foundRecipe;
          } else {
            console.error('Recipe not found in family recipes list');
            this.$router.replace({ name: 'notFound' });
          }
        } else {
          throw new Error('Failed to fetch family recipes');
        }
        
      } catch (error) {
        console.error("Failed to load family recipe:", error);
        if (error.response?.status === 404) {
          this.$router.replace({ name: 'notFound' });
        } else {
          this.errorMessage = error.response?.data?.message || "Failed to load family recipe. Please try again.";
        }
      } finally {
        this.loading = false;
      }
    },
    
    goToPreparation() {
      const id = this.recipe.id;
      // Only add if not already in meal plan
      const exists = window.store.mealPlan.some(r => r.id === id);
      if (!exists) {
        window.store.addToMealPlan({ 
          id, 
          title: `${this.recipe.familyMember}'s ${this.recipe.occasion} Recipe`, 
          image: this.recipe.image || '' 
        });
      }
      
      // Navigate to family recipe preparation route
      this.$router.push({ path: `/users/family-recipes/${id}/preparation` });
    }
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
  gap: 2rem;
}
.wrapped {
  width: 50%;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
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

.view-toggle {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f9f9f9;
  margin: 1rem auto;
  max-width: 300px;
}

.form-check-inline {
  margin-right: 2rem;
}

.form-check-input {
  margin-right: 0.5rem;
}

.ingredients-section, .instructions-section, .equipment-section {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.ingredients-section h3, .instructions-section h3, .equipment-section h3 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.basic-view-message {
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

/* Dietary badges styling (same as preview) */
.diet-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.badge {
  display: inline-block;
  padding: 0.25em 0.5em;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.375rem;
}

.badge-primary {
  color: #fff;
  background-color: #0d6efd;
}

.badge-success {
  color: #fff;
  background-color: #28a745;
}

.badge-warning {
  color: #212529;
  background-color: #ffc107;
}

.badge-info {
  color: #fff;
  background-color: #17a2b8;
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

.text-muted {
  color: #6c757d;
}

.recipe-header {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.recipe-header h1 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1.5rem;
}
</style>