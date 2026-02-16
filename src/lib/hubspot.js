// Sends enquiry data to our serverless API which syncs to HubSpot
// Fails silently — HubSpot sync is a nice-to-have, not a blocker
export async function syncToHubSpot(data) {
  try {
    const res = await fetch('/api/hubspot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      console.warn('HubSpot sync failed:', await res.text())
    }
  } catch (err) {
    console.warn('HubSpot sync error:', err)
  }
}
