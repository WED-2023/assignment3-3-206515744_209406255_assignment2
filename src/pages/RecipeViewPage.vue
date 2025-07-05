<template>
  <div class="container fade-in">
    <!-- Status Section (Loading, Error) -->
    <RecipeStatusSection
      :loading="loading"
      :error-message="errorMessage"
    />
    
    <div v-if="recipe && !loading" class="slide-in-up">
      <!-- Recipe Header -->
      <RecipeHeaderSection
        :recipe="recipe"
        :view-type="viewType"
        @update:view-type="viewType = $event"
      />
      
      <div class="recipe-body">
        <!-- Basic Info -->
        <RecipeBasicInfoSection
          :recipe="recipe"
          :view-type="viewType"
          :is-user-or-family-recipe="isUserOrFamilyRecipe"
        />
        
        <!-- Recipe Details (Ingredients, Instructions, Equipment) -->
        <RecipeDetailsSection
          :recipe="recipe"
          :view-type="viewType"
        />
        
        <!-- Summary and Basic View Message -->
        <RecipeSummarySection
          :recipe="recipe"
          :view-type="viewType"
        />
      </div>
      
      <!-- Prepare button -->
      <div class="text-center mb-4">
        <button class="btn btn-primary prepare-btn" @click="goToPreparation">
          Prepare this recipe
        </button>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import RecipeHeaderSection from "../components/recipe/RecipeHeaderSection.vue";
  import RecipeBasicInfoSection from "../components/recipe/RecipeBasicInfoSection.vue";
  import RecipeDetailsSection from "../components/recipe/RecipeDetailsSection.vue";
  import RecipeSummarySection from "../components/recipe/RecipeSummarySection.vue";
  import RecipeStatusSection from "../components/recipe/RecipeStatusSection.vue";

  export default {
    components: {
      RecipeHeaderSection,
      RecipeBasicInfoSection,
      RecipeDetailsSection,
      RecipeSummarySection,
      RecipeStatusSection
    },
    data() {
      return {
        recipe: null,
        loading: false,
        errorMessage: "",
        viewType: "basic"
      };
    },
    async created() {
      await this.fetchFullRecipe();
    },
    computed: {
      // Determine the API endpoint based on the current route
      apiEndpoint() {
        const fullPath = this.$route.path;
        const recipeId = this.$route.params.recipeId;
        
        // Check if we're on a user's my-recipes route
        if (fullPath.includes('/users/my-recipes/')) {
          return `/users/my-recipes/${recipeId}`;
        }
        
        // Default to the general recipes endpoint
        return `/recipes/${recipeId}`;
      },
      
      // Check if this is a user-created or family recipe (no Spoonacular score)
      isUserOrFamilyRecipe() {
        return this.$route.path.includes('/users/my-recipes/') || 
               this.$route.path.includes('/family-recipes/') ||
               !this.recipe?.spoonacularScore;
      }
    },
    methods: {
      async fetchFullRecipe() {
        this.loading = true;
        this.errorMessage = "";
        
        try {
          const recipeId = this.$route.params.recipeId;
          console.log('Fetching recipe with ID:', recipeId);
          console.log('Using API endpoint:', this.apiEndpoint);
          
          // Use the computed endpoint based on the current route
          const response = await window.axios.get(this.apiEndpoint, { 
            params: { full: true } 
          });
          
          console.log('Recipe response:', response.data);

          if (response.status !== 200) {
            this.$router.replace("/NotFound");
            return;
          }

          this.recipe = response.data;
          
        } catch (error) {
          console.error("Failed to fetch recipe:", error);
          if (error.response?.status === 404) {
            this.$router.replace("/NotFound");
          } else {
            this.errorMessage = error.response?.data?.message || "Failed to load recipe. Please try again.";
          }
        } finally {
          this.loading = false;
        }
      },
      goToPreparation() {
        const id = this.recipe.id;
        // Only add if not already in meal plan
        const exists = window.store.mealPlan.some(r => r.id === id);
        if (!exists) {
          window.store.addToMealPlan({ id, title: this.recipe.title, image: this.recipe.image });
        }
        
        // Navigate to correct preparation route based on current route
        const isUserRecipe = this.$route.path.includes('/users/my-recipes/');
        const preparationPath = isUserRecipe 
          ? `/users/my-recipes/${id}/preparation`
          : `/recipes/${id}/preparation`;
          
        this.$router.push({ path: preparationPath });
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .recipe-body {
    margin-bottom: 2rem;
  }

  .prepare-btn {
    padding: 0.75rem 2rem;
    font-size: 1.1rem;
    font-weight: 500;
    border-radius: 25px;
    transition: all 0.3s ease;
    min-width: 200px;
  }

  .prepare-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
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
    border-radius: 0.25rem;
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

  .text-center {
    text-align: center;
  }

  .mb-4 {
    margin-bottom: 1.5rem;
  }

  /* Animation classes */
  .fade-in {
    opacity: 0;
    animation: fadeIn 0.8s ease-in-out forwards;
  }

  .slide-in-up {
    opacity: 0;
    transform: translateY(30px);
    animation: slideInUp 0.8s ease-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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

  /* Responsive design */
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
    
    .prepare-btn {
      min-width: 180px;
      font-size: 1rem;
    }
  }
  </style>
