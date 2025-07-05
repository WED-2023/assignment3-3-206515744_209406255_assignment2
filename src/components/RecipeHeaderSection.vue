<template>
  <div class="recipe-header mt-3 mb-4">
    <h1 class="fade-in-down">{{ recipe.title }}</h1>
    <div class="image-container">
      <img 
        v-if="recipe.image" 
        :src="recipe.image" 
        class="center hover-lift" 
        :alt="recipe.title"
      />
      <div v-else class="center no-image-placeholder hover-lift pulse-slow">
        <i class="fas fa-utensils"></i>
        <p>No image available</p>
      </div>
    </div>
      
    <!-- Dietary badges -->
    <div class="diet-info mt-2 slide-in-left">
      <span v-if="recipe.vegan" class="badge badge-success hover-scale">🌱 Vegan</span>
      <span v-else-if="recipe.vegetarian" class="badge badge-warning hover-scale">🥬 Vegetarian</span>
      <span v-if="recipe.glutenFree" class="badge badge-info hover-scale">🌾 Gluten Free</span>
    </div>
      
    <!-- Toggle for full/basic view -->
    <div class="view-toggle mt-3 text-center slide-in-right">
      <div class="form-check form-check-inline">
        <input 
          class="form-check-input" 
          type="radio" 
          name="viewType" 
          id="basicView" 
          value="basic"
          :checked="viewType === 'basic'"
          @change="$emit('update:view-type', 'basic')"
        >
        <label class="form-check-label" for="basicView">
          Basic View
        </label>
      </div>
      <div class="form-check form-check-inline">
        <input 
          class="form-check-input" 
          type="radio" 
          name="viewType" 
          id="fullView" 
          value="full"
          :checked="viewType === 'full'"
          @change="$emit('update:view-type', 'full')"
        >
        <label class="form-check-label" for="fullView">
          Full Details
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeHeaderSection",
  props: {
    recipe: {
      type: Object,
      required: true
    },
    viewType: {
      type: String,
      required: true
    }
  },
  emits: ['update:view-type']
};
</script>

<style scoped>
.recipe-header {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.recipe-header h1 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

.no-image-placeholder {
  margin: 2rem auto;
  padding: 3rem;
  background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
  color: white;
  text-align: center;
  border-radius: 10px;
  max-width: 400px;
}

.no-image-placeholder i {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

.diet-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.badge {
  display: inline-block;
  padding: 0.25em 0.5em;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.375rem;
}

.badge-success {
  color: #fff;
  background-color: #28a745;
}

.badge-warning {
  color: #212529;
  background-color: #ffc107;
}

.badge-info {
  color: #fff;
  background-color: #17a2b8;
}

.view-toggle {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f9f9f9;
  margin: 1rem auto;
  max-width: 300px;
}

.form-check-inline {
  margin-right: 2rem;
}

.form-check-input {
  margin-right: 0.5rem;
}

/* Animation classes */
.fade-in-down {
  opacity: 0;
  transform: translateY(-20px);
  animation: fadeInDown 1s ease-out forwards;
}

.slide-in-left {
  opacity: 0;
  transform: translateX(-30px);
  animation: slideInLeft 0.8s ease-out 0.3s forwards;
}

.slide-in-right {
  opacity: 0;
  transform: translateX(30px);
  animation: slideInRight 0.8s ease-out 0.5s forwards;
}

.pulse-slow {
  animation: pulseSlow 3s ease-in-out infinite;
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
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

@keyframes pulseSlow {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.8;
    transform: scale(1.02);
  }
}

@media (max-width: 768px) {
  .center {
    width: 80%;
  }
  
  .form-check-inline {
    margin-right: 1rem;
  }
  
  .view-toggle {
    padding: 0.75rem;
  }
}
</style>
