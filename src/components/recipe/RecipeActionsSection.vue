<template>
  <div class="action-buttons-row">
    <!-- Like button (only for Spoonacular recipes) -->
    <ActionButton
      v-if="!isUserRecipesRoute && !isFamilyRecipesRoute"
      :item-id="recipeId"
      action-type="like"
      :initial-active-state="isLiked"
      active-emoji="❤️"
      inactive-emoji="🤍"
      color="red"
      size="small"
      active-tooltip="Remove from liked"
      inactive-tooltip="Add to liked"
      add-endpoint="/users/liked"
      @action-changed="onActionChanged"
      @click.stop
    />
    
    <!-- Favorite button (only for Spoonacular recipes) -->
    <ActionButton
      v-if="!isUserRecipesRoute && !isFamilyRecipesRoute"
      :item-id="recipeId"
      action-type="favorite"
      :initial-active-state="isFavorited"
      active-emoji="⭐"
      inactive-emoji="☆"
      color="yellow"
      size="small"
      active-tooltip="Remove from favorites"
      inactive-tooltip="Add to favorites"
      add-endpoint="/users/favorites"
      @action-changed="onActionChanged"
      @click.stop
    />
    
    <!-- Delete button (only show if showDeleteButton prop is true) -->
    <button
      v-if="showDeleteButton"
      type="button"
      class="btn btn-danger btn-sm delete-recipe-btn"
      @click.stop="onDeleteClick"
      title="Delete recipe"
    >
      🗑️
    </button>
  </div>
</template>

<script>
import ActionButton from '../ui/ActionButton.vue';

export default {
  name: "RecipeActionsSection",
  components: {
    ActionButton
  },
  props: {
    recipeId: {
      type: [Number, String],
      required: true
    },
    isLiked: {
      type: Boolean,
      default: false
    },
    isFavorited: {
      type: Boolean,
      default: false
    },
    isUserRecipesRoute: {
      type: Boolean,
      default: false
    },
    isFamilyRecipesRoute: {
      type: Boolean,
      default: false
    },
    showDeleteButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['action-changed', 'delete-click'],
  methods: {
    onActionChanged(data) {
      this.$emit('action-changed', data);
    },
    onDeleteClick() {
      this.$emit('delete-click');
    }
  }
}
</script>

<style scoped>
.action-buttons-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 2;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
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

/* Responsive adjustments */
@media (max-width: 576px) {
  .action-buttons-row {
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.375rem;
  }
}
</style>
