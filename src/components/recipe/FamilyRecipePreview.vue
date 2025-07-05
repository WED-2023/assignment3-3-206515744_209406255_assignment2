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
    <RecipeImageSection
      :recipe="recipe"
      :is-viewed="false"
      :is-favorited="false"
      :is-user-recipes-route="false"
      :is-family-recipes-route="true"
    />
    
    <div class="card-body text-center clickable-area">
      <FamilyRecipeInfoSection :recipe="recipe" />
      
      <!-- Bottom fixed container for actions -->
      <div class="bottom-actions">
        <FamilyRecipeActionsSection @delete-click="deleteRecipe" />
      </div>
    </div>
  </div>
</template>

<script>
import RecipeImageSection from './RecipeImageSection.vue';
import FamilyRecipeInfoSection from './FamilyRecipeInfoSection.vue';
import FamilyRecipeActionsSection from './FamilyRecipeActionsSection.vue';

export default {
  name: "FamilyRecipePreview",
  components: {
    RecipeImageSection,
    FamilyRecipeInfoSection,
    FamilyRecipeActionsSection
  },
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

.recipe-card:hover .recipe-image,
.recipe-card:hover .no-image-placeholder {
  transform: scale(1.05);
}

.card-body {
  cursor: pointer;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

/* Container to push actions to bottom */
.bottom-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

/* Add a subtle pulse animation to indicate interactivity */
@keyframes pulse-border {
  0% {
    border-color: #e9ecef;
  }
  50% {
    border-color: #007bff;
  }
  100% {
    border-color: #e9ecef;
  }
}

.recipe-card:focus-within {
  animation: pulse-border 2s ease-in-out infinite;
  outline: none;
}
</style>