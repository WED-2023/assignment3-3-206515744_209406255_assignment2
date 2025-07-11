import Main from "../pages/MainPage.vue";
import Register from "../pages/RegisterPage.vue";
import Login from "../pages/LoginPage.vue";
import SearchPage from "../pages/SearchPage.vue";
import AboutPage from "../pages/AboutPage.vue";
// import RecipesRandom from "../pages/RecipesRandomPage.vue";
import RecipeView from "../pages/RecipeViewPage.vue";
import FamilyRecipeView from "../pages/FamilyRecipeViewPage.vue";
// import UsersLastView from "../pages/UsersLastViewPage.vue";
import UsersLiked from "../pages/UsersLikedPage.vue";
import UsersFavorites from "../pages/UsersFavoritesPage.vue";
import UsersMyRecipes from "../pages/UsersMyRecipesPage.vue";
import UsersFamilyRecipes from "../pages/UsersFamilyRecipesPage.vue";
// import UsersMealPlan from "../pages/UsersMealPlanPage.vue";
import NotFound from "../pages/NotFoundPage.vue";
import UsersProfilePage from "../pages/UsersProfilePage.vue";
import RecipePreparation from "../pages/RecipePreparationPage.vue";
import store from "../store.js";
import MealPlanPage from "../pages/UsersMealPlanPage.vue";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/profile",
    name: "userProfile",
    component: UsersProfilePage,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/recipes/search",
    name: "search",
    component: SearchPage,
  },
  {
    path: "/about",
    name: "about",
    component: AboutPage,
  },
  {
    path: "/recipes/:recipeId",
    name: "recipe",
    component: RecipeView,
  },
  {
    path: "/recipes/:recipeId/preparation",
    name: "recipePreparation",
    component: RecipePreparation,
    beforeEnter: (to, from, next) => {
      if (store.username) next();
      else next({ name: "login" });
    },
  },
  {
    path: "/users/my-recipes/:recipeId/preparation",
    name: "userRecipePreparation",
    component: RecipePreparation,
    beforeEnter: (to, from, next) => {
      if (store.username) next();
      else next({ name: "login" });
    },
  },
  {
    path: "/users/family-recipes/:recipeId/preparation",
    name: "familyRecipePreparation",
    component: RecipePreparation,
    beforeEnter: (to, from, next) => {
      if (store.username) next();
      else next({ name: "login" });
    },
  },
  {
    path: "/meal-plan",
    name: "mealPlan",
    component: MealPlanPage,
    beforeEnter: (to, from, next) => {
      if (store.username) next();
      else next({ name: "login" });
    },
  },
  // {
  //   path: "/recipes/random",
  //   name: "recipeRandom",
  //   component: RecipesRandom,
  // },
  // {
  //   path: "/users/last-view",
  //   name: "usersLastView",
  //   component: UsersLastView,
  // },
  {
    path: "/users/liked",
    name: "usersLiked",
    component: UsersLiked,
  },
  {
    path: "/users/favorites",
    name: "usersFavorites",
    component: UsersFavorites,
  },
  {
    path: "/users/my-recipes",
    name: "usersMyRecipes",
    component: UsersMyRecipes,
  },
  {
    path: "/users/my-recipes/:recipeId",
    name: "userRecipeView",
    component: RecipeView,
  },
  {
    path: "/users/family-recipes",
    name: "usersFamilyRecipes",
    component: UsersFamilyRecipes,
  },
  {
    path: "/family-recipes/:recipeId",
    name: "familyRecipeView",
    component: FamilyRecipeView,
  },
  // {
  //   path: "/users/meal-plan",
  //   name: "usersMealPlan",
  //   component: UsersMealPlan,
  // },
  // Catch-all route for 404 Not Found
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
  },
];

export default routes;
