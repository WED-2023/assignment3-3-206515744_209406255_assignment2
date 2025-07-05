<template>
  <div class="container fade-in">
    <h1 class="title fade-in-down">Search Page</h1>
    
    <!-- Search Form -->
    <SearchFormSection
      :form="form"
      :loading="loading"
      :show-advanced="showAdvanced"
      :all-cuisines="allCuisines"
      :diet-options="dietOptions"
      :all-intolerances="allIntolerances"
      @search="onSearch"
      @toggle-advanced="showAdvanced = !showAdvanced"
      @update:query="form.query = $event"
      @update:form="form = $event"
      @clear-all-filters="clearAllFilters"
    />

    <!-- Search Status (Loading, Error, No Results) -->
    <SearchStatusSection
      :loading="loading"
      :has-searched="hasSearched"
      :search-results="searchResults"
      :error-message="errorMessage"
      :last-search-query="lastSearchQuery"
      :search-criteria-text="getSearchCriteriaText()"
    />

    <!-- Search Results -->
    <SearchResultsSection
      :search-results="searchResults"
      :loading="loading"
      :sort-by="sortBy"
      :is-restored-search="isRestoredSearch"
      @update:sort-by="sortBy = $event"
      @recipe-action-changed="onRecipeActionChanged"
    />
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import SearchFormSection from "../components/search/SearchFormSection.vue";
import SearchStatusSection from "../components/search/SearchStatusSection.vue";
import SearchResultsSection from "../components/search/SearchResultsSection.vue";

