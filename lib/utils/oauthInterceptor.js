/**
 * Google OAuth Response Interceptor
 * This script will be injected to detect and handle JSON responses
 * in the OAuth popup/iframe when backend returns JSON directly
 */

// Immediately check if the current page contains JSON response
(function () {
  'use strict';

  console.log('🔍 OAuth Response Interceptor loaded');

  const checkForJSONResponse = () => {
    try {
      const bodyText =
        document.body.textContent || document.body.innerText || '';
      console.log('📄 Page content preview:', bodyText.substring(0, 200));

      // Check if this page contains a JSON response
      if (
        bodyText.includes('{"status":"success"') &&
        bodyText.includes('access_token')
      ) {
        console.log('✅ JSON authentication response detected!');

        // Extract and parse the JSON
        const match = bodyText.match(/\{"status"[^}]+(?:\}[^}]*)*\}/);
        if (match) {
          try {
            const authData = JSON.parse(match[0]);
            console.log('🎉 Successfully parsed auth data:', authData);

            // Send success message to parent window
            if (window.opener) {
              console.log('📤 Sending success message to window.opener');
              window.opener.postMessage(
                {
                  type: 'GOOGLE_AUTH_SUCCESS',
                  payload: authData
                },
                window.location.origin
              );

              // Close popup after sending message
              setTimeout(() => {
                console.log('🚪 Closing popup window');
                window.close();
              }, 500);
            } else if (window.parent && window.parent !== window) {
              console.log('📤 Sending success message to parent window');
              window.parent.postMessage(
                {
                  type: 'GOOGLE_AUTH_SUCCESS',
                  payload: authData
                },
                window.location.origin
              );

              // Signal parent to close iframe
              setTimeout(() => {
                console.log('📤 Signaling parent to close iframe');
                window.parent.postMessage(
                  {
                    type: 'GOOGLE_AUTH_CLOSE'
                  },
                  window.location.origin
                );
              }, 500);
            } else {
              console.log('⚠️ No parent window found - redirecting directly');
              // Fallback: redirect to home page
              window.location.href = '/';
            }

            return true;
          } catch (parseError) {
            console.error('❌ Failed to parse JSON:', parseError);
          }
        }
      }

      // Check for error responses
      if (
        bodyText.includes('{"status":"error"') ||
        bodyText.includes('{"error"')
      ) {
        console.log('❌ Error response detected');
        const match = bodyText.match(/\{"(?:status|error)"[^}]+(?:\}[^}]*)*\}/);
        if (match) {
          try {
            const errorData = JSON.parse(match[0]);
            console.log('❌ Parsed error data:', errorData);

            const errorMessage =
              errorData.message || errorData.error || 'Authentication failed';

            // Send error message to parent window
            if (window.opener) {
              window.opener.postMessage(
                {
                  type: 'GOOGLE_AUTH_ERROR',
                  error: errorMessage
                },
                window.location.origin
              );
              window.close();
            } else if (window.parent && window.parent !== window) {
              window.parent.postMessage(
                {
                  type: 'GOOGLE_AUTH_ERROR',
                  error: errorMessage
                },
                window.location.origin
              );
            }

            return true;
          } catch (parseError) {
            console.error('❌ Failed to parse error JSON:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error in checkForJSONResponse:', error);
    }

    return false;
  };

  // Check immediately when script loads
  if (checkForJSONResponse()) {
    console.log('✅ JSON response processed immediately');
    return;
  }

  // If not found immediately, wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('📄 DOM loaded, checking for JSON response...');
      if (checkForJSONResponse()) {
        console.log('✅ JSON response processed after DOM load');
        return;
      }
    });
  }

  // Also check periodically for dynamically loaded content
  let attempts = 0;
  const maxAttempts = 30; // 30 attempts * 200ms = 6 seconds

  const intervalCheck = setInterval(() => {
    attempts++;
    console.log(`🔄 Interval check #${attempts}`);

    if (checkForJSONResponse()) {
      console.log('✅ JSON response processed via interval check');
      clearInterval(intervalCheck);
      return;
    }

    if (attempts >= maxAttempts) {
      console.log('⏰ Max attempts reached, stopping interval checks');
      clearInterval(intervalCheck);
    }
  }, 200);

  // Fallback: check for changes in page content
  if (window.MutationObserver) {
    const observer = new MutationObserver(() => {
      if (checkForJSONResponse()) {
        console.log('✅ JSON response processed via mutation observer');
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Disconnect observer after 10 seconds
    setTimeout(() => {
      observer.disconnect();
      console.log('🔌 Mutation observer disconnected');
    }, 10000);
  }
})();
