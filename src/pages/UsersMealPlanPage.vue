<template>
  <div class="container mt-4">
    <h2>My Meal Plan</h2>
    <div v-if="!mealPlan.length" class="text-center mt-4">
      <p>Your meal plan is empty. Add recipes to get started!</p>
    </div>
    <div v-else>
      <ul class="list-group mb-3">
        <li v-for="(item, idx) in mealPlan" :key="item.id" class="list-group-item d-flex align-items-center justify-content-between">
          <div class="d-flex flex-column flex-grow-1">
            <div class="d-flex align-items-center mb-2">
              <img 
                v-if="item.image" 
                :src="item.image" 
                alt="" 
                class="meal-img me-3" 
              />
              <div v-else class="meal-img-placeholder me-3">
                <i class="fas fa-utensils"></i>
              </div>
              <router-link :to="{ name: 'recipe', params: { recipeId: item.id } }">{{ item.title }}</router-link>
            </div>
            <ProgressBar
              v-if="item.totalSteps > 0"
              :current="item.completedSteps.filter(s => s).length"
              :total="item.totalSteps"
            ></ProgressBar>
          </div>
          <div class="d-flex align-items-center">
            <button class="btn btn-sm btn-outline-secondary me-2" @click="moveUp(idx)" :disabled="idx === 0">⬆️</button>
            <button class="btn btn-sm btn-outline-secondary me-2" @click="moveDown(idx)" :disabled="idx === mealPlan.length - 1">⬇️</button>
            <button class="btn btn-sm btn-outline-danger" @click="remove(idx)">🗑️</button>
          </div>
        </li>
      </ul>
      <button class="btn btn-danger" @click="clearAll">Clear All</button>
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
</style>
