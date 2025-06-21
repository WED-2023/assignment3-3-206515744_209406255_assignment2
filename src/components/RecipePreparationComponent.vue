<template>
  <div class="step-container">
    <ProgressBar :current="current" :total="total" />
    <!-- Moved navigation above content -->
    <div class="navigation mt-4 text-center">
      <button @click="$emit('prev')" :disabled="current <= 1" class="btn btn-secondary mr-2">
        Previous
      </button>
      <button @click="$emit('next')" :disabled="current >= total" class="btn btn-primary">
        Next
      </button>
    </div>
    <h4>Step {{ step.stepNumber }}</h4>
    <p>{{ step.instruction }}</p>

    <div v-if="step.equipment.length" class="equipment-section">
      <strong>Equipment:</strong>
      <ul>
        <li v-for="(item, idx) in step.equipment" :key="idx">{{ item }}</li>
      </ul>
    </div>

    <div v-if="step.ingredients.length" class="ingredients-section">
      <strong>Ingredients:</strong>
      <ul>
        <li v-for="(ing, idx) in step.ingredients" :key="idx">
          {{ formatAmount(ing.amount) }} {{ ing.unit }} {{ ing.name }}
          <span v-if="ing.description"> - {{ ing.description }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ProgressBar from "./ProgressBar.vue";
export default {
  name: 'RecipePreparationComponent',
  components: { ProgressBar },
  props: {
    step: { type: Object, required: true },
    current: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  methods: {
    formatAmount(amount) {
      if (amount == null) return '';
      // amount is already per-step base amount
      return amount;
    }
  }
};
</script>

<style scoped>
.equipment-section, .ingredients-section {
  margin-bottom: 1rem;
}
.navigation button {
  min-width: 100px;
}
</style>
