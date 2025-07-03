<template>
  <!-- Modal -->
  <div v-if="show" class="modal fade show d-block" tabindex="-1" role="dialog" aria-labelledby="newFamilyRecipeModalLabel">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title-container">
            <h2 id="newFamilyRecipeModalLabel">Create New Family Recipe</h2>
            <p class="text-muted mb-0">Share a treasured family recipe</p>
          </div>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="modal-body">
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

              <!-- Family Member Field -->
              <FormField
                v-model="newRecipe.familyMember"
                label="Family Member"
                name="familyMember"
                type="text"
                placeholder="e.g., Grandma Sarah, Uncle John"
                :required="true"
                :has-error="errors.familyMember.length > 0"
                :errors="errors.familyMember"
              />

              <!-- Occasion Field -->
              <FormField
                v-model="newRecipe.occasion"
                label="Occasion"
                name="occasion"
                type="text"
                placeholder="e.g., birthday, holiday, Sunday dinner"
                :required="true"
                :has-error="errors.occasion.length > 0"
                :errors="errors.occasion"
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
            default-text="Create Family Recipe"
            loading-text="Creating Family Recipe..."
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
</template>

<script>
import FormField from "./FormField.vue";
import SubmitButton from "./SubmitButton.vue";

export default {
  name: "UsersNewFamilyRecipeModal",
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
      isSubmitting: false,
      newRecipe: {
        title: "",
        familyMember: "",
        occasion: "",
        image: "",
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
        ]
      },
      errors: {
        title: [],
        familyMember: [],
        occasion: [],
        image: [],
        steps: []
      }
    };
  },
  computed: {
    isFormValid() {
      return this.newRecipe.title.trim() !== '' &&
             this.newRecipe.familyMember.trim() !== '' &&
             this.newRecipe.occasion.trim() !== '' &&
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
  methods: {
    resetForm() {
      this.newRecipe = {
        title: "",
        familyMember: "",
        occasion: "",
        image: "",
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
        ]
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

      if (!this.newRecipe.familyMember.trim()) {
        this.errors.familyMember.push('Family member name is required');
      }

      if (!this.newRecipe.occasion.trim()) {
        this.errors.occasion.push('Occasion is required');
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
    },

    getInvalidFields() {
      const invalidFields = [];
      
      if (!this.newRecipe.title.trim()) invalidFields.push('Recipe title');
      if (!this.newRecipe.familyMember.trim()) invalidFields.push('Family member name');
      if (!this.newRecipe.occasion.trim()) invalidFields.push('Occasion');
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
          family_member: this.newRecipe.familyMember,
          occasion: this.newRecipe.occasion,
          ingredients: allIngredients,
          instructions: allInstructions,
          equipment: allEquipment,
          image: this.newRecipe.image || ""
        };

        console.log('Submitting family recipe:', recipeData);

        const response = await window.axios.post('/users/family-recipes', recipeData);
        
        if (response.data.success) {
          if (window.toast) {
            window.toast("Success", response.data.message || "Family recipe created successfully!", "success");
          }
          
          // Emit event to parent to refresh the recipe list
          this.$emit('recipe-created', response.data);
          
          // Close modal
          this.closeModal();
        } else {
          throw new Error(response.data.message || "Failed to create family recipe");
        }
        
      } catch (error) {
        console.error("Failed to create family recipe:", error);
        const errorMessage = error.response?.data?.message || "Failed to create family recipe. Please try again.";
        
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
.modal {
  z-index: 1050;
}

.modal-backdrop {
  z-index: 1040;
}

.modal-xl {
  max-width: 90%;
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

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

/* Remove horizontal gutter for ingredient and equipment rows to match instruction spacing */
.ingredient-item .row,
.equipment-item .row {
  --bs-gutter-x: 0;
}
</style>