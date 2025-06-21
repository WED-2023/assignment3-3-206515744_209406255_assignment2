<template>
  <div class="container">
    <h1 class="title">Main Page</h1>

    <div class="main-content">
      <!-- Left side - Random Recipes -->
      <div class="recipe-section">
        <div class="section-header">
          <h2>Random Recipes</h2>
        </div>
        
        <!-- Loading state for random recipes -->
        <div v-if="loadingRandom && randomRecipes.length === 0" class="text-center py-4">
          <p>Loading random recipes...</p>
        </div>
          <!-- Random recipes error -->
        <div v-else-if="randomError" class="alert alert-danger">
          <h4>Error Loading Random Recipes</h4>
          <p>{{ randomError }}</p>
          <button @click="fetchRandomRecipes(true)" class="btn btn-outline-primary">
            <i class="fas fa-redo"></i> Try Again
          </button>
        </div>
        
        <!-- Random recipes list -->
        <div v-else>
          <RecipePreviewList
            title=""
            :recipes="randomRecipes"
            class="recipe-list"
            @recipe-action-changed="onRecipeActionChanged"
          />
            <!-- Load More Button for Random Recipes -->
          <div class="text-center mt-3">
            <button 
              @click="fetchRandomRecipes(false)"
              :disabled="loadingRandom"
              class="btn btn-primary load-more-btn"
            >
              <i v-if="loadingRandom" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-plus"></i>
              {{ loadingRandom ? 'Loading...' : 'Load 3 More Random Recipes' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right side - Last Viewed Recipes -->
      <div class="recipe-section">
        <div class="section-header">
          <h2>Last Viewed Recipes</h2>
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
        <div v-else-if="loadingViewed && lastViewedRecipes.length === 0" class="text-center py-4">
          <p>Loading last viewed recipes...</p>
        </div>
          <!-- Last viewed recipes error -->
        <div v-else-if="viewedError" class="alert alert-danger">
          <h4>Error Loading Viewed Recipes</h4>
          <p>{{ viewedError }}</p>
          <button @click="fetchLastViewedRecipes(true)" class="btn btn-outline-primary">
            <i class="fas fa-redo"></i> Try Again
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
        <div v-else>
          <RecipePreviewList
            title=""
            :recipes="lastViewedRecipes"
            class="recipe-list"
            @recipe-action-changed="onRecipeActionChanged"
          />
            <!-- Load More Button for Last Viewed Recipes -->
          <div class="text-center mt-3">
            <button 
              @click="fetchLastViewedRecipes(false)"
              :disabled="loadingViewed"
              class="btn btn-primary load-more-btn"
            >
              <i v-if="loadingViewed" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-plus"></i>
              {{ loadingViewed ? 'Loading...' : 'Load 3 More Viewed Recipes' }}
            </button>
          </div>
        </div>
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
      loadingRandom: false,
      randomError: '',
      
      // Last viewed recipes data
      lastViewedRecipes: [],
      lastViewedNumber: 3, // Start with 3, increment by 3 each time
      loadingViewed: false,
      viewedError: ''
    };
  },
  async mounted() {
    // Fetch initial random recipes
    await this.fetchRandomRecipes(true);
    
    // Fetch initial last viewed recipes if user is logged in
    if (this.store.username) {
      await this.fetchLastViewedRecipes(true);
    }
  },
  watch: {
    // Watch for login state changes
    'store.username'(newValue) {
      if (newValue) {
        // User just logged in, reset and fetch their viewed recipes
        this.lastViewedNumber = 3;
        this.fetchLastViewedRecipes(true);
      } else {
        // User logged out, clear viewed recipes and reset counter
        this.lastViewedRecipes = [];
        this.lastViewedNumber = 3;
        this.viewedError = '';
      }
    }
  },
  methods: {
    async fetchRandomRecipes(reset = false) {
      // If reset is true, we're starting fresh (clear existing recipes)
      // If reset is false, we're adding more recipes to the existing list
      
      this.loadingRandom = true;
      this.randomError = '';
      
      try {
        console.log('Fetching 3 random recipes...');
        
        const response = await this.axios.get('/recipes/random', {
          params: {
            number: 3
          }
        });
        
        console.log('Random recipes response:', response.data);
        
        // Handle different response formats
        let newRecipes = response.data.recipes || response.data || [];
        
        // Ensure each recipe has the required properties
        newRecipes = newRecipes.map(recipe => ({
          ...recipe,
          viewed: recipe.viewed || false,
          favorite: recipe.favorite || false,
          liked: recipe.liked || false
        }));
        
        if (reset) {
          // Replace all recipes
          this.randomRecipes = newRecipes;
        } else {
          // Add new recipes to the end of the list
          this.randomRecipes = [...this.randomRecipes, ...newRecipes];
        }
        
        console.log('Processed random recipes:', this.randomRecipes);
        
      } catch (error) {
        console.error('Error fetching random recipes:', error);
        this.randomError = 'Failed to load random recipes. Please try again.';
        if (reset) {
          this.randomRecipes = [];
        }
      } finally {
        this.loadingRandom = false;
      }
    },

    async fetchLastViewedRecipes(reset = false) {
    if (!this.store.username) {
      console.log('User not logged in, skipping last viewed recipes fetch');
      return;
    }
    this.loadingViewed = true;
    this.viewedError = '';

    try {
      // remember how many we already had
      const oldCount = reset ? 0 : this.lastViewedRecipes.length;

      // bump counter
      if (reset) {
        this.lastViewedNumber = 3;
      } else {
        this.lastViewedNumber += 3;
      }
      console.log(`Fetching ${this.lastViewedNumber} last viewed recipes…`);

      const response = await this.axios.get('/users/last-view', {
        params: { number: this.lastViewedNumber }
      });
      const fetched = response.data.recipes || response.data || [];

      // normalize
      const processed = fetched.map(recipe => ({
        ...recipe,
        viewed: recipe.viewed !== undefined ? recipe.viewed : true,
        favorite: recipe.favorite || false,
        liked: recipe.liked || false
      }));

      if (reset) {
        // first load → replace
        this.lastViewedRecipes = processed;
      } else {
        // load more → append only the new ones
        const newOnes = processed.slice(oldCount);
        this.lastViewedRecipes = [
          ...this.lastViewedRecipes,
          ...newOnes
        ];
      }
      console.log(`Now showing ${this.lastViewedRecipes.length} last viewed recipes`);
    } catch (error) {
      console.error('Error fetching last viewed recipes:', error);
      this.viewedError = 'Failed to load viewed recipes. Try again.';
      if (reset) {
        this.lastViewedRecipes = [];
      }
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
  max-width: 1600px;
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
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.recipe-list {
  margin-top: 0;
  
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

.load-more-btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 25px;
  transition: all 0.3s ease;
  min-width: 200px;
}

.load-more-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.load-more-btn i {
  margin-right: 0.5rem;
}

.alert {
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  text-align: center;
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
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
  
  &:hover:not(:disabled) {
    background-color: #0056b3;
    border-color: #0056b3;
  }
}

.btn-outline-primary {
  color: #007bff;
  background-color: transparent;
  border-color: #007bff;
  
  &:hover:not(:disabled) {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 1rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

.text-center {
  text-align: center;
}

.py-4 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive design */
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .section-header {
    text-align: center;
  }
  
  .load-more-btn {
    min-width: 180px;
    font-size: 0.9rem;
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
  
  .load-more-btn {
    min-width: 160px;
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
}
</style>