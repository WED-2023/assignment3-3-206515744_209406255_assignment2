<template>
  <!-- Modal -->
  <div v-if="show" class="modal fade show d-block" tabindex="-1" role="dialog" aria-labelledby="newFamilyRecipeModalLabel">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title-container">
            <h2 id="newFamilyRecipeModalLabel">Add New Family Recipe</h2>
            <p class="text-muted mb-0">Share a treasured family recipe</p>
          </div>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="modal-body">
          <form @submit.prevent="submitRecipe">
            <!-- Family Member -->
            <FormField
              v-model="form.family_member"
              label="Family Member"
              name="family_member"
              type="text"
              placeholder="e.g., Grandma Sarah, Uncle John"
              :required="true"
              :has-error="errors.family_member.length > 0"
              :errors="errors.family_member"
              :requirements="['Enter the family member who created this recipe']"
            />

            <!-- Occasion -->
            <FormField
              v-model="form.occasion"
              label="Occasion"
              name="occasion"
              type="text"
              placeholder="e.g., birthday, holiday, Sunday dinner"
              :required="true"
              :has-error="errors.occasion.length > 0"
              :errors="errors.occasion"
              :requirements="['Specify when this recipe is typically made']"
            />

            <!-- Recipe Image URL -->
            <FormField
              v-model="form.image"
              label="Recipe Image URL"
              name="image"
              type="text"
              placeholder="https://example.com/recipe-image.jpg"
              :required="false"
              :has-error="errors.image.length > 0"
              :errors="errors.image"
              :requirements="['Optional: Add a photo URL of the finished dish']"
            />

            <!-- Ingredients Section -->
            <div class="form-group">
              <label class="form-label">
                Ingredients <span class="text-danger">*</span>
              </label>
              <div class="ingredients-section">
                <div 
                  v-for="(ingredient, index) in form.ingredients" 
                  :key="index"
                  class="ingredient-item"
                >
                  <div class="input-group">                    <input
                      v-model="form.ingredients[index]"
                      type="text"
                      class="form-control"
                      :placeholder="index === 0 ? `Ingredient ${index + 1} *` : `Ingredient ${index + 1}`"
                      :required="index === 0"
                      @blur="validateIngredients"
                    />
                    <div class="input-group-append">                      <button
                        type="button"
                        class="btn btn-danger"
                        @click="removeIngredient(index)"
                        :disabled="form.ingredients.length <= 1"
                      >
                        <i class="fas fa-times text-white"></i>
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
            <div class="form-group">
              <label class="form-label">
                Instructions <span class="text-danger">*</span>
              </label>
              <div class="instructions-section">
                <div 
                  v-for="(instruction, index) in form.instructions" 
                  :key="index"
                  class="instruction-item"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">{{ index + 1 }}</span>
                    </div>                    <textarea
                      v-model="form.instructions[index]"
                      class="form-control"
                      :placeholder="index === 0 ? `Step ${index + 1} instructions *` : `Step ${index + 1} instructions`"
                      :required="index === 0"
                      rows="2"
                      @blur="validateInstructions"
                    ></textarea>
                    <div class="input-group-append">                      <button
                        type="button"
                        class="btn btn-danger"
                        @click="removeInstruction(index)"
                        :disabled="form.instructions.length <= 1"
                      >
                        <i class="fas fa-times text-white"></i>
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
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            <i class="fas fa-times"></i> Cancel
          </button>
          <SubmitButton
            :is-loading="isSubmitting"
            :is-form-valid="isFormValid"
            default-text="Add Family Recipe"
            loading-text="Adding Recipe..."
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
import FormField from './FormField.vue';
import SubmitButton from './SubmitButton.vue';

