<template>
  <div class="search-form slide-in-up">
    <form @submit.prevent="$emit('search')">
      <!-- Main search field -->
      <div class="fade-in-up-delayed">
        <FormField
          label="Search Recipes:"
          name="query"
          type="text"
          placeholder="Enter recipe name, ingredients, or keywords..."
          :model-value="form.query"
          @update:model-value="$emit('update:query', $event)"
          :required="true"
          :requirements="['Required field']"
          autocomplete="on"
        />
      </div>

      <!-- Advanced filters toggle -->
      <div class="advanced-toggle slide-in-left">
        <button 
          type="button" 
          @click="$emit('toggle-advanced')"
          class="btn btn-link hover-scale"
        >
          <i class="fas fa-filter"></i>
          {{ showAdvanced ? 'Hide' : 'Show' }} Advanced Filters
          <i :class="showAdvanced ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </button>
      </div>

      <!-- Advanced filters component -->
      <AdvancedFiltersSection
        v-if="showAdvanced"
        :form="form"
        :all-cuisines="allCuisines"
        :diet-options="dietOptions"
        :all-intolerances="allIntolerances"
        @update:form="$emit('update:form', $event)"
        @clear-all-filters="$emit('clear-all-filters')"
      />
      
      <div class="slide-in-right">
        <SubmitButton
          :is-loading="loading"
          :is-form-valid="!!form.query.trim()"
          default-text="Search"
          loading-text="Searching..."
          variant="btn-primary"
          :tooltip-fields="form.query.trim() ? [] : ['Search query is required']"
          tooltip-title="Form incomplete"
        />
      </div>
    </form>
  </div>
</template>

<script>
import FormField from "./FormField.vue";
import SubmitButton from "./SubmitButton.vue";
import AdvancedFiltersSection from "./AdvancedFiltersSection.vue";

export default {
  name: "SearchFormSection",
  components: {
    FormField,
    SubmitButton,
    AdvancedFiltersSection
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    showAdvanced: {
      type: Boolean,
      default: false
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
  emits: [
    'search',
    'toggle-advanced',
    'update:query',
    'update:form',
    'clear-all-filters'
  ]
};
</script>

<style lang="scss" scoped>
@import "@/scss/form-style.scss";

.search-form {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.advanced-toggle {
  text-align: center;
  margin: 1rem 0;
}

.advanced-toggle .btn-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.advanced-toggle .btn-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.advanced-toggle i {
  margin: 0 0.25rem;
}

/* Animation classes */
.fade-in-up-delayed {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
}

.slide-in-left {
  opacity: 0;
  transform: translateX(-30px);
  animation: slideInLeft 0.8s ease-out 0.2s forwards;
}

.slide-in-right {
  opacity: 0;
  transform: translateX(30px);
  animation: slideInRight 0.8s ease-out 0.4s forwards;
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
  transform: scale(1.05);
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
