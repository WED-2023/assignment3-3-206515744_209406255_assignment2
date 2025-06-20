<template>
  <div class="grid-container">
    <RecipePreview 
      v-for="r in recipes" 
      :key="r.id"
      class="recipePreview" 
      :recipe="r" 
      :custom-route-prefix="customRoutePrefix"
      :show-delete-button="showDeleteButton"
      @recipe-action-changed="$emit('recipe-action-changed', $event)"
      @recipe-deleted="$emit('recipe-deleted', $event)"
    />
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview
  },
  props: {
    title: {
      type: String,
      required: true
    },
    recipes: {
      type: Array,
      default: () => []
    },
    customRoutePrefix: {
      type: String,
      default: '/recipes'
    },
    showDeleteButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['recipe-action-changed', 'recipe-deleted']
};
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* if you want exactly 3 rows of equal height, uncomment: */
  /* grid-template-rows: repeat(3, auto); */
  gap: 1rem;
}
</style>
