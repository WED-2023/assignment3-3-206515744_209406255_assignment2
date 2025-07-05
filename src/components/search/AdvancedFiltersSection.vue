<template>
  <div class="advanced-filters slide-in-down">
    <div class="row">
      <div class="col-md-6">
        <!-- Number of results as radio buttons -->
        <div class="form-group">
          <label>Number of Results:</label>
          <div class="radio-group">
            <div class="form-check form-check-inline">
              <input 
                class="form-check-input" 
                type="radio" 
                name="numberOfResults" 
                id="results5" 
                value="5"
                :checked="form.number === '5'"
                @change="updateForm({ number: '5' })"
              >
              <label class="form-check-label" for="results5">5</label>
            </div>
            <div class="form-check form-check-inline">
              <input 
                class="form-check-input" 
                type="radio" 
                name="numberOfResults" 
                id="results10" 
                value="10"
                :checked="form.number === '10'"
                @change="updateForm({ number: '10' })"
              >
              <label class="form-check-label" for="results10">10</label>
            </div>
            <div class="form-check form-check-inline">
              <input 
                class="form-check-input" 
                type="radio" 
                name="numberOfResults" 
                id="results15" 
                value="15"
                :checked="form.number === '15'"
                @change="updateForm({ number: '15' })"
              >
              <label class="form-check-label" for="results15">15</label>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <!-- Cuisine dropdown -->
        <div class="form-group">
          <label>Cuisine:</label>
          <select 
            :value="form.cuisine" 
            @change="updateForm({ cuisine: $event.target.value })"
            class="form-control"
          >
            <option value="">No filter</option>
            <option v-for="cuisine in allCuisines" :key="cuisine" :value="cuisine">
              {{ cuisine }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <!-- Diet dropdown -->
        <div class="form-group">
          <label>Diet:</label>
          <select 
            :value="form.diet" 
            @change="updateForm({ diet: $event.target.value })"
            class="form-control"
          >
            <option value="">No filter</option>
            <option v-for="diet in dietOptions" :key="diet.value" :value="diet.value">
              {{ diet.label }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-md-6">
        <!-- Intolerances dropdown -->
        <div class="form-group">
          <label>Intolerance:</label>
          <select 
            :value="form.intolerance" 
            @change="updateForm({ intolerance: $event.target.value })"
            class="form-control"
          >
            <option value="">No filter</option>
            <option v-for="intolerance in allIntolerances" :key="intolerance" :value="intolerance">
              {{ intolerance }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Active filters display -->
    <div v-if="hasActiveFilters" class="active-filters">
      <small class="text-muted">Active filters:</small>
      <div class="active-chips">
        <span v-if="form.number !== '5'" class="active-chip">
          {{ form.number }} results 
          <i @click="updateForm({ number: '5' })" class="fas fa-times"></i>
        </span>
        <span v-if="form.cuisine" class="active-chip">
          {{ form.cuisine }} 
          <i @click="updateForm({ cuisine: '' })" class="fas fa-times"></i>
        </span>
        <span v-if="form.diet" class="active-chip">
          {{ getDietLabel(form.diet) }} 
          <i @click="updateForm({ diet: '' })" class="fas fa-times"></i>
        </span>
        <span v-if="form.intolerance" class="active-chip">
          {{ form.intolerance }} 
          <i @click="updateForm({ intolerance: '' })" class="fas fa-times"></i>
        </span>
        <button type="button" @click="$emit('clear-all-filters')" class="btn btn-sm btn-outline-danger">
          Clear All
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdvancedFiltersSection",
  props: {
    form: {
      type: Object,
      required: true
    },
    allCuisines: {
      type: Array,
      required: true
    },
    dietOptions: {
      type: Array,
      required: true
    },
    allIntolerances: {
      type: Array,
      required: true
    }
  },
  emits: ['update:form', 'clear-all-filters'],
  computed: {
    hasActiveFilters() {
      return this.form.number !== "5" || this.form.cuisine || this.form.diet || this.form.intolerance;
    }
  },
  methods: {
    updateForm(updates) {
      this.$emit('update:form', { ...this.form, ...updates });
    },
    getDietLabel(dietValue) {
      const diet = this.dietOptions.find(d => d.value === dietValue);
      return diet ? diet.label : dietValue;
    }
  }
};
</script>

<style lang="scss" scoped>
.advanced-filters {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.row {
  display: flex;
  margin: 0 -15px;
}

.col-md-6 {
  flex: 0 0 50%;
  max-width: 50%;
  padding: 0 15px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.form-check {
  display: flex;
  align-items: center;
  min-height: 1.5rem;
}

.form-check-input {
  margin-right: 0.5rem;
}

.form-check-label {
  margin-bottom: 0;
  cursor: pointer;
}

.active-filters {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.active-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.5rem;
}

.active-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background-color: #007bff;
  color: white;
  border-radius: 15px;
  font-size: 0.875rem;
  gap: 0.25rem;
}

.active-chip i {
  cursor: pointer;
  transition: color 0.2s ease;
}

.active-chip i:hover {
  color: #ffcccc;
}

.btn {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  margin-bottom: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.2rem;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
  background-color: transparent;
}

.btn-outline-danger:hover {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

.text-muted {
  color: #6c757d;
}

.slide-in-down {
  opacity: 0;
  transform: translateY(-20px);
  animation: slideInDown 0.5s ease-out forwards;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .row {
    flex-direction: column;
  }
  
  .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .active-chips {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
