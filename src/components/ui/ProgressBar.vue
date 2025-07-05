<template>
  <div class="progress-bar-container">
    <div class="progress-bar-bg">
      <div class="progress-bar-fill" :style="{ width: percent + '%' }"></div>
    </div>
    <div class="progress-bar-text">{{ current }} / {{ total }}</div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    current: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  computed: {
    percent() {
      const denom = this.total > 0 ? this.total : 1;
      return Math.round((this.current / denom) * 100);
    }
  }
};
</script>

<style scoped>
.progress-bar-container {
  width: 100%;
  margin-bottom: 1rem;
}
.progress-bar-bg {
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  height: 12px;
}
.progress-bar-fill {
  background-color: #007bff;
  height: 100%;
  transition: width 0.3s ease;
}
.progress-bar-text {
  text-align: center;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
