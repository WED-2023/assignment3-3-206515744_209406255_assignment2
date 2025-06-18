<template>
  <div class="container">
    <h1 class="title">Main Page</h1>

    <div class="main-content">
      <!-- Left side - Random Recipes -->
      <div class="recipe-section">
        <div class="section-header">
          <h2>Random Recipes</h2>
          <div class="number-selector">
            <label for="randomNumber">Number of recipes:</label>
            <select 
              id="randomNumber" 
              v-model="randomRecipesNumber" 
              @change="fetchRandomRecipes"
              class="form-select"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>
        </div>
        
        <!-- Loading state for random recipes -->
        <div v-if="loadingRandom" class="text-center py-4">
          <p>Loading random recipes...</p>
        </div>
        
        <!-- Random recipes error -->
        <div v-else-if="randomError" class="alert alert-danger">
          <p>{{ randomError }}</p>
          <button @click="fetchRandomRecipes" class="btn btn-sm btn-outline-danger">
            Try Again
          </button>
        </div>
        
        <!-- Random recipes list -->
        <RecipePreviewList
          v-else
          title=""
          :recipes="randomRecipes"
          class="recipe-list"
          @recipe-action-changed="onRecipeActionChanged"
        />
      </div>

      <!-- Right side - Last Viewed Recipes -->
      <div class="recipe-section">
        <div class="section-header">
          <h2>Last Viewed Recipes</h2>
          <div v-if="store.username" class="number-selector">
            <label for="viewedNumber">Number of recipes:</label>
            <select 
              id="viewedNumber" 
              v-model="lastViewedNumber" 
              @change="fetchLastViewedRecipes"
              class="form-select"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>
        </div>

        <!-- Not logged in message -->
        <div v-if="!store.username" class="text-center mt-4">
          <div class="alert alert-info">
            <h4>Login Required</h4>
            <p>You need to be logged in to view your last viewed recipes.</p>
            <router-link :to="{ name: 'login' }">
              <button class="btn btn-primary">Login</button>
            </router-link>
          </div>
        </div>

        <!-- Loading state for last viewed -->
        <div v-else-if="loadingViewed" class="text-center py-4">
          <p>Loading last viewed recipes...</p>
        </div>
        
        <!-- Last viewed recipes error -->
        <div v-else-if="viewedError" class="alert alert-danger">
          <p>{{ viewedError }}</p>
          <button @click="fetchLastViewedRecipes" class="btn btn-sm btn-outline-danger">
            Try Again
          </button>
        </div>
        
        <!-- No viewed recipes -->
        <div v-else-if="lastViewedRecipes.length === 0" class="text-center mt-4">
          <div class="alert alert-info">
            <h4>No Viewed Recipes</h4>
            <p>You haven't viewed any recipes yet.</p>
            <router-link :to="{ name: 'search' }">
              <button class="btn btn-primary">Search Recipes</button>
            </router-link>
          </div>
        </div>
        
        <!-- Last viewed recipes list -->
        <RecipePreviewList
          v-else
          title=""
          :recipes="lastViewedRecipes"
          class="recipe-list"
          @recipe-action-changed="onRecipeActionChanged"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  components: {
    RecipePreviewList
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const axios = internalInstance.appContext.config.globalProperties.axios;

    return { store, axios };
  },
  data() {
    return {
      // Random recipes data
      randomRecipes: [],
      randomRecipesNumber: 3,
      loadingRandom: false,
      randomError: '',
      
      // Last viewed recipes data
      lastViewedRecipes: [],
      lastViewedNumber: 3,
      loadingViewed: false,
      viewedError: ''
    };
  },
  async mounted() {
    // Fetch random recipes immediately
    await this.fetchRandomRecipes();
    
    // Fetch last viewed recipes if user is logged in
    if (this.store.username) {
      await this.fetchLastViewedRecipes();
    }
  },
  watch: {
    // Watch for login state changes
    'store.username'(newValue) {
      if (newValue) {
        // User just logged in, fetch their viewed recipes
        this.fetchLastViewedRecipes();
      } else {
        // User logged out, clear viewed recipes
        this.lastViewedRecipes = [];
        this.viewedError = '';
      }
    }
  },
  methods: {
    async fetchRandomRecipes() {
      this.loadingRandom = true;
      this.randomError = '';
      
      try {
        console.log(`Fetching ${this.randomRecipesNumber} random recipes...`);
        
        const response = await this.axios.get('/recipes/random', {
          params: {
            number: this.randomRecipesNumber
          }
        });
        
        console.log('Random recipes response:', response.data);
        
        // Handle different response formats
        this.randomRecipes = response.data.recipes || response.data || [];
        
        // Ensure each recipe has the required properties
        this.randomRecipes = this.randomRecipes.map(recipe => ({
          ...recipe,
          viewed: recipe.viewed || false,
          favorite: recipe.favorite || false,
          liked: recipe.liked || false
        }));
        
        console.log('Processed random recipes:', this.randomRecipes);
        
      } catch (error) {
        console.error('Error fetching random recipes:', error);
        this.randomError = 'Failed to load random recipes. Please try again.';
        this.randomRecipes = [];
      } finally {
        this.loadingRandom = false;
      }
    },

    async fetchLastViewedRecipes() {
      if (!this.store.username) {
        console.log('User not logged in, skipping last viewed recipes fetch');
        return;
      }

      this.loadingViewed = true;
      this.viewedError = '';
      
      try {
        console.log(`Fetching ${this.lastViewedNumber} last viewed recipes...`);
        
        const response = await this.axios.get('/users/last-view', {
          params: {
            number: this.lastViewedNumber
          }
        });
        
        console.log('Last viewed recipes response:', response.data);
        
        // Handle different response formats
        this.lastViewedRecipes = response.data.recipes || response.data || [];
        
        // Ensure each recipe has the required properties
        this.lastViewedRecipes = this.lastViewedRecipes.map(recipe => ({
          ...recipe,
          viewed: recipe.viewed !== undefined ? recipe.viewed : true, // Default to true for viewed recipes
          favorite: recipe.favorite || false,
          liked: recipe.liked || false
        }));
        
        console.log('Processed last viewed recipes:', this.lastViewedRecipes);
        
      } catch (error) {
        console.error('Error fetching last viewed recipes:', error);
        
        if (error.response?.status === 401) {
          this.viewedError = 'Please log in to view your last viewed recipes.';
        } else {
          this.viewedError = 'Failed to load last viewed recipes. Please try again.';
        }
        
        this.lastViewedRecipes = [];
      } finally {
        this.loadingViewed = false;
      }
    },

    onRecipeActionChanged(data) {
      console.log('Recipe action changed on main page:', data);
      
      // Update the recipe state in both lists if it exists
      this.updateRecipeInList(this.randomRecipes, data);
      this.updateRecipeInList(this.lastViewedRecipes, data);
    },

    updateRecipeInList(recipeList, actionData) {
      const recipe = recipeList.find(r => r.id === actionData.recipeId);
      if (recipe) {
        if (actionData.actionType === 'like') {
          recipe.liked = actionData.isActive;
        } else if (actionData.actionType === 'favorite') {
          recipe.favorite = actionData.isActive;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.recipe-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.number-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.number-selector label {
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
}

.form-select {
  min-width: 80px;
  padding: 0.25rem 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: white;
  font-size: 0.9rem;
}

.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  outline: none;
}

.recipe-list {
  margin-top: 0;
}

.alert {
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid transparent;
  border-radius: 0.375rem;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.alert-info {
  color: #0c5460;
  background-color: #d1ecf1;
  border-color: #bee5eb;
}

.alert h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.alert p {
  margin: 0 0 1rem 0;
}

.btn {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  margin-bottom: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  color: #fff;
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
  background-color: transparent;
}

.btn-outline-danger:hover {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

.text-center {
  text-align: center;
}

.py-4 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .number-selector {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 1rem;
  }
  
  .recipe-section {
    padding: 1rem;
  }
  
  .section-header h2 {
    font-size: 1.25rem;
  }
}
</style>
