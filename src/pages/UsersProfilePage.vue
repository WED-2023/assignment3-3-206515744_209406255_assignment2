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
  border: 1px solid grey;
  overflow: hidden;
  max-width: 600px;
  margin: 2rem auto;
  padding: 0; // remove inner padding, move to card
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.profile-container h1 {
  text-align: center;
  font-size: 1.8rem;
  color: #42b983;
  margin: 1rem 0;
  padding: 0 1rem;
}

.profile-card {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  align-items: start;
  gap: 1.5rem;
  padding: 1.5rem;
}

.profile-pic {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #42b983;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.profile-details {
  width: 100%;
  background: #f9f9f9;
  padding: 0.75rem;
  border-radius: 0 20px 20px 0;
  font-size: 1rem;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.profile-field {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.field-label {
  font-weight: 600;
  color: #555;
  flex: 0 0 auto;
  margin-right: 0.5rem;
}

.field-value {
  color: #333;
  flex: 1 1 auto;
  min-width: 0;
  overflow-wrap: break-word;
}

.error {
  color: #c00;
  text-align: center;
  margin-top: 1rem;
}
</style>
