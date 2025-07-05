<template>
  <div class="form-section fade-in-up-delayed">
    <h5><i class="fas fa-info-circle"></i> Basic Information</h5>
    
    <FormField
      :value="recipeData.title"
      label="Recipe Title"
      name="title"
      type="text"
      placeholder="Enter recipe title"
      :required="true"
      :has-error="errors.title.length > 0"
      :errors="errors.title"
      @input="updateRecipe('title', $event)"
    />
    
    <FormField
      :value="recipeData.image"
      label="Image URL"
      name="image"
      type="text"
      placeholder="https://example.com/image.jpg"
      :required="false"
      :has-error="errors.image.length > 0"
      :errors="errors.image"
      @input="updateRecipe('image', $event)"
    />
    
    <div class="row">
      <div class="col-md-6">
        <FormField
          :value="recipeData.readyInMinutes"
          label="Ready Time (minutes)"
          name="readyInMinutes"
          type="number"
          placeholder="30"
          :required="true"
          :has-error="errors.readyInMinutes.length > 0"
          :errors="errors.readyInMinutes"
          @input="updateRecipe('readyInMinutes', parseInt($event) || 0)"
        />
      </div>
      
      <div class="col-md-6">
        <FormField
          :value="recipeData.servings"
          label="Servings"
          name="servings"
          type="number"
          placeholder="4"
          :required="true"
          :has-error="errors.servings.length > 0"
          :errors="errors.servings"
          @input="updateRecipe('servings', parseInt($event) || 0)"
        />
      </div>
    </div>
    
    <FormField
      :value="recipeData.summary"
      label="Recipe Summary"
      name="summary"
      type="textarea"
      placeholder="Brief description of your recipe..."
      :required="true"
      :has-error="errors.summary.length > 0"
      :errors="errors.summary"
      rows="3"
      @input="updateRecipe('summary', $event)"
    />
  </div>
</template>

<script>
import FormField from '../form/FormField.vue';

export default {
  name: "RecipeBasicInfoForm",
  components: {
    FormField
  },
  props: {
    recipeData: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      required: true
    }
  },
  emits: ['update-recipe'],
  methods: {
    updateRecipe(field, value) {
      this.$emit('update-recipe', { field, value });
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
  border-left: 4px solid #007bff;
}

.form-section h5 {
  color: #007bff;
  margin-bottom: 1rem;
  font-weight: 600;
}

.form-section h5 i {
  margin-right: 0.5rem;
}

.fade-in-up-delayed {
  animation: fadeInUpDelayed 0.6s ease-out;
}

@keyframes fadeInUpDelayed {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
