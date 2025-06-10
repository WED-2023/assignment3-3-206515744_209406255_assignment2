<template>
  <div class="register-page">
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label>Username:</label>
        <input v-model="state.username" type="text" class="form-control" autocomplete="username" name="username" />
        <div v-if="v$.username.$error" class="text-danger">
          Username is required.
        </div>
        <div v-if="!v$.username.minLength && v$.username.$dirty" class="text-danger">
            Username must be at least 3 characters.
        </div>
        <div v-if="!v$.username.maxLength && v$.username.$dirty" class="text-danger">
            Username must be at most 8 characters.
        </div>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input v-model="state.password" type="password" class="form-control" autocomplete="new-password" name="password" />
        <div v-if="v$.password.$error" class="text-danger">
          Password is required (at least 6 characters).
        </div>
         <div v-if="!v$.password.minLength && v$.password.$dirty" class="text-danger">
            Password must be at least 5 characters.
        </div>
        <div v-if="!v$.password.maxLength && v$.password.$dirty" class="text-danger">
            Password must be at most 10 characters.
        </div>
        <div v-if="!v$.password.hasSpecialChar && v$.password.$dirty" class="text-danger">
            Password must contain at least one special character.
        </div>
        <div v-if="!v$.password.hasAtLeastOneNumber && v$.password.$dirty" class="text-danger">
            Password must contain at least one number.
        </div>
      </div>
      <div class="form-group">
        <label>Confirm Password:</label>
        <input v-model="state.confirmPassword" type="password" class="form-control" autocomplete="new-password" name="confirmPassword" />
        <div v-if="v$.confirmPassword.$error" class="text-danger">
          Passwords must match.
        </div>
      </div>
      <div class="form-group">
        <label>First Name:</label>
        <input v-model="state.firstName" type="text" class="form-control" autocomplete="given-name" name="firstName" />
        <div v-if="v$.firstName.$error" class="text-danger">
          First name is required.
        </div>
      </div>
      <div class="form-group">
        <label>Last Name:</label>
        <input v-model="state.lastName" type="text" class="form-control" autocomplete="family-name" name="lastName" />
        <div v-if="v$.lastName.$error" class="text-danger">
          Last name is required.
        </div>
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input v-model="state.email" type="email" class="form-control" autocomplete="email" name="email" />
        <div v-if="v$.email.$error" class="text-danger">
          Valid email is required.
        </div>
         <div v-if="!v$.email.email && v$.email.$dirty" class="text-danger">
            Please enter a valid email address.
        </div>
      </div>
      <div class="form-group">
        <label>Country:</label>
        <select v-model="state.country" class="form-control" autocomplete="country-name" name="country">
          <option disabled value="">Select a country</option>
          <option v-for="country in countries" :key="country.code" :value="country.name">
            {{ country.name }}
          </option>
        </select>
        <div v-if="v$.country.$error" class="text-danger">
          Country is required.
        </div>
      </div>
      <button type="submit" class="btn btn-success mt-3">Register</button>
      <div v-if="isLoadingCountries" class="mt-3">Loading countries...</div>
    </form>
  </div>
</template>

<script>
import { reactive, ref, onMounted, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, sameAs, maxLength, email } from '@vuelidate/validators';
import axios from 'axios';

const env = {
  COUNTRIES_API_KEY: process.env.VUE_APP_COUNTRIES_API_KEY
}

export default {
  name: "RegisterPage",
  setup() {
    const state = reactive({
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      email: '',
      country: '' // This now holds the country NAME because of <option :value="country.name">
    });

    const rules = computed(() => ({
      username: { required, minLength: minLength(3), maxLength: maxLength(8) },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
        hasSpecialChar: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
        hasAtLeastOneNumber: (value) => /\d/.test(value)
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs(state.password)
      },
      country: { required },
      firstName: { required },
      lastName: { required },
      email: { required, email },
    }));

    const v$ = useVuelidate(rules, state);

    const register = async () => {
      v$.value.$touch();
      if (await v$.value.$validate()) {
        try {
          // --- REMOVED: Country name lookup is no longer needed
          // because state.country already holds the name from <option :value="country.name">
          await axios.post('/register', { // Corrected endpoint for consistency
            username: state.username,
            password: state.password,
            firstname: state.firstName, // Ensure your backend expects 'firstName' or 'firstname'
            lastname: state.lastName,   // Ensure your backend expects 'lastName' or 'lastname'
            email: state.email,
            country: state.country      // Now sends the country NAME directly
          });
          window.toast("Registration Successful", "You can now login", "success");
          window.router.push('/login');
        } catch (err) {
          console.error("Registration failed:", err);
          window.toast("Registration failed", err.response?.data?.message || "An unexpected error occurred", "danger");
        }
      }
    };

    // Country selection logic
    const countries = ref([]);
    const isLoadingCountries = ref(false);
    onMounted(async () => {
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
        countries.value = response.data.data.map(country => ({
          code: country.iso2,
          name: country.name
        })).sort((a, b) => a.name.localeCompare(b.name));

      } catch (error) {
        console.error('Failed to fetch countries:', error);
        console.error('Error details:', error.response ? error.response.data : 'No response data');
        countries.value = [
          { code: 'US', name: 'United States' },
          { code: 'IL', name: 'Israel' },
        ];
      } finally {
        isLoadingCountries.value = false;
      }
    });

    return {
      state,
      v$,
      register,
      countries,
      isLoadingCountries
    };
  }
};
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: auto;
}
</style>