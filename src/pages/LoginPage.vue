<template>
  <div class="login-page">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label>Username:</label>
        <input v-model="state.username" type="text" class="form-control" />
        <div v-if="v$.username.$error" class="text-danger">
          Username is required.
        </div>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input v-model="state.password" type="password" class="form-control" />
        <div v-if="v$.password.$error" class="text-danger">
          Password is required (at least 5 characters, at most 10 characters, must contain at least one number and one special character).
        </div>
      </div>
      <button type="submit" class="btn btn-primary mt-3">Login</button>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';

export default {
  name: "LoginPage",
  setup(_, { expose }) {
    const state = reactive({
      username: '',
      password: '',
    });

    const rules = {
      username: { required, minLength: minLength(3), maxLength: maxLength(8) },
      password: { required, minLength: minLength(5),maxLength: maxLength(10), hasSpecialChar: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), hasAtLeastOneNumber: (value) => /\d/.test(value) }
    };

    const v$ = useVuelidate(rules, state);

    const login = async () => {
      if (await v$.value.$validate()) {
        try {
          await window.axios.post('/login', {
            username: state.username,
            password: state.password
          });
          window.store.login(state.username);
          window.router.push('/main');
        } catch (err) {
          console.error("Login error:", err);
          
          // Safely extract error message with fallbacks
          let errorMessage = "An unexpected error occurred";
          
          if (err.response && err.response.data) {
            // Server responded with error data
            errorMessage = err.response.data.message || "Server error";
          } else if (err.request) {
            // Request was made but no response received
            errorMessage = "No response from server. Please check your connection.";
          } else {
            // Something else caused the error
            errorMessage = err.message || errorMessage;
          }
          
          window.toast("Login failed", errorMessage, "danger");
        }
      }
    };

    expose({ login });

    return { state, v$, login };
  }
};
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: auto;
}
</style>
