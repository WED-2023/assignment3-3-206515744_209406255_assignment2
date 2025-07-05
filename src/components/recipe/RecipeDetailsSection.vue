<template>
  <div v-if="viewType === 'full'" class="recipe-details">
    <div class="wrapper">
      <div class="wrapped">
        <!-- Ingredients section -->
        <div class="ingredients-section">
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
        <!-- Instructions section -->
        <div class="instructions-section">
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
        
        <!-- Equipment section -->
        <div v-if="recipe.equipment && recipe.equipment.length > 0" class="equipment-section mt-3">
          <h4>Equipment needed:</h4>
          <ul>
            <li v-for="(item, index) in recipe.equipment" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeDetailsSection",
  props: {
    recipe: {
      type: Object,
      required: true
    },
    viewType: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.recipe-details {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.wrapper {
  display: flex;
  gap: 2rem;
}

.wrapped {
  width: 50%;
}

.ingredients-section, 
.instructions-section, 
.equipment-section {
  margin-bottom: 2rem;
}

.ingredients-section h4, 
.instructions-section h4, 
.equipment-section h4 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.ingredients-section ul,
.equipment-section ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.instructions-section ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
}

.ingredients-section li,
.instructions-section li,
.equipment-section li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.mt-3 {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .wrapper {
    flex-direction: column;
    gap: 1rem;
  }
  
  .wrapped {
    width: 100%;
  }
  
  .recipe-details {
    padding: 1.5rem;
  }
}
</style>
