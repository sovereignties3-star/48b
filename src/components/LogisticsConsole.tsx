import React, { useState, useCallback, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { apiFetch } from '../utils/apiClient';

const MAP_ID = 'DEMO_MAP_ID';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Kroger Cart API simulation
const addToCart = async (upc: string, quantity: number, modality: 'PICKUP' | 'DELIVERY' = 'PICKUP') => {
  try {
    const res = await apiFetch<any>('/api/kroger/cart/add', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ upc, quantity, modality }]
      })
    });
    return res;
  } catch (err) {
    console.error('Kroger Cart Add Error:', err);
    throw err;
  }
};

export const LogisticsConsole: React.FC = () => {
  const [position] = useState({ lat: 37.7749, lng: -122.4194 }); // San Francisco
  const [cartStatus, setCartStatus] = useState<string | null>(null);

  const handleAddToCart = async () => {
    setCartStatus('Adding item...');
    try {
      // Simulation of Kroger API call
      await addToCart('0001200016268', 1);
      setCartStatus('Item added to Kroger cart successfully!');
    } catch (err) {
      setCartStatus('Failed to add item to cart.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-white">
      <div className="p-4 border-b border-[#30363d] flex justify-between items-center">
        <h2 className="text-lg font-bold">Logistics & Procurement Dashboard</h2>
        <button 
          onClick={handleAddToCart}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold"
        >
          Add Item to Kroger Cart
        </button>
      </div>
      {cartStatus && <div className="p-2 text-center text-xs text-blue-400">{cartStatus}</div>}
      
      <div className="flex-1 w-full h-[500px]">
        <APIProvider apiKey={API_KEY} internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}>
          <Map
            mapId={MAP_ID}
            defaultCenter={position}
            defaultZoom={13}
            style={{ width: '100%', height: '100%' }}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            <AdvancedMarker position={position}>
              <Pin background={'#fbbc04'} glyphColor={'#000'} />
            </AdvancedMarker>
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};
