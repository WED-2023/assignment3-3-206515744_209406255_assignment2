<template>
  <div class="like-button-container">
    <button 
      class="like-button"
      :class="{ 
        'liked': isLiked, 
        'processing': isProcessing,
        [`color-${color}`]: color 
      }"
      @click="handleClick"
      :title="isLiked ? unlikeTooltip : likeTooltip"
      :disabled="isProcessing"
    >
      {{ isLiked ? likedEmoji : notLikedEmoji }}
    </button>
  </div>
</template>

<script>
export default {
  name: "LikeButton",
  props: {
    // Required props
    itemId: {
      type: [Number, String],
      required: true
    },
    
    // Customizable emojis
    likedEmoji: {
      type: String,
      default: '❤️'
    },
    notLikedEmoji: {
      type: String,
      default: '🤍'
    },
    
    // Color theme
    color: {
      type: String,
      default: 'red', // red, blue, green, purple, orange
      validator: (value) => ['red', 'blue', 'green', 'purple', 'orange'].includes(value)
    },
    
    // Initial liked state
    initialLikedState: {
      type: Boolean,
      default: false
    },
    
    // Tooltips
    likeTooltip: {
      type: String,
      default: 'Add to liked'
    },
    unlikeTooltip: {
      type: String,
      default: 'Remove from liked'
    },
    
    // Custom API endpoints (optional)
    likeEndpoint: {
      type: String,
      default: '/users/liked'
    },
    
    // Custom request data key (optional)
    requestDataKey: {
      type: String,
      default: 'recipe_id'
    },
    
    // Size
    size: {
      type: String,
      default: 'medium', // small, medium, large
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    }
  },
  
  data() {
    return {
      isLiked: false,
      isProcessing: false
    };
  },
  
  mounted() {
    this.isLiked = this.initialLikedState;
  },
  
  watch: {
    initialLikedState(newValue) {
      this.isLiked = newValue;
    }
  },
  
  methods: {
    async handleClick() {
      if (this.isProcessing) return;
      
      // Check if user is logged in
      if (!window.store.username) {
        alert('Please log in to like items');
        this.$router.push('/login');
        return;
      }
      
      this.isProcessing = true;
      const wasLiked = this.isLiked;
      
      try {
        if (wasLiked) {
          await this.unlikeItem();
        } else {
          await this.likeItem();
        }
        
        // Toggle the UI state only if request was successful
        this.isLiked = !wasLiked;
        
        // Emit events for parent components
        this.$emit('like-changed', {
          itemId: this.itemId,
          isLiked: this.isLiked,
          wasLiked: wasLiked
        });
        
        if (this.isLiked) {
          this.$emit('liked', this.itemId);
        } else {
          this.$emit('unliked', this.itemId);
        }
        
      } catch (error) {
        console.error('Failed to toggle like status:', error);
        
        if (error.response?.status === 401) {
          alert('Please log in to like items');
          this.$router.push('/login');
        } else {
          alert('Failed to update like status. Please try again.');
        }
        
        // Emit error event
        this.$emit('like-error', {
          itemId: this.itemId,
          error: error
        });
      } finally {
        this.isProcessing = false;
      }
    },
    
    async likeItem() {
      console.log('Liking item:', this.itemId, typeof this.itemId);
      
      const requestData = {};
      requestData[this.requestDataKey] = parseInt(this.itemId);
      
      console.log('Request data being sent:', requestData);
      
      try {
        const response = await window.axios.post(this.likeEndpoint, requestData);
        console.log('Like response:', response.data);
        return response.data;
      } catch (error) {
        // Check if it's already liked (409 conflict or specific error message)
        if (error.response?.status === 409 || 
            error.response?.data?.message?.includes('already liked') ||
            error.response?.data?.message?.includes('already exists')) {
          console.log('Recipe already liked, treating as success');
          return { success: true, message: 'Already liked' };
        }
        throw error; // Re-throw other errors
      }
    },
    
    async unlikeItem() {
      console.log('Unliking item:', this.itemId, typeof this.itemId);
      
      const requestData = {};
      requestData[this.requestDataKey] = parseInt(this.itemId);
      
      console.log('Delete request data being sent:', requestData);
      
      try {
        const response = await window.axios.delete(this.likeEndpoint, {
          data: requestData
        });
        console.log('Unlike response:', response.data);
        return response.data;
      } catch (error) {
        // Check if it's already not liked (404 or specific error message)
        if (error.response?.status === 404 || 
            error.response?.data?.message?.includes('not found') ||
            error.response?.data?.message?.includes('not liked')) {
          console.log('Recipe not in liked list, treating as success');
          return { success: true, message: 'Already not liked' };
        }
        throw error; // Re-throw other errors
      }
    }
  }
};
</script>

<style scoped>
.like-button-container {
  display: flex;
  justify-content: center;
}

.like-button {
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
.like-button {
  width: 45px;
  height: 45px;
  font-size: 1.2rem;
}

.like-button.size-small {
  width: 35px;
  height: 35px;
  font-size: 1rem;
}

.like-button.size-large {
  width: 55px;
  height: 55px;
  font-size: 1.4rem;
}

/* Color themes */
.like-button.color-red:hover {
  border-color: #ff6b7a;
  background-color: #fff5f5;
}

.like-button.color-red.liked {
  border-color: #ff4757;
  background-color: #fff0f0;
}

.like-button.color-blue:hover {
  border-color: #4dabf7;
  background-color: #f0f8ff;
}

.like-button.color-blue.liked {
  border-color: #339af0;
  background-color: #e7f5ff;
}

.like-button.color-green:hover {
  border-color: #51cf66;
  background-color: #f3fff3;
}

.like-button.color-green.liked {
  border-color: #37b24d;
  background-color: #ebfbee;
}

.like-button.color-purple:hover {
  border-color: #9775fa;
  background-color: #f8f0ff;
}

.like-button.color-purple.liked {
  border-color: #7950f2;
  background-color: #f3f0ff;
}

.like-button.color-orange:hover {
  border-color: #ff922b;
  background-color: #fff4e6;
}

.like-button.color-orange.liked {
  border-color: #fd7e14;
  background-color: #fff0e6;
}

/* Common hover and interaction states */
.like-button:hover {
  transform: scale(1.1);
}

.like-button.liked {
  animation: heartBeat 0.4s ease;
}

.like-button.processing {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Heart beat animation */
@keyframes heartBeat {
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