import Main from "../pages/MainPage.vue";
import Register from "../pages/RegisterPage.vue";
import Login from "../pages/LoginPage.vue";
import SearchPage from "../pages/SearchPage.vue";
// import RecipesRandom from "../pages/RecipesRandomPage.vue";
import RecipeView from "../pages/RecipeViewPage.vue";
// import UsersLastView from "../pages/UsersLastViewPage.vue";
import UsersLiked from "../pages/UsersLikedPage.vue";
import UsersFavorites from "../pages/UsersFavoritesPage.vue";
// import UsersMyRecipes from "../pages/UsersMyRecipesPage.vue";
// import UsersFamilyRecipes from "../pages/UsersFamilyRecipesPage.vue";
// import UsersMealPlan from "../pages/UsersMealPlanPage.vue";
import NotFound from "../pages/NotFoundPage.vue";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: Register
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
    path: "/recipes/:recipeId",
    name: "recipe",
    component: RecipeView,
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
  // {
  //   path: "/users/my-recipes",
  //   name: "usersMyRecipes",
  //   component: UsersMyRecipes,
  // },
  // {
  //   path: "/users/family-recipes",
  //   name: "usersFamilyRecipes",
  //   component: UsersFamilyRecipes,
  // },
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
  }
];

export default routes;
