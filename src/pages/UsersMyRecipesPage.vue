<template>
  <div class="container">
    <h1 class="title">My Recipes</h1>
    
    <!-- Loading state -->
    <div v-if="loading" class="text-center mt-4">
      <p>Loading your recipes...</p>
    </div>

    <!-- My recipes -->
    <div v-if="myRecipes.length > 0 && !loading" class="my-recipes mt-4">
      <div class="recipes-header">
        <p class="subtitle">You have {{ myRecipes.length }} recipe{{ myRecipes.length === 1 ? '' : 's' }}</p>
        <button class="btn btn-primary" @click="createNewRecipe">
          Create New Recipe
        </button>
      </div>
      <RecipePreviewList 
        :recipes="myRecipes" 
        title="" 
        class="center"
        :custom-route-prefix="'/users/my-recipes'"
        :show-delete-button="true"
        @recipe-action-changed="onRecipeActionChanged"
        @recipe-deleted="onRecipeDeleted"
      />
    </div>

    <!-- No recipes message -->
    <div v-if="hasLoaded && myRecipes.length === 0 && !loading && !errorMessage" class="text-center mt-4">
      <div class="alert alert-info">
        <h4>No recipes created yet</h4>
        <p>You haven't created any recipes yet.</p>
        <p>Start creating your own delicious recipes!</p>
        <button class="btn btn-primary mt-2" @click="createNewRecipe">
          Create New Recipe
        </button>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="alert alert-danger mt-4">
      <h4>Error Loading Your Recipes</h4>
      <p>{{ errorMessage }}</p>
      <button @click="fetchMyRecipes" class="btn btn-outline-primary">
        Try Again
      </button>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  name: "UsersMyRecipesPage",
  components: {
    RecipePreviewList
  },
  data() {
    return {
      myRecipes: [],
      loading: false,
      hasLoaded: false,
      errorMessage: ""
    };
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const axios = internalInstance.appContext.config.globalProperties.axios;
    const toast = internalInstance.appContext.config.globalProperties.toast;

    return { store, axios, toast };
  },
  async created() {
    await this.fetchMyRecipes();
  },
  methods: {
    async fetchMyRecipes() {
      this.loading = true;
      this.errorMessage = "";
      
      try {
        console.log('Fetching user created recipes...');
        
        const response = await window.axios.get('/users/my-recipes');
        console.log('My recipes response:', response);
        
        // Transform the API response to match RecipePreview expected format
        const recipes = response.data || [];
        this.myRecipes = recipes.map(recipe => ({
          id: recipe.id, // Use recipe.id instead of recipe.recipe_id
          title: recipe.title,
          image: recipe.image,
          readyInMinutes: recipe.readyInMinutes,
          aggregateLikes: recipe.aggregateLikes || 0, // Default to 0 if not provided
          vegan: recipe.vegan,
          vegetarian: recipe.vegetarian,
          glutenFree: recipe.glutenFree,
          viewed: recipe.viewed || false, // Default to false if not provided
          // Set favorite and liked states based on API response
          favorited: recipe.favorite || false, // Default to false if not provided
          liked: false // API doesn't provide liked status for own recipes, assuming false
        }));
        
        console.log('Transformed recipes:', this.myRecipes);
        this.hasLoaded = true;
        
      } catch (error) {
        console.error("Failed to fetch my recipes:", error);
        
        if (error.response?.status === 401) {
          this.errorMessage = "Please log in to view your recipes.";
          this.$router.push('/login');
        } else if (error.response?.status === 404) {
          this.myRecipes = [];
          this.hasLoaded = true;
        } else {
          this.errorMessage = error.response?.data?.message || "Failed to load your recipes. Please try again.";
        }
      } finally {
        this.loading = false;
      }
    },

    onRecipeActionChanged(data) {
      console.log('Recipe action changed on my recipes page:', data);
      
      // Update the local recipe state when actions change
      const recipe = this.myRecipes.find(r => r.id === data.recipeId);
      if (recipe) {
        if (data.actionType === 'like') {
          recipe.liked = data.isActive;
        } else if (data.actionType === 'favorite') {
          recipe.favorited = data.isActive;
        }
      }
    },

    onRecipeDeleted(data) {
      console.log('Recipe deleted:', data);
      
      // Remove the recipe from the local list
      this.myRecipes = this.myRecipes.filter(recipe => recipe.id !== data.recipeId);
      
      // Show success message
      this.toast("Success", `"${data.recipeName}" has been deleted successfully!`, "success");
    },

    createNewRecipe() {
      this.$router.push('/users/my-recipes/new');
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
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.recipes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.my-recipes {
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

.center {
  text-align: center;
}
</style>