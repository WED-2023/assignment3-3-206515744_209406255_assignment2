<template>
  <div class="family-recipe-actions">
    <button
      type="button"
      class="btn btn-danger btn-sm delete-recipe-btn"
      @click="onDeleteClick"
      title="Delete family recipe"
    >
      🗑️
    </button>
  </div>
</template>

<script>
export default {
  name: "FamilyRecipeActionsSection",
  emits: ['delete-click'],
  methods: {
    onDeleteClick() {
      this.$emit('delete-click');
    }
  }
}
</script>

<style scoped>
.family-recipe-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
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
</style>
