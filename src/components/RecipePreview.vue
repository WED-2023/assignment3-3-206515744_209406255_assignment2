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
      
      <!-- Like button in its own row -->
      <div class="like-button-row">
        <LikeButton
          :item-id="recipe.id"
          :initial-liked-state="recipe.liked || false"
          liked-emoji="❤️"
          not-liked-emoji="🤍"
          color="red"
          size="medium"
          like-tooltip="Add to favorites"
          unlike-tooltip="Remove from favorites"
          @like-changed="onLikeChanged"
          @click.stop
        />
      </div>
    </div>
  </div>
</template>

<script>
import LikeButton from './LikeButton.vue';

export default {
  name: "RecipePreview",
  components: {
    LikeButton
  },
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  emits: ['recipe-liked-changed'],
  methods: {
    goToRecipe() {
      this.$router.push(`/recipe/${this.recipe.id}`);
    },
    
    onLikeChanged(data) {
      console.log('Recipe like status changed:', data);
      // Emit event to parent component instead of mutating prop
      this.$emit('recipe-liked-changed', {
        recipeId: this.recipe.id,
        isLiked: data.isLiked
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

.like-button-row {
  margin-top: 0.5rem;
}
</style>
