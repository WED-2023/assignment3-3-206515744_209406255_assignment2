<template>
  <div class="register-page">
    <h1>Register</h1>
    <form @submit.prevent="handleSubmit" novalidate>
      <FormField
        v-model="state.username"
        label="Username"
        name="username"
        type="text"
        autocomplete="username"
        :required="true"
        :has-error="v$.username.$error"
        :errors="getUsernameErrors"
        :requirements="['Required field', '3-8 characters long']"
      />

      <FormField
        v-model="state.password"
        label="Password"
        name="password"
        type="password"
        autocomplete="new-password"
        :required="true"
        :has-error="v$.password.$error"
        :errors="getPasswordErrors"
        :requirements="[
          'Required field',
          '5-10 characters long',
          'At least one special character',
          'At least one number'
        ]"
      />

      <FormField
        v-model="state.confirmPassword"
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        autocomplete="new-password"
        :required="true"
        :has-error="v$.confirmPassword.$error"
        :errors="['Passwords must match.']"
        :requirements="['Required field', 'Must match the password above']"
      />

      <FormField
        v-model="state.firstName"
        label="First Name"
        name="firstName"
        type="text"
        autocomplete="given-name"
        :required="true"
        :has-error="v$.firstName.$error"
        :errors="['First name is required.']"
        :requirements="['Required field']"
      />

      <FormField
        v-model="state.lastName"
        label="Last Name"
        name="lastName"
        type="text"
        autocomplete="family-name"
        :required="true"
        :has-error="v$.lastName.$error"
        :errors="['Last name is required.']"
        :requirements="['Required field']"
      />

      <FormField
        v-model="state.email"
        label="Email"
        name="email"
        type="email"
        autocomplete="email"
        :required="true"
        :has-error="v$.email.$error"
        :errors="getEmailErrors"
        :requirements="['Required field', 'Valid email format (example@domain.com)']"
      />

      <FormField
        v-model="state.country"
        label="Country"
        name="country"
        type="select"
        autocomplete="country-name"
        :required="true"
        :has-error="v$.country.$error"
        :errors="['Country is required.']"
        :requirements="['Required field', 'Select from the available countries']"
        :placeholder="isLoadingCountries ? 'Loading countries...' : 'Select a country'"
        :options="countries"
        :disabled="isLoadingCountries"
      />

      <!-- Submit Button -->
      <div class="submit-section">
        <button
          type="submit"
          class="btn btn-success w-100"
          :class="{ 'btn-disabled': isSubmitting || !isFormValid }"
          :disabled="isSubmitting || !isFormValid"
          @mouseover="showTooltip = !isFormValid && !isSubmitting"
          @mouseleave="showTooltip = false"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
          {{ isSubmitting ? 'Creating Account...' : 'Register' }}
        </button>
        
        <!-- Tooltip for disabled button -->
        <div v-if="showTooltip && !isFormValid" class="tooltip-content">
          <strong>Form incomplete:</strong>
          <ul class="mb-0">
            <li v-for="field in missingRequiredFields" :key="field">{{ field }}</li>
          </ul>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, ref, onMounted, computed, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, sameAs, maxLength, email } from '@vuelidate/validators';
import axios from 'axios';
import FormField from '@/components/FormField.vue';

// Custom validators
const hasSpecialChar = (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value);
const hasAtLeastOneNumber = (value) => /\d/.test(value);

// Environment configuration
const env = {
  COUNTRIES_API_KEY: process.env.VUE_APP_COUNTRIES_API_KEY
};

