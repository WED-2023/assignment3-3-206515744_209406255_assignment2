<template>
  <div class="login-page">
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit" novalidate>
      <!-- Username Field -->
      <div class="form-group">
        <label for="username" class="form-label">
          Username <span class="text-danger">*</span>
        </label>
        <div class="input-wrapper">
          <input
            id="username"
            v-model="state.username"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': v$.username.$error }"
            autocomplete="username"
            name="username"
            @focus="showValidationHint.username = true"
            @input="showValidationHint.username = true"
          />
          <div v-if="showValidationHint.username && !state.username" class="validation-hint">
            <strong>Requirements:</strong>
            <ul>
              <li>Required field</li>
              <li>Enter your registered username</li>
            </ul>
          </div>
        </div>
        <div v-if="v$.username.$error" class="invalid-feedback">
          Username is required.
        </div>
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label for="password" class="form-label">
          Password <span class="text-danger">*</span>
        </label>
        <div class="input-wrapper">
          <input
            id="password"
            v-model="state.password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': v$.password.$error }"
            autocomplete="current-password"
            name="password"
            @focus="showValidationHint.password = true"
            @input="showValidationHint.password = true"
          />
          <div v-if="showValidationHint.password && !state.password" class="validation-hint">
            <strong>Requirements:</strong>
            <ul>
              <li>Required field</li>
              <li>Enter your password</li>
            </ul>
          </div>
        </div>
        <div v-if="v$.password.$error" class="invalid-feedback">
          Password is required.
        </div>
      </div>

      <!-- Submit Button -->
      <div class="submit-section">
        <button
          type="submit"
          class="btn btn-primary w-100"
          :class="{ 'btn-disabled': isSubmitting || !isFormValid }"
          :disabled="isSubmitting || !isFormValid"
          @mouseover="showTooltip = !isFormValid && !isSubmitting"
          @mouseleave="showTooltip = false"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
          {{ isSubmitting ? 'Logging in...' : 'Login' }}
        </button>
        
        <!-- Tooltip for disabled button -->
        <div v-if="showTooltip && !isFormValid" class="tooltip-content">
          <strong>Form incomplete:</strong>
          <ul class="mb-0">
            <li v-for="field in missingRequiredFields" :key="field">{{ field }}</li>
          </ul>
        </div>
      </div>

      <!-- Register Link -->
      <div class="text-center mt-3">
        <p class="mb-0">
          Don't have an account? 
          <router-link to="/register" class="link-primary">Register here</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useRouter } from 'vue-router';

export default {
  name: "LoginPage",
  setup() {
    const router = useRouter();

    // Form state
    const state = reactive({
      username: '',
      password: ''
    });

    // UI state for validation hints
    const showValidationHint = reactive({
      username: false,
      password: false
    });

    // Validation rules
    const rules = computed(() => ({
      username: { required },
      password: { required }
    }));

    const v$ = useVuelidate(rules, state);

    // UI state
    const isSubmitting = ref(false);
    const showTooltip = ref(false);

    // Computed properties
    const isFormValid = computed(() => !v$.value.$invalid);

    // Get missing required fields for user feedback (for tooltip only)
    const missingRequiredFields = computed(() => {
      const missing = [];
      const fieldLabels = {
        username: 'Username',
        password: 'Password'
      };

      // Check if field value is empty or invalid
      Object.keys(fieldLabels).forEach(fieldName => {
        const fieldValue = state[fieldName];
        const field = v$.value[fieldName];
        
        // If field is empty
        if (!fieldValue || fieldValue.trim() === '') {
          missing.push(fieldLabels[fieldName]);
        }
        // If field has value but is invalid
        else if (field.$invalid) {
          missing.push(`${fieldLabels[fieldName]} (fix validation errors)`);
        }
      });

      return missing;
    });

    // Form submission
    const handleSubmit = async () => {
      v$.value.$touch();
      
      if (!await v$.value.$validate()) {
        window.toast('Please fill in all required fields', '', 'danger');
        return;
      }

      isSubmitting.value = true;

      try {
        const payload = {
          username: state.username,
          password: state.password
        };

        await window.axios.post('/login', payload);
        
        // Store user data and token if provided
        window.store.login(state.username);
        window.toast('Login Successful', 'Welcome back!', 'success');
        router.push('/'); // Redirect to home or dashboard
      } catch (error) {
        console.error('Login failed:', error);
        const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
        window.toast('Login Failed', message, 'danger');
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      state,
      v$,
      isSubmitting,
      isFormValid,
      showTooltip,
      showValidationHint,
      missingRequiredFields,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.input-wrapper {
  position: relative;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.is-invalid {
  border-color: #dc3545;
}

.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

.validation-hint {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 0.25rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.validation-hint strong {
  color: #1976d2;
}

.validation-hint ul {
  margin: 0.25rem 0 0 0;
  padding-left: 1rem;
  color: #424242;
}

.text-danger {
  color: #dc3545;
}

.submit-section {
  position: relative;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.15s ease-in-out;
}

.btn-primary {
  background-color: #0d6efd;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0b5ed7;
}

.btn-disabled {
  background-color: #6c757d !important;
  cursor: not-allowed;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.w-100 {
  width: 100%;
}

.me-2 {
  margin-right: 0.5rem;
}

.mb-0 {
  margin-bottom: 0;
}

.mt-3 {
  margin-top: 1rem;
}

.text-center {
  text-align: center;
}

.link-primary {
  color: #0d6efd;
  text-decoration: none;
}

.link-primary:hover {
  color: #0b5ed7;
  text-decoration: underline;
}

.tooltip-content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 1000;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.tooltip-content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #333;
}

.tooltip-content ul {
  margin: 0;
  padding-left: 1rem;
  list-style-type: disc;
}

.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: -0.125em;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.2em;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}
</style>
