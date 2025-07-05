<template>
  <div class="recipe-section slide-in-right">
    <div class="section-header">
      <h2 class="pulse-text">Last Viewed Recipes</h2>
    </div>

    <div class="section-content">
      <div class="content-area">
        <!-- Not logged in message -->
        <div v-if="!isLoggedIn" class="text-center mt-4">
          <div class="alert alert-info">
            <h4>Login Required</h4>
            <p>You need to be logged in to view your last viewed recipes.</p>
            <div class="auth-buttons">
              <router-link :to="{ name: 'login' }">
                <button class="btn btn-primary auth-btn">
                  <i class="fas fa-sign-in-alt"></i>
                  Login
                </button>
              </router-link>
              <router-link :to="{ name: 'register' }">
                <button class="btn btn-outline-primary auth-btn">
                  <i class="fas fa-user-plus"></i>
                  Register
                </button>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-else-if="loading && recipes.length === 0" class="text-center py-4">
          <p>Loading last viewed recipes...</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="alert alert-danger">
          <h4>Error Loading Viewed Recipes</h4>
          <p>{{ error }}</p>
          <button @click="$emit('retry')" class="btn btn-outline-primary">
            <i class="fas fa-redo"></i> Try Again
          </button>
        </div>
        
        <!-- No viewed recipes -->
        <div v-else-if="recipes.length === 0" class="text-center mt-4">
          <div class="alert alert-info">
            <h4>No Viewed Recipes</h4>
            <p>You haven't viewed any recipes yet.</p>
            <router-link :to="{ name: 'search' }">
              <button class="btn btn-primary">Search Recipes</button>
            </router-link>
          </div>
        </div>
        
        <!-- Recipes list -->
        <div v-else>
          <RecipePreviewList
            title=""
            :recipes="recipes"
            class="recipe-list"
            @recipe-action-changed="$emit('recipe-action-changed', $event)"
          />
        </div>
      </div>
      
      <!-- Load More Button -->
      <div v-if="isLoggedIn && (recipes.length > 0 || (!loading && !error))" class="button-area text-center">
        <!-- No more recipes message -->
        <div v-if="noMoreRecipes" class="alert alert-info mb-2">
          <small>
            <i class="fas fa-info-circle"></i>
            You've reached the end of your viewed recipes history.
          </small>
        </div>
        
        <button 
          @click="$emit('load-more')"
          :disabled="loading || noMoreRecipes"
          class="btn btn-primary load-more-btn"
          :class="{ 'btn-secondary': noMoreRecipes }"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          <i v-else-if="noMoreRecipes" class="fas fa-check"></i>
          <i v-else class="fas fa-plus"></i>
          {{ loading ? 'Loading...' : noMoreRecipes ? 'All Recipes Loaded' : 'Load 3 More Viewed Recipes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from "../recipe/RecipePreviewList.vue";

export default {
  name: 'LastViewedRecipesSection',
  components: {
    RecipePreviewList
  },
  props: {
    recipes: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    noMoreRecipes: {
      type: Boolean,
      default: false
    }
  },
  emits: ['load-more', 'retry', 'recipe-action-changed']
};
</script>

<style lang="scss" scoped>
.recipe-section {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 2.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.recipe-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.section-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.section-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.content-area {
  flex: 1;
}

.button-area {
  margin-top: auto;
  padding-top: 1rem;
}

.recipe-list {
  margin-top: 0;
  
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

.load-more-btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 25px;
  transition: all 0.3s ease;
  min-width: 200px;
}

.load-more-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.load-more-btn i {
  margin-right: 0.5rem;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.auth-btn {
  min-width: 120px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.auth-btn i {
  margin-right: 0.5rem;
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
  
  &:hover:not(:disabled) {
    background-color: #0056b3;
    border-color: #0056b3;
  }
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
  
  &:hover:not(:disabled) {
    background-color: #5a6268;
    border-color: #545b62;
  }
}

.btn-outline-primary {
  color: #007bff;
  background-color: transparent;
  border-color: #007bff;
  
  &:hover:not(:disabled) {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.text-center {
  text-align: center;
}

.py-4 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.pulse-text {
  animation: pulseText 2s ease-in-out infinite;
}

.slide-in-right {
  opacity: 0;
  transform: translateX(30px);
  animation: slideInRight 0.8s ease-out 0.4s forwards;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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

.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
