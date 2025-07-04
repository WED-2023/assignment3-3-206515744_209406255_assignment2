<template>
  <div class="container mt-4 fade-in">
    <h2 class="fade-in-down">My Meal Plan</h2>
    <div v-if="!mealPlan.length" class="text-center mt-4 slide-in-up">
      <div class="empty-state pulse-slow">
        <i class="fas fa-calendar-alt"></i>
        <p>Your meal plan is empty. Add recipes to get started!</p>
      </div>
    </div>
    <div v-else class="slide-in-up">
      <ul class="list-group mb-3">
        <li v-for="(item, idx) in mealPlan" :key="item.id" class="list-group-item d-flex align-items-center justify-content-between meal-item-animation" :style="{animationDelay: `${idx * 0.1}s`}">
          <div class="d-flex flex-column flex-grow-1">
            <div class="d-flex align-items-center mb-2">
              <img 
                v-if="item.image" 
                :src="item.image" 
                alt="" 
                class="meal-img me-3 hover-lift" 
              />
              <div v-else class="meal-img-placeholder me-3 hover-lift pulse-slow">
                <i class="fas fa-utensils"></i>
              </div>
              <router-link :to="{ name: 'recipe', params: { recipeId: item.id } }" class="hover-scale">{{ item.title }}</router-link>
            </div>
            <ProgressBar
              v-if="item.totalSteps > 0"
              :current="item.completedSteps.filter(s => s).length"
              :total="item.totalSteps"
            ></ProgressBar>
          </div>
          <div class="d-flex align-items-center">
            <button class="btn btn-sm btn-outline-secondary me-2 hover-lift" @click="moveUp(idx)" :disabled="idx === 0">⬆️</button>
            <button class="btn btn-sm btn-outline-secondary me-2 hover-lift" @click="moveDown(idx)" :disabled="idx === mealPlan.length - 1">⬇️</button>
            <button class="btn btn-sm btn-outline-danger hover-scale" @click="remove(idx)">🗑️</button>
          </div>
        </li>
      </ul>
      <button class="btn btn-danger hover-lift" @click="clearAll">Clear All</button>
    </div>
  </div>
</template>

<script>
import ProgressBar from '../components/ProgressBar.vue';
export default {
  name: 'MealPlanPage',
  components: { ProgressBar },
  data() {
    return {};
  },
  computed: {
    mealPlan() {
      return window.store.mealPlan;
    }
  },
  methods: {
    remove(idx) {
      window.store.removeFromMealPlan(idx);
    },
    clearAll() {
      window.store.clearMealPlan();
    },
    moveUp(idx) {
      window.store.moveMealPlanUp(idx);
    },
    moveDown(idx) {
      window.store.moveMealPlanDown(idx);
    }
  }
};
</script>

<style scoped>
.meal-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.meal-img-placeholder {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 1.2rem;
}

.empty-state {
  padding: 3rem 2rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
  color: #42b983;
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

.slide-in-up {
  opacity: 0;
  transform: translateY(30px);
  animation: slideInUp 0.8s ease-out forwards;
}

.pulse-slow {
  animation: pulseSlow 3s ease-in-out infinite;
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}

.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.meal-item-animation {
  opacity: 0;
  transform: translateX(-20px);
  animation: slideInFromLeft 0.6s ease-out forwards;
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

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
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
</style>
