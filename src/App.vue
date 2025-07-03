<template>
  <div id="app">
    <div id="nav">
      <div class="nav-left">
        <router-link :to="{ name: 'main' }">Main Page</router-link> |
        <router-link :to="{ name: 'search' }">Search</router-link> |
        <span v-if="!store.username" class="guest-links">
          Guest:
          <router-link :to="{ name: 'register' }">Register</router-link> |
          <router-link :to="{ name: 'login' }">Login</router-link>
        </span>
        <!-- User controls moved from the right -->
        <span v-if="store.username" class="d-inline-flex align-items-center">
          <div class="dropdown d-inline-block">
            <a
              href="#"
              class="dropdown-toggle"
              @click.prevent="toggleDropdown"
              :class="{ active: isDropdownOpen }"
            >
              <!-- Profile picture -->
              <img v-if="store.profilePic" :src="store.profilePic" alt="Profile" class="profile-pic me-2" />
              {{ store.username }}
            </a>
            <div class="dropdown-menu" :class="{ show: isDropdownOpen }">
              <!-- Profile link -->
              <router-link class="dropdown-item" :to="{ name: 'userProfile' }" @click="closeDropdown">
                Profile
              </router-link>
              <router-link class="dropdown-item" :to="{ name: 'usersLiked' }" @click="closeDropdown">
                My Liked
              </router-link>
              <router-link class="dropdown-item" :to="{ name: 'usersFavorites' }" @click="closeDropdown">
                My Favorites
              </router-link>
              <router-link class="dropdown-item" :to="{ name: 'usersMyRecipes' }" @click="closeDropdown">
                My Recipes
              </router-link>
              <router-link class="dropdown-item" :to="{ name: 'usersFamilyRecipes' }" @click="closeDropdown">
                Family Recipes
              </router-link>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item" @click.prevent="logout">Logout</a>
            </div>
          </div>
          <span class="nav-separator">|</span>
          <!-- Meal plan icon -->
          <router-link v-if="store.username" :to="{ name: 'mealPlan' }" class="nav-icon me-2">
            🍽️<span v-if="store.mealPlan.length" class="badge bg-danger ms-1">{{ store.mealPlan.length }}</span>
          </router-link>
        </span>
      </div>
      <div class="nav-title">Grandma's Recipes</div>
      <div class="nav-right">
        <!-- This section is now empty -->
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import { getCurrentInstance, ref, onMounted, onUnmounted } from 'vue';

export default {
  name: "App",
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;
    const axios = internalInstance.appContext.config.globalProperties.axios;

    const isDropdownOpen = ref(false);

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    const closeDropdown = () => {
      isDropdownOpen.value = false;
    };

    const handleClickOutside = (event) => {
      const dropdown = event.target.closest('.dropdown');
      if (!dropdown) {
        closeDropdown();
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      // Fetch user info for profile picture
      if (store.username) {
        axios.get('/user_information')
          .then(response => {
            const pic = response.data.data.profilePic;
            store.setProfilePic(pic);
          })
          .catch(err => console.error('Failed to fetch user information:', err));
      }
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    const logout = async () => {
      closeDropdown();
      try {
        // Send logout request to backend
        await axios.post('/logout');
        
        // Clear local state
        store.logout();
        
        toast("Logout", "User logged out successfully", "success");
        router.push("/").catch(() => {});
      } catch (error) {
        console.error('Logout error:', error);
        
        // Even if the backend request fails, still clear local state
        store.logout();
        
        // Show different message based on error
        if (error.response?.status === 401) {
          toast("Logout", "Already logged out", "info");
        } else {
          toast("Logout", "Logged out locally (server error)", "warning");
        }
        
        router.push("/").catch(() => {});
      }
    };

    return { 
      store, 
      logout, 
      axios, 
      isDropdownOpen, 
      toggleDropdown, 
      closeDropdown 
    };
  }
}
</script>

<style lang="scss">
@import "@/scss/form-style.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-fonts;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

#nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
  padding: 0.75rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 0 0 8px 8px;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap; /* Allow items within left/right to wrap */
}

.nav-right {
  justify-content: flex-end;
}

.guest-links {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem; /* Smaller gap for guest links */
}

/* Centered site title in navbar */
.nav-title {
  justify-self: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  flex-shrink: 0;
}

#nav a,
#nav .dropdown-toggle {
  margin: 0;                         // ← remove old margin-right
  color: #fff;
  font-weight: 600;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.3s, color 0.3s;
  border-bottom: 2px solid transparent;    // ← reserve space for underline
  display: inline-flex;
  align-items: center;
}

#nav a.router-link-exact-active,
#nav .dropdown-toggle.active {
  background: rgba(255,255,255,0.3);
  border-bottom-color: #fff;                // ← now just change border-color
}

/* remove the ::after block entirely */
.dropdown {
  position: relative;
  .dropdown-menu {
    background: #fff;
    z-index: 1000;
    color: #2c3e50;              // ← make all text dark
    .dropdown-item {
      color: inherit !important; // enforce the dark color
      transition: background 0.2s, color 0.2s;
      &:hover {
        background: #f0f0f0;
        color: #42b983;          // optional hover accent
      }
      &.router-link-active {
        font-weight: bold;
      }
    }
  }
  .dropdown-divider {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    margin: 0.5rem 0;
  }
}

/* New styles for profile picture */
.profile-pic {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.5rem;
}

/* New styles for nav icon */
.nav-icon {
  font-size: 1.25rem;
  color: #fff;
  position: relative;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  vertical-align: middle;  // ensure it's centered vertically
}

/* Positioning for meal plan count badge only */
.nav-icon .badge {
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: 0.75rem;
  padding: 0.1rem 0.4rem;
  border-radius: 10rem;
}

/* New styles for nav separator */
.nav-separator {
  padding: 0 0.5rem;
  vertical-align: middle;  // ensure it's centered vertically
}
</style>
