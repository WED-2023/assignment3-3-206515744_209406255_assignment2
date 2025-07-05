<template>
  <div class="container">
    <h1 class="title">My Family Recipes</h1>
    
    <!-- Create New Recipe button under title - only show when there are recipes -->
    <div v-if="familyRecipes.length > 0 && !loading" class="text-center mt-3 mb-4">
      <button class="btn btn-primary" @click="showCreateModal = true">
        <i class="fas fa-plus"></i> Add New Family Recipe
      </button>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="text-center mt-4">
      <p>Loading your family recipes...</p>
    </div>

    <!-- Family recipes -->
    <div v-if="familyRecipes.length > 0 && !loading" class="family-recipes mt-4">
      <div class="recipes-header">
        <p class="subtitle">You have {{ familyRecipes.length }} family recipe{{ familyRecipes.length === 1 ? '' : 's' }}</p>
      </div>
      
      <FamilyRecipePreviewList 
        title=""
        :recipes="familyRecipes"
        class="center"
        @recipe-deleted="handleRecipeDeleted"
      />
    </div>

    <!-- No family recipes message -->
    <div v-if="hasLoaded && familyRecipes.length === 0 && !loading && !errorMessage" class="text-center mt-4">
      <div class="alert alert-info">
        <h4>No family recipes yet</h4>
        <p>You haven't added any family recipes yet.</p>
        <p>Start building your family recipe collection by adding your first recipe!</p>
        <button class="btn btn-primary mt-2" @click="showCreateModal = true">
          <i class="fas fa-plus"></i> Add Your First Family Recipe
        </button>
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

    <!-- Create Family Recipe Modal -->
    <UsersNewFamilyRecipeModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @recipe-created="onFamilyRecipeCreated"
    />
  </div>
</template>

<script>
import FamilyRecipePreviewList from '@/components/recipe/FamilyRecipePreviewList.vue';
import UsersNewFamilyRecipeModal from '@/components/modal/UsersNewFamilyRecipeModal.vue';

export default {
  name: 'UsersFamilyRecipesPage',
  components: {
    FamilyRecipePreviewList,
    UsersNewFamilyRecipeModal
  },
  data() {
    return {
      familyRecipes: [],
      loading: false,
      hasLoaded: false,
      errorMessage: '',
      showCreateModal: false
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
          // Keep the family recipes in their original format
          this.familyRecipes = response.data || [];
          console.log('Processed family recipes:', this.familyRecipes);
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
    
    handleRecipeDeleted(recipeId) {
      console.log('Recipe deleted on family recipes page:', recipeId);
      
      // Remove the deleted recipe from the list
      this.familyRecipes = this.familyRecipes.filter(
        recipe => recipe.id !== recipeId
      );
    },

    onFamilyRecipeCreated(data) {
      console.log('Family recipe created:', data);
      
      // Refresh the family recipes list
      this.fetchFamilyRecipes();
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  /* Ensure modals are not clipped by this container */
  overflow: visible;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-weight: 700;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.family-recipes {
  margin-top: 2rem;
}

.recipes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 1rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.text-center {
  text-align: center;
}

@media (max-width: 768px) {
  .recipes-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>