export default {
  name: "RegisterPage",
  components: {
    FormField
  },
  setup() {
    // Form state
    const state = reactive({
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      email: '',
      country: ''
    });

    // Validation rules
    const rules = computed(() => ({
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(8)
      },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
        hasSpecialChar,
        hasAtLeastOneNumber
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs(state.password)
      },
      firstName: { required },
      lastName: { required },
      email: { required, email },
      country: { required }
    }));

    const v$ = useVuelidate(rules, state);

    // UI state
    const isSubmitting = ref(false);
    const countries = ref([]);
    const isLoadingCountries = ref(false);
    const showTooltip = ref(false);

    // Watch for user interaction
    watch([state], () => {
      // User interaction tracking if needed
    }, { deep: true });

    // Computed properties
    const isFormValid = computed(() => !v$.value.$invalid);

    // Get missing required fields for user feedback (for tooltip only)
    const missingRequiredFields = computed(() => {
      const missing = [];
      const fieldLabels = {
        username: 'Username',
        password: 'Password', 
        confirmPassword: 'Confirm Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        country: 'Country'
      };

      // Simple approach: check if field value is empty or invalid
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

    // Error message getters
    const getUsernameErrors = computed(() => {
      const errors = [];
      if (!v$.value.username.required && v$.value.username.$dirty) {
        errors.push('Username is required.');
      }
      if (!v$.value.username.minLength && v$.value.username.$dirty) {
        errors.push('Username must be at least 3 characters.');
      }
      if (!v$.value.username.maxLength && v$.value.username.$dirty) {
        errors.push('Username must be at most 8 characters.');
      }
      return errors;
    });

    const getPasswordErrors = computed(() => {
      const errors = [];
      if (!v$.value.password.required && v$.value.password.$dirty) {
        errors.push('Password is required.');
      }
      if (!v$.value.password.minLength && v$.value.password.$dirty) {
        errors.push('Password must be at least 5 characters.');
      }
      if (!v$.value.password.maxLength && v$.value.password.$dirty) {
        errors.push('Password must be at most 10 characters.');
      }
      if (!v$.value.password.hasSpecialChar && v$.value.password.$dirty) {
        errors.push('Password must contain at least one special character.');
      }
      if (!v$.value.password.hasAtLeastOneNumber && v$.value.password.$dirty) {
        errors.push('Password must contain at least one number.');
      }
      return errors;
    });

    const getEmailErrors = computed(() => {
      const errors = [];
      if (!v$.value.email.required && v$.value.email.$dirty) {
        errors.push('Email is required.');
      }
      if (!v$.value.email.email && v$.value.email.$dirty) {
        errors.push('Please enter a valid email address.');
      }
      return errors;
    });

    // Country fetching
    const fetchCountries = async () => {
      try {
        isLoadingCountries.value = true;
        const apiKey = env.COUNTRIES_API_KEY;

        const response = await axios.get('https://restfulcountries.com/api/v1/countries', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          params: {
            per_page: 250
          }
        });

        countries.value = response.data.data
          .map(country => ({
            code: country.iso2,
            name: country.name
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

      } catch (error) {
        console.error('Failed to fetch countries:', error);
        // Fallback countries
        countries.value = [
          { code: 'US', name: 'United States' },
          { code: 'IL', name: 'Israel' },
        ];
      } finally {
        isLoadingCountries.value = false;
      }
    };

    // Form submission
    const handleSubmit = async () => {
      v$.value.$touch();
      
      if (!await v$.value.$validate()) {
        window.toast('Please fix the form errors', '', 'danger');
        return;
      }

      isSubmitting.value = true;

      try {
        const payload = {
          username: state.username,
          password: state.password,
          firstname: state.firstName,
          lastname: state.lastName,
          email: state.email,
          country: state.country
        };

        await window.axios.post('/register', payload);
        
        window.toast('Registration Successful', 'You can now login', 'success');
        window.router.push('/login');
      } catch (error) {
        console.error('Registration failed:', error);
        const message = error.response?.data?.message || 'Registration failed. Please try again.';
        window.toast('Registration Failed', message, 'danger');
      } finally {
        isSubmitting.value = false;
      }
    };

    // Initialize on mount
    onMounted(() => {
      fetchCountries();
    });

    return {
      state,
      v$,
      countries,
      isLoadingCountries,
      isSubmitting,
      isFormValid,
      showTooltip,
      missingRequiredFields,
      handleSubmit,
      getUsernameErrors,
      getPasswordErrors,
      getEmailErrors
    };
  }
};
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
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

.btn-success {
  background-color: #198754;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #157347;
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