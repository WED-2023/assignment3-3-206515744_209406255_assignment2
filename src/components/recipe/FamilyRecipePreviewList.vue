<template>
  <div class="grid-container">
    <FamilyRecipePreview 
      v-for="r in recipes" 
      :key="r.id"
      class="recipePreview" 
      :recipe="r" 
      @recipe-deleted="$emit('recipe-deleted', $event)"
    />
  </div>
</template>

<script>
import FamilyRecipePreview from "./FamilyRecipePreview.vue";

export default {
  name: "FamilyRecipePreviewList",
  components: {
    FamilyRecipePreview
  },
  props: {
    title: {
      type: String,
      required: true
    },
    recipes: {
      type: Array,
      default: () => []
    }
  },
  emits: ['recipe-deleted']
};
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* grid-template-rows: repeat(3, auto); */
  gap: 1rem;
}
</style>