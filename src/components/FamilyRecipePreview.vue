<template>
  <div class="card h-100 recipe-card clickable-card">
    <div class="recipe-image-container">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        class="card-img-top recipe-image"
        alt="Family recipe image"
        @click="goToRecipe"
      />
      <div v-else class="no-image-placeholder" @click="goToRecipe">
        <i class="fas fa-utensils"></i>
      </div>
    </div>
    
    <div class="card-body text-center clickable-area" @click="goToRecipe">
      <h5 class="card-title">{{ recipe.familyMember }}'s Recipe</h5>
      <p class="card-text">
        <span class="badge badge-primary">{{ recipe.occasion }}</span>
      </p>
      
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
@import "@/scss/_recipe-card.scss";

/* Quick-info styling (retained from original override) */
.quick-info {
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 1rem;
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
</style>