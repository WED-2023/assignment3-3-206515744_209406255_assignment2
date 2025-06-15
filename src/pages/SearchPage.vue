<template>
  <div class="container">
    <h1 class="title">Search Page</h1>
    
    <div class="search-form">
      <form @submit.prevent="onSearch">
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
    <div v-if="hasSearched && searchResults.length === 0 && !loading" class="text-center mt-4">
      <p>No recipes found for "{{ lastSearchQuery }}". Try different keywords.</p>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="alert alert-danger mt-4">
      {{ errorMessage }}
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
        query: ""
      },
      searchResults: [],
      loading: false,
      hasSearched: false,
      lastSearchQuery: "",
      errorMessage: ""
    };
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const axios = internalInstance.appContext.config.globalProperties.axios;

    return { store, axios };
  },
  methods: {
    async onSearch() {
      if (!this.form.query.trim()) return;

      this.loading = true;
      this.errorMessage = "";
      this.lastSearchQuery = this.form.query;
      this.hasSearched = true;

      try {
        const response = await window.axios.post('/recipes/search', {
          params: {
            query: this.form.query
          }
        });

        this.searchResults = response.data.recipes || response.data || [];
      } catch (error) {
        console.error("Search failed:", error);
        this.errorMessage = error.response?.data?.message || "Search failed. Please try again.";
        this.searchResults = [];
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.search-form {
  max-width: 400px; /* Same as LoginPage */
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.search-results h3 {
  color: #333;
  margin-bottom: 1rem;
}

.alert {
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.center {
  text-align: center;
}
</style>
