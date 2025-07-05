<template>
  <!-- Use Teleport to render modal at body level, escaping parent containers -->
  <Teleport to="body">
    <!-- Modal -->
    <div v-if="show" class="modal fade show d-block fade-in" tabindex="-1" role="dialog" aria-labelledby="newRecipeModalLabel" @click="closeModal">
      <div class="modal-dialog modal-xl slide-in-up" role="document" @click.stop>
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header fade-in-down">
          <div class="modal-title-container">
            <h2 id="newRecipeModalLabel">Create New Recipe</h2>
            <p class="text-muted mb-0">Create and share your own recipe</p>
          </div>
          <button type="button" class="btn-close hover-scale" @click="closeModal" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="modal-body slide-in-up">
          <form @submit.prevent="submitRecipe">
            <!-- Basic Information Section -->
            <div class="form-section fade-in-up-delayed">
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

            <!-- Recipe Steps Section -->
            <div class="form-section">
              <h5><i class="fas fa-list-ol"></i> Recipe Steps</h5>
              <div class="steps-section">
                <div 
                  v-for="(step, stepIndex) in newRecipe.steps" 
                  :key="`step-${stepIndex}`"
                  class="step-container"
                >
                  <div class="step-header">
                    <h6 class="step-title">
                      Step {{ stepIndex + 1 }}
                    </h6>
                    <button
                      v-if="newRecipe.steps.length > 1"
                      type="button"
                      class="btn btn-danger btn-sm"
                      @click="removeStep(stepIndex)"
                      title="Remove entire step"
                    >
                      <i class="fas fa-trash"></i> Remove Step
                    </button>
                  </div>

                  <!-- Step Ingredients -->
                  <div class="step-subsection">
                    <label class="subsection-label">
                      <i class="fas fa-carrot"></i> Ingredients for this step:
                    </label>
                    <div 
                      v-for="(ingredient, ingredientIndex) in step.ingredients" 
                      :key="`step-${stepIndex}-ingredient-${ingredientIndex}`" 
                      class="ingredient-item"
                    >
                      <div class="row align-items-center">
                        <div class="col-md-4">
                          <input
                            v-model="ingredient.name"
                            type="text"
                            class="form-control"
                            placeholder="Ingredient name (e.g., carrot)"
                            @blur="validateSteps"
                          />
                        </div>
                        <div class="col-md-2">
                          <input
                            v-model="ingredient.amount"
                            type="number"
                            step="0.1"
                            class="form-control"
                            placeholder="Amount"
                            @blur="validateSteps"
                          />
                        </div>
                        <div class="col-md-2">
                          <input
                            v-model="ingredient.unit"
                            type="text"
                            class="form-control"
                            placeholder="Unit"
                            @blur="validateSteps"
                          />
                        </div>
                        <div class="col-md-3">
                          <input
                            v-model="ingredient.description"
                            type="text"
                            class="form-control"
                            placeholder="Description (optional)"
                          />
                        </div>
                        <div class="col-md-1">
                          <button
                            v-if="step.ingredients.length > 1"
                            type="button"
                            class="btn btn-danger btn-sm rounded-circle p-1 ms-2"
                            @click="removeIngredientFromStep(stepIndex, ingredientIndex)"
                            title="Remove ingredient"
                          >
                            <i class="fas fa-times text-white"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="btn btn-outline-secondary btn-sm mt-1"
                      @click="addIngredientToStep(stepIndex)"
                    >
                      <i class="fas fa-plus"></i> Add Ingredient
                    </button>
                  </div>

                  <!-- Step Equipment -->
                  <div class="step-subsection">
                    <label class="subsection-label">
                      <i class="fas fa-tools"></i> Equipment needed for this step:
                    </label>
                    <div 
                      v-for="(equipment, equipmentIndex) in step.equipment" 
                      :key="`step-${stepIndex}-equipment-${equipmentIndex}`"
                      class="equipment-item"
                    >
                      <div class="row align-items-center">
                        <div class="col">
                          <input
                            v-model="step.equipment[equipmentIndex]"
                            type="text"
                            class="form-control"
                            placeholder="Equipment (e.g., sauce pan)"
                            @blur="validateSteps"
                          />
                        </div>
                        <div class="col-auto">
                          <button
                            v-if="step.equipment.length > 1"
                            type="button"
                            class="btn btn-danger btn-sm rounded-circle p-1 ms-2"
                            @click="removeEquipmentFromStep(stepIndex, equipmentIndex)"
                            title="Remove equipment"
                          >
                            <i class="fas fa-times text-white"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="btn btn-outline-secondary btn-sm mt-1"
                      @click="addEquipmentToStep(stepIndex)"
                    >
                      <i class="fas fa-plus"></i> Add Equipment
                    </button>
                  </div>

                  <!-- Step Instructions -->
                  <div class="step-subsection">
                    <label class="subsection-label">
                      <i class="fas fa-clipboard-list"></i> Instructions for this step:
                    </label>
                    <textarea
                      v-model="step.instruction"
                      class="form-control"
                      :placeholder="`Describe what to do in step ${stepIndex + 1}${stepIndex === 0 ? ' *' : ''}`"
                      :required="stepIndex === 0"
                      rows="3"
                      @blur="validateSteps"
                    ></textarea>
                  </div>
                </div>
                
                <button
                  type="button"
                  class="btn btn-primary btn-sm mt-3"
                  @click="addStep"
                >
                  <i class="fas fa-plus"></i> Add New Step
                </button>
                
                <div v-if="errors.steps.length > 0" class="invalid-feedback d-block">
                  <div v-for="error in errors.steps" :key="error">{{ error }}</div>
                </div>
              </div>
            </div>

            <!-- Summary Section -->
            <div class="form-section">
              <h5><i class="fas fa-align-left"></i> Recipe Summary</h5>              <FormField
                v-model="newRecipe.summary"
                label="Recipe Summary"
                name="summary"
                type="textarea"
                :rows="4"
                placeholder="Describe your recipe, its flavors, dietary benefits, etc."
                :required="false"
              />
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <SubmitButton
            :is-loading="false"
            :is-form-valid="true"
            default-text="Cancel"
            variant="btn-secondary"
            @click="closeModal"
          />
          <SubmitButton
            :is-loading="isSubmitting"
            :is-form-valid="isFormValid"
            default-text="Create Recipe"
            loading-text="Creating Recipe..."
            variant="btn-success"
            :tooltip-fields="getInvalidFields()"
            tooltip-title="Please complete the following"
            @click="submitRecipe"
          />
        </div>
      </div>
    </div>
  </div>

    <!-- Modal Backdrop -->
    <div v-if="show" class="modal-backdrop fade show"></div>
  </Teleport>
