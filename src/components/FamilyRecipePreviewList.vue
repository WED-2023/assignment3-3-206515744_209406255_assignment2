<template>
  <b-container>
    <b-row>
      <b-col v-for="r in recipes" :key="r.id">
        <FamilyRecipePreview 
          class="recipePreview" 
          :recipe="r" 
          @recipe-deleted="$emit('recipe-deleted', $event)"
        />
      </b-col>
    </b-row>
  </b-container>
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
.container {
  min-height: 400px;
}
</style>