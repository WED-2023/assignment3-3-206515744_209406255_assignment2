<template>
  <div class="container">
    <div v-if="loading" class="text-center mt-4">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p class="mt-2">Loading family recipe...</p>
    </div>
    
    <div v-if="recipe && !loading">
      <div class="recipe-header mt-3 mb-4">
        <div class="family-recipe-badge">
          <i class="fas fa-heart"></i> Family Recipe
        </div>
        
        <h1>{{ recipe.familyMember }}'s Special Recipe</h1>
        
        <div class="occasion-info">
          <span class="badge badge-primary badge-lg">{{ recipe.occasion }}</span>
        </div>
        
        <img 
          v-if="recipe.image" 
          :src="recipe.image" 
          class="recipe-image" 
          :alt="`${recipe.familyMember}'s recipe`"
        />
        <div v-else class="no-image-placeholder">
          <i class="fas fa-utensils"></i>
          <p>No image available</p>
        </div>
      </div>
      
      <div class="recipe-body">
        <div class="row">
          <div class="col-md-6">
            <!-- Ingredients section -->
            <div class="recipe-section">
              <h3><i class="fas fa-list"></i> Ingredients</h3>
              <div v-if="!recipe.ingredients || recipe.ingredients.length === 0">
                <p class="text-muted">No ingredients listed</p>
              </div>
              <ul v-else class="ingredients-list">
                <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
                  {{ ingredient }}
                </li>
              </ul>
            </div>
          </div>
          
          <div class="col-md-6">
            <!-- Instructions section -->
            <div class="recipe-section">
              <h3><i class="fas fa-tasks"></i> Instructions</h3>
              <div v-if="!recipe.instructions || recipe.instructions.length === 0">
                <p class="text-muted">No instructions provided</p>
              </div>
              <ol v-else class="instructions-list">
                <li v-for="(instruction, index) in recipe.instructions" :key="index">
                  {{ instruction }}
                </li>
              </ol>
            </div>
          </div>
        </div>
        
        <!-- Family Recipe Info -->
        <div class="family-info-section mt-4">
          <div class="card">
            <div class="card-body">
              <h4><i class="fas fa-users"></i> About This Recipe</h4>
              <p class="mb-2">
                <strong>Family Member:</strong> {{ recipe.familyMember }}
              </p>
              <p class="mb-0">
                <strong>Special Occasion:</strong> {{ recipe.occasion }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Action buttons -->
        <div class="action-section mt-4 text-center">
          <router-link 
            :to="{ name: 'usersFamilyRecipes' }" 
            class="btn btn-secondary me-3"
          >
            <i class="fas fa-arrow-left"></i> Back to Family Recipes
          </router-link>
          
          <button 
            class="btn btn-outline-primary"
            @click="printRecipe"
          >
            <i class="fas fa-print"></i> Print Recipe
          </button>
        </div>
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
      errorMessage: ""
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
          this.$router.replace("/NotFound");
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
            this.$router.replace("/NotFound");
          }
        } else {
          throw new Error('Failed to fetch family recipes');
        }
        
      } catch (error) {
        console.error("Failed to load family recipe:", error);
        if (error.response?.status === 404) {
          this.$router.replace("/NotFound");
        } else {
          this.errorMessage = error.response?.data?.message || "Failed to load family recipe. Please try again.";
        }
      } finally {
        this.loading = false;
      }
    },
    
    printRecipe() {
      const printWindow = window.open('', '_blank');
      const recipeHtml = `
        <html>
          <head>
            <title>${this.recipe.familyMember}'s ${this.recipe.occasion} Recipe</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
              h2 { color: #666; margin-top: 20px; }
              ul, ol { margin: 10px 0; padding-left: 20px; }
              li { margin: 5px 0; }
              .occasion { background: #007bff; color: white; padding: 5px 10px; border-radius: 5px; display: inline-block; }
              .family-info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <h1>${this.recipe.familyMember}'s Special Recipe</h1>
            <p class="occasion">${this.recipe.occasion}</p>
            
            <h2>Ingredients:</h2>
            <ul>
              ${this.recipe.ingredients?.map(ing => `<li>${ing}</li>`).join('') || '<li>No ingredients listed</li>'}
            </ul>
            
            <h2>Instructions:</h2>
            <ol>
              ${this.recipe.instructions?.map(inst => `<li>${inst}</li>`).join('') || '<li>No instructions provided</li>'}
            </ol>
            
            <div class="family-info">
              <strong>Family Member:</strong> ${this.recipe.familyMember}<br>
              <strong>Special Occasion:</strong> ${this.recipe.occasion}
            </div>
          </body>
        </html>
      `;
      
      printWindow.document.write(recipeHtml);
      printWindow.document.close();
      printWindow.print();
    }
  }
};
</script>

<style scoped>
.recipe-header {
  text-align: center;
  margin-bottom: 2rem;
}

.family-recipe-badge {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.family-recipe-badge i {
  margin-right: 0.5rem;
}

.occasion-info {
  margin: 1rem 0;
}

.badge-lg {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.recipe-image {
  display: block;
  margin: 2rem auto;
  max-width: 100%;
  height: auto;
  max-height: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.no-image-placeholder {
  margin: 2rem auto;
  padding: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.recipe-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #007bff;
}

.recipe-section h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.recipe-section h3 i {
  margin-right: 0.5rem;
  color: #007bff;
}

.ingredients-list, .instructions-list {
  margin: 0;
  padding-left: 1.5rem;
}

.ingredients-list li, .instructions-list li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.family-info-section .card {
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 10px;
}

.family-info-section .card-body {
  padding: 1.5rem;
}

.family-info-section h4 {
  color: #333;
  margin-bottom: 1rem;
}

.family-info-section h4 i {
  margin-right: 0.5rem;
  color: #28a745;
}

.action-section {
  padding: 2rem 0;
  border-top: 1px solid #e9ecef;
}

.badge {
  display: inline-block;
  padding: 0.375em 0.75em;
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

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.me-3 {
  margin-right: 1rem;
}
</style>