</template>

<script>
import FormField from "../form/FormField.vue";
import SubmitButton from "../form/SubmitButton.vue";

export default {
  name: "UsersNewRecipeModal",
  components: {
    FormField,
    SubmitButton
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'recipe-created'],
  data() {
    return {
      isSubmitting: false,      newRecipe: {
        title: "",
        image: "",
        readyInMinutes: "",
        vegan: false,
        vegetarian: false,
        glutenFree: false,
        viewed: true,
        favorite: false,
        steps: [
          {
            ingredients: [
              {
                name: "",
                amount: null,
                unit: "",
                description: ""
              }
            ],
            equipment: [""],
            instruction: ""
          }
        ],
        numberOfPortions: "",
        summary: ""
      },
      errors: {
        title: [],
        image: [],
        readyInMinutes: [],
        numberOfPortions: [],
        steps: []
      }
    };
  },
  computed: {    isFormValid() {
      return this.newRecipe.title.trim() !== '' &&
             this.newRecipe.readyInMinutes && Number(this.newRecipe.readyInMinutes) > 0 &&
             this.newRecipe.numberOfPortions && Number(this.newRecipe.numberOfPortions) > 0 &&
             this.newRecipe.steps.some(step => 
               step.ingredients.some(ing => ing.name && ing.name.trim() !== '') &&
               step.instruction.trim() !== ''
             ) &&
             Object.values(this.errors).every(errorArray => errorArray.length === 0);
    }
  },
  watch: {
    show(newValue) {
      if (newValue) {
        // Reset form when modal opens
        this.resetForm();
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
      } else {
        // Restore body scroll
        document.body.style.overflow = '';
      }
    }
  },
  methods: {    resetForm() {
      this.newRecipe = {
        title: "",
        image: "",
        readyInMinutes: "",
        vegan: false,
        vegetarian: false,
        glutenFree: false,
        viewed: true,
        favorite: false,
        steps: [
          {
            ingredients: [
              {
                name: "",
                amount: null,
                unit: "",
                description: ""
              }
            ],
            equipment: [""],
            instruction: ""
          }
        ],
        numberOfPortions: "",
        summary: ""
      };
      
      // Clear errors
      Object.keys(this.errors).forEach(key => {
        this.errors[key] = [];
      });
    },

    closeModal() {
      this.$emit('close');
    },

    validateForm() {
      // Clear previous errors
      Object.keys(this.errors).forEach(key => {
        this.errors[key] = [];
      });
      
      // Validate required fields
      if (!this.newRecipe.title.trim()) {
        this.errors.title.push('Recipe title is required');
      }
        if (!this.newRecipe.readyInMinutes || Number(this.newRecipe.readyInMinutes) <= 0) {
        this.errors.readyInMinutes.push('Ready time must be a positive number');
      }
      
      if (!this.newRecipe.numberOfPortions || Number(this.newRecipe.numberOfPortions) <= 0) {
        this.errors.numberOfPortions.push('Number of portions must be a positive number');
      }
      
      // Validate image URL format if provided
      if (this.newRecipe.image.trim() && !this.isValidUrl(this.newRecipe.image)) {
        this.errors.image.push('Please enter a valid URL');
      }
      
      this.validateSteps();
    },

    validateSteps() {
      this.errors.steps = [];
      
      // Check if there's at least one step with valid content
      const validSteps = this.newRecipe.steps.filter(step => {
        const hasValidIngredient = step.ingredients.some(ing => ing.name && ing.name.trim() !== '');
        const hasValidInstruction = step.instruction.trim() !== '';
        return hasValidIngredient && hasValidInstruction;
      });
      
      if (validSteps.length === 0) {
        this.errors.steps.push('At least one step with ingredients and instructions is required');
      }
    },

    isValidUrl(string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    },    getInvalidFields() {
      const invalidFields = [];
      
      if (!this.newRecipe.title.trim()) invalidFields.push('Recipe title');
      if (!this.newRecipe.readyInMinutes || Number(this.newRecipe.readyInMinutes) <= 0) invalidFields.push('Ready time');
      if (!this.newRecipe.numberOfPortions || Number(this.newRecipe.numberOfPortions) <= 0) invalidFields.push('Number of portions');
      if (!this.newRecipe.steps.some(step => 
        step.ingredients.some(ing => ing.name && ing.name.trim() !== '') &&
        step.instruction.trim() !== ''
      )) invalidFields.push('At least one complete step');
      
      return invalidFields;
    },

    async submitRecipe() {
      this.validateForm();
      
      if (!this.isFormValid) {
        return;
      }

      this.isSubmitting = true;
      
      try {
        // Prepare data for API - flatten steps into separate arrays
        const allIngredients = [];
        const allInstructions = [];
        const allEquipment = [];
        
        this.newRecipe.steps.forEach((step) => {
          // Add ingredients with step context
          step.ingredients
            .filter(ing => ing.name && ing.name.trim())
            .forEach(ing => allIngredients.push(ing));
          
          // Add instruction
          if (step.instruction.trim()) {
            allInstructions.push(step.instruction.trim());
          }
          
          // Add equipment
          step.equipment
            .filter(eq => eq.trim())
            .forEach(eq => allEquipment.push(eq));
        });

        const recipeData = {
          title: this.newRecipe.title,
          image: this.newRecipe.image || "",
          readyInMinutes: parseInt(this.newRecipe.readyInMinutes),
          vegan: this.newRecipe.vegan,
          vegetarian: this.newRecipe.vegetarian,
          glutenFree: this.newRecipe.glutenFree,
          viewed: this.newRecipe.viewed,
          favorite: this.newRecipe.favorite,
          ingredients: allIngredients,
          instructions: allInstructions,
          numberOfPortions: parseInt(this.newRecipe.numberOfPortions),
          equipment: allEquipment,
          summary: this.newRecipe.summary || ""
        };

        console.log('Submitting recipe:', recipeData);

        const response = await window.axios.post('/users/my-recipes', recipeData);
        
        if (response.data.success) {
          if (window.toast) {
            window.toast("Success", response.data.message || "Recipe created successfully!", "success");
          }
          
          // Emit event to parent to refresh the recipe list
          this.$emit('recipe-created', response.data);
          
          // Close modal
          this.closeModal();
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

    // Step management methods
    addStep() {
      this.newRecipe.steps.push({
        ingredients: [
          {
            name: "",
            amount: null,
            unit: "",
            description: ""
          }
        ],
        equipment: [""],
        instruction: ""
      });
    },

    removeStep(stepIndex) {
      if (this.newRecipe.steps.length > 1) {
        this.newRecipe.steps.splice(stepIndex, 1);
        this.validateSteps();
      }
    },

    // Ingredient management within steps
    addIngredientToStep(stepIndex) {
      this.newRecipe.steps[stepIndex].ingredients.push({
        name: "",
        amount: null,
        unit: "",
        description: ""
      });
    },

    removeIngredientFromStep(stepIndex, ingredientIndex) {
      if (this.newRecipe.steps[stepIndex].ingredients.length > 1) {
        this.newRecipe.steps[stepIndex].ingredients.splice(ingredientIndex, 1);
        this.validateSteps();
      }
    },

    // Equipment management within steps
    addEquipmentToStep(stepIndex) {
      this.newRecipe.steps[stepIndex].equipment.push("");
    },

    removeEquipmentFromStep(stepIndex, equipmentIndex) {
      if (this.newRecipe.steps[stepIndex].equipment.length > 1) {
        this.newRecipe.steps[stepIndex].equipment.splice(equipmentIndex, 1);
        this.validateSteps();
      }
    }
  }
};
</script>

<style scoped>
/* Modal styles - now rendered at body level via Teleport */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal-dialog {
  position: relative;
  margin: 1.75rem auto;
  pointer-events: none;
  width: auto;
  max-width: none;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-xl {
  max-width: 90vw;
  width: 90vw;
}

@media (max-width: 768px) {
  .modal-xl {
    max-width: 95vw;
    width: 95vw;
    margin: 0.5rem;
  }
  
  .modal-dialog {
    margin: 0.5rem auto;
  }
}

.modal-header {
  background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
  color: white;
  border-radius: 0;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title-container h2 {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.btn-close:hover {
  opacity: 0.7;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
  padding: 2rem;
  flex: 1 1 auto;
}

.modal-footer {
  padding: 1rem 2rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

/* Remove top margin on submit button when in footer to align with other buttons */
.modal-footer .submit-section {
  margin-top: 0;
}

/* Match cancel button style to submit button */
.modal-footer .btn-secondary {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease-in-out;
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

.steps-section {
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
}

.step-container {
  border: 2px solid #dee2e6;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.step-container:last-child {
  margin-bottom: 0;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e9ecef;
}

.step-title {
  color: #495057;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.step-title i {
  color: #007bff;
}

.step-subsection {
  margin-bottom: 1.5rem;
}

.step-subsection:last-child {
  margin-bottom: 0;
}

.subsection-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
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

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

/* Spacing for step number badge */
.input-group-text.me-2 {
  margin-right: 0.5rem;
}

/* Ingredient and equipment numbering icons styling to match instructions */
.ingredient-item .input-group-text,
.equipment-item .input-group-text {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
  font-weight: 600;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Remove horizontal gutter for ingredient and equipment rows to match instruction spacing */
.ingredient-item .row,
.equipment-item .row {
  --bs-gutter-x: 0;
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

.fade-in-up-delayed {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out 0.2s forwards;
}

.slide-in-up {
  opacity: 0;
  transform: translateY(30px);
  animation: slideInUp 0.8s ease-out forwards;
}

.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.1);
}

/* Ensure form field hints are visible with new card styling */
.modal-body .form-group {
  position: relative;
  z-index: 1;
  margin-bottom: 2rem;
}

.modal-body .input-wrapper {
  position: relative;
  z-index: 1;
}

.modal-body .validation-hint {
  background-color: rgba(227, 242, 253, 0.98);
  backdrop-filter: blur(5px);
  border: 1px solid #90caf9;
  z-index: 1000 !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  position: relative !important;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
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