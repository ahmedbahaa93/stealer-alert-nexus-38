/**
 * Toast Disabler Script
 * Completely prevents any toast messages from appearing on payment pages
 */

(function () {
  'use strict';

  // Override all possible toast methods globally
  const disableToasts = () => {
    // Override any global toast functions
    if (window.toast) {
      window.toast = {
        success: () => console.log('Toast disabled'),
        error: () => console.log('Toast disabled'),
        warning: () => console.log('Toast disabled'),
        loading: () => console.log('Toast disabled'),
        show: () => console.log('Toast disabled')
      };
    }

    // Override customToast if it exists
    if (window.customToast) {
      window.customToast = {
        success: () => console.log('CustomToast disabled'),
        error: () => console.log('CustomToast disabled'),
        warning: () => console.log('CustomToast disabled'),
        loading: () => console.log('CustomToast disabled'),
        show: () => console.log('CustomToast disabled')
      };
    }

    // Override React Toast if present
    if (window.ReactToastify) {
      window.ReactToastify.toast = () => console.log('ReactToastify disabled');
    }

    // Hide any existing toast containers
    const toastContainers = document.querySelectorAll(
      '.custom-toast-container, .toast-container, .Toastify__toast-container, [class*="toast"]'
    );
    toastContainers.forEach((container) => {
      if (container && container.style) {
        container.style.display = 'none';
        container.style.visibility = 'hidden';
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';
      }
    });

    // Remove any toast elements
    const toastElements = document.querySelectorAll(
      '.toast, .custom-toast, .Toastify__toast, [class*="toast-item"], [role="alert"]'
    );
    toastElements.forEach((element) => {
      if (element && element.remove) {
        element.remove();
      }
    });
  };

  // Run immediately
  disableToasts();

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', disableToasts);
  }

  // Run periodically to catch any dynamic toasts
  setInterval(disableToasts, 500);

  // Override console.error to catch and suppress "Invalid payment confirmation" errors
  const originalConsoleError = console.error;
  console.error = function (...args) {
    const message = args.join(' ').toLowerCase();
    if (
      message.includes('invalid payment confirmation') ||
      message.includes('invalid access') ||
      message.includes('payment confirmation')
    ) {
      console.log('Suppressed error:', ...args);
      return;
    }
    originalConsoleError.apply(console, args);
  };

  console.log('Toast disabler script loaded and active');
})();
