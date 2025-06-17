<template>
  <div class="container">
    <h1 class="title">My Favorite Recipes</h1>
    
    <!-- Loading state -->
    <div v-if="loading" class="text-center mt-4">
      <p>Loading your favorite recipes...</p>
    </div>

    <!-- Favorite recipes -->
    <div v-if="favoriteRecipes.length > 0 && !loading" class="favorite-recipes mt-4">
      <p class="subtitle">You have {{ favoriteRecipes.length }} favorite recipe{{ favoriteRecipes.length === 1 ? '' : 's' }}</p>
      <div class="row center">
        <div 
          v-for="recipe in favoriteRecipes" 
          :key="recipe.id"
          class="col-md-6 col-lg-4 mb-4"
        >
          <RecipePreview 
            :recipe="recipe"
            @recipe-action-changed="onRecipeActionChanged"
          />
        </div>
      </div>
    </div>

    <!-- No favorites message -->
    <div v-if="hasLoaded && favoriteRecipes.length === 0 && !loading && !errorMessage" class="text-center mt-4">
      <div class="alert alert-info">
        <h4>No favorite recipes yet</h4>
        <p>You haven't added any recipes to your favorites yet.</p>
        <p>Start exploring recipes and click the star icon to add them to your favorites!</p>
        <router-link to="/search" class="btn btn-primary mt-2">
          Search Recipes
        </router-link>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="alert alert-danger mt-4">
      <h4>Error Loading Favorites</h4>
      <p>{{ errorMessage }}</p>
      <button @click="fetchFavoriteRecipes" class="btn btn-outline-primary">
        Try Again
      </button>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RecipePreview from "../components/RecipePreview.vue";

export default {
  name: "UsersFavoritesPage",
  components: {
    RecipePreview
  },
  data() {
    return {
      favoriteRecipes: [],
      loading: false,
      hasLoaded: false,
      errorMessage: ""
    };
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const axios = internalInstance.appContext.config.globalProperties.axios;

    return { store, axios };
  },
  async created() {
    await this.fetchFavoriteRecipes();
  },
  methods: {
    async fetchFavoriteRecipes() {
      this.loading = true;
      this.errorMessage = "";
      
      try {
        console.log('Fetching user favorite recipes...');
        
        const response = await window.axios.get('/users/favorites');
        console.log('Favorite recipes response:', response);
        
        if (response.status === 200) {
          // Just pass the raw recipe data - RecipePreview will handle state
          const recipes = response.data.recipes || response.data || [];
          this.favoriteRecipes = recipes.map(recipe => ({
            ...recipe,
            favorited: true // Hint for RecipePreview to optimize (since they come from favorites endpoint)
          }));
          console.log('Loaded favorite recipes:', this.favoriteRecipes);
        } else {
          throw new Error('Failed to fetch favorite recipes');
        }
        
        this.hasLoaded = true;
        
      } catch (error) {
        console.error("Failed to fetch favorite recipes:", error);
        
        if (error.response?.status === 401) {
          this.errorMessage = "Please log in to view your favorite recipes.";
          this.$router.push('/login');
        } else if (error.response?.status === 404) {
          this.favoriteRecipes = [];
          this.hasLoaded = true;
        } else {
          this.errorMessage = error.response?.data?.message || "Failed to load favorite recipes. Please try again.";
        }
      } finally {
        this.loading = false;
      }
    },

    onRecipeActionChanged(data) {
      console.log('Recipe action changed on favorites page:', data);
      
      // If user unfavorites a recipe, remove it from the list
      if (data.actionType === 'favorite' && !data.isActive) {
        this.favoriteRecipes = this.favoriteRecipes.filter(recipe => recipe.id !== data.recipeId);
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
  color: #333;
  margin-bottom: 2rem;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.favorite-recipes {
  margin-top: 2rem;
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
  
  &:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }
}

.btn-outline-primary {
  color: #007bff;
  background-color: transparent;
  border-color: #007bff;
  
  &:hover {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }
}

.center {
  text-align: center;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.col-md-6 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}

.col-lg-4 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}

@media (min-width: 768px) {
  .col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 992px) {
  .col-lg-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

.text-center {
  text-align: center;
}
</style>