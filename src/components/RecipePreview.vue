<template>
  <div class="card h-100 recipe-card">
    <div class="recipe-image-container">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        class="card-img-top recipe-image"
        alt="Recipe image"
        @click="goToRecipe"
      />
    </div>
    
    <div class="card-body text-center" @click="goToRecipe">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text">{{ recipe.readyInMinutes }} minutes</p>
      
      <!-- Action buttons in their own row -->
      <div class="action-buttons-row">
        <!-- Like button -->
        <ActionButton
          :item-id="recipe.id"
          action-type="like"
          :initial-active-state="recipe.liked || false"
          active-emoji="❤️"
          inactive-emoji="🤍"
          color="red"
          size="medium"
          active-tooltip="Remove from liked"
          inactive-tooltip="Add to liked"
          add-endpoint="/users/liked"
          @action-changed="onActionChanged"
          @click.stop
        />
        
        <!-- Favorite button -->
        <ActionButton
          :item-id="recipe.id"
          action-type="favorite"
          :initial-active-state="recipe.favorited || false"
          active-emoji="⭐"
          inactive-emoji="☆"
          color="yellow"
          size="medium"
          active-tooltip="Remove from favorites"
          inactive-tooltip="Add to favorites"
          add-endpoint="/users/favorites"
          @action-changed="onActionChanged"
          @click.stop
        />
      </div>
    </div>
  </div>
</template>

<script>
import ActionButton from './ActionButton.vue';

export default {
  name: "RecipePreview",
  components: {
    ActionButton
  },
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  emits: ['recipe-action-changed'],
  methods: {
    goToRecipe() {
      this.$router.push(`/recipe/${this.recipe.id}`);
    },
    
    onActionChanged(data) {
      console.log('Recipe action changed:', data);
      // Emit event to parent component
      this.$emit('recipe-action-changed', {
        recipeId: this.recipe.id,
        actionType: data.actionType,
        isActive: data.isActive
      });
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

.action-buttons-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
}
</style>
