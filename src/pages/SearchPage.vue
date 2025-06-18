<template>
  <div class="container">
    <h1 class="title">Search Page</h1>
    
    <div class="search-form">
      <form @submit.prevent="onSearch">
        <!-- Main search field -->
        <FormField
          label="Search Recipes:"
          name="query"
          type="text"
          placeholder="Enter recipe name, ingredients, or keywords..."
          v-model="form.query"
          :required="true"
          :requirements="['Required field']"
          autocomplete="on"
        />

        <!-- Advanced filters toggle -->
        <div class="advanced-toggle">
          <button 
            type="button" 
            @click="showAdvanced = !showAdvanced"
            class="btn btn-link"
          >
            <i class="fas fa-filter"></i>
            {{ showAdvanced ? 'Hide' : 'Show' }} Advanced Filters
            <i :class="showAdvanced ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </button>
        </div>

        <!-- Advanced filters (collapsible) -->
        <div v-if="showAdvanced" class="advanced-filters">
          <div class="row">
            <div class="col-md-6">
              <!-- Number of results as radio buttons -->
              <div class="form-group">
                <label>Number of Results:</label>
                <div class="radio-group">
                  <div class="form-check form-check-inline">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      name="numberOfResults" 
                      id="results5" 
                      value="5"
                      v-model="form.number"
                    >
                    <label class="form-check-label" for="results5">5</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      name="numberOfResults" 
                      id="results10" 
                      value="10"
                      v-model="form.number"
                    >
                    <label class="form-check-label" for="results10">10</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      name="numberOfResults" 
                      id="results15" 
                      value="15"
                      v-model="form.number"
                    >
                    <label class="form-check-label" for="results15">15</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <!-- Cuisine chips -->
              <div class="form-group">
                <label>Cuisines:</label>
                <div class="chip-container">
                  <div 
                    v-for="cuisine in popularCuisines" 
                    :key="cuisine"
                    @click="toggleCuisine(cuisine)"
                    :class="['chip', { 'chip-selected': form.cuisines.includes(cuisine) }]"
                  >
                    {{ cuisine }}
                  </div>
                </div>
                <div class="more-options">
                  <button 
                    type="button" 
                    @click="showAllCuisines = !showAllCuisines"
                    class="btn btn-sm btn-outline-secondary"
                  >
                    {{ showAllCuisines ? 'Show Less' : 'More Cuisines...' }}
                  </button>
                </div>
                <div v-if="showAllCuisines" class="chip-container mt-2">
                  <div 
                    v-for="cuisine in otherCuisines" 
                    :key="cuisine"
                    @click="toggleCuisine(cuisine)"
                    :class="['chip', { 'chip-selected': form.cuisines.includes(cuisine) }]"
                  >
                    {{ cuisine }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <!-- Diet chips -->
              <div class="form-group">
                <label>Diet:</label>
                <div class="chip-container">
                  <div 
                    v-for="diet in dietOptions" 
                    :key="diet.value"
                    @click="toggleDiet(diet.value)"
                    :class="['chip', { 'chip-selected': form.diet.includes(diet.value) }]"
                  >
                    {{ diet.label }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <!-- Intolerances chips -->
              <div class="form-group">
                <label>Intolerances:</label>
                <div class="chip-container">
                  <div 
                    v-for="intolerance in commonIntolerances" 
                    :key="intolerance"
                    @click="toggleIntolerance(intolerance)"
                    :class="['chip', { 'chip-selected': form.intolerances.includes(intolerance) }]"
                  >
                    {{ intolerance }}
                  </div>
                </div>
                <div class="more-options">
                  <button 
                    type="button" 
                    @click="showAllIntolerances = !showAllIntolerances"
                    class="btn btn-sm btn-outline-secondary"
                  >
                    {{ showAllIntolerances ? 'Show Less' : 'More...' }}
                  </button>
                </div>
                <div v-if="showAllIntolerances" class="chip-container mt-2">
                  <div 
                    v-for="intolerance in otherIntolerances" 
                    :key="intolerance"
                    @click="toggleIntolerance(intolerance)"
                    :class="['chip', { 'chip-selected': form.intolerances.includes(intolerance) }]"
                  >
                    {{ intolerance }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Active filters display -->
          <div v-if="hasActiveFilters" class="active-filters">
            <small class="text-muted">Active filters:</small>
            <div class="active-chips">
              <span v-if="form.number !== '5'" class="active-chip">
                {{ form.number }} results <i @click="form.number = '5'" class="fas fa-times"></i>
              </span>
              <span v-for="cuisine in form.cuisines" :key="'c-'+cuisine" class="active-chip">
                {{ cuisine }} <i @click="removeCuisine(cuisine)" class="fas fa-times"></i>
              </span>
              <span v-for="diet in form.diet" :key="'d-'+diet" class="active-chip">
                {{ diet }} <i @click="removeDiet(diet)" class="fas fa-times"></i>
              </span>
              <span v-for="intolerance in form.intolerances" :key="'i-'+intolerance" class="active-chip">
                {{ intolerance }} <i @click="removeIntolerance(intolerance)" class="fas fa-times"></i>
              </span>
              <button type="button" @click="clearAllFilters" class="btn btn-sm btn-outline-danger">
                Clear All
              </button>
            </div>
          </div>
        </div>
        
        <SubmitButton
          :is-loading="loading"
          :is-form-valid="!!form.query.trim()"
          default-text="Search"
          loading-text="Searching..."
          variant="btn-primary"
          :tooltip-fields="form.query.trim() ? [] : ['Search query is required']"
          tooltip-title="Form incomplete"
        />
      </form>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center mt-4">
      <p>Searching...</p>
    </div>

    <!-- Search results -->
    <div v-if="searchResults.length > 0 && !loading" class="search-results mt-4">
      <h3>Search Results ({{ searchResults.length }} found)</h3>
      <RecipePreviewList 
        :recipes="searchResults" 
        title="" 
        class="center"
      />
    </div>

    <!-- No results message -->
    <div v-if="hasSearched && searchResults.length === 0 && !loading && !errorMessage" class="text-center mt-4">
      <div class="alert alert-info">
        <h4>No recipes found</h4>
        <p>No recipes found for "{{ lastSearchQuery }}"{{ getSearchCriteriaText() }}.</p>
        <p>Try different keywords or adjust your search criteria.</p>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="alert alert-danger mt-4">
      <h4>Search Error</h4>
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";
import FormField from "../components/FormField.vue";
import SubmitButton from "../components/SubmitButton.vue";

export default {
  components: {
    RecipePreviewList,
    FormField,
    SubmitButton
  },
  data() {
    return {
      form: {
        query: "",
        number: "5", // Changed to string to work with radio buttons
        cuisines: [],
        diet: [],
        intolerances: []
      },
      searchResults: [],
      loading: false,
      hasSearched: false,
      lastSearchQuery: "",
      lastSearchCriteria: {},
      errorMessage: "",
      showAdvanced: false,
      showAllCuisines: false,
      showAllIntolerances: false,
      
      // Popular options shown first
      popularCuisines: ['Italian', 'American', 'Chinese', 'Mexican', 'French', 'Indian'],
      otherCuisines: ['African', 'British', 'Cajun', 'Caribbean', 'Eastern European', 'European', 'German', 'Greek', 'Irish', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'],
      
      dietOptions: [
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'gluten free', label: 'Gluten Free' },
        { value: 'ketogenic', label: 'Keto' },
        { value: 'paleo', label: 'Paleo' },
        { value: 'pescetarian', label: 'Pescetarian' },
        { value: 'lacto-vegetarian', label: 'Lacto-Vegetarian' },
        { value: 'ovo-vegetarian', label: 'Ovo-Vegetarian' },
        { value: 'primal', label: 'Primal' },
        { value: 'whole30', label: 'Whole30' }
      ],
      
      commonIntolerances: ['gluten', 'dairy', 'peanut', 'soy'],
      otherIntolerances: ['egg', 'grain', 'seafood', 'sesame', 'shellfish', 'sulfite', 'tree nut', 'wheat'],

      userLikedRecipes: [],
      userFavoriteRecipes: [] // Add this
    };
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const axios = internalInstance.appContext.config.globalProperties.axios;

    return { store, axios };
  },
  computed: {
    hasActiveFilters() {
      return this.form.number !== "5" || this.form.cuisines.length > 0 || this.form.diet.length > 0 || this.form.intolerances.length > 0;
    }
  },
  methods: {
    toggleCuisine(cuisine) {
      const index = this.form.cuisines.indexOf(cuisine);
      if (index > -1) {
        this.form.cuisines.splice(index, 1);
      } else {
        this.form.cuisines.push(cuisine);
      }
    },
    
    toggleDiet(diet) {
      const index = this.form.diet.indexOf(diet);
      if (index > -1) {
        this.form.diet.splice(index, 1);
      } else {
        this.form.diet.push(diet);
      }
    },
    
    toggleIntolerance(intolerance) {
      const index = this.form.intolerances.indexOf(intolerance);
      if (index > -1) {
        this.form.intolerances.splice(index, 1);
      } else {
        this.form.intolerances.push(intolerance);
      }
    },
    
    removeCuisine(cuisine) {
      this.form.cuisines = this.form.cuisines.filter(c => c !== cuisine);
    },
    
    removeDiet(diet) {
      this.form.diet = this.form.diet.filter(d => d !== diet);
    },
    
    removeIntolerance(intolerance) {
      this.form.intolerances = this.form.intolerances.filter(i => i !== intolerance);
    },
    
    clearAllFilters() {
      this.form.cuisines = [];
      this.form.diet = [];
      this.form.intolerances = [];
      this.form.number = "5";
    },

    async onSearch() {
      if (!this.form.query.trim()) return;

      this.loading = true;
      this.errorMessage = "";
      this.lastSearchQuery = this.form.query;
      this.hasSearched = true;

      // Build search parameters
      const params = {
        query: this.form.query
      };

      // Add optional parameters if they have values
      if (this.form.number && parseInt(this.form.number) > 0) {
        params.number = parseInt(this.form.number);
      }

      if (this.form.cuisines && this.form.cuisines.length > 0) {
        params.cuisines = this.form.cuisines.join(',');
      }

      if (this.form.diet && this.form.diet.length > 0) {
        params.diet = this.form.diet.join(',');
      }

      if (this.form.intolerances && this.form.intolerances.length > 0) {
        params.intolerances = this.form.intolerances.join(',');
      }

      // Store criteria for display purposes
      this.lastSearchCriteria = { ...params };

      try {
        console.log("Search params:", params);
        
        // Execute search and fetch both liked and favorite recipes in parallel
        const [searchResponse] = await Promise.all([
          window.axios.get('/recipes/search', { params }),
          this.fetchUserLikedRecipes(),
          this.fetchUserFavoriteRecipes() // Add this
        ]);
        
        console.log("Search response:", searchResponse);
        console.log("Liked recipes:", this.userLikedRecipes);
        console.log("Favorite recipes:", this.userFavoriteRecipes);
        
        // Get search results
        const recipes = searchResponse.data.recipes || searchResponse.data || [];
        
        // Mark recipes as liked/favorited
        this.searchResults = this.markRecipeStates(recipes);
        
      } catch (error) {
        console.error("Search failed:", error);
        
        if (error.response?.status === 404) {
          // Handle 404 - no recipes found
          this.errorMessage = error.response.data?.message || "No recipes found for the given criteria";
          this.searchResults = [];
        } else {
          // Handle other errors
          this.errorMessage = error.response?.data?.message || "Search failed. Please try again.";
          this.searchResults = [];
        }
      } finally {
        this.loading = false;
      }
    },

    async fetchUserLikedRecipes() {
      // Only fetch if user is logged in
      if (!window.store.username) {
        this.userLikedRecipes = [];
        return [];
      }

      try {
        const response = await window.axios.get('/users/liked');
        this.userLikedRecipes = response.data.recipes || response.data || [];
        return this.userLikedRecipes;
      } catch (error) {
        console.error("Failed to fetch liked recipes:", error);
        this.userLikedRecipes = [];
        return [];
      }
    },

    async fetchUserFavoriteRecipes() {
      if (!this.$root.store.username) {
        this.userFavoriteRecipes = [];
        return [];
      }

      try {
        const response = await window.axios.get('/users/favorites');
        this.userFavoriteRecipes = response.data.recipes || response.data || [];
        return this.userFavoriteRecipes;
      } catch (error) {
        console.error("Failed to fetch favorite recipes:", error);
        this.userFavoriteRecipes = [];
        return [];
      }
    },

    markRecipeStates(recipes) {
      return recipes.map(recipe => {
        // Check if this recipe is liked
        const isLiked = this.userLikedRecipes.some(likedRecipe => 
          likedRecipe.id === recipe.id
        );
        
        // Check if this recipe is favorited
        const isFavorited = this.userFavoriteRecipes.some(favRecipe => 
          favRecipe.id === recipe.id
        );
        
        return {
          ...recipe,
          liked: isLiked,
          favorited: isFavorited
        };
      });
    },

    onRecipeActionChanged(data) {
      console.log('Recipe action changed on search page:', data);
      
      if (data.actionType === 'like') {
        if (data.isActive) {
          const recipe = this.searchResults.find(r => r.id === data.recipeId);
          if (recipe && !this.userLikedRecipes.some(lr => lr.id === data.recipeId)) {
            this.userLikedRecipes.push(recipe);
          }
        } else {
          this.userLikedRecipes = this.userLikedRecipes.filter(lr => lr.id !== data.recipeId);
        }
      } else if (data.actionType === 'favorite') {
        if (data.isActive) {
          const recipe = this.searchResults.find(r => r.id === data.recipeId);
          if (recipe && !this.userFavoriteRecipes.some(fr => fr.id === data.recipeId)) {
            this.userFavoriteRecipes.push(recipe);
          }
        } else {
          this.userFavoriteRecipes = this.userFavoriteRecipes.filter(fr => fr.id !== data.recipeId);
        }
      }
    },

    getSearchCriteriaText() {
      const criteria = [];
      
      if (this.form.number !== "5") {
        criteria.push(`${this.form.number} results`);
      }
      
      if (this.form.cuisines.length > 0) {
        criteria.push(`cuisines: ${this.form.cuisines.join(', ')}`);
      }
      
      if (this.form.diet.length > 0) {
        criteria.push(`diet: ${this.form.diet.join(', ')}`);
      }
      
      if (this.form.intolerances.length > 0) {
        criteria.push(`intolerances: ${this.form.intolerances.join(', ')}`);
      }

      return criteria.length > 0 ? ` with ${criteria.join(', ')}` : '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/form-style.scss";

.search-form {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.advanced-toggle {
  text-align: center;
  margin: 1rem 0;
  
  .btn-link {
    color: #007bff;
    text-decoration: none;
    border: none;
    background: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #e7f3ff;
      text-decoration: none;
    }
    
    i {
      margin: 0 0.5rem;
    }
  }
}

.advanced-filters {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin: 1rem 0;
}

.radio-group {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.form-check-inline {
  margin-right: 1rem;
}

.form-check-input {
  margin-right: 0.5rem;
}

.chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.chip {
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  
  &:hover {
    background-color: #dee2e6;
    transform: translateY(-1px);
  }
  
  &.chip-selected {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
}

.more-options {
  margin-top: 0.5rem;
}

.active-filters {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.active-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  align-items: center;
}

.active-chip {
  background-color: #28a745;
  color: white;
  border-radius: 15px;
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  i {
    cursor: pointer;
    font-size: 0.7rem;
    
    &:hover {
      color: #ffcccc;
    }
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.row {
  display: flex;
  margin: 0 -0.5rem;
}

.col-md-6 {
  flex: 0 0 50%;
  padding: 0 0.5rem;
}

.search-results h3 {
  color: #333;
  margin-bottom: 1rem;
}

.alert {
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
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

.text-muted {
  color: #6c757d;
}

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
</style>
