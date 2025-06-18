<template>
  <div id="app">
    <div id="nav">
      <router-link :to="{ name: 'main' }">Vue Recipes</router-link> |
      <router-link :to="{ name: 'search' }">Search</router-link> |
      <span v-if="!store.username">
        Guest:
        <router-link :to="{ name: 'register' }">Register</router-link> |
        <router-link :to="{ name: 'login' }">Login</router-link> |
      </span>
      <span v-else>
        <div class="dropdown d-inline-block">
          <a 
            href="#" 
            class="dropdown-toggle" 
            @click.prevent="toggleDropdown"
            :class="{ active: isDropdownOpen }"
          >
            {{ store.username }}
          </a>
          <div class="dropdown-menu" :class="{ show: isDropdownOpen }">
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
      </span>
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
  padding: 30px;
  position: relative;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

// Dropdown styles
.dropdown {
  position: relative;
  
  .dropdown-toggle {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.15s ease-in-out;
    
    &:hover {
      color: #42b983 !important;
    }
    
    &.active {
      color: #42b983 !important;
    }
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    min-width: 160px;
    padding: 0.5rem 0;
    margin: 0.125rem 0 0;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.375rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
    
    &.show {
      display: block;
    }
    
    .dropdown-item {
      display: block;
      width: 100%;
      padding: 0.375rem 1rem;
      clear: both;
      font-weight: 400;
      color: #212529;
      text-align: inherit;
      text-decoration: none;
      white-space: nowrap;
      background-color: transparent;
      border: 0;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
      
      &:hover, &:focus {
        color: #1e2125;
        background-color: #e9ecef;
        text-decoration: none;
      }
      
      &.router-link-active {
        color: #42b983;
        font-weight: bold;
      }
    }
    
    .dropdown-divider {
      height: 0;
      margin: 0.5rem 0;
      overflow: hidden;
      border-top: 1px solid rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
