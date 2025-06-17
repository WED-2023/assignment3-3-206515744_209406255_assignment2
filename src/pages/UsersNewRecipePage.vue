<template>
  <div class="container">
    <h1 class="title">Create New Recipe</h1>
    
    <!-- Create Recipe Form -->
    <div class="create-recipe-form mt-4">
      <div class="form-card">
        <form @submit.prevent="submitRecipe">
          <!-- Basic Information -->
          <div class="form-section">
            <h5>Basic Information</h5>
            
            <FormField
              v-model="newRecipe.title"
              label="Recipe Title"
              name="title"
              type="text"
              placeholder="Enter recipe title"
              :required="true"
            />
            
            <FormField
              v-model="newRecipe.image"
              label="Image URL"
              name="image"
              type="url"
              placeholder="https://example.com/image.jpg"
            />
            
            <div class="row">
              <div class="col-md-6">
                <FormField
                  v-model="newRecipe.readyInMinutes"
                  label="Ready in Minutes"
                  name="readyInMinutes"
                  type="number"
                  placeholder="30"
                  :required="true"
                />
              </div>
              <div class="col-md-6">
                <FormField
                  v-model="newRecipe.numberOfPortions"
                  label="Number of Portions"
                  name="numberOfPortions"
                  type="number"
                  placeholder="4"
                  :required="true"
                />
              </div>
            </div>
          </div>

          <!-- Dietary Information -->
          <div class="form-section">
            <h5>Dietary Information</h5>
            <div class="dietary-checkboxes">
              <div class="form-check form-check-inline">
                <input
                  id="vegan"
                  v-model="newRecipe.vegan"
                  class="form-check-input"
                  type="checkbox"
                  name="vegan"
                >
                <label class="form-check-label" for="vegan">
                  Vegan
                </label>
              </div>
              
              <div class="form-check form-check-inline">
                <input
                  id="vegetarian"
                  v-model="newRecipe.vegetarian"
                  class="form-check-input"
                  type="checkbox"
                  name="vegetarian"
                >
                <label class="form-check-label" for="vegetarian">
                  Vegetarian
                </label>
              </div>
              
              <div class="form-check form-check-inline">
                <input
                  id="glutenFree"
                  v-model="newRecipe.glutenFree"
                  class="form-check-input"
                  type="checkbox"
                  name="glutenFree"
                >
                <label class="form-check-label" for="glutenFree">
                  Gluten Free
                </label>
              </div>
              
              <div class="form-check form-check-inline">
                <input
                  id="favorite"
                  v-model="newRecipe.favorite"
                  class="form-check-input"
                  type="checkbox"
                  name="favorite"
                >
                <label class="form-check-label" for="favorite">
                  Mark as Favorite
                </label>
              </div>
            </div>
          </div>

          <!-- Ingredients -->
          <div class="form-section">
            <h5>Ingredients</h5>
            <div v-for="(ingredient, index) in newRecipe.ingredients" :key="`ingredient-${index}`" class="ingredient-row">
              <div class="row align-items-end">
                <div class="col-md-4">
                  <FormField
                    v-model="ingredient.name"
                    :label="index === 0 ? 'Ingredient Name' : ''"
                    :name="`ingredient-name-${index}`"
                    type="text"
                    placeholder="e.g., carrot"
                    :required="true"
                  />
                </div>
                <div class="col-md-2">
                  <FormField
                    v-model="ingredient.amount"
                    :label="index === 0 ? 'Amount' : ''"
                    :name="`ingredient-amount-${index}`"
                    type="number"
                    step="0.1"
                    placeholder="3"
                    :required="true"
                  />
                </div>
                <div class="col-md-2">
                  <FormField
                    v-model="ingredient.unit"
                    :label="index === 0 ? 'Unit' : ''"
                    :name="`ingredient-unit-${index}`"
                    type="text"
                    placeholder="large"
                    :required="true"
                  />
                </div>
                <div class="col-md-3">
                  <FormField
                    v-model="ingredient.description"
                    :label="index === 0 ? 'Description' : ''"
                    :name="`ingredient-description-${index}`"
                    type="text"
                    placeholder="washed and chopped"
                  />
                </div>
                <div class="col-md-1">
                  <button
                    v-if="index > 0"
                    type="button"
                    class="btn btn-danger btn-sm delete-btn"
                    @click="removeIngredient(index)"
                    title="Remove ingredient"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-secondary btn-sm mt-2" @click="addIngredient">
              Add Ingredient
            </button>
          </div>

          <!-- Instructions -->
          <div class="form-section">
            <h5>Instructions</h5>
            <div v-for="(instruction, index) in newRecipe.instructions" :key="`instruction-${index}`" class="instruction-row">
              <div class="row align-items-end">
                <div class="col-md-11">
                  <FormField
                    v-model="newRecipe.instructions[index]"
                    :label="`Step ${index + 1}`"
                    :name="`instruction-${index}`"
                    type="textarea"
                    :placeholder="`Describe step ${index + 1}...`"
                    :required="true"
                  />
                </div>
                <div class="col-md-1">
                  <button
                    v-if="index > 0"
                    type="button"
                    class="btn btn-danger btn-sm delete-btn"
                    @click="removeInstruction(index)"
                    title="Remove step"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-secondary btn-sm mt-2" @click="addInstruction">
              Add Step
            </button>
          </div>

          <!-- Equipment -->
          <div class="form-section">
            <h5>Equipment</h5>
            <div v-for="(equipment, index) in newRecipe.equipment" :key="`equipment-${index}`" class="equipment-row">
              <div class="row align-items-end">
                <div class="col-md-11">
                  <FormField
                    v-model="newRecipe.equipment[index]"
                    :label="index === 0 ? 'Equipment' : ''"
                    :name="`equipment-${index}`"
                    type="text"
                    placeholder="e.g., sauce pan"
                    :required="true"
                  />
                </div>
                <div class="col-md-1">
                  <button
                    v-if="index > 0"
                    type="button"
                    class="btn btn-danger btn-sm delete-btn"
                    @click="removeEquipment(index)"
                    title="Remove equipment"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-secondary btn-sm mt-2" @click="addEquipment">
              Add Equipment
            </button>
          </div>

          <!-- Summary -->
          <div class="form-section">
            <FormField
              v-model="newRecipe.summary"
              label="Recipe Summary"
              name="summary"
              type="textarea"
              rows="4"
              placeholder="Describe your recipe, its flavors, dietary benefits, etc."
            />
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" class="btn btn-secondary me-2" @click="cancelCreate">
              Cancel
            </button>
            <SubmitButton
              :is-submitting="isSubmitting"
              submit-text="Create Recipe"
              submitting-text="Creating Recipe..."
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import FormField from "../components/FormField.vue";
import SubmitButton from "../components/SubmitButton.vue";