export default {
  name: 'UsersNewFamilyRecipeModal',
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
      form: {
        family_member: '',
        occasion: '',
        image: '',
        ingredients: [''],
        instructions: ['']
      },
      errors: {
        family_member: [],
        occasion: [],
        image: [],
        ingredients: [],
        instructions: []
      },
      isSubmitting: false
    };
  },
  computed: {
    isFormValid() {
      return this.form.family_member.trim() !== '' &&
             this.form.occasion.trim() !== '' &&
             this.form.ingredients.some(ing => ing.trim() !== '') &&
             this.form.instructions.some(inst => inst.trim() !== '') &&
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
      this.form = {
        family_member: '',
        occasion: '',
        image: '',
        ingredients: [''],
        instructions: ['']
      };
      
      // Clear errors
      Object.keys(this.errors).forEach(key => {
        this.errors[key] = [];
      });
    },

    closeModal() {
      this.$emit('close');
    },

    addIngredient() {
      this.form.ingredients.push('');
    },
    
    removeIngredient(index) {
      if (this.form.ingredients.length > 1) {
        this.form.ingredients.splice(index, 1);
        this.validateIngredients();
      }
    },
    
    addInstruction() {
      this.form.instructions.push('');
    },
    
    removeInstruction(index) {
      if (this.form.instructions.length > 1) {
        this.form.instructions.splice(index, 1);
        this.validateInstructions();
      }
    },
    
    validateIngredients() {
      this.errors.ingredients = [];
      const nonEmptyIngredients = this.form.ingredients.filter(ing => ing.trim() !== '');
      
      if (nonEmptyIngredients.length === 0) {
        this.errors.ingredients.push('At least one ingredient is required');
      }
    },
    
    validateInstructions() {
      this.errors.instructions = [];
      const nonEmptyInstructions = this.form.instructions.filter(inst => inst.trim() !== '');
      
      if (nonEmptyInstructions.length === 0) {
        this.errors.instructions.push('At least one instruction step is required');
      }
    },
    
    validateForm() {
      // Clear previous errors
      Object.keys(this.errors).forEach(key => {
        this.errors[key] = [];
      });
      
      // Validate required fields
      if (!this.form.family_member.trim()) {
        this.errors.family_member.push('Family member name is required');
      }
      
      if (!this.form.occasion.trim()) {
        this.errors.occasion.push('Occasion is required');
      }
      
      // Validate image URL format if provided
      if (this.form.image.trim() && !this.isValidUrl(this.form.image)) {
        this.errors.image.push('Please enter a valid URL');
      }
      
      this.validateIngredients();
      this.validateInstructions();
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
      
      if (!this.form.family_member.trim()) invalidFields.push('Family member name');
      if (!this.form.occasion.trim()) invalidFields.push('Occasion');
      if (!this.form.ingredients.some(ing => ing.trim() !== '')) invalidFields.push('At least one ingredient');
      if (!this.form.instructions.some(inst => inst.trim() !== '')) invalidFields.push('At least one instruction');
      
      return invalidFields;
    },
    
    async submitRecipe() {
      this.validateForm();
      
      if (!this.isFormValid) {
        return;
      }
      
      this.isSubmitting = true;
      
      try {
        // Filter out empty ingredients and instructions
        const payload = {
          familyrecipe_id: 0, // Backend will assign the actual ID
          family_member: this.form.family_member.trim(),
          occasion: this.form.occasion.trim(),
          ingredients: this.form.ingredients.filter(ing => ing.trim() !== ''),
          instructions: this.form.instructions.filter(inst => inst.trim() !== ''),
          image: this.form.image.trim() || null
        };
        
        console.log('Submitting family recipe:', payload);
        
        const response = await window.axios.post('/users/family-recipes', payload);
        
        if (response.data.success) {
          if (window.toast) {
            window.toast("Success", response.data.message, "success");
          }
          
          // Emit event to parent to refresh the recipe list
          this.$emit('recipe-created', response.data);
          
          // Close modal
          this.closeModal();
        } else {
          throw new Error(response.data.message || 'Failed to add family recipe');
        }
        
      } catch (error) {
        console.error('Error submitting family recipe:', error);
        
        const errorMessage = error.response?.data?.message || 'Failed to add family recipe. Please try again.';
        
        if (window.toast) {
          window.toast("Error", errorMessage, "error");
        } else {
          alert(errorMessage);
        }
      } finally {
        this.isSubmitting = false;
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

.modal-lg {
  max-width: 800px;
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  justify-content: flex-end;
  gap: 1rem;
}

.ingredients-section, .instructions-section {
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
}

.ingredient-item, .instruction-item {
  margin-bottom: 0.75rem;
}

.ingredient-item:last-child, .instruction-item:last-child {
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

.form-group {
  margin-bottom: 1.5rem;
}

.text-danger {
  color: #dc3545;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

@media (max-width: 768px) {
  .modal-lg {
    max-width: 95%;
  }
  
  .modal-body {
    padding: 1rem;
    max-height: 60vh;
  }
  
  .modal-footer {
    padding: 1rem;
  }
}
</style>