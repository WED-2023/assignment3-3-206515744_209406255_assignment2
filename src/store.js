import { reactive } from "vue";

const store = reactive({
  username: localStorage.getItem("username"),
  profilePic: localStorage.getItem("profilePic") || null,
  server_domain: "http://localhost:3000",
  isAuthenticated: false,

  async validateSession() {
    if (!this.username) {
      this.isAuthenticated = false;
      return false;
    }

    try {
      // Try to fetch user information to validate session
      const response = await fetch(`${this.server_domain}/user_information`, {
        credentials: "include",
      });

      if (response.ok) {
        this.isAuthenticated = true;
        const data = await response.json();
        this.setProfilePic(data.data.profilePic);
        return true;
      } else {
        // Session is invalid, clear local data
        this.logout();
        return false;
      }
    } catch (error) {
      console.error("Session validation failed:", error);
      this.isAuthenticated = false;
      return false;
    }
  },

  login(username) {
    localStorage.setItem("username", username);
    this.username = username;
    this.isAuthenticated = true;
    console.log("login", this.username);
  },

  setProfilePic(pic) {
    this.profilePic = pic;
    if (pic) localStorage.setItem("profilePic", pic);
  },

  logout() {
    console.log("logout");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePic");
    this.username = undefined;
    this.profilePic = null;
    this.isAuthenticated = false;
    // Clear meal plan on logout
    this.clearMealPlan();
  },
  // Meal plan management
  mealPlan: JSON.parse(localStorage.getItem("mealPlan") || "[]"),
  addToMealPlan(recipe) {
    const entry = { ...recipe, completedSteps: [], totalSteps: 0 };
    this.mealPlan.push(entry);
    localStorage.setItem("mealPlan", JSON.stringify(this.mealPlan));
  },
  initMealPlanSteps(recipeId, totalSteps) {
    const idx = this.mealPlan.findIndex((r) => r.id === recipeId);
    if (idx >= 0) {
      this.mealPlan[idx].totalSteps = totalSteps;
      if (
        !Array.isArray(this.mealPlan[idx].completedSteps) ||
        this.mealPlan[idx].completedSteps.length !== totalSteps
      ) {
        this.mealPlan[idx].completedSteps = Array(totalSteps).fill(false);
      }
      localStorage.setItem("mealPlan", JSON.stringify(this.mealPlan));
    }
  },
  toggleMealPlanStep(recipeId, stepIndex) {
    const idx = this.mealPlan.findIndex((r) => r.id === recipeId);
    if (idx >= 0) {
      const steps = this.mealPlan[idx].completedSteps;
      steps[stepIndex] = !steps[stepIndex];
      localStorage.setItem("mealPlan", JSON.stringify(this.mealPlan));
    }
  },
  removeFromMealPlan(index) {
    this.mealPlan.splice(index, 1);
    localStorage.setItem("mealPlan", JSON.stringify(this.mealPlan));
  },
  clearMealPlan() {
    this.mealPlan = [];
    localStorage.removeItem("mealPlan");
  },
  moveMealPlanUp(index) {
    if (index > 0) {
      const temp = this.mealPlan[index - 1];
      this.mealPlan[index - 1] = this.mealPlan[index];
      this.mealPlan[index] = temp;
      localStorage.setItem("mealPlan", JSON.stringify(this.mealPlan));
    }
  },
  moveMealPlanDown(index) {
    if (index < this.mealPlan.length - 1) {
      const temp = this.mealPlan[index + 1];
      this.mealPlan[index + 1] = this.mealPlan[index];
      this.mealPlan[index] = temp;
      localStorage.setItem("mealPlan", JSON.stringify(this.mealPlan));
    }
  },
});

export default store;
