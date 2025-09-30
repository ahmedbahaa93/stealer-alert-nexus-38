/**
 * Payment Response Handler
 * This script should be included in the payment success/failure pages
 * from Paymob or Strapi to redirect to the payment result page with the response data.
 */

(function () {
  'use strict';

  // Main function to handle payment response
  function handlePaymentResponse(responseData) {
    // Validate response data
    if (!responseData || typeof responseData !== 'object') {
      console.error('Invalid payment response data');
      redirectToHome();
      return;
    }

    // Store the payment response in sessionStorage
    try {
      sessionStorage.setItem('paymentResponse', JSON.stringify(responseData));
    } catch (error) {
      console.error('Error storing payment response:', error);
    }

    // Extract the base URL (considering different environments)
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const baseUrl = `${urlParts[0]}//${urlParts[2]}`;

    // Detect language from current URL or default to 'en'
    const pathParts = window.location.pathname.split('/');
    const locale =
      pathParts[1] && ['en', 'ar'].includes(pathParts[1]) ? pathParts[1] : 'en';

    // Construct the payment result URL
    const paymentResultUrl = `${baseUrl}/${locale}/payment-result`;

    // Add query parameters as backup
    const params = new URLSearchParams();
    params.set('status', responseData.status || 'unknown');
    params.set('code', responseData.code?.toString() || '0');
    params.set('message', responseData.message || 'Payment processed');

    if (responseData.data) {
      if (responseData.data.transactionId) {
        params.set('transactionId', responseData.data.transactionId.toString());
      }
      if (responseData.data.bookingStatus) {
        params.set('bookingStatus', responseData.data.bookingStatus);
      }
      if (responseData.data.paymentStatus) {
        params.set('paymentStatus', responseData.data.paymentStatus);
      }
      if (responseData.data.redirectUrl) {
        params.set('redirectUrl', responseData.data.redirectUrl);
      }
    }

    const finalUrl = `${paymentResultUrl}?${params.toString()}`;

    // Log for debugging
    console.log('Redirecting to payment result page:', finalUrl);

    // Redirect to the payment result page
    window.location.href = finalUrl;
  }

  // Function to redirect to home page if something goes wrong
  function redirectToHome() {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const baseUrl = `${urlParts[0]}//${urlParts[2]}`;
    const pathParts = window.location.pathname.split('/');
    const locale =
      pathParts[1] && ['en', 'ar'].includes(pathParts[1]) ? pathParts[1] : 'en';

    console.log('Redirecting to home page due to error');
    window.location.href = `${baseUrl}/${locale}`;
  }

  // Function to extract response data from current page
  function extractResponseFromPage() {
    // Try to get response from URL parameters first
    const urlParams = new URLSearchParams(window.location.search);

    let responseData = null;

    // Check if we have the exact response structure you mentioned
    if (
      urlParams.has('status') ||
      urlParams.has('code') ||
      urlParams.has('transactionId')
    ) {
      const statusCode = parseInt(urlParams.get('code') || '0');
      const status = urlParams.get('status');

      // Handle status codes according to backend specification
      // 303 = success, 307 = failure
      const isSuccess = statusCode === 303 || status === 'success';
      const isFailure =
        statusCode === 307 || status === 'failed' || status === 'error';

      responseData = {
        status: isSuccess
          ? 'success'
          : isFailure
            ? 'failed'
            : status || 'unknown',
        code: statusCode,
        message:
          urlParams.get('message') ||
          (isSuccess
            ? 'Payment completed successfully'
            : isFailure
              ? 'Payment failed'
              : 'Payment processed'),
        data: {
          transactionId: parseInt(urlParams.get('transactionId') || '0'),
          bookingStatus: isSuccess
            ? 'Confirmed'
            : isFailure
              ? 'Failed'
              : urlParams.get('bookingStatus') || 'Unknown',
          paymentStatus: isSuccess
            ? 'Completed'
            : isFailure
              ? 'Failed'
              : urlParams.get('paymentStatus') || 'Unknown',
          redirectUrl: urlParams.get('redirectUrl') || ''
        }
      };
    }

    // Try to find response data in page content (for embedded JSON)
    if (!responseData) {
      try {
        // Look for JSON in script tags
        const scripts = document.querySelectorAll(
          'script[type="application/json"]'
        );
        for (let script of scripts) {
          try {
            const data = JSON.parse(script.textContent || '');
            if (data.status || data.code || data.transactionId) {
              responseData = data;
              break;
            }
          } catch (e) {
            // Continue to next script
          }
        }
      } catch (error) {
        console.error('Error extracting response from page:', error);
      }
    }

    return responseData;
  }

  // Auto-initialization function
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Check if we're on a payment result page (avoid infinite loops)
    if (window.location.pathname.includes('/payment-result')) {
      return;
    }

    // Try to extract response data from the current page
    const responseData = extractResponseFromPage();

    if (responseData) {
      // Add a small delay to ensure page is fully loaded
      setTimeout(() => {
        handlePaymentResponse(responseData);
      }, 1000);
    } else {
      console.warn('No payment response data found on page');
    }
  }

  // Expose functions to global scope for manual usage
  window.handlePaymentResponse = handlePaymentResponse;
  window.extractResponseFromPage = extractResponseFromPage;

  // Auto-initialize when script loads
  init();

  // Also provide a way to manually trigger with the exact response you mentioned
  window.handleExactPaymentResponse = function () {
    const exampleResponse = {
      status: 'success',
      code: 200,
      message:
        'Payment confirmed! Your booking has been successfully completed.',
      data: {
        transactionId: 332385463,
        bookingStatus: 'Confirmed',
        paymentStatus: 'Partial',
        redirectUrl: 'https://raiseup-front.vercel.app/en/payments'
      }
    };
    handlePaymentResponse(exampleResponse);
  };
})();