export default {
  name: "UsersNewRecipePage",
  components: {
    FormField,
    SubmitButton
  },
  data() {
    return {
      isSubmitting: false,
      newRecipe: {
        title: "",
        image: "",
        readyInMinutes: null,
        aggregateLikes: 0,
        vegan: false,
        vegetarian: false,
        glutenFree: false,
        viewed: true,
        favorite: false,
        ingredients: [
          {
            name: "",
            amount: null,
            unit: "",
            description: ""
          }
        ],
        instructions: [""],
        numberOfPortions: null,
        equipment: [""],
        summary: ""
      }
    };
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const axios = internalInstance.appContext.config.globalProperties.axios;
    const toast = internalInstance.appContext.config.globalProperties.toast;

    return { store, axios, toast };
  },
  methods: {
    cancelCreate() {
      this.$router.push('/users/my-recipes');
    },

    async submitRecipe() {
      this.isSubmitting = true;
      
      try {
        // Validate form
        if (!this.validateForm()) {
          return;
        }

        // Prepare data for API
        const recipeData = {
          title: this.newRecipe.title,
          image: this.newRecipe.image || "",
          readyInMinutes: parseInt(this.newRecipe.readyInMinutes),
          aggregateLikes: parseInt(this.newRecipe.aggregateLikes) || 0,
          vegan: this.newRecipe.vegan,
          vegetarian: this.newRecipe.vegetarian,
          glutenFree: this.newRecipe.glutenFree,
          viewed: this.newRecipe.viewed,
          favorite: this.newRecipe.favorite,
          ingredients: this.newRecipe.ingredients.filter(ing => ing.name.trim()),
          instructions: this.newRecipe.instructions.filter(inst => inst.trim()),
          numberOfPortions: parseInt(this.newRecipe.numberOfPortions),
          equipment: this.newRecipe.equipment.filter(eq => eq.trim()),
          summary: this.newRecipe.summary || ""
        };

        console.log('Submitting recipe:', recipeData);

        const response = await window.axios.post('/users/my-recipes', recipeData);
        
        if (response.data.success) {
          this.toast("Success", response.data.message || "Recipe created successfully!", "success");
          // Navigate back to my recipes page
          this.$router.push('/users/my-recipes');
        } else {
          throw new Error(response.data.message || "Failed to create recipe");
        }
        
      } catch (error) {
        console.error("Failed to create recipe:", error);
        this.toast("Error", error.response?.data?.message || "Failed to create recipe. Please try again.", "error");
      } finally {
        this.isSubmitting = false;
      }
    },

    validateForm() {
      if (!this.newRecipe.title.trim()) {
        this.toast("Validation Error", "Recipe title is required.", "error");
        return false;
      }
      
      if (!this.newRecipe.readyInMinutes || this.newRecipe.readyInMinutes <= 0) {
        this.toast("Validation Error", "Ready time must be a positive number.", "error");
        return false;
      }
      
      if (!this.newRecipe.numberOfPortions || this.newRecipe.numberOfPortions <= 0) {
        this.toast("Validation Error", "Number of portions must be a positive number.", "error");
        return false;
      }
      
      if (this.newRecipe.ingredients.filter(ing => ing.name.trim()).length === 0) {
        this.toast("Validation Error", "At least one ingredient is required.", "error");
        return false;
      }
      
      if (this.newRecipe.instructions.filter(inst => inst.trim()).length === 0) {
        this.toast("Validation Error", "At least one instruction is required.", "error");
        return false;
      }
      
      return true;
    },

    // Dynamic form methods
    addIngredient() {
      this.newRecipe.ingredients.push({
        name: "",
        amount: null,
        unit: "",
        description: ""
      });
    },

    removeIngredient(index) {
      this.newRecipe.ingredients.splice(index, 1);
    },

    addInstruction() {
      this.newRecipe.instructions.push("");
    },

    removeInstruction(index) {
      this.newRecipe.instructions.splice(index, 1);
    },

    addEquipment() {
      this.newRecipe.equipment.push("");
    },

    removeEquipment(index) {
      this.newRecipe.equipment.splice(index, 1);
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
  color: #333;
  margin-bottom: 2rem;
}

.create-recipe-form {
  margin-bottom: 3rem;
}

.form-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 2rem;
}

.form-section {
  margin-bottom: 2.5rem;
  
  h5 {
    color: #495057;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e9ecef;
  }
}

.dietary-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.ingredient-row,
.instruction-row,
.equipment-row {
  margin-bottom: 1rem;
}

.delete-btn {
  margin-top: 1.5rem; // Align with form fields when no label is present
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #dee2e6;
}

.row {
  margin-bottom: 1rem;
}
</style>