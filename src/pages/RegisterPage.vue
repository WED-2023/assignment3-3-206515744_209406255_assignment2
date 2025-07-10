<template>
  <div class="register-page fade-in">
    <h1 class="fade-in-down">Register</h1>
    <form @submit.prevent="handleSubmit" novalidate class="slide-in-up">
      <div class="fade-in-up-delayed">
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
      </div>

      <div class="fade-in-up-delayed" style="animation-delay: 0.2s;">
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
      </div>

      <div class="fade-in-up-delayed" style="animation-delay: 0.3s;">
        <FormField
          v-model="state.confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          autocomplete="new-password"
          :required="true"
          :has-error="v$.confirmPassword.$error"
          :errors="getConfirmPasswordErrors"
          :requirements="['Required field', 'Must match the password above']"
        />
      </div>

      <div class="fade-in-up-delayed" style="animation-delay: 0.4s;">
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
      </div>

      <div class="fade-in-up-delayed" style="animation-delay: 0.5s;">
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
      </div>

      <div class="fade-in-up-delayed" style="animation-delay: 0.6s;">
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
      </div>

      <div class="fade-in-up-delayed" style="animation-delay: 0.7s;">
        <FormField
          v-model="state.country"
          label="Country"
          name="country"
          type="select"
          autocomplete="country-name"
          :required="true"
          :has-error="v$.country.$error"
          :errors="['Country is required.']"
          :requirements="['Required field']"
          :placeholder="isLoadingCountries ? 'Loading countries...' : 'Select a country'"
          :options="countries"
          :disabled="isLoadingCountries"
        />
      </div>

      <div class="fade-in-up-delayed" style="animation-delay: 0.8s;">
        <FormField
          v-model="state.profilePic"
          label="Profile Picture URL (Optional)"
          name="profilePic"
          type="text"
          autocomplete="off"
          :has-error="v$.profilePic.$error"
          :errors="getProfilePicErrors"
          :requirements="['Must be a valid URL if provided']"
        />
      </div>

      <div class="slide-in-up" style="animation-delay: 0.9s;">
        <SubmitButton
          :is-loading="isSubmitting"
        :is-form-valid="isFormValid"
        default-text="Register"
        loading-text="Creating Account..."
        variant="btn-success"
        :tooltip-fields="missingRequiredFields"
        tooltip-title="Form incomplete"
      />
      </div>

      <!-- Login Link -->
      <div class="text-center mt-3 slide-in-up" style="animation-delay: 1.0s;">
        <p class="mb-0">
          Already have an account? 
          <router-link to="/login" class="link-primary hover-scale">Login here</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, ref, onMounted, computed, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, email } from '@vuelidate/validators';
import axios from 'axios';
import FormField from '@/components/form/FormField.vue';
import SubmitButton from '@/components/form/SubmitButton.vue';

// Custom URL validator
const isValidUrl = (value) => {
  if (!value) return true;
  try { new URL(value); return true; } catch { return false; }
};

// Custom validators
const hasSpecialChar = (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value);
const hasAtLeastOneNumber = (value) => /\d/.test(value);

