<template>
  <div class="register-page">
    <h1>Register</h1>
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
              <li>3-8 characters long</li>
            </ul>
          </div>
        </div>
        <div v-if="v$.username.$error" class="invalid-feedback">
          <div v-for="error in getUsernameErrors" :key="error">{{ error }}</div>
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
            autocomplete="new-password"
            name="password"
            @focus="showValidationHint.password = true"
            @input="showValidationHint.password = true"
          />
          <div v-if="showValidationHint.password && !state.password" class="validation-hint">
            <strong>Requirements:</strong>
            <ul>
              <li>Required field</li>
              <li>5-10 characters long</li>
              <li>At least one special character (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
              <li>At least one number</li>
            </ul>
          </div>
        </div>
        <div v-if="v$.password.$error" class="invalid-feedback">
          <div v-for="error in getPasswordErrors" :key="error">{{ error }}</div>
        </div>
      </div>

      <!-- Confirm Password Field -->
      <div class="form-group">
        <label for="confirmPassword" class="form-label">
          Confirm Password <span class="text-danger">*</span>
        </label>
        <div class="input-wrapper">
          <input
            id="confirmPassword"
            v-model="state.confirmPassword"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': v$.confirmPassword.$error }"
            autocomplete="new-password"
            name="confirmPassword"
            @focus="showValidationHint.confirmPassword = true"
            @input="showValidationHint.confirmPassword = true"
          />
          <div v-if="showValidationHint.confirmPassword && !state.confirmPassword" class="validation-hint">
            <strong>Requirements:</strong>
            <ul>
              <li>Required field</li>
              <li>Must match the password above</li>
            </ul>
          </div>
        </div>
        <div v-if="v$.confirmPassword.$error" class="invalid-feedback">
          Passwords must match.
        </div>
      </div>

      <!-- First Name Field -->
      <div class="form-group">
        <label for="firstName" class="form-label">
          First Name <span class="text-danger">*</span>
        </label>
        <div class="input-wrapper">
          <input
            id="firstName"
            v-model="state.firstName"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': v$.firstName.$error }"
            autocomplete="given-name"
            name="firstName"
            @focus="showValidationHint.firstName = true"
            @input="showValidationHint.firstName = true"
          />
          <div v-if="showValidationHint.firstName && !state.firstName" class="validation-hint">
            <strong>Requirements:</strong>
            <ul>
              <li>Required field</li>
            </ul>
          </div>
        </div>
        <div v-if="v$.firstName.$error" class="invalid-feedback">
          First name is required.
        </div>
      </div>

      <!-- Last Name Field -->
      <div class="form-group">
        <label for="lastName" class="form-label">
          Last Name <span class="text-danger">*</span>
        </label>
        <div class="input-wrapper">
          <input
            id="lastName"
            v-model="state.lastName"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': v$.lastName.$error }"
            autocomplete="family-name"
            name="lastName"
            @focus="showValidationHint.lastName = true"
            @input="showValidationHint.lastName = true"
          />
          <div v-if="showValidationHint.lastName && !state.lastName" class="validation-hint">
            <strong>Requirements:</strong>
            <ul>
              <li>Required field</li>
            </ul>
          </div>
        </div>
        <div v-if="v$.lastName.$error" class="invalid-feedback">
          Last name is required.
        </div>
      </div>

      <!-- Email Field -->
      <div class="form-group">
        <label for="email" class="form-label">
          Email <span class="text-danger">*</span>
        </label>
        <div class="input-wrapper">
          <input
            id="email"
            v-model="state.email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': v$.email.$error }"
            autocomplete="email"
            name="email"
            @focus="showValidationHint.email = true"
            @input="showValidationHint.email = true"
          />
          <div v-if="showValidationHint.email && !state.email" class="validation-hint">
            <strong>Requirements:</strong>
            <ul>
              <li>Required field</li>
              <li>Valid email format (example@domain.com)</li>
            </ul>
          </div>
        </div>
        <div v-if="v$.email.$error" class="invalid-feedback">
          <div v-for="error in getEmailErrors" :key="error">{{ error }}</div>
        </div>
      </div>

      <!-- Country Field -->
      <div class="form-group">
        <label for="country" class="form-label">
          Country <span class="text-danger">*</span>
        </label>
        <div class="input-wrapper">
          <select
            id="country"
            v-model="state.country"
            class="form-control"
            :class="{ 'is-invalid': v$.country.$error }"
            autocomplete="country-name"
            name="country"
            :disabled="isLoadingCountries"
            @focus="showValidationHint.country = true"
            @change="showValidationHint.country = true"
          >
            <option disabled value="">
              {{ isLoadingCountries ? 'Loading countries...' : 'Select a country' }}
            </option>
            <option
              v-for="country in countries"
              :key="country.code"
              :value="country.name"
            >
              {{ country.name }}
            </option>
          </select>
          <div v-if="showValidationHint.country && !state.country" class="validation-hint">
            <strong>Requirements:</strong>
            <ul>
              <li>Required field</li>
              <li>Select from the available countries</li>
            </ul>
          </div>
        </div>
        <div v-if="v$.country.$error" class="invalid-feedback">
          Country is required.
        </div>
      </div>

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

// Custom validators
const hasSpecialChar = (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value);
const hasAtLeastOneNumber = (value) => /\d/.test(value);

// Environment configuration
const env = {
  COUNTRIES_API_KEY: process.env.VUE_APP_COUNTRIES_API_KEY
};

export default {
  name: "RegisterPage",
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

    // UI state for validation hints
    const showValidationHint = reactive({
      username: false,
      password: false,
      confirmPassword: false,
      firstName: false,
      lastName: false,
      email: false,
      country: false
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
    const hasUserInteracted = ref(false);

    // Watch for user interaction
    watch([state], () => {
      hasUserInteracted.value = true;
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
      showValidationHint,
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