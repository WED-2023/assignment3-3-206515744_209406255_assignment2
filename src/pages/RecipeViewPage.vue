<template>
    <div class="container fade-in">
      <div v-if="loading" class="text-center mt-4 pulse">
        <div class="loading-animation">
          <div class="spinner"></div>
          <p class="pulse-text">Loading recipe...</p>
        </div>
      </div>
      
      <div v-if="recipe && !loading" class="slide-in-up">      <div class="recipe-header mt-3 mb-4">
        <h1 class="fade-in-down">{{ recipe.title }}</h1>
        <div class="image-container">
          <img 
            v-if="recipe.image" 
            :src="recipe.image" 
            class="center hover-lift" 
            :alt="recipe.title"
          />
          <div v-else class="center no-image-placeholder hover-lift pulse-slow">
            <i class="fas fa-utensils"></i>
            <p>No image available</p>
          </div>
        </div>
          
          <!-- Dietary badges - styled same as preview -->
          <div class="diet-info mt-2 slide-in-left">
            <span v-if="recipe.vegan" class="badge badge-success hover-scale">🌱 Vegan</span>
            <span v-else-if="recipe.vegetarian" class="badge badge-warning hover-scale">🥬 Vegetarian</span>
            <span v-if="recipe.glutenFree" class="badge badge-info hover-scale">🌾 Gluten Free</span>
          </div>
          
          <!-- Toggle for full/basic view -->
          <div class="view-toggle mt-3 text-center slide-in-right">
            <div class="form-check form-check-inline">
              <input 
                class="form-check-input" 
                type="radio" 
                name="viewType" 
                id="basicView" 
                value="basic"
                v-model="viewType"
              >
              <label class="form-check-label" for="basicView">
                Basic View
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input 
                class="form-check-input" 
                type="radio" 
                name="viewType" 
                id="fullView" 
                value="full"
                v-model="viewType"
              >
              <label class="form-check-label" for="fullView">
                Full Details
              </label>
            </div>
          </div>
        </div>
        
        <div class="recipe-body">
          <div class="wrapper">
            <div class="wrapped">
              <!-- Basic view information - always shown -->
              <div class="mb-3">
                <div><strong>Ready in:</strong> {{ recipe.readyInMinutes }} minutes</div>
                <div><strong>Spoonacular Score:</strong> {{ recipe.spoonacularScore }}</div>
              </div>
              
              <!-- Additional info for full view only -->
              <div v-if="viewType === 'full'" class="mb-3">
                <div v-if="recipe.numberOfPortions"><strong>Serves:</strong> {{ recipe.numberOfPortions }} portions</div>
              </div>
              
              <!-- Ingredients section - only show in full view -->
              <div v-if="viewType === 'full'" class="ingredients-section">
                <h4>Ingredients:</h4>
                <div v-if="!recipe.ingredients || recipe.ingredients.length === 0">
                  <p>No ingredients available</p>
                </div>
                <ul v-else>
                  <li
                    v-for="(ingredient, index) in recipe.ingredients"
                    :key="index"
                  >
                    {{ ingredient.amount }} {{ ingredient.unit }} {{ ingredient.name }}
                    <span v-if="ingredient.description"> - {{ ingredient.description }}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div class="wrapped">
              <!-- Instructions section - only show in full view -->
              <div v-if="viewType === 'full'" class="instructions-section">
                <h4>Instructions:</h4>
                <div v-if="!recipe.instructions || recipe.instructions.length === 0">
                  <p>No instructions available</p>
                </div>
                <ol v-else>
                  <li v-for="(instruction, index) in recipe.instructions" :key="index">
                    {{ instruction }}
                  </li>
                </ol>
              </div>
              
              <!-- Equipment section - only show in full view -->
              <div v-if="viewType === 'full' && recipe.equipment && recipe.equipment.length > 0" class="equipment-section mt-3">
                <h4>Equipment needed:</h4>
                <ul>
                  <li v-for="(item, index) in recipe.equipment" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- Summary section - only show in full view -->
          <div v-if="viewType === 'full' && recipe.summary" class="recipe-summary mt-4">
            <h4>Summary</h4>
            <p v-html="recipe.summary"></p>
          </div>
          
          <!-- Message for basic view -->
          <div v-if="viewType === 'basic'" class="basic-view-message mt-4 text-center">
            <p class="text-muted">Switch to "Full Details" to see ingredients, instructions, equipment, servings, and detailed summary.</p>
          </div>
        </div>
        
        <!-- Prepare button -->
        <div class="text-center mb-4">
          <button class="btn btn-primary" @click="goToPreparation">Prepare this recipe</button>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="errorMessage" class="alert alert-danger mt-4">
        {{ errorMessage }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
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
  .wrapper {
    display: flex;
    gap: 2rem;
  }
  .wrapped {
    width: 50%;
  }
  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  }

  .no-image-placeholder {
    margin: 2rem auto;
    padding: 3rem;
    background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
    color: white;
    text-align: center;
    border-radius: 10px;
    max-width: 400px;
  }

  .no-image-placeholder i {
    font-size: 4rem;
    margin-bottom: 1rem;
    display: block;
  }

  .view-toggle {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background-color: #f9f9f9;
    margin: 1rem auto;
    max-width: 300px;
  }

  .form-check-inline {
    margin-right: 2rem;
  }

  .form-check-input {
    margin-right: 0.5rem;
  }

  .ingredients-section, .instructions-section, .equipment-section {
    margin-bottom: 2rem;
  }

  .basic-view-message {
    padding: 2rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .recipe-header {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .recipe-header h1 {
    color: #2c3e50;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  .ingredients-section h3, .instructions-section h3, .equipment-section h3 {
    color: #2c3e50;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  /* Dietary badges styling (same as preview) */
  .diet-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }

  .badge {
    display: inline-block;
    padding: 0.25em 0.5em;
    font-size: 0.75em;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.375rem;
  }

  .badge-success {
    color: #fff;
    background-color: #28a745;
  }

  .badge-warning {
    color: #212529;
    background-color: #ffc107;
  }

  .badge-info {
    color: #fff;
    background-color: #17a2b8;
  }

  .recipe-summary {
    border-top: 1px solid #ddd;
    padding-top: 1rem;
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

  .text-muted {
    color: #6c757d;
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

  .slide-in-up {
    opacity: 0;
    transform: translateY(30px);
    animation: slideInUp 0.8s ease-out forwards;
  }

  .slide-in-left {
    opacity: 0;
    transform: translateX(-30px);
    animation: slideInLeft 0.8s ease-out 0.3s forwards;
  }

  .slide-in-right {
    opacity: 0;
    transform: translateX(30px);
    animation: slideInRight 0.8s ease-out 0.5s forwards;
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  .pulse-text {
    animation: pulseText 2s ease-in-out infinite;
  }

  .pulse-slow {
    animation: pulseSlow 3s ease-in-out infinite;
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

  @keyframes pulseSlow {
    0%, 100% { 
      opacity: 1;
      transform: scale(1);
    }
    50% { 
      opacity: 0.8;
      transform: scale(1.02);
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
