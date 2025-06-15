<template>
  <div class="form-group">
    <label :for="name" class="form-label">
      {{ label }} <span v-if="required" class="text-danger">*</span>
    </label>
    <div class="input-wrapper">
      <input
        v-if="type !== 'select'"
        :id="name"
        :value="modelValue"
        :type="type"
        :name="name"
        :autocomplete="autocomplete"
        :class="['form-control', { 'is-invalid': hasError }]"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="showHint = true"
      />
      
      <select
        v-else
        :id="name"
        :value="modelValue"
        :name="name"
        :autocomplete="autocomplete"
        :class="['form-control', { 'is-invalid': hasError }]"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.value)"
        @focus="showHint = true"
      >
        <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value || option.code"
          :value="option.value || option.name"
        >
          {{ option.text || option.name }}
        </option>
      </select>

      <!-- Validation Hint -->
      <div v-if="showHint && (!modelValue || modelValue.trim() === '') && requirements.length > 0" class="validation-hint">
        <strong>Requirements:</strong>
        <ul>
          <li v-for="req in requirements" :key="req">{{ req }}</li>
        </ul>
      </div>
    </div>

    <!-- Error Messages -->
    <div v-if="hasError && errors.length > 0" class="invalid-feedback">
      <div v-for="error in errors" :key="error">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'FormField',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) => ['text', 'password', 'email', 'select'].includes(value)
    },
    autocomplete: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    hasError: {
      type: Boolean,
      default: false
    },
    errors: {
      type: Array,
      default: () => []
    },
    requirements: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  setup() {
    const showHint = ref(false);

    return {
      showHint
    };
  }
};
</script>

<style scoped>
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
</style>