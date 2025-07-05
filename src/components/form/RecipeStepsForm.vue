<template>
  <div class="form-section">
    <h5><i class="fas fa-list-ol"></i> Recipe Steps</h5>
    
    <div v-for="(step, stepIndex) in steps" :key="stepIndex" class="step-container">
      <div class="step-header">
        <h6 class="step-title">
          <i class="fas fa-utensils"></i>
          Step {{ stepIndex + 1 }}
        </h6>
        <button
          type="button"
          class="btn btn-danger btn-sm"
          @click="removeStep(stepIndex)"
          :disabled="steps.length <= 1"
          title="Remove step"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
      
      <!-- Ingredients subsection -->
      <div class="step-subsection">
        <div class="subsection-label">
          <i class="fas fa-shopping-basket"></i>
          Ingredients
        </div>
        
        <div v-for="(ingredient, ingIndex) in step.ingredients" :key="ingIndex" class="ingredient-item">
          <div class="row">
            <div class="col-md-4">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{ ingIndex + 1 }}</span>
                </div>
                <input
                  :value="ingredient.name"
                  type="text"
                  class="form-control"
                  placeholder="Ingredient name"
                  @input="updateIngredient(stepIndex, ingIndex, 'name', $event.target.value)"
                />
                <div class="input-group-append">
                  <button
                    type="button"
                    class="btn btn-danger"
                    @click="removeIngredient(stepIndex, ingIndex)"
                    :disabled="step.ingredients.length <= 1"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="col-md-2">
              <input
                :value="ingredient.amount"
                type="number"
                class="form-control"
                placeholder="Amount"
                step="0.1"
                @input="updateIngredient(stepIndex, ingIndex, 'amount', parseFloat($event.target.value) || null)"
              />
            </div>
            
            <div class="col-md-2">
              <input
                :value="ingredient.unit"
                type="text"
                class="form-control"
                placeholder="Unit"
                @input="updateIngredient(stepIndex, ingIndex, 'unit', $event.target.value)"
              />
            </div>
            
            <div class="col-md-4">
              <input
                :value="ingredient.description"
                type="text"
                class="form-control"
                placeholder="Description (optional)"
                @input="updateIngredient(stepIndex, ingIndex, 'description', $event.target.value)"
              />
            </div>
          </div>
        </div>
        
        <button
          type="button"
          class="btn btn-outline-primary btn-sm"
          @click="addIngredient(stepIndex)"
        >
          <i class="fas fa-plus"></i> Add Ingredient
        </button>
      </div>
      
      <!-- Equipment subsection -->
      <div class="step-subsection">
        <div class="subsection-label">
          <i class="fas fa-tools"></i>
          Equipment
        </div>
        
        <div v-for="(equipment, eqIndex) in step.equipment" :key="eqIndex" class="equipment-item">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">{{ eqIndex + 1 }}</span>
            </div>
            <input
              :value="equipment"
              type="text"
              class="form-control"
              placeholder="Equipment needed"
              @input="updateEquipment(stepIndex, eqIndex, $event.target.value)"
            />
            <div class="input-group-append">
              <button
                type="button"
                class="btn btn-danger"
                @click="removeEquipment(stepIndex, eqIndex)"
                :disabled="step.equipment.length <= 1"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
        
        <button
          type="button"
          class="btn btn-outline-primary btn-sm"
          @click="addEquipment(stepIndex)"
        >
          <i class="fas fa-plus"></i> Add Equipment
        </button>
      </div>
      
      <!-- Instructions subsection -->
      <div class="step-subsection">
        <div class="subsection-label">
          <i class="fas fa-clipboard-list"></i>
          Instructions
        </div>
        
        <textarea
          :value="step.instruction"
          class="form-control"
          rows="3"
          placeholder="Describe what to do in this step..."
          @input="updateInstruction(stepIndex, $event.target.value)"
        ></textarea>
      </div>
    </div>
    
    <button
      type="button"
      class="btn btn-primary"
      @click="addStep"
    >
      <i class="fas fa-plus"></i> Add Step
    </button>
  </div>
</template>

<script>
export default {
  name: "RecipeStepsForm",
  props: {
    steps: {
      type: Array,
      required: true
    }
  },
  emits: ['update-step', 'add-step', 'remove-step'],
  methods: {
    updateIngredient(stepIndex, ingIndex, field, value) {
      this.$emit('update-step', {
        stepIndex,
        type: 'ingredient',
        index: ingIndex,
        field,
        value
      });
    },
    
    updateEquipment(stepIndex, eqIndex, value) {
      this.$emit('update-step', {
        stepIndex,
        type: 'equipment',
        index: eqIndex,
        value
      });
    },
    
    updateInstruction(stepIndex, value) {
      this.$emit('update-step', {
        stepIndex,
        type: 'instruction',
        value
      });
    },
    
    addIngredient(stepIndex) {
      this.$emit('update-step', {
        stepIndex,
        type: 'add-ingredient'
      });
    },
    
    removeIngredient(stepIndex, ingIndex) {
      this.$emit('update-step', {
        stepIndex,
        type: 'remove-ingredient',
        index: ingIndex
      });
    },
    
    addEquipment(stepIndex) {
      this.$emit('update-step', {
        stepIndex,
        type: 'add-equipment'
      });
    },
    
    removeEquipment(stepIndex, eqIndex) {
      this.$emit('update-step', {
        stepIndex,
        type: 'remove-equipment',
        index: eqIndex
      });
    },
    
    addStep() {
      this.$emit('add-step');
    },
    
    removeStep(stepIndex) {
      this.$emit('remove-step', stepIndex);
    }
  }
}
</script>

<style scoped>
.form-section {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #ffc107;
}

.form-section h5 {
  color: #ffc107;
  margin-bottom: 1rem;
  font-weight: 600;
}

.form-section h5 i {
  margin-right: 0.5rem;
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

.ingredient-item, .equipment-item {
  margin-bottom: 0.75rem;
}

.ingredient-item:last-child, .equipment-item:last-child {
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

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-outline-primary {
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .row .col-md-4,
  .row .col-md-2 {
    margin-bottom: 0.5rem;
  }
}
</style>
