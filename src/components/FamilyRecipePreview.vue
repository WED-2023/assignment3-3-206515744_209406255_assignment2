<template>
  <div 
    class="card h-100 recipe-card clickable-card"
    role="button"
    tabindex="0"
    :aria-label="`View family recipe: ${recipe.title || recipe.familyMember + ' Recipe'}`"
    @click="goToRecipe"
    @keydown.enter="goToRecipe"
    @keydown.space.prevent="goToRecipe"
  >
    <div class="recipe-image-container">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        class="card-img-top recipe-image"
        alt="Family recipe image"
      />
      <div v-else class="no-image-placeholder">
        <i class="fas fa-utensils"></i>
      </div>
      
      <!-- Clickable indicator overlay -->
      <div class="clickable-indicator">
        <i class="fas fa-eye"></i>
        <span>Click to view</span>
      </div>
      
      <!-- Recipe indicators overlay -->
      <div class="recipe-indicators">
        <!-- Vegan indicator -->
        <div v-if="recipe.vegan" class="indicator vegan-indicator" title="Vegan">
          🌱
        </div>
        
        <!-- Vegetarian indicator (only if not vegan) -->
        <div v-else-if="recipe.vegetarian" class="indicator vegetarian-indicator" title="Vegetarian">
          🥬
        </div>
        
        <!-- Gluten-free indicator -->
        <div v-if="recipe.glutenFree" class="indicator gluten-free-indicator" title="Gluten Free">
          🌾
        </div>
      </div>
    </div>
    
    <div class="card-body text-center clickable-area">
      <!-- Recipe title -->
      <h5 class="card-title">{{ recipeTitle }}</h5>
      
      <!-- Family member and occasion info -->
      <div class="family-info">
        <span class="badge badge-primary">{{ recipe.occasion }}</span>
        <span v-if="recipe.familyMember" class="badge badge-secondary">{{ recipe.familyMember }}</span>
      </div>
      
      <!-- Bottom fixed container for time and actions -->
      <div class="bottom-actions">
        <!-- Recipe time info -->
        <div class="recipe-info">
          <p v-if="recipe.readyInMinutes" class="card-text time-info">
            <i class="fas fa-clock"></i> {{ recipe.readyInMinutes }} min
          </p>
        </div>
        
        <!-- Quick info -->
        <div class="quick-info">
          <small class="text-muted">
            <i class="fas fa-list"></i> {{ recipe.ingredients?.length || 0 }} ingredients
          </small>
          <br>
          <small class="text-muted">
            <i class="fas fa-tasks"></i> {{ recipe.instructions?.length || 0 }} steps
          </small>
        </div>
        
        <!-- Action buttons in their own row -->
        <div class="action-buttons-row">
          <button
            type="button"
            class="btn btn-danger btn-sm delete-recipe-btn"
            @click.stop="deleteRecipe"
            title="Delete family recipe"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FamilyRecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  emits: ['recipe-deleted'],
  computed: {
    recipeTitle() {
      return this.recipe.title || `${this.recipe.familyMember}'s Recipe`;
    }
  },
  methods: {
    goToRecipe() {
      // Debug log to see the recipe structure
      console.log('Recipe object:', this.recipe);
      console.log('Recipe ID:', this.recipe.id);
      
      // Make sure we have a valid recipe ID
      if (!this.recipe.id) {
        console.error('No id found in recipe:', this.recipe);
        return;
      }
      
      // Pass the entire recipe object via navigation state
      this.$router.push({ 
        name: 'familyRecipeView', 
        params: { recipeId: this.recipe.id.toString() },
        // Pass the recipe data through navigation state
        state: { recipe: this.recipe }
      });
    },
    
    async deleteRecipe() {
      const recipeName = `${this.recipe.familyMember}'s ${this.recipe.occasion} recipe`;
      
      if (!confirm(`Are you sure you want to delete "${recipeName}"? This action cannot be undone.`)) {
        return;
      }

      try {
        console.log('Deleting family recipe with ID:', this.recipe.id);
        
        // Send DELETE request to /users/family-recipes with recipe_id in request body
        const response = await window.axios.delete('/users/family-recipes', {
          data: {
            recipe_id: this.recipe.id
          },
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        });
        
        console.log('Delete response:', response.data);
        
        if (response.data.success || response.status === 200) {
          // Emit event to parent to remove recipe from list
          this.$emit('recipe-deleted', this.recipe.id);
            // Show success message if toast is available
          if (window.toast) {
            window.toast("Success", response.data.message || "Family recipe deleted successfully!", "success");
          }
        } else {
          throw new Error(response.data.message || "Failed to delete family recipe");
        }
        
      } catch (error) {
        console.error("Failed to delete family recipe:", error);
        
        let errorMessage = "Failed to delete family recipe. Please try again.";
        if (error.response?.status === 404) {
          errorMessage = "Family recipe not found or already deleted.";
        } else if (error.response?.status === 403) {
          errorMessage = "You don't have permission to delete this family recipe.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
          if (window.toast) {
          window.toast("Error", errorMessage, "error");
        } else {
          alert(errorMessage);
        }
      }
    }
  }
}
</script>

