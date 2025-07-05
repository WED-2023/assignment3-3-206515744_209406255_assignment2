<template>
  <div v-if="searchResults.length > 0 && !loading" class="search-results mt-4 fade-in-up-delayed">
    <div class="results-header">
      <h3 class="slide-in-left">
        Search Results ({{ searchResults.length }} found)
        <small v-if="isRestoredSearch" class="text-muted restored-indicator">
          <i class="fas fa-history"></i> Last search restored
        </small>
      </h3>
      <div class="sort-controls">
        <label for="sortBy">Sort by:</label>
        <select 
          id="sortBy" 
          :value="sortBy" 
          @change="$emit('update:sort-by', $event.target.value)"
          class="form-control form-control-sm"
        >
          <option value="">Default</option>
          <option value="time">Time to make</option>
          <option value="score">Spoonacular score</option>
        </select>
      </div>
    </div>
    <RecipePreviewList 
      :recipes="sortedResults" 
      title="" 
      class="center"
      @recipe-action-changed="$emit('recipe-action-changed', $event)"
    />
  </div>
</template>

<script>
import RecipePreviewList from "../recipe/RecipePreviewList.vue";

export default {
  name: "SearchResultsSection",
  components: {
    RecipePreviewList
  },
  props: {
    searchResults: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    sortBy: {
      type: String,
      default: ""
    },
    isRestoredSearch: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:sort-by', 'recipe-action-changed'],
  computed: {
    sortedResults() {
      if (!this.sortBy || this.searchResults.length === 0) {
        return this.searchResults;
      }
      
      const sorted = [...this.searchResults];
      
      if (this.sortBy === 'time') {
        return sorted.sort((a, b) => {
          const timeA = a.readyInMinutes || a.cookingMinutes || 0;
          const timeB = b.readyInMinutes || b.cookingMinutes || 0;
          return timeA - timeB; // Ascending order (shortest time first)
        });
      } else if (this.sortBy === 'score') {
        return sorted.sort((a, b) => {
          const scoreA = a.spoonacularScore || a.score || 0;
          const scoreB = b.spoonacularScore || b.score || 0;
          return scoreB - scoreA; // Descending order (highest score first)
        });
      }
      
      return sorted;
    }
  }
};
</script>

<style lang="scss" scoped>
.search-results {
  margin-top: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.results-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.restored-indicator {
  font-size: 0.875rem;
  font-weight: 400;
  color: #6c757d;
  margin-left: 0.5rem;
}

.restored-indicator i {
  margin-right: 0.25rem;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-controls label {
  margin: 0;
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
}

.form-control {
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.2rem;
  min-width: 140px;
}

.form-control:focus {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.mt-4 {
  margin-top: 1.5rem;
}

.text-muted {
  color: #6c757d;
}

.center {
  text-align: center;
}

/* Animation classes */
.fade-in-up-delayed {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
}

.slide-in-left {
  opacity: 0;
  transform: translateX(-30px);
  animation: slideInLeft 0.8s ease-out 0.2s forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .sort-controls {
    width: 100%;
    justify-content: flex-start;
  }
  
  .form-control-sm {
    min-width: 120px;
  }
}
</style>
