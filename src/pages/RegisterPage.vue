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
        :requirements="['Required field']"
        :placeholder="isLoadingCountries ? 'Loading countries...' : 'Select a country'"
        :options="countries"
        :disabled="isLoadingCountries"
      />

      <SubmitButton
        :is-loading="isSubmitting"
        :is-form-valid="isFormValid"
        default-text="Register"
        loading-text="Creating Account..."
        variant="btn-success"
        :tooltip-fields="missingRequiredFields"
        tooltip-title="Form incomplete"
      />
    </form>
  </div>
</template>

<script>
import { reactive, ref, onMounted, computed, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, sameAs, maxLength, email } from '@vuelidate/validators';
import axios from 'axios';
import FormField from '@/components/FormField.vue';
import SubmitButton from '@/components/SubmitButton.vue';

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
        window.toast('Validation Error', 'Please fix the form errors', 'error');
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
</style>