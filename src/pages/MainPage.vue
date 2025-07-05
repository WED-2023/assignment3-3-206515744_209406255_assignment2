<template>
  <div class="container fade-in">
    <h1 class="title fade-in-down">Main Page</h1>

    <div class="main-content slide-in-up">
      <!-- Left side - Random Recipes -->
      <div class="recipe-section slide-in-left">
        <div class="section-header">
          <h2 class="pulse-text">Explore These Recipes</h2>
        </div>
        
        <div class="section-content">
          <div class="content-area">
            <!-- Loading state for random recipes -->
            <div v-if="loadingRandom && randomRecipes.length === 0" class="text-center py-4 pulse">
              <div class="loading-animation">
                <div class="spinner"></div>
                <p class="pulse-text">Loading random recipes...</p>
              </div>
            </div>
              <!-- Random recipes error -->
            <div v-else-if="randomError" class="alert alert-danger slide-in-right">
              <h4>Error Loading Random Recipes</h4>
              <p>{{ randomError }}</p>
              <button @click="fetchRandomRecipes(true)" class="btn btn-outline-primary hover-lift">
                <i class="fas fa-redo"></i> Try Again
              </button>
            </div>
            
            <!-- Random recipes list -->
            <div v-else class="fade-in-up-delayed">
              <RecipePreviewList
                title=""
                :recipes="randomRecipes"
                class="recipe-list"
                @recipe-action-changed="onRecipeActionChanged"
              />
            </div>
          </div>
          
          <!-- Get New Random Recipes Button - always at bottom -->
          <div v-if="!randomError && (!loadingRandom || randomRecipes.length > 0)" class="button-area text-center">
            <button 
              @click="fetchRandomRecipes(true)"
              :disabled="loadingRandom"
              class="btn btn-primary load-more-btn hover-scale"
            >
              <i v-if="loadingRandom" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-sync-alt"></i>
              {{ loadingRandom ? 'Loading...' : 'Get New Random Recipes' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right side - Last Viewed Recipes -->
      <div class="recipe-section slide-in-right">
        <div class="section-header">
          <h2 class="pulse-text">Last Viewed Recipes</h2>
        </div>

        <div class="section-content">
          <div class="content-area">
            <!-- Not logged in message -->
            <div v-if="!store.username" class="text-center mt-4">
              <div class="alert alert-info">
                <h4>Login Required</h4>
                <p>You need to be logged in to view your last viewed recipes.</p>
                <div class="auth-buttons">
                  <router-link :to="{ name: 'login' }">
                    <button class="btn btn-primary auth-btn">
                      <i class="fas fa-sign-in-alt"></i>
                      Login
                    </button>
                  </router-link>
                  <router-link :to="{ name: 'register' }">
                    <button class="btn btn-outline-primary auth-btn">
                      <i class="fas fa-user-plus"></i>
                      Register
                    </button>
                  </router-link>
                </div>
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
            </div>
          </div>
          
          <!-- Load More Button for Last Viewed Recipes - always at bottom when logged in and has recipes -->
          <div v-if="store.username && (lastViewedRecipes.length > 0 || (!loadingViewed && !viewedError))" class="button-area text-center">
            <!-- Show "no more recipes" message if applicable -->
            <div v-if="noMoreViewedRecipes" class="alert alert-info mb-2">
              <small>
                <i class="fas fa-info-circle"></i>
                You've reached the end of your viewed recipes history.
              </small>
            </div>
            
            <button 
              @click="fetchLastViewedRecipes(false)"
              :disabled="loadingViewed || noMoreViewedRecipes"
              class="btn btn-primary load-more-btn"
              :class="{ 'btn-secondary': noMoreViewedRecipes }"
            >
              <i v-if="loadingViewed" class="fas fa-spinner fa-spin"></i>
              <i v-else-if="noMoreViewedRecipes" class="fas fa-check"></i>
              <i v-else class="fas fa-plus"></i>
              {{ loadingViewed ? 'Loading...' : noMoreViewedRecipes ? 'All Recipes Loaded' : 'Load 3 More Viewed Recipes' }}
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
      viewedError: '',
      noMoreViewedRecipes: false
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
        this.noMoreViewedRecipes = false;
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
            number: 3,
            fresh: reset ? 'true' : 'false' // Force fresh recipes when resetting
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
          // Replace all recipes with new ones
          this.randomRecipes = [...newRecipes];
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
      // Store the current count before fetching
      const previousCount = this.lastViewedRecipes.length;
      
      // Determine how many recipes to fetch
      let requestNumber;
      if (reset) {
        this.lastViewedNumber = 3;
        requestNumber = 3;
        this.noMoreViewedRecipes = false; // Reset the flag on initial load
      } else {
        // When loading more, fetch 3 additional recipes
        this.lastViewedNumber += 3;
        requestNumber = this.lastViewedNumber;
      }
      
      console.log(`Fetching ${requestNumber} last viewed recipes (reset: ${reset})...`);

      const response = await this.axios.get('/users/last-view', {
        params: { number: requestNumber }
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
        // first load → replace all
        this.lastViewedRecipes = processed;
      } else {
        // load more → check if we got new recipes
        if (processed.length === previousCount) {
          // No new recipes were added
          this.noMoreViewedRecipes = true;
          this.lastViewedNumber -= 3; // Revert the increment since we didn't get more
          console.log('No more viewed recipes to load');
        } else {
          // We got more recipes, replace with all fetched recipes
          this.lastViewedRecipes = processed;
          this.noMoreViewedRecipes = false;
        }
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
  max-width: 1900px; /* Increased from 1600px to give more space for recipe titles */
  margin: 0 auto;
  padding: 2rem;
}

.title {
  text-align: center;
  margin-bottom: 3rem;
  color: #2c3e50;
  font-weight: 700;
  font-size: 2.5rem;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem; /* Increased from 3rem to make better use of the wider space */
  align-items: stretch; /* Changed from 'start' to 'stretch' to make sections equal height */
}

.recipe-section {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 2.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 100%; /* Ensure sections fill the available height */
}

.recipe-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.section-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0; /* Prevent header from shrinking */
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.section-content {
  flex: 1; /* Take up remaining space */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Distribute space between content and button */
}

.content-area {
  flex: 1; /* Allow content to grow */
}

.button-area {
  margin-top: auto; /* Push button to bottom */
  padding-top: 1rem; /* Add some space above the button */
}

.recipe-list {
  margin-top: 0;
  flex: 1; /* Allow recipe list to grow */
  
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

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
  
  &:hover:not(:disabled) {
    background-color: #5a6268;
    border-color: #545b62;
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

.auth-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.auth-btn {
  min-width: 120px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.auth-btn i {
  margin-right: 0.5rem;
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

/* Animation classes */
.fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-in-out forwards;
}

.fade-in-down {
  opacity: 0;
  transform: translateY(-20px);
  animation: fadeInDown 1s ease-out forwards;
}

.fade-in-up-delayed {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
}

.slide-in-up {
  opacity: 0;
  transform: translateY(30px);
  animation: slideInUp 0.8s ease-out forwards;
}

.slide-in-left {
  opacity: 0;
  transform: translateX(-30px);
  animation: slideInLeft 0.8s ease-out 0.2s forwards;
}

.slide-in-right {
  opacity: 0;
  transform: translateX(30px);
  animation: slideInRight 0.8s ease-out 0.4s forwards;
}

.pulse {
  animation: pulse 2s infinite;
}

.pulse-text {
  animation: pulseText 2s ease-in-out infinite;
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.loading-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes pulseText {
  0%, 100% { 
    color: inherit;
    transform: scale(1);
  }
  50% { 
    color: #42b983;
    transform: scale(1.02);
  }
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