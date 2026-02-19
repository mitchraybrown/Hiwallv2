import { useEffect, useRef, useState } from 'react'
import { fmt, campPrice, COORDS } from '../lib/pricing'

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const STYLE = 'mapbox://styles/mapbox/light-v11'
const SYDNEY = { lng: 151.21, lat: -33.87, zoom: 12.5 }

// Load Mapbox GL JS from CDN
let mapboxPromise = null
function loadMapbox() {
  if (mapboxPromise) return mapboxPromise
  mapboxPromise = new Promise((resolve, reject) => {
    if (window.mapboxgl) { resolve(window.mapboxgl); return }
    // CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css'
    document.head.appendChild(link)
    // JS
    const script = document.createElement('script')
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js'
    script.onload = () => resolve(window.mapboxgl)
    script.onerror = () => reject(new Error('Failed to load Mapbox'))
    document.head.appendChild(script)
  })
  return mapboxPromise
}

export default function MapboxMap({ walls, onSelect, hoveredId, onHover }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const [ready, setReady] = useState(false)

  // Init map
  useEffect(() => {
    let cancelled = false
    loadMapbox().then(mapboxgl => {
      if (cancelled || !containerRef.current) return
      mapboxgl.accessToken = TOKEN

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: STYLE,
        center: [SYDNEY.lng, SYDNEY.lat],
        zoom: SYDNEY.zoom,
        attributionControl: false
      })

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
      map.on('load', () => { if (!cancelled) setReady(true) })
      mapRef.current = map
    })

    return () => {
      cancelled = true
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [])

  // Update markers when walls or hoveredId changes
  useEffect(() => {
    if (!mapRef.current || !ready) return

    // Clear old markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    walls.forEach(w => {
      // Use wall lat/lng if available, otherwise fall back to suburb coords
      const lat = w.latitude || COORDS[w.neighborhood]?.lat || SYDNEY.lat
      const lng = w.longitude || COORDS[w.neighborhood]?.lng || SYDNEY.lng

      // Offset walls in the same suburb so they don't stack
      const sameSuburb = walls.filter(x => x.neighborhood === w.neighborhood)
      const idx = sameSuburb.indexOf(w)
      const offsetLat = lat + (idx % 3 - 1) * 0.0008
      const offsetLng = lng + Math.floor(idx / 3) * 0.0008

      const booked = w.availability_status === 'booked'
      const isHovered = hoveredId === w.id
      const price = fmt(campPrice(w)).replace('A', '')

      // Create marker element
      const el = document.createElement('div')
      el.style.cssText = `cursor:pointer;display:flex;flex-direction:column;align-items:center;transform:${isHovered ? 'scale(1.15)' : 'scale(1)'};transition:transform .15s;z-index:${isHovered ? 10 : 1};position:relative;`

      // Price pill
      const pill = document.createElement('div')
      pill.style.cssText = `background:${isHovered ? '#1a1a1a' : booked ? '#2563EB' : '#FF385C'};color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.2);border:2px solid #fff;font-family:var(--f);letter-spacing:-0.02em;`
      pill.textContent = price
      el.appendChild(pill)

      // Pin dot
      const dot = document.createElement('div')
      dot.style.cssText = `width:8px;height:8px;border-radius:50%;background:${booked ? '#2563EB' : '#FF385C'};border:2px solid #fff;margin-top:-2px;box-shadow:0 1px 3px rgba(0,0,0,.2);`
      el.appendChild(dot)

      el.addEventListener('mouseenter', () => onHover?.(w.id))
      el.addEventListener('mouseleave', () => onHover?.(null))
      el.addEventListener('click', (e) => { e.stopPropagation(); onSelect?.(w) })

      const marker = new window.mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([offsetLng, offsetLat])
        .addTo(mapRef.current)

      markersRef.current.push(marker)
    })
  }, [walls, hoveredId, ready, onSelect, onHover])

  return <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    {!ready && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4F8', fontSize: 13, color: '#8E99A8' }}>Loading map...</div>}
    <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 10, background: 'rgba(255,255,255,.92)', borderRadius: 8, padding: '8px 12px', fontSize: 11, display: 'flex', gap: 12 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF385C' }} />Available</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563EB' }} />Booked</span>
    </div>
  </div>
}
