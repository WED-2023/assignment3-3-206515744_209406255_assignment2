<template>
  <div class="container">
    <h1 class="title">My Liked Recipes</h1>
    
    <!-- Loading state -->
    <div v-if="loading" class="text-center mt-4">
      <p>Loading your liked recipes...</p>
    </div>

    <!-- Liked recipes -->
    <div v-if="likedRecipes.length > 0 && !loading" class="liked-recipes mt-4">
      <p class="subtitle">You have {{ likedRecipes.length }} liked recipe{{ likedRecipes.length === 1 ? '' : 's' }}</p>
      <div class="row center">
        <div 
          v-for="recipe in likedRecipes" 
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

    <!-- No liked message -->
    <div v-if="hasLoaded && likedRecipes.length === 0 && !loading && !errorMessage" class="text-center mt-4">
      <div class="alert alert-info">
        <h4>No liked recipes yet</h4>
        <p>You haven't liked any recipes yet.</p>
        <p>Start exploring recipes and click the heart icon to like them!</p>
        <router-link to="/search" class="btn btn-primary mt-2">
          Search Recipes
        </router-link>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="alert alert-danger mt-4">
      <h4>Error Loading Liked Recipes</h4>
      <p>{{ errorMessage }}</p>
      <button @click="fetchLikedRecipes" class="btn btn-outline-primary">
        Try Again
      </button>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RecipePreview from "../components/recipe/RecipePreview.vue";

export default {
  name: "UsersLikedPage",
  components: {
    RecipePreview
  },
  data() {
    return {
      likedRecipes: [],
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
    await this.fetchLikedRecipes();
  },
  methods: {
    async fetchLikedRecipes() {
      this.loading = true;
      this.errorMessage = "";
      
      try {
        console.log('Fetching user liked recipes...');
        
        const response = await window.axios.get('/users/liked');
        console.log('Liked recipes response:', response);
        
        if (response.status === 200) {
          // Just pass the raw recipe data - RecipePreview will handle state
          const recipes = response.data.recipes || response.data || [];
          this.likedRecipes = recipes.map(recipe => ({
            ...recipe,
            liked: true // Hint for RecipePreview to optimize (since they come from liked endpoint)
          }));
          console.log('Loaded liked recipes:', this.likedRecipes);
        } else {
          throw new Error('Failed to fetch liked recipes');
        }
        
        this.hasLoaded = true;
        
      } catch (error) {
        console.error("Failed to fetch liked recipes:", error);
        
        if (error.response?.status === 401) {
          this.errorMessage = "Please log in to view your liked recipes.";
          this.$router.push('/login');
        } else if (error.response?.status === 404) {
          this.likedRecipes = [];
          this.hasLoaded = true;
        } else {
          this.errorMessage = error.response?.data?.message || "Failed to load liked recipes. Please try again.";
        }
      } finally {
        this.loading = false;
      }
    },

    onRecipeActionChanged(data) {
      console.log('Recipe action changed on liked page:', data);
      
      // If user unlikes a recipe, remove it from the list
      if (data.actionType === 'like' && !data.isActive) {
        this.likedRecipes = this.likedRecipes.filter(recipe => recipe.id !== data.recipeId);
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

.liked-recipes {
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