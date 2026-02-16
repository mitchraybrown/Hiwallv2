// Vercel Serverless Function — /api/hubspot
// Receives enquiry data from the frontend and syncs to HubSpot CRM
// Creates: Contact, Company (if provided), Deal (linked to both)

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.HUBSPOT_TOKEN
  if (!token) {
    console.error('HUBSPOT_TOKEN not set')
    return res.status(500).json({ error: 'HubSpot not configured' })
  }

  const { contact_name, contact_email, contact_phone, company_name, campaign_goal, budget, timeline, message, wall_title, wall_location, enquiry_type } = req.body

  if (!contact_email) {
    return res.status(400).json({ error: 'Email required' })
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  try {
    // 1. Create or update Contact
    const nameParts = (contact_name || '').trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // Search for existing contact by email
    const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST', headers,
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: contact_email }] }]
      })
    })
    const searchData = await searchRes.json()

    let contactId
    if (searchData.total > 0) {
      // Update existing contact
      contactId = searchData.results[0].id
      await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH', headers,
        body: JSON.stringify({
          properties: {
            firstname: firstName,
            lastname: lastName,
            phone: contact_phone || '',
          }
        })
      })
    } else {
      // Create new contact
      const contactRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST', headers,
        body: JSON.stringify({
          properties: {
            email: contact_email,
            firstname: firstName,
            lastname: lastName,
            phone: contact_phone || '',
          }
        })
      })
      const contactData = await contactRes.json()
      if (contactData.id) {
        contactId = contactData.id
      } else {
        console.error('Failed to create contact:', contactData)
        return res.status(500).json({ error: 'Failed to create contact' })
      }
    }

    // 2. Create or find Company (if company name provided)
    let companyId = null
    if (company_name) {
      const compSearchRes = await fetch('https://api.hubapi.com/crm/v3/objects/companies/search', {
        method: 'POST', headers,
        body: JSON.stringify({
          filterGroups: [{ filters: [{ propertyName: 'name', operator: 'EQ', value: company_name }] }]
        })
      })
      const compSearchData = await compSearchRes.json()

      if (compSearchData.total > 0) {
        companyId = compSearchData.results[0].id
      } else {
        const compRes = await fetch('https://api.hubapi.com/crm/v3/objects/companies', {
          method: 'POST', headers,
          body: JSON.stringify({
            properties: { name: company_name }
          })
        })
        const compData = await compRes.json()
        if (compData.id) companyId = compData.id
      }

      // Associate contact with company
      if (contactId && companyId) {
        await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}/associations/companies/${companyId}/contact_to_company`, {
          method: 'PUT', headers
        })
      }
    }

    // 3. Create Deal
    const dealType = enquiry_type === 'council' ? 'Council Enquiry' : 'Wall Enquiry'
    const dealName = wall_title
      ? `${dealType} — ${wall_title}`
      : `${dealType} — ${company_name || contact_name}`

    // Map budget string to an amount for the deal
    const budgetMap = { 'Under $5k': 2500, '$5k-$10k': 7500, '$10k-$25k': 17500, '$25k-$50k': 37500, '$50k+': 75000 }
    const dealAmount = budgetMap[budget] || null

    const dealProperties = {
      dealname: dealName,
      dealstage: 'appointmentscheduled', // First stage in default pipeline
      pipeline: 'default',
      description: [
        campaign_goal ? `Campaign Goal: ${campaign_goal}` : '',
        budget ? `Budget: ${budget}` : '',
        timeline ? `Timeline: ${timeline}` : '',
        wall_title ? `Wall: ${wall_title}` : '',
        wall_location ? `Location: ${wall_location}` : '',
        message ? `Notes: ${message}` : '',
      ].filter(Boolean).join('\n'),
    }
    if (dealAmount) dealProperties.amount = String(dealAmount)

    const dealRes = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
      method: 'POST', headers,
      body: JSON.stringify({ properties: dealProperties })
    })
    const dealData = await dealRes.json()

    if (!dealData.id) {
      console.error('Failed to create deal:', dealData)
      return res.status(500).json({ error: 'Failed to create deal' })
    }

    // Associate deal with contact
    if (contactId) {
      await fetch(`https://api.hubapi.com/crm/v3/objects/deals/${dealData.id}/associations/contacts/${contactId}/deal_to_contact`, {
        method: 'PUT', headers
      })
    }

    // Associate deal with company
    if (companyId) {
      await fetch(`https://api.hubapi.com/crm/v3/objects/deals/${dealData.id}/associations/companies/${companyId}/deal_to_company`, {
        method: 'PUT', headers
      })
    }

    return res.status(200).json({
      success: true,
      contactId,
      companyId,
      dealId: dealData.id
    })

  } catch (err) {
    console.error('HubSpot error:', err)
    return res.status(500).json({ error: 'HubSpot sync failed' })
  }
}
