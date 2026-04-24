'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { FALLBACK_COORDS, DEFAULT_CENTER, filterPinsWithCoords, resolveCoords, type RestaurantPinData } from '@/libs/mapUtils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export type RestaurantPin = RestaurantPinData

const restaurantIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

export default function RestaurantMap() {
  const [restaurants, setRestaurants] = useState<RestaurantPin[]>([])
  const [userPos, setUserPos] = useState<[number, number] | null>(null)
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [geoError, setGeoError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/v1/restaurants`)
      .then((r) => r.json())
      .then((j) => {
        const data: RestaurantPin[] = (j.data ?? []).map((r: any) => {
          const coords = resolveCoords(r.name, r.lat, r.lng)
          return {
            _id: r._id,
            name: r.name,
            address: r.address,
            tel: r.tel,
            lat: coords?.[0],
            lng: coords?.[1],
          }
        })
        setRestaurants(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setUserPos(coords)
        setCenter(coords)
      },
      () => setGeoError('Location access denied. Showing Bangkok by default.')
    )
  }, [])

  const pins = filterPinsWithCoords(restaurants)

  return (
    <div className="relative">
      {geoError && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-black/80 border border-yellow-600/30 text-yellow-400 text-xs px-4 py-2 rounded shadow">
          {geoError}
        </div>
      )}
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '500px', width: '100%', background: '#0a0a0a' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={center} />

        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>
              <div style={{ fontFamily: 'sans-serif', fontSize: '12px' }}>
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {pins.map((r) => (
          <Marker
            key={r._id}
            position={[r.lat!, r.lng!]}
            icon={restaurantIcon}
          >
            <Popup>
              <div style={{ fontFamily: 'sans-serif', minWidth: '160px' }}>
                <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px', color: '#111' }}>
                  {r.name}
                </p>
                {r.address && (
                  <p style={{ fontSize: '11px', color: '#555', marginBottom: '4px' }}>
                    📍 {r.address}
                  </p>
                )}
                {r.tel && (
                  <p style={{ fontSize: '11px', color: '#555', marginBottom: '6px' }}>
                    📞 {r.tel}
                  </p>
                )}
                <a
                  href={`/venue/${r._id}`}
                  style={{ fontSize: '11px', color: '#b45309', textDecoration: 'underline' }}
                >
                  View Details →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
