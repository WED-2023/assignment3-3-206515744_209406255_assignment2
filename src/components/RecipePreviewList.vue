<template>
  <b-container>
    <b-row>
      <b-col v-for="r in recipes" :key="r.id">
        <RecipePreview 
          class="recipePreview" 
          :recipe="r" 
          :custom-route-prefix="customRoutePrefix"
          :show-delete-button="showDeleteButton"
          @recipe-action-changed="$emit('recipe-action-changed', $event)"
          @recipe-deleted="$emit('recipe-deleted', $event)"
        />
      </b-col>
    </b-row>
  </b-container>
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
.container {
  min-height: 400px;
}
</style>
