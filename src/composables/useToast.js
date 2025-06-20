// composables/useToast.js
import { getCurrentInstance } from "vue";

/**
 * Toast composable for consistent toast usage across the application
 * @returns {Object} Toast utilities
 */
export function useToast() {
  const instance = getCurrentInstance();

  /**
   * Show a toast notification
   * @param {string} title - The toast title
   * @param {string} content - The toast content/message
   * @param {string} variant - The toast variant (success, error, warning, info)
   * @param {boolean} append - Whether to append to existing toasts or replace them
   */
  const showToast = (title, content = "", variant = "info", append = false) => {
    // Normalize variant names for consistency
    const normalizedVariant = normalizeVariant(variant);

    if (instance && instance.appContext.config.globalProperties.toast) {
      // Use Vue instance toast if available
      instance.appContext.config.globalProperties.toast(
        title,
        content,
        normalizedVariant,
        append
      );
    } else if (window.toast) {
      // Fall back to window.toast
      window.toast(title, content, normalizedVariant, append);
    } else {
      // Final fallback to alert (in case toast isn't loaded)
      const message = content ? `${title}: ${content}` : title;
      alert(message);
      console.warn("Toast function not available, falling back to alert");
    }
  };

  /**
   * Normalize variant names for consistency
   * @param {string} variant - Original variant name
   * @returns {string} Normalized variant name
   */
  const normalizeVariant = (variant) => {
    const variantMap = {
      danger: "error",
      warning: "warning",
      success: "success",
      error: "error",
      info: "info",
      primary: "info",
      secondary: "info",
    };

    return variantMap[variant] || "info";
  };

  /**
   * Show success toast
   * @param {string} title - Toast title
   * @param {string} content - Toast content
   * @param {boolean} append - Whether to append to existing toasts
   */
  const showSuccess = (title, content = "", append = false) => {
    showToast(title, content, "success", append);
  };

  /**
   * Show error toast
   * @param {string} title - Toast title
   * @param {string} content - Toast content
   * @param {boolean} append - Whether to append to existing toasts
   */
  const showError = (title, content = "", append = false) => {
    showToast(title, content, "error", append);
  };

  /**
   * Show warning toast
   * @param {string} title - Toast title
   * @param {string} content - Toast content
   * @param {boolean} append - Whether to append to existing toasts
   */
  const showWarning = (title, content = "", append = false) => {
    showToast(title, content, "warning", append);
  };

  /**
   * Show info toast
   * @param {string} title - Toast title
   * @param {string} content - Toast content
   * @param {boolean} append - Whether to append to existing toasts
   */
  const showInfo = (title, content = "", append = false) => {
    showToast(title, content, "info", append);
  };

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