export default {
  components: {
    SearchFormSection,
    SearchStatusSection,
    SearchResultsSection
  },
  data() {
    return {
      form: {
        query: "",
        number: "5", // Default to 5 results
        cuisine: "", // Single cuisine selection
        diet: "", // Single diet selection
        intolerance: "" // Single intolerance selection
      },
      searchResults: [],
      sortBy: "", // For sorting results
      loading: false,
      hasSearched: false,
      lastSearchQuery: "",
      lastSearchCriteria: {},
      errorMessage: "",
      showAdvanced: false,
      
      // All cuisine options
      allCuisines: ['Italian', 'American', 'Chinese', 'Mexican', 'French', 'Indian', 'African', 'British', 'Cajun', 'Caribbean', 'Eastern European', 'European', 'German', 'Greek', 'Irish', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'],
      
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
      
      // All intolerance options
      allIntolerances: ['gluten', 'dairy', 'peanut', 'soy', 'egg', 'grain', 'seafood', 'sesame', 'shellfish', 'sulfite', 'tree nut', 'wheat'],

      userLikedRecipes: [],
      userFavoriteRecipes: [],
      isFromRestoredSearch: false // Track if current results are from restoration
    };
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const axios = internalInstance.appContext.config.globalProperties.axios;

    return { store, axios };
  },
  watch: {
    // Clear saved search results when user logs out
    'store.username'(newValue, oldValue) {
      // If user logged out (had a username, now doesn't)
      if (oldValue && !newValue) {
        console.log('User logged out, clearing saved search results');
        this.clearSavedSearchResults();
        // Optionally clear current search results too
        this.searchResults = [];
        this.hasSearched = false;
        this.lastSearchQuery = '';
        this.lastSearchCriteria = {};
      }
    }
  },
  mounted() {
    // Restore last search results when component mounts
    this.restoreLastSearchResults();
  },
  computed: {
    isRestoredSearch() {
      return this.isFromRestoredSearch && this.searchResults.length > 0;
    }
  },
  methods: {
    clearAllFilters() {
      this.form.cuisine = "";
      this.form.diet = "";
      this.form.intolerance = "";
      this.form.number = "5";
    },

    saveSearchResults() {
      // Only save if there are search results
      if (this.searchResults.length > 0) {
        const searchData = {
          results: this.searchResults,
          query: this.lastSearchQuery,
          criteria: this.lastSearchCriteria,
          form: { ...this.form },
          timestamp: Date.now(),
          hasSearched: this.hasSearched
        };
        
        try {
          localStorage.setItem('lastSearchResults', JSON.stringify(searchData));
          console.log('Search results saved to localStorage');
        } catch (error) {
          console.error('Failed to save search results to localStorage:', error);
        }
      }
    },

    restoreLastSearchResults() {
      try {
        const savedData = localStorage.getItem('lastSearchResults');
        if (!savedData) {
          console.log('No saved search results found');
          return;
        }

        const searchData = JSON.parse(savedData);
        
        // Check if the data is recent (within 24 hours to avoid stale data)
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (Date.now() - searchData.timestamp > twentyFourHours) {
          console.log('Saved search results are too old, clearing them');
          localStorage.removeItem('lastSearchResults');
          return;
        }

        // Restore the search state
        this.searchResults = searchData.results || [];
        this.lastSearchQuery = searchData.query || '';
        this.lastSearchCriteria = searchData.criteria || {};
        this.hasSearched = searchData.hasSearched || false;
        this.isFromRestoredSearch = true; // Mark as restored
        
        // Restore form state
        if (searchData.form) {
          this.form = { ...this.form, ...searchData.form };
        }

        console.log('Last search results restored:', this.searchResults.length, 'recipes');
        
        // Fetch current user liked/favorite status to update the restored results
        if (this.store.username) {
          this.fetchUserLikedRecipes();
          this.fetchUserFavoriteRecipes();
        }
        
      } catch (error) {
        console.error('Failed to restore search results from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('lastSearchResults');
      }
    },

    clearSavedSearchResults() {
      try {
        localStorage.removeItem('lastSearchResults');
        console.log('Saved search results cleared');
      } catch (error) {
        console.error('Failed to clear saved search results:', error);
      }
    },

    async onSearch() {
      if (!this.form.query.trim()) return;

      this.loading = true;
      this.errorMessage = "";
      this.lastSearchQuery = this.form.query;
      this.hasSearched = true;
      this.isFromRestoredSearch = false; // Clear restoration flag on new search

      // Build search parameters
      const params = {
        query: this.form.query
      };

      // Add optional parameters if they have values
      if (this.form.number && parseInt(this.form.number) > 0) {
        params.number = parseInt(this.form.number);
      }

      if (this.form.cuisine && this.form.cuisine.trim()) {
        params.cuisines = this.form.cuisine; // Backend expects 'cuisines' parameter
      }

      if (this.form.diet && this.form.diet.trim()) {
        params.diet = this.form.diet;
      }

      if (this.form.intolerance && this.form.intolerance.trim()) {
        params.intolerances = this.form.intolerance; // Backend expects 'intolerances' parameter
      }

      // Store criteria for display purposes
      this.lastSearchCriteria = { ...params };

      try {
        console.log("Search params:", params);
        
        // Execute search and fetch both liked and favorite recipes in parallel
        const [searchResponse] = await Promise.all([
          this.axios.get('/recipes/search', { params }), // Use this.axios instead of window.axios
          this.fetchUserLikedRecipes(),
          this.fetchUserFavoriteRecipes()
        ]);
        
        console.log("Search response:", searchResponse);
        console.log("Liked recipes:", this.userLikedRecipes);
        console.log("Favorite recipes:", this.userFavoriteRecipes);
        
        // Get search results - backend returns recipes directly for search endpoint
        const recipes = searchResponse.data || [];
        
        // Mark recipes as liked/favorited
        this.searchResults = this.markRecipeStates(recipes);
        
        // Save search results to localStorage for browser persistence
        this.saveSearchResults();
        
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
      if (!this.store.username) {
        this.userLikedRecipes = [];
        return [];
      }

      try {
        const response = await this.axios.get('/users/liked');
        this.userLikedRecipes = response.data.recipes || response.data || [];
        return this.userLikedRecipes;
      } catch (error) {
        console.error("Failed to fetch liked recipes:", error);
        this.userLikedRecipes = [];
        return [];
      }
    },

    async fetchUserFavoriteRecipes() {
      if (!this.store.username) {
        this.userFavoriteRecipes = [];
        return [];
      }

      try {
        const response = await this.axios.get('/users/favorites');
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
      
      if (this.form.cuisine) {
        criteria.push(`cuisine: ${this.form.cuisine}`);
      }
      
      if (this.form.diet) {
        criteria.push(`diet: ${this.getDietLabel(this.form.diet)}`);
      }
      
      if (this.form.intolerance) {
        criteria.push(`intolerance: ${this.form.intolerance}`);
      }

      return criteria.length > 0 ? ` with ${criteria.join(', ')}` : '';
    },

    getDietLabel(dietValue) {
      const diet = this.dietOptions.find(d => d.value === dietValue);
      return diet ? diet.label : dietValue;
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
  margin-bottom: 2rem;
  color: #2c3e50;
  font-weight: 600;
  font-size: 2.5rem;
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

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
}
</style>
