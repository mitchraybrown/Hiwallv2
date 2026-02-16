import { useState, useRef, useEffect } from 'react'

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export default function AddressAutocomplete({ value, onChange }) {
  const [query, setQuery] = useState(value || '')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)
  const wrapRef = useRef(null)

  // Sync external value
  useEffect(() => { setQuery(value || '') }, [value])

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const extractSuburb = (feature) => {
    // Mapbox context contains locality (suburb), place (city), etc.
    const ctx = feature.context || []
    // Try locality first (most specific — this is the suburb)
    const locality = ctx.find(c => c.id?.startsWith('locality'))
    if (locality) return locality.text
    // Try neighborhood
    const neighborhood = ctx.find(c => c.id?.startsWith('neighborhood'))
    if (neighborhood) return neighborhood.text
    // Try place
    const place = ctx.find(c => c.id?.startsWith('place'))
    if (place) return place.text
    // Fallback: try to extract from place_name
    const parts = feature.place_name?.split(',').map(s => s.trim()) || []
    // Usually format: "123 Street, Suburb, State Postcode, Country"
    if (parts.length >= 2) return parts[1]
    return null
  }

  const search = (q) => {
    setQuery(q)
    onChange(q, null, null, null) // update parent text immediately
    clearTimeout(timerRef.current)
    if (q.length < 3) { setResults([]); setOpen(false); return }
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?` +
          `access_token=${TOKEN}&country=au&proximity=151.21,-33.87&types=address,poi&limit=5`
        )
        const data = await res.json()
        if (data.features) {
          setResults(data.features.map(f => ({
            text: f.place_name,
            lat: f.center[1],
            lng: f.center[0],
            suburb: extractSuburb(f)
          })))
          setOpen(true)
        }
      } catch (err) {
        console.warn('Geocoding error:', err)
      }
      setLoading(false)
    }, 300)
  }

  const select = (r) => {
    setQuery(r.text)
    setOpen(false)
    onChange(r.text, r.lat, r.lng, r.suburb)
  }

  return <div ref={wrapRef} style={{ position: 'relative', marginBottom: 15 }}>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
      Address <span style={{ color: 'var(--co)' }}>*</span>
    </label>
    <div style={{ position: 'relative' }}>
      <input
        value={query}
        onChange={e => search(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Start typing an address..."
        style={{
          width: '100%', padding: '10px 13px 10px 32px', border: '1.5px solid var(--ln)',
          borderRadius: 10, fontSize: 14, outline: 'none', background: 'var(--wh)',
          boxSizing: 'border-box'
        }}
      />
      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--mu)' }}>
        {loading ? '⏳' : '📍'}
      </span>
    </div>
    {open && results.length > 0 && <div style={{
      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
      background: 'var(--wh)', border: '1.5px solid var(--ln)', borderRadius: 10,
      marginTop: 4, boxShadow: '0 8px 24px rgba(0,0,0,.1)', overflow: 'hidden'
    }}>
      {results.map((r, i) => <div key={i}
        onClick={() => select(r)}
        style={{
          padding: '10px 14px', fontSize: 13, cursor: 'pointer',
          borderBottom: i < results.length - 1 ? '1px solid var(--ln)' : 'none',
          background: 'var(--wh)', transition: 'background .1s'
        }}
        onMouseEnter={e => e.target.style.background = 'var(--bg)'}
        onMouseLeave={e => e.target.style.background = 'var(--wh)'}
      >
        <span style={{ color: 'var(--mu)', marginRight: 6, fontSize: 12 }}>📍</span>
        {r.text}
      </div>)}
    </div>}
  </div>
}
