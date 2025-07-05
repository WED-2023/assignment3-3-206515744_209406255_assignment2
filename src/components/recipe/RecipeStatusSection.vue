<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="text-center mt-4 pulse">
      <div class="loading-animation">
        <div class="spinner"></div>
        <p class="pulse-text">Loading recipe...</p>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="alert alert-danger mt-4">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeStatusSection",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped>
.loading-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.alert {
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.text-center {
  text-align: center;
}

.mt-4 {
  margin-top: 1.5rem;
}

/* Animation classes */
.pulse {
  animation: pulse 2s infinite;
}

.pulse-text {
  animation: pulseText 2s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes pulseText {
  0%, 100% { 
    color: inherit;
    transform: scale(1);
  }
  50% { 
    color: #42b983;
    transform: scale(1.02);
  }
}
</style>
