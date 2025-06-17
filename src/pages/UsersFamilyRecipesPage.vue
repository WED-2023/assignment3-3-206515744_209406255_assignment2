<template>
  <div class="container">
    <h1 class="title">My Family Recipes</h1>    

    <!-- Loading State -->
    <div v-if="loading" class="text-center mt-4">
      <p>Loading your family recipes...</p>
    </div>

    <!-- Family Recipes -->
    <div v-if="familyRecipes.length > 0 && !loading" class="family-recipes mt-4">
      <p class="subtitle">You have {{ familyRecipes.length }} family recipe{{ familyRecipes.length === 1 ? '' : 's' }}</p>
      <div class="row center">
        <div 
          v-for="recipe in familyRecipes" 
          :key="recipe.id"
          class="col-md-6 col-lg-4 mb-4"
        >
          <FamilyRecipePreview 
            :recipe="recipe"
            @recipe-deleted="handleRecipeDeleted"
          />
        </div>
      </div>
    </div>

    <!-- No family recipes message -->
    <div v-if="hasLoaded && familyRecipes.length === 0 && !loading && !errorMessage" class="text-center mt-4">
      <div class="alert alert-info">
        <h4>No family recipes yet</h4>
        <p>You haven't added any family recipes yet.</p>
        <p>Start building your family recipe collection by adding your first recipe!</p>
        <router-link 
          :to="{ name: 'usersNewFamilyRecipe' }" 
          class="btn btn-primary mt-2"
        >
          Add Your First Family Recipe
        </router-link>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="alert alert-danger mt-4">
      <h4>Error Loading Family Recipes</h4>
      <p>{{ errorMessage }}</p>
      <button @click="fetchFamilyRecipes" class="btn btn-outline-primary">
        Try Again
      </button>
    </div>
  </div>
</template>

<script>
import FamilyRecipePreview from '@/components/FamilyRecipePreview.vue';

export default {
  name: 'UsersFamilyRecipesPage',
  components: {
    FamilyRecipePreview
  },
  data() {
    return {
      familyRecipes: [],
      loading: false,
      hasLoaded: false,
      errorMessage: ''
    };
  },
  async created() {
    await this.fetchFamilyRecipes();
  },
  methods: {
    async fetchFamilyRecipes() {
      this.loading = true;
      this.errorMessage = '';
      
      try {
        console.log('Fetching user family recipes...');
        
        const response = await window.axios.get('/users/family-recipes');
        console.log('Family recipes response:', response);
        
        if (response.status === 200) {
          this.familyRecipes = response.data || [];
          console.log('Loaded family recipes:', this.familyRecipes);
        } else {
          throw new Error('Failed to fetch family recipes');
        }
        
        this.hasLoaded = true;
        
      } catch (error) {
        console.error('Error fetching family recipes:', error);
        
        if (error.response?.status === 401) {
          this.errorMessage = "Please log in to view your family recipes.";
          this.$router.push('/login');
        } else if (error.response?.status === 404) {
          this.familyRecipes = [];
          this.hasLoaded = true;
        } else {
          this.errorMessage = error.response?.data?.message || 'Failed to load family recipes. Please try again.';
        }
      } finally {
        this.loading = false;
      }
    },
    
    handleRecipeDeleted(deletedRecipeId) {
      console.log('Recipe deleted on family recipes page:', deletedRecipeId);
      
      // Remove the deleted recipe from the list
      this.familyRecipes = this.familyRecipes.filter(
        recipe => recipe.id !== deletedRecipeId
      );
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

.family-recipes {
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

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
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