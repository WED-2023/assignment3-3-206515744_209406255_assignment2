<script>
// ...existing imports...

export default {
  // ...existing component definition...
  data() {
    return {
      // ...existing data...
      userLikedRecipes: []
    };
  },
  async created() {
    // Fetch random recipes and liked recipes in parallel
    await Promise.all([
      this.updateRandomRecipes(),
      this.fetchUserLikedRecipes()
    ]);
    
    // Mark liked recipes after both requests complete
    this.randomRecipes = this.markLikedRecipes(this.randomRecipes);
  },
  methods: {
    // ...existing methods...

    async fetchUserLikedRecipes() {
      if (!this.$root.store.username) {
        this.userLikedRecipes = [];
        return [];
      }

      try {
        const response = await window.axios.get('/users/liked');
        this.userLikedRecipes = response.data.recipes || response.data || [];
        return this.userLikedRecipes;
      } catch (error) {
        console.error("Failed to fetch liked recipes:", error);
        this.userLikedRecipes = [];
        return [];
      }
    },

    markLikedRecipes(recipes) {
      return recipes.map(recipe => {
        const isLiked = this.userLikedRecipes.some(likedRecipe => 
          likedRecipe.id === recipe.id
        );
        return {
          ...recipe,
          liked: isLiked
        };
      });
    },

    onRecipeLikedChanged(data) {
      console.log('Recipe liked status changed on home page:', data);
      
      if (data.isLiked) {
        const recipe = this.randomRecipes.find(r => r.id === data.recipeId);
        if (recipe && !this.userLikedRecipes.some(lr => lr.id === data.recipeId)) {
          this.userLikedRecipes.push(recipe);
        }
      } else {
        this.userLikedRecipes = this.userLikedRecipes.filter(lr => lr.id !== data.recipeId);
      }
    }
  }
};
</script>