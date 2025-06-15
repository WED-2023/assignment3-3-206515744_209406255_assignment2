<template>
  <div class="submit-section">
    <button
      type="submit"
      :class="[
        'btn',
        'w-100',
        variant,
        { 'btn-disabled': isDisabled }
      ]"
      :disabled="isDisabled"
      @mouseover="showTooltip = isDisabled && !isLoading && tooltipFields.length > 0"
      @mouseleave="showTooltip = false"
    >
      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
      {{ buttonText }}
    </button>
    
    <!-- Tooltip for disabled button -->
    <div v-if="showTooltip && tooltipFields.length > 0" class="tooltip-content">
      <strong>{{ tooltipTitle }}:</strong>
      <ul class="mb-0">
        <li v-for="field in tooltipFields" :key="field">{{ field }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'SubmitButton',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    isFormValid: {
      type: Boolean,
      default: true
    },
    loadingText: {
      type: String,
      default: 'Loading...'
    },
    defaultText: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      default: 'btn-primary',
      validator: (value) => ['btn-primary', 'btn-success', 'btn-danger', 'btn-warning', 'btn-info'].includes(value)
    },
    tooltipFields: {
      type: Array,
      default: () => []
    },
    tooltipTitle: {
      type: String,
      default: 'Form incomplete'
    }
  },
  setup(props) {
    const showTooltip = ref(false);

    const isDisabled = computed(() => {
      return props.isLoading || !props.isFormValid;
    });

    const buttonText = computed(() => {
      return props.isLoading ? props.loadingText : props.defaultText;
    });

    return {
      showTooltip,
      isDisabled,
      buttonText
    };
  }
};
</script>

<style scoped>
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

.btn-primary {
  background-color: #0d6efd;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0b5ed7;
}

.btn-success {
  background-color: #198754;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #157347;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #bb2d3b;
}

.btn-warning {
  background-color: #ffc107;
  color: #000;
}

.btn-warning:hover:not(:disabled) {
  background-color: #ffca2c;
}

.btn-info {
  background-color: #0dcaf0;
  color: #000;
}

.btn-info:hover:not(:disabled) {
  background-color: #31d2f2;
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