<style scoped>
/* Container to push time/score and buttons to bottom */
.bottom-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.recipe-info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}

.time-info {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.time-info i {
  color: #007bff;
}

/* Family member and occasion info */
.family-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
  min-height: 25px;
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

.badge-primary {
  color: #fff;
  background-color: #007bff;
}

.badge-secondary {
  color: #fff;
  background-color: #6c757d;
}

/* Quick-info styling (retained from original override) */
.quick-info {
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
}

/* Any additional overrides (e.g. delete button) */
.delete-recipe-btn {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-recipe-btn:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.recipe-card {
  cursor: pointer;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out,
    border-color 0.2s ease-in-out;
  position: relative;
  border: 2px solid #e9ecef;
}

.recipe-card.clickable-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #007bff;
}

.recipe-card.clickable-card:hover .clickable-indicator {
  opacity: 1;
  visibility: visible;
}

.recipe-image-container {
  position: relative;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.recipe-card:hover .recipe-image,
.recipe-card:hover .no-image-placeholder {
  transform: scale(1.05);
}

.no-image-placeholder {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

/* Clickable indicator overlay */
.clickable-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 123, 255, 0.9);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease-in-out;
  z-index: 3;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Recipe indicators overlay */
.recipe-indicators {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 2;
}

.indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.indicator:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 1);
}

.viewed-indicator {
  border-color: #6c757d;
}

.vegan-indicator {
  border-color: #28a745;
}

.vegetarian-indicator {
  border-color: #ffc107;
}

.gluten-free-indicator {
  border-color: #17a2b8;
}

.card-body {
  cursor: pointer;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.card-body.clickable-area {
  position: relative;
}

.card-body.clickable-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  transition: background 0.2s ease-in-out;
  pointer-events: none;
  z-index: 1;
}

.recipe-card:hover .card-body.clickable-area::before {
  background: rgba(0, 123, 255, 0.02);
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: #2c3e50;
  font-weight: 600;
  line-height: 1.3;
  position: relative;
  z-index: 2;
}

.recipe-info,
.action-buttons-row {
  position: relative;
  z-index: 2;
}

.recipe-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.action-buttons-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  position: relative;
  z-index: 2;
}

@media (max-width: 576px) {
  .recipe-indicators { top: 4px; right: 4px; }
  .indicator { width: 28px; height: 28px; font-size: 12px; }
  .action-buttons-row { flex-wrap: wrap; gap: 0.25rem; }
  .recipe-info { flex-direction: column; gap: 0.5rem; }
  .clickable-indicator { padding: 0.5rem 0.75rem; font-size: 0.75rem; }
}

@keyframes pulse-border {
  0% { border-color: #e9ecef; }
  50% { border-color: #007bff; }
  100% { border-color: #e9ecef; }
}

.recipe-card:focus-within {
  animation: pulse-border 2s ease-in-out infinite;
  outline: none;
}

</style>