<template>
  <div class="card h-100 recipe-card">
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
    
    <div class="card-body text-center" @click="goToRecipe">
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
          class="btn btn-outline-primary btn-sm"
          @click.stop="goToRecipe"
        >
          <i class="fas fa-eye"></i> View
        </button>
        
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
.recipe-card {
  cursor: pointer;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  position: relative;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
}

.no-image-placeholder {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  cursor: pointer;
}

.card-body {
  cursor: pointer;
  padding: 1rem;
}

.card-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.card-text {
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.badge {
  display: inline-block;
  padding: 0.375em 0.75em;
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
  background-color: #0d6efd;
}

.quick-info {
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.action-buttons-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
}

.btn-outline-primary {
  color: #0d6efd;
  border-color: #0d6efd;
  background-color: transparent;
}

.btn-outline-primary:hover {
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}

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

.text-muted {
  color: #6c757d;
}
</style>