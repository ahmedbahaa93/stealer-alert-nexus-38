/**
 * Location-Aware Pricing Test Script
 * Run this in the browser console to test location functionality
 */

// Test 1: Check current location state
console.log('=== LOCATION STATE TEST ===');
const locationStore = JSON.parse(
  localStorage.getItem('location-store') || '{}'
);
console.log('Current location store:', locationStore.state?.location);

// Test 2: Check if location headers are being sent
console.log('\n=== API HEADERS TEST ===');
// Intercept fetch requests to check headers
const originalFetch = window.fetch;
window.fetch = function (...args) {
  const [url, options] = args;
  if (options && options.headers) {
    console.log('API Request Headers:', options.headers);
  }
  return originalFetch.apply(this, args);
};

// Test 3: Force location change to Egypt
function testEgyptLocation() {
  console.log('\n=== TESTING EGYPT LOCATION ===');
  const egyptLocation = {
    country: 'Egypt',
    countryCode: 'EG',
    city: 'Cairo',
    latitude: 30.0444,
    longitude: 31.2357,
    timezone: 'Africa/Cairo',
    currency: 'EGP',
    paymentMethod: 'paymob',
    lastUpdated: Date.now()
  };

  localStorage.setItem(
    'location-store',
    JSON.stringify({
      state: { location: egyptLocation },
      version: 2
    })
  );

  console.log('Set location to Egypt. Refresh page to see EGP prices.');
  return egyptLocation;
}

// Test 4: Force location change to USA
function testUSALocation() {
  console.log('\n=== TESTING USA LOCATION ===');
  const usaLocation = {
    country: 'United States',
    countryCode: 'US',
    city: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
    currency: 'USD',
    paymentMethod: 'checkout',
    lastUpdated: Date.now()
  };

  localStorage.setItem(
    'location-store',
    JSON.stringify({
      state: { location: usaLocation },
      version: 2
    })
  );

  console.log('Set location to USA. Refresh page to see USD prices.');
  return usaLocation;
}

// Test 5: Clear location (should trigger detection)
function clearLocation() {
  console.log('\n=== CLEARING LOCATION ===');
  localStorage.removeItem('location-store');
  console.log('Location cleared. Refresh page to trigger detection.');
}

// Test 6: Check price elements on page
function checkPriceElements() {
  console.log('\n=== PRICE ELEMENTS CHECK ===');
  const priceElements = document.querySelectorAll(
    '[class*="price"], [class*="cost"], [class*="currency"]'
  );
  priceElements.forEach((el, index) => {
    console.log(`Price element ${index + 1}:`, el.textContent, el.className);
  });
}

// Export functions to global scope
window.locationTest = {
  testEgyptLocation,
  testUSALocation,
  clearLocation,
  checkPriceElements,
  getCurrentLocation: () => locationStore.state?.location
};

console.log('\n=== TEST FUNCTIONS AVAILABLE ===');
console.log('window.locationTest.testEgyptLocation() - Set location to Egypt');
console.log('window.locationTest.testUSALocation() - Set location to USA');
console.log('window.locationTest.clearLocation() - Clear location');
console.log('window.locationTest.checkPriceElements() - Check price elements');
console.log('window.locationTest.getCurrentLocation() - Get current location');
