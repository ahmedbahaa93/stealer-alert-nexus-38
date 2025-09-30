'use client';

import { useState } from 'react';

function Map() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // RaiseUp location coordinates (example: Cairo, Egypt - you can update this to your actual location)
  const location = {
    lat: 30.0444,
    lng: 31.2357,
    name: "RaiseUp Training Center",
    address: "Cairo, Egypt"
  };

  const googleMapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.1!2d${location.lng}!3d${location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent(location.name)}!5e0!3m2!1sen!2seg!4v1640000000000!5m2!1sen!2seg`;

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  const handleMapError = () => {
    setMapError(true);
  };

  return (
    <div className="w-full space-y-2">
      <div className="w-full h-[200px] bg-gray-100 rounded-lg overflow-hidden border-2 border-[#1f43ad]/20 relative">
        {!mapError ? (
          <>
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f43ad] mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Loading map...</p>
                </div>
              </div>
            )}
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={handleMapLoad}
              onError={handleMapError}
              className="w-full h-full border-0"
              title="RaiseUp Training Center Location"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1f43ad]/10 to-[#0e43b4]/10">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-[#1f43ad] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#1f43ad] mb-1">{location.name}</h3>
              <p className="text-gray-600 text-sm">{location.address}</p>
              <button
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`, '_blank')}
                className="mt-2 px-4 py-2 bg-[#1f43ad] text-white rounded-lg text-sm hover:bg-[#0e43b4] transition-colors duration-200"
              >
                View in Maps
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Map;
