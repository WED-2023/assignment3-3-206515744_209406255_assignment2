<template>
  <div>
    <!-- Summary section - only show in full view -->
    <div v-if="viewType === 'full' && recipe.summary" class="recipe-summary mt-4">
      <h4>Summary</h4>
      <p v-html="recipe.summary"></p>
    </div>
    
    <!-- Message for basic view -->
    <div v-if="viewType === 'basic'" class="basic-view-message mt-4 text-center">
      <p class="text-muted">
        Switch to "Full Details" to see ingredients, instructions, equipment, servings, and detailed summary.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeSummarySection",
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
.recipe-summary {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border-top: 1px solid #ddd;
  margin-bottom: 2rem;
}

.recipe-summary h4 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.basic-view-message {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.text-muted {
  color: #6c757d;
}

.mt-4 {
  margin-top: 1.5rem;
}

.text-center {
  text-align: center;
}

@media (max-width: 768px) {
  .recipe-summary,
  .basic-view-message {
    padding: 1.5rem;
  }
}
</style>
