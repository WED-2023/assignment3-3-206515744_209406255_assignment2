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
      <RecipePreviewList 
        :recipes="likedRecipes" 
        title="" 
        class="center"
      />
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
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  name: "UsersLikedPage",
  components: {
    RecipePreviewList
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
        
        // Debug: Check if cookies are being sent
        console.log('Document cookies:', document.cookie);
        
        const response = await window.axios.get('/users/liked');
        console.log('Liked recipes response:', response);
        
        this.likedRecipes = response.data.recipes || response.data || [];
        this.hasLoaded = true;
        
      } catch (error) {
        console.error("Failed to fetch liked recipes:", error);
        console.error("Error response:", error.response);
        
        if (error.response?.status === 401) {
          // User not authenticated
          this.errorMessage = "Please log in to view your liked recipes.";
          this.$router.push('/login');
        } else if (error.response?.status === 404) {
          // No liked recipes found
          this.likedRecipes = [];
          this.hasLoaded = true;
        } else {
          this.errorMessage = error.response?.data?.message || "Failed to load liked recipes. Please try again.";
        }
      } finally {
        this.loading = false;
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
  color: #fff;
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
</style>