export default {
  name: "RegisterPage",
  components: {
    FormField,
    SubmitButton
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
      country: '',
      profilePic: ''  // optional
    });

    // Validation rules - removed sameAs for confirmPassword to handle manually
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
        required
      },
      firstName: { required },
      lastName: { required },
      email: { required, email },
      country: { required },
      profilePic: { isValidUrl }
    }));

    const v$ = useVuelidate(rules, state);

    // UI state
    const isSubmitting = ref(false);
    const countries = ref([]);
    const isLoadingCountries = ref(false);

    // Watch for user interaction - simplified
    watch(state, () => {
      // Only validate if the form has been touched before
      if (v$.value.$anyDirty) {
        v$.value.$validate();
      }
    }, { deep: true });

    // Debug function to check form state
    const debugFormState = () => {
      console.log('=== FORM DEBUG ===');
      console.log('State:', {
        username: state.username,
        password: state.password ? '***' : '',
        confirmPassword: state.confirmPassword ? '***' : '',
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        country: state.country,
        profilePic: state.profilePic
      });
      console.log('Validation:', {
        invalid: v$.value.$invalid,
        dirty: v$.value.$dirty,
        anyDirty: v$.value.$anyDirty
      });
      console.log('Password match:', state.password === state.confirmPassword);
      console.log('Form valid:', isFormValid.value);
      console.log('================');
    };
    
    // Expose debug function globally for testing
    window.debugForm = debugFormState;

    // Computed properties
    const isFormValid = computed(() => {
      // Check if all required fields have values - be more explicit about checking
      const hasAllRequiredValues = !!(
        state.username && state.username.trim() && 
        state.password && 
        state.confirmPassword && 
        state.firstName && state.firstName.trim() && 
        state.lastName && state.lastName.trim() && 
        state.email && state.email.trim() && 
        state.country
      );
      
      // Check if basic validation has passed (excluding password match)
      const isBasicValidationPassed = !v$.value.$invalid;
      
      // Manual password matching check
      const passwordsMatch = state.password === state.confirmPassword && state.password.length > 0;
      
      const isValid = hasAllRequiredValues && isBasicValidationPassed && passwordsMatch;
      
      return isValid;
    });

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
    const getProfilePicErrors = computed(() => {
      const errors = [];
      const field = v$.value.profilePic;
      if (!field.isValidUrl && field.$dirty) {
        errors.push('Please enter a valid URL.');
      }
      return errors;
    });

    const getConfirmPasswordErrors = computed(() => {
      const errors = [];
      const field = v$.value.confirmPassword;
      
      if (!field.required && field.$dirty) {
        errors.push('Confirm password is required.');
      }
      
      // Manual password matching check
      if (field.$dirty && state.confirmPassword && state.password !== state.confirmPassword) {
        errors.push('Passwords must match.');
      }
      
      return errors;
    });

    // Country fetching
    const fetchCountries = async () => {
      try {
        isLoadingCountries.value = true;
        // Fetch countries through our backend proxy to avoid CORS
        const response = await axios.get('/countries');
        console.log('Countries fetched:', response.data);
        const countryNames = response.data.success && Array.isArray(response.data.data)
          ? response.data.data
          : [];
        countries.value = countryNames
          .map(name => ({ value: name, text: name }));

      } catch (error) {
        console.error('Failed to fetch countries:', error);
        // Fallback countries
        countries.value = [
          { value: 'US', text: 'United States' },
          { value: 'IL', text: 'Israel' },
        ];
      } finally {
        isLoadingCountries.value = false;
      }
    };

    // Form submission
    const handleSubmit = async () => {
      console.log('Form submission started');
      
      // Touch all fields to show validation errors
      v$.value.$touch();
      
      // Wait for validation to complete
      const isVuelidateValid = await v$.value.$validate();
      
      // Check passwords match
      const passwordsMatch = state.password === state.confirmPassword;
      
      console.log('Submission validation:', {
        isVuelidateValid,
        passwordsMatch,
        password: state.password,
        confirmPassword: state.confirmPassword,
        invalid: v$.value.$invalid
      });
      
      // Check basic validation first
      if (!isVuelidateValid) {
        console.log('Vuelidate validation failed');
        window.toast('Validation Error', 'Please fix the form errors', 'error');
        return;
      }
      
      // Check password matching
      if (!passwordsMatch) {
        console.log('Password matching failed');
        window.toast('Password Error', 'Passwords must match', 'error');
        return;
      }
      
      console.log('All validation passed, submitting...');
      isSubmitting.value = true;

      try {
        const payload = {
          username: state.username,
          password: state.password,
          confirmedPassword: state.confirmPassword,  // Backend expects this field name
          firstname: state.firstName,
          lastname: state.lastName,
          email: state.email,
          country: state.country,
          profilePic: state.profilePic  // include optional URL
        };

        console.log('Sending payload:', {
          ...payload,
          password: '***',
          profilePic: payload.profilePic || '(empty)'
        });

        await window.axios.post('/register', payload);
        
        window.toast('Registration Successful', 'You can now login', 'success');
        window.router.push('/login');
      } catch (error) {
        console.error('Registration failed:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        let message = 'Registration failed. Please try again.';
        
        if (error.response?.data) {
          if (typeof error.response.data === 'string') {
            message = error.response.data;
          } else if (error.response.data.message) {
            message = error.response.data.message;
          } else if (error.response.data.error) {
            message = error.response.data.error;
          } else {
            message = `Server error: ${JSON.stringify(error.response.data)}`;
          }
        }
        
        window.toast('Registration Failed', message, 'error');
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
      missingRequiredFields,
      handleSubmit,
      getUsernameErrors,
      getPasswordErrors,
      getEmailErrors,
      getProfilePicErrors,
      getConfirmPasswordErrors
    };
  }
};
</script>

<style scoped>
.register-page {
  max-width: 500px;
  margin: 2rem auto;
  padding: 3rem 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.register-page h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-weight: 600;
}

/* Ensure form field hints are visible with new card styling */
.register-page .form-group {
  position: relative;
  z-index: 1;
  margin-bottom: 2rem; /* Add more space for hints */
}

.register-page .input-wrapper {
  position: relative;
  z-index: 1;
}

.register-page .validation-hint {
  background-color: rgba(227, 242, 253, 0.98);
  backdrop-filter: blur(5px);
  border: 1px solid #90caf9;
  z-index: 1000 !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  position: relative !important; /* Changed to relative */
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.mb-0 {
  margin-bottom: 0;
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

/* Animation classes */
.fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-in-out forwards;
}

.fade-in-down {
  opacity: 0;
  transform: translateY(-20px);
  animation: fadeInDown 1s ease-out forwards;
}

.fade-in-up-delayed {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out forwards;
}

.slide-in-up {
  opacity: 0;
  transform: translateY(30px);
  animation: slideInUp 0.8s ease-out forwards;
}

.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>