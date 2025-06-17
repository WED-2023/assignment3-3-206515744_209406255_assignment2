<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <div class="card">
          <div class="card-header text-center">
            <h2>Create New Recipe</h2>
            <p class="text-muted mb-0">Create and share your own recipe</p>
          </div>
          
          <div class="card-body">
            <form @submit.prevent="submitRecipe">
              <!-- Basic Information Section -->
              <div class="form-section">
                <h5><i class="fas fa-info-circle"></i> Basic Information</h5>
                
                <FormField
                  v-model="newRecipe.title"
                  label="Recipe Title"
                  name="title"
                  type="text"
                  placeholder="Enter recipe title"
                  :required="true"
                  :has-error="errors.title.length > 0"
                  :errors="errors.title"
                />
                
                <FormField
                  v-model="newRecipe.image"
                  label="Image URL"
                  name="image"
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  :required="false"
                  :has-error="errors.image.length > 0"
                  :errors="errors.image"
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
                      :has-error="errors.readyInMinutes.length > 0"
                      :errors="errors.readyInMinutes"
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
                      :has-error="errors.numberOfPortions.length > 0"
                      :errors="errors.numberOfPortions"
                    />
                  </div>
                </div>
              </div>

              <!-- Dietary Information Section -->
              <div class="form-section">
                <h5><i class="fas fa-leaf"></i> Dietary Information</h5>
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

              <!-- Ingredients Section -->
              <div class="form-section">
                <h5><i class="fas fa-list"></i> Ingredients</h5>
                <div class="ingredients-section">
                  <div 
                    v-for="(ingredient, index) in newRecipe.ingredients" 
                    :key="`ingredient-${index}`" 
                    class="ingredient-item"
                  >
                    <div class="row">
                      <div class="col-md-4">
                        <input
                          v-model="ingredient.name"
                          type="text"
                          class="form-control"
                          :placeholder="index === 0 ? 'Ingredient name (e.g., carrot)' : 'Ingredient name'"
                          @blur="validateIngredients"
                        />
                      </div>
                      <div class="col-md-2">
                        <input
                          v-model="ingredient.amount"
                          type="number"
                          step="0.1"
                          class="form-control"
                          :placeholder="index === 0 ? 'Amount' : ''"
                          @blur="validateIngredients"
                        />
                      </div>
                      <div class="col-md-2">
                        <input
                          v-model="ingredient.unit"
                          type="text"
                          class="form-control"
                          :placeholder="index === 0 ? 'Unit' : ''"
                          @blur="validateIngredients"
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          v-model="ingredient.description"
                          type="text"
                          class="form-control"
                          :placeholder="index === 0 ? 'Description (optional)' : ''"
                        />
                      </div>
                      <div class="col-md-1">
                        <button
                          v-if="newRecipe.ingredients.length > 1"
                          type="button"
                          class="btn btn-outline-danger btn-sm"
                          @click="removeIngredient(index)"
                          title="Remove ingredient"
                        >
                          <i class="fas fa-minus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm mt-2"
                    @click="addIngredient"
                  >
                    <i class="fas fa-plus"></i> Add Ingredient
                  </button>
                  
                  <div v-if="errors.ingredients.length > 0" class="invalid-feedback d-block">
                    <div v-for="error in errors.ingredients" :key="error">{{ error }}</div>
                  </div>
                </div>
              </div>

              <!-- Instructions Section -->
              <div class="form-section">
                <h5><i class="fas fa-tasks"></i> Instructions</h5>
                <div class="instructions-section">
                  <div 
                    v-for="(instruction, index) in newRecipe.instructions" 
                    :key="`instruction-${index}`"
                    class="instruction-item"
                  >
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">{{ index + 1 }}</span>
                      </div>
                      <textarea
                        v-model="newRecipe.instructions[index]"
                        class="form-control"
                        :placeholder="`Step ${index + 1} instructions`"
                        rows="2"
                        @blur="validateInstructions"
                      ></textarea>
                      <div class="input-group-append">
                        <button
                          v-if="newRecipe.instructions.length > 1"
                          type="button"
                          class="btn btn-outline-danger"
                          @click="removeInstruction(index)"
                          title="Remove step"
                        >
                          <i class="fas fa-minus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm mt-2"
                    @click="addInstruction"
                  >
                    <i class="fas fa-plus"></i> Add Step
                  </button>
                  
                  <div v-if="errors.instructions.length > 0" class="invalid-feedback d-block">
                    <div v-for="error in errors.instructions" :key="error">{{ error }}</div>
                  </div>
                </div>
              </div>

              <!-- Equipment Section -->
              <div class="form-section">
                <h5><i class="fas fa-tools"></i> Equipment</h5>
                <div class="equipment-section">
                  <div 
                    v-for="(equipment, index) in newRecipe.equipment" 
                    :key="`equipment-${index}`"
                    class="equipment-item"
                  >
                    <div class="input-group">
                      <input
                        v-model="newRecipe.equipment[index]"
                        type="text"
                        class="form-control"
                        :placeholder="index === 0 ? 'Equipment (e.g., sauce pan)' : 'Equipment'"
                        @blur="validateEquipment"
                      />
                      <div class="input-group-append">
                        <button
                          v-if="newRecipe.equipment.length > 1"
                          type="button"
                          class="btn btn-outline-danger"
                          @click="removeEquipment(index)"
                          title="Remove equipment"
                        >
                          <i class="fas fa-minus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm mt-2"
                    @click="addEquipment"
                  >
                    <i class="fas fa-plus"></i> Add Equipment
                  </button>
                  
                  <div v-if="errors.equipment.length > 0" class="invalid-feedback d-block">
                    <div v-for="error in errors.equipment" :key="error">{{ error }}</div>
                  </div>
                </div>
              </div>

              <!-- Summary Section -->
              <div class="form-section">
                <h5><i class="fas fa-align-left"></i> Recipe Summary</h5>
                <FormField
                  v-model="newRecipe.summary"
                  label=""
                  name="summary"
                  type="textarea"
                  rows="4"
                  placeholder="Describe your recipe, its flavors, dietary benefits, etc."
                  :required="false"
                />
              </div>

              <!-- Form Actions -->
              <div class="form-actions">
                <button type="button" class="btn btn-secondary me-3" @click="cancelCreate">
                  <i class="fas fa-times"></i> Cancel
                </button>
                <SubmitButton
                  :is-loading="isSubmitting"
                  :is-form-valid="isFormValid"
                  default-text="Create Recipe"
                  loading-text="Creating Recipe..."
                  variant="btn-success"
                  :tooltip-fields="getInvalidFields()"
                  tooltip-title="Please complete the following"
                />
              </div>
            </form>
          </div>
        </div>
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
      },
      errors: {
        title: [],
        image: [],
        readyInMinutes: [],
        numberOfPortions: [],
        ingredients: [],
        instructions: [],
        equipment: []
      }
    };
  },
  computed: {
    isFormValid() {
      return this.newRecipe.title.trim() !== '' &&
             this.newRecipe.readyInMinutes && this.newRecipe.readyInMinutes > 0 &&
             this.newRecipe.numberOfPortions && this.newRecipe.numberOfPortions > 0 &&
             this.newRecipe.ingredients.some(ing => ing.name && ing.name.trim() !== '') &&
             this.newRecipe.instructions.some(inst => inst.trim() !== '') &&
             Object.values(this.errors).every(errorArray => errorArray.length === 0);
    }
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const axios = internalInstance.appContext.config.globalProperties.axios;
    const toast = internalInstance.appContext.config.globalProperties.toast;

    return { store, axios, toast };
  },
  methods: {
    validateForm() {
      // Clear previous errors
      Object.keys(this.errors).forEach(key => {
        this.errors[key] = [];
      });
      
      // Validate required fields
      if (!this.newRecipe.title.trim()) {
        this.errors.title.push('Recipe title is required');
      }
      
      if (!this.newRecipe.readyInMinutes || this.newRecipe.readyInMinutes <= 0) {
        this.errors.readyInMinutes.push('Ready time must be a positive number');
      }
      
      if (!this.newRecipe.numberOfPortions || this.newRecipe.numberOfPortions <= 0) {
        this.errors.numberOfPortions.push('Number of portions must be a positive number');
      }
      
      // Validate image URL format if provided
      if (this.newRecipe.image.trim() && !this.isValidUrl(this.newRecipe.image)) {
        this.errors.image.push('Please enter a valid URL');
      }
      
      this.validateIngredients();
      this.validateInstructions();
      this.validateEquipment();
    },

    validateIngredients() {
      this.errors.ingredients = [];
      const validIngredients = this.newRecipe.ingredients.filter(ing => ing.name && ing.name.trim() !== '');
      
      if (validIngredients.length === 0) {
        this.errors.ingredients.push('At least one ingredient is required');
      }
    },

    validateInstructions() {
      this.errors.instructions = [];
      const validInstructions = this.newRecipe.instructions.filter(inst => inst.trim() !== '');
      
      if (validInstructions.length === 0) {
        this.errors.instructions.push('At least one instruction is required');
      }
    },

    validateEquipment() {
      this.errors.equipment = [];
      // Equipment is optional, so no validation needed
    },

    isValidUrl(string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    },

    getInvalidFields() {
      const invalidFields = [];
      
      if (!this.newRecipe.title.trim()) invalidFields.push('Recipe title');
      if (!this.newRecipe.readyInMinutes || this.newRecipe.readyInMinutes <= 0) invalidFields.push('Ready time');
      if (!this.newRecipe.numberOfPortions || this.newRecipe.numberOfPortions <= 0) invalidFields.push('Number of portions');
      if (!this.newRecipe.ingredients.some(ing => ing.name && ing.name.trim() !== '')) invalidFields.push('At least one ingredient');
      if (!this.newRecipe.instructions.some(inst => inst.trim() !== '')) invalidFields.push('At least one instruction');
      
      return invalidFields;
    },

    cancelCreate() {
      this.$router.push('/users/my-recipes');
    },

    async submitRecipe() {
      this.validateForm();
      
      if (!this.isFormValid) {
        return;
      }

      this.isSubmitting = true;
      
      try {
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
          ingredients: this.newRecipe.ingredients.filter(ing => ing.name && ing.name.trim()),
          instructions: this.newRecipe.instructions.filter(inst => inst.trim()),
          numberOfPortions: parseInt(this.newRecipe.numberOfPortions),
          equipment: this.newRecipe.equipment.filter(eq => eq.trim()),
          summary: this.newRecipe.summary || ""
        };

        console.log('Submitting recipe:', recipeData);

        const response = await window.axios.post('/users/my-recipes', recipeData);
        
        if (response.data.success) {
          if (window.toast) {
            window.toast("Success", response.data.message || "Recipe created successfully!", "success");
          }
          // Navigate back to my recipes page
          this.$router.push('/users/my-recipes');
        } else {
          throw new Error(response.data.message || "Failed to create recipe");
        }
        
      } catch (error) {
        console.error("Failed to create recipe:", error);
        const errorMessage = error.response?.data?.message || "Failed to create recipe. Please try again.";
        
        if (window.toast) {
          window.toast("Error", errorMessage, "error");
        } else {
          alert(errorMessage);
        }
      } finally {
        this.isSubmitting = false;
      }
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
      if (this.newRecipe.ingredients.length > 1) {
        this.newRecipe.ingredients.splice(index, 1);
        this.validateIngredients();
      }
    },

    addInstruction() {
      this.newRecipe.instructions.push("");
    },

    removeInstruction(index) {
      if (this.newRecipe.instructions.length > 1) {
        this.newRecipe.instructions.splice(index, 1);
        this.validateInstructions();
      }
    },

    addEquipment() {
      this.newRecipe.equipment.push("");
    },

    removeEquipment(index) {
      if (this.newRecipe.equipment.length > 1) {
        this.newRecipe.equipment.splice(index, 1);
        this.validateEquipment();
      }
    }
  }
};
</script>

<style scoped>
.card {
  border: none;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  border-radius: 10px;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px 10px 0 0;
  padding: 2rem;
}

.card-header h2 {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.card-body {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2.5rem;
  
  h5 {
    color: #495057;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e9ecef;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.dietary-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #e9ecef;
}

.ingredients-section, .instructions-section, .equipment-section {
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
}

.ingredient-item, .instruction-item, .equipment-item {
  margin-bottom: 0.75rem;
}

.ingredient-item:last-child, .instruction-item:last-child, .equipment-item:last-child {
  margin-bottom: 0;
}

.input-group-prepend .input-group-text {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
  font-weight: 600;
  min-width: 40px;
  justify-content: center;
}

.input-group-append .btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.form-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #dee2e6;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

.me-3 {
  margin-right: 1rem;
}
</style>