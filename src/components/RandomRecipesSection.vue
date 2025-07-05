<template>
  <div class="recipe-section slide-in-left">
    <div class="section-header">
      <h2 class="pulse-text">Explore These Recipes</h2>
    </div>
    
    <div class="section-content">
      <div class="content-area">
        <!-- Loading state -->
        <div v-if="loading && recipes.length === 0" class="text-center py-4 pulse">
          <div class="loading-animation">
            <div class="spinner"></div>
            <p class="pulse-text">Loading random recipes...</p>
          </div>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="alert alert-danger slide-in-right">
          <h4>Error Loading Random Recipes</h4>
          <p>{{ error }}</p>
          <button @click="$emit('retry')" class="btn btn-outline-primary hover-lift">
            <i class="fas fa-redo"></i> Try Again
          </button>
        </div>
        
        <!-- Recipes list -->
        <div v-else class="fade-in-up-delayed">
          <RecipePreviewList
            title=""
            :recipes="recipes"
            class="recipe-list"
            @recipe-action-changed="$emit('recipe-action-changed', $event)"
          />
        </div>
      </div>
      
      <!-- Get New Random Recipes Button -->
      <div v-if="!error && (!loading || recipes.length > 0)" class="button-area text-center">
        <button 
          @click="$emit('get-new-recipes')"
          :disabled="loading"
          class="btn btn-primary load-more-btn hover-scale"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-sync-alt"></i>
          {{ loading ? 'Loading...' : 'Get New Random Recipes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from "./RecipePreviewList.vue";

export default {
  name: 'RandomRecipesSection',
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
    }
  },
  emits: ['get-new-recipes', 'retry', 'recipe-action-changed']
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

.text-center {
  text-align: center;
}

.py-4 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

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

.pulse {
  animation: pulse 2s infinite;
}

.pulse-text {
  animation: pulseText 2s ease-in-out infinite;
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

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

.slide-in-right {
  opacity: 0;
  transform: translateX(30px);
  animation: slideInRight 0.8s ease-out 0.4s forwards;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
