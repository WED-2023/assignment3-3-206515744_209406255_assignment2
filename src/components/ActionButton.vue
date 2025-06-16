<template>
  <div class="action-button-container">
    <button 
      class="action-button"
      :class="{ 
        'active': isActive, 
        'processing': isProcessing,
        [`color-${color}`]: color,
        [`size-${size}`]: size
      }"
      @click="handleClick"
      :title="isActive ? activeTooltip : inactiveTooltip"
      :disabled="isProcessing"
    >
      {{ isActive ? activeEmoji : inactiveEmoji }}
    </button>
  </div>
</template>

<script>
export default {
  name: "ActionButton",
  props: {
    // Required props
    itemId: {
      type: [Number, String],
      required: true
    },
    
    // Action type (like, favorite, bookmark, etc.)
    actionType: {
      type: String,
      required: true,
      validator: (value) => ['like', 'favorite', 'bookmark', 'watch'].includes(value)
    },
    
    // Customizable emojis
    activeEmoji: {
      type: String,
      required: true
    },
    inactiveEmoji: {
      type: String,
      required: true
    },
    
    // Color theme
    color: {
      type: String,
      default: 'red',
      validator: (value) => ['red', 'blue', 'green', 'purple', 'orange', 'yellow'].includes(value)
    },
    
    // Initial active state
    initialActiveState: {
      type: Boolean,
      default: false
    },
    
    // Tooltips
    activeTooltip: {
      type: String,
      required: true
    },
    inactiveTooltip: {
      type: String,
      required: true
    },
    
    // API endpoints
    addEndpoint: {
      type: String,
      required: true
    },
    removeEndpoint: {
      type: String,
      default: null // If null, will use same endpoint with DELETE
    },
    
    // Request data key
    requestDataKey: {
      type: String,
      default: 'recipe_id'
    },
    
    // Size
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    }
  },
  
  data() {
    return {
      isActive: false,
      isProcessing: false
    };
  },
  
  mounted() {
    this.isActive = this.initialActiveState;
  },
  
  watch: {
    initialActiveState(newValue) {
      this.isActive = newValue;
    }
  },
  
  methods: {
    async handleClick() {
      if (this.isProcessing) return;
      
      // Check if user is logged in
      if (!window.store.username) {
        alert(`Please log in to ${this.actionType} items`);
        this.$router.push('/login');
        return;
      }
      
      this.isProcessing = true;
      const wasActive = this.isActive;
      
      try {
        if (wasActive) {
          await this.removeAction();
        } else {
          await this.addAction();
        }
        
        // Toggle the UI state only if request was successful
        this.isActive = !wasActive;
        
        // Emit events for parent components
        this.$emit('action-changed', {
          itemId: this.itemId,
          actionType: this.actionType,
          isActive: this.isActive,
          wasActive: wasActive
        });
        
        if (this.isActive) {
          this.$emit('action-added', { itemId: this.itemId, actionType: this.actionType });
        } else {
          this.$emit('action-removed', { itemId: this.itemId, actionType: this.actionType });
        }
        
      } catch (error) {
        console.error(`Failed to toggle ${this.actionType} status:`, error);
        
        if (error.response?.status === 401) {
          alert(`Please log in to ${this.actionType} items`);
          this.$router.push('/login');
        } else {
          alert(`Failed to update ${this.actionType} status. Please try again.`);
        }
        
        // Emit error event
        this.$emit('action-error', {
          itemId: this.itemId,
          actionType: this.actionType,
          error: error
        });
      } finally {
        this.isProcessing = false;
      }
    },
    
    async addAction() {
      console.log(`Adding ${this.actionType} for item:`, this.itemId);
      
      const requestData = {};
      requestData[this.requestDataKey] = parseInt(this.itemId);
      
      console.log(`${this.actionType} request data:`, requestData);
      
      try {
        const response = await window.axios.post(this.addEndpoint, requestData);
        console.log(`${this.actionType} response:`, response.data);
        return response.data;
      } catch (error) {
        // Handle "already exists" errors gracefully
        if (error.response?.status === 409 || 
            error.response?.data?.message?.includes('already') ||
            error.response?.data?.message?.includes('exists')) {
          console.log(`Item already ${this.actionType}d, treating as success`);
          return { success: true, message: `Already ${this.actionType}d` };
        }
        throw error;
      }
    },
    
    async removeAction() {
      console.log(`Removing ${this.actionType} for item:`, this.itemId);
      
      const requestData = {};
      requestData[this.requestDataKey] = parseInt(this.itemId);
      
      console.log(`Remove ${this.actionType} request data:`, requestData);
      
      const endpoint = this.removeEndpoint || this.addEndpoint;
      
      try {
        const response = await window.axios.delete(endpoint, {
          data: requestData
        });
        console.log(`Remove ${this.actionType} response:`, response.data);
        return response.data;
      } catch (error) {
        // Handle "not found" errors gracefully
        if (error.response?.status === 404 || 
            error.response?.data?.message?.includes('not found') ||
            error.response?.data?.message?.includes('not ' + this.actionType)) {
          console.log(`Item not ${this.actionType}d, treating as success`);
          return { success: true, message: `Already not ${this.actionType}d` };
        }
        throw error;
      }
    }
  }
};
</script>

<style scoped>
.action-button-container {
  display: flex;
  justify-content: center;
}

.action-button {
  background: none;
  border: 2px solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

/* Size variations */
.action-button.size-small {
  width: 35px;
  height: 35px;
  font-size: 1rem;
}

.action-button.size-medium {
  width: 45px;
  height: 45px;
  font-size: 1.2rem;
}

.action-button.size-large {
  width: 55px;
  height: 55px;
  font-size: 1.4rem;
}

/* Color themes */
.action-button.color-red:hover {
  border-color: #ff6b7a;
  background-color: #fff5f5;
}

.action-button.color-red.active {
  border-color: #ff4757;
  background-color: #fff0f0;
}

.action-button.color-blue:hover {
  border-color: #4dabf7;
  background-color: #f0f8ff;
}

.action-button.color-blue.active {
  border-color: #339af0;
  background-color: #e7f5ff;
}

.action-button.color-green:hover {
  border-color: #51cf66;
  background-color: #f3fff3;
}

.action-button.color-green.active {
  border-color: #37b24d;
  background-color: #ebfbee;
}

.action-button.color-purple:hover {
  border-color: #9775fa;
  background-color: #f8f0ff;
}

.action-button.color-purple.active {
  border-color: #7950f2;
  background-color: #f3f0ff;
}

.action-button.color-orange:hover {
  border-color: #ff922b;
  background-color: #fff4e6;
}

.action-button.color-orange.active {
  border-color: #fd7e14;
  background-color: #fff0e6;
}

.action-button.color-yellow:hover {
  border-color: #ffd43b;
  background-color: #fffbf0;
}

.action-button.color-yellow.active {
  border-color: #fab005;
  background-color: #fff8e1;
}

/* Common hover and interaction states */
.action-button:hover {
  transform: scale(1.1);
}

.action-button.active {
  animation: buttonPulse 0.4s ease;
}

.action-button.processing {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Button pulse animation */
@keyframes buttonPulse {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.15);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>