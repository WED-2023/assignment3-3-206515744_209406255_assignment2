<template>
    <div class="container">
      <div v-if="loading" class="text-center mt-4">
        <p>Loading recipe...</p>
      </div>
      
      <div v-if="recipe && !loading">
        <div class="recipe-header mt-3 mb-4">
          <h1>{{ recipe.title }}</h1>
          <img :src="recipe.image" class="center" />
          
          <!-- Toggle for full/basic view -->
          <div class="view-toggle mt-3 text-center">
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
                <div><strong>Recipe ID:</strong> {{ recipe.id }}</div>
                <div><strong>Ready in:</strong> {{ recipe.readyInMinutes }} minutes</div>
                <div><strong>Spoonacular Score:</strong> {{ recipe.spoonacularScore }}</div>
              </div>
              
              <!-- Dietary badges - always shown -->
              <div class="mb-3">
                <span v-if="recipe.vegan" class="badge badge-success mr-2">Vegan</span>
                <span v-if="recipe.vegetarian" class="badge badge-success mr-2">Vegetarian</span>
                <span v-if="recipe.glutenFree" class="badge badge-success mr-2">Gluten Free</span>
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
    methods: {
      async fetchFullRecipe() {
        this.loading = true;
        this.errorMessage = "";
        
        try {
          const recipeId = this.$route.params.recipeId;
          console.log('Fetching full recipe with ID:', recipeId);
          
          // Always fetch full recipe data when component loads
          const response = await window.axios.get(`/recipes/${recipeId}`, { 
            params: { full: true } 
          });
          
          console.log('Full recipe response:', response.data);

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
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .badge {
    display: inline-block;
    padding: 0.25em 0.4em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
  }

  .badge-success {
    color: #fff;
    background-color: #28a745;
  }

  .mr-2 {
    margin-right: 0.5rem;
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
  </style>
