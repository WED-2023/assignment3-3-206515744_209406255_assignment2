<template>
  <div class="profile-container">
    <h1>User Profile</h1>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else class="profile-card">
      <img v-if="userInfo.profilePic" :src="userInfo.profilePic" alt="Profile Picture" class="profile-pic" />
      <div class="profile-details">
        <div class="profile-field">
          <span class="field-label">First Name:</span>
          <span class="field-value">{{ userInfo.firstname }}</span>
        </div>
        <div class="profile-field">
          <span class="field-label">Last Name:</span>
          <span class="field-value">{{ userInfo.lastname }}</span>
        </div>
        <div class="profile-field">
          <span class="field-label">Email:</span>
          <span class="field-value">{{ userInfo.email }}</span>
        </div>
        <div class="profile-field">
          <span class="field-label">Country:</span>
          <span class="field-value">{{ userInfo.country }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref, onMounted } from 'vue';

export default {
  name: 'UsersProfilePage',
  setup() {
    const instance = getCurrentInstance();
    const axios = instance.appContext.config.globalProperties.axios;
    const userInfo = ref({ firstname: '', lastname: '', email: '', country: '', profilePic: '' });
    const error = ref('');

    onMounted(async () => {
      try {
        const response = await axios.get('/user_information');
        const data = response.data.data;
        userInfo.value = {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          country: data.country,
          profilePic: data.profilePic
        };
      } catch (err) {
        console.error('Failed to load user information:', err);
        error.value = 'Unable to fetch profile information. Please try again later.';
      }
    });

    return { userInfo, error };
  }
};
</script>

<style lang="scss" scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #42b983;
}

.profile-details {
  flex: 1;
}

.profile-field {
  margin-bottom: 0.75rem;
}

.field-label {
  font-weight: 600;
  margin-right: 0.5rem;
}

.error {
  color: #c00;
  text-align: center;
  margin-top: 1rem;
}
</style>
