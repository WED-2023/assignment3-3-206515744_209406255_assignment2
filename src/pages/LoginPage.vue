<template>
  <div class="login-page">
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit" novalidate>
      <FormField
        v-model="state.username"
        label="Username"
        name="username"
        type="text"
        autocomplete="username"
        :required="true"
        :has-error="v$.username.$error"
        :errors="['Username is required.']"
        :requirements="['Required field']"
      />

      <FormField
        v-model="state.password"
        label="Password"
        name="password"
        type="password"
        autocomplete="current-password"
        :required="true"
        :has-error="v$.password.$error"
        :errors="['Password is required.']"
        :requirements="['Required field']"
      />

      <SubmitButton
        :is-loading="isSubmitting"
        :is-form-valid="isFormValid"
        default-text="Login"
        loading-text="Logging in..."
        variant="btn-primary"
        :tooltip-fields="missingRequiredFields"
        tooltip-title="Form incomplete"
      />

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
import FormField from '@/components/FormField.vue';
import SubmitButton from '@/components/SubmitButton.vue';

export default {
  name: "LoginPage",
  components: {
    FormField,
    SubmitButton
  },
  setup() {
    const router = useRouter();

    // Form state
    const state = reactive({
      username: '',
      password: ''
    });

    // Validation rules
    const rules = computed(() => ({
      username: { required },
      password: { required }
    }));

    const v$ = useVuelidate(rules, state);

    // UI state
    const isSubmitting = ref(false);

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
        window.toast('Validation Error', 'Please fill in all required fields', 'error');
        return;
      }

      isSubmitting.value = true;

      try {
        const payload = {
          username: state.username,
          password: state.password
        };

        await window.axios.post('/login', payload);
        
        // Store user data
        window.store.login(state.username);
        // Fetch and store profile picture
        try {
          const res = await window.axios.get('/user_information');
          window.store.setProfilePic(res.data.data.profilePic);
        } catch (picErr) {
          console.error('Failed to fetch profile picture:', picErr);
        }
        
        window.toast('Login Successful', 'Welcome back!', 'success');
        router.push('/'); // Redirect to home or dashboard
      } catch (error) {
        console.error('Login failed:', error);
        const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
        window.toast('Login Failed', message, 'error');
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      state,
      v$,
      isSubmitting,
      isFormValid,
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

.mt-3 {
  margin-top: 1rem;
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
</style>