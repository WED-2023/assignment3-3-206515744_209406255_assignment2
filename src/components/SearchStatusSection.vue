<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="text-center mt-4 pulse">
      <div class="loading-animation">
        <div class="spinner"></div>
        <p class="pulse-text">Searching...</p>
      </div>
    </div>

    <!-- No results message -->
    <div v-if="hasSearched && searchResults.length === 0 && !loading && !errorMessage" class="text-center mt-4 slide-in-up">
      <div class="alert alert-info">
        <h4>No recipes found</h4>
        <p>No recipes found for "{{ lastSearchQuery }}"{{ searchCriteriaText }}.</p>
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
export default {
  name: "SearchStatusSection",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    hasSearched: {
      type: Boolean,
      default: false
    },
    searchResults: {
      type: Array,
      required: true
    },
    errorMessage: {
      type: String,
      default: ""
    },
    lastSearchQuery: {
      type: String,
      default: ""
    },
    searchCriteriaText: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
.loading-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
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

.alert h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.alert p {
  margin: 0 0 1rem 0;
}

.alert p:last-child {
  margin-bottom: 0;
}

.mt-4 {
  margin-top: 1.5rem;
}

.text-center {
  text-align: center;
}

/* Animation classes */
.pulse {
  animation: pulse 2s infinite;
}

.pulse-text {
  animation: pulseText 2s ease-in-out infinite;
}

.slide-in-up {
  opacity: 0;
  transform: translateY(30px);
  animation: slideInUp 0.8s ease-out forwards;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes pulseText {
  0%, 100% { 
    color: inherit;
    transform: scale(1);
  }
  50% { 
    color: #42b983;
    transform: scale(1.02);
  }
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
</style>
