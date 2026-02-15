import { useState } from 'react'
import { supabase } from '../supabase'
import { Btn, Inp, Card, Overlay } from './ui'
import { fmt } from '../lib/pricing'

export default function EnquiryForm({ wall, onClose, toast }) {
  const [f, sF] = useState({ contact_name:'', contact_email:'', contact_phone:'', company_name:'', campaign_goal:'', budget_range:'', timeline:'', message:'' })
  const [sending, setSending] = useState(false)
  const booked = wall.availability_status === 'booked'

  const submit = async () => {
    if (!f.contact_name || !f.contact_email || !f.campaign_goal || !f.budget_range) return
    setSending(true)
    try {
      const { error } = await supabase.from('enquiries').insert({
        wall_id: wall.id,
        contact_name: f.contact_name,
        contact_email: f.contact_email,
        contact_phone: f.contact_phone,
        company_name: f.company_name,
        campaign_goal: f.campaign_goal,
        budget_range: f.budget_range,
        timeline: f.timeline,
        message: f.message,
      })
      if (error) throw error
      toast(booked ? 'Interest registered!' : 'Enquiry submitted!')
      onClose()
    } catch (err) {
      console.error(err)
      toast('Error submitting — please try again')
    } finally {
      setSending(false)
    }
  }

  return <Overlay onClose={onClose}>
    <Card style={{maxWidth:520,width:'95vw'}}>
      <div style={{padding:22}}>
        <h2 style={{fontFamily:'var(--fd)',fontSize:19,fontWeight:700,marginBottom:4}}>{booked ? 'Express Interest' : 'Enquire About This Wall'}</h2>
        <p style={{color:'var(--mu)',fontSize:13,marginBottom:2}}>for <strong>{wall.title}</strong> — {fmt(wall.price_total)}/{wall.duration_months}mo</p>
        {booked && <p style={{fontSize:12,color:'var(--bl)',marginBottom:10}}>This wall is booked until {wall.booked_until}. Submit interest for when available.</p>}
        <div style={{marginTop:12}}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <Inp label="Your Name" required value={f.contact_name} onChange={e => sF({...f, contact_name: e.target.value})} placeholder="Full name"/>
          <Inp label="Email" required type="email" value={f.contact_email} onChange={e => sF({...f, contact_email: e.target.value})} placeholder="you@company.com"/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <Inp label="Phone" value={f.contact_phone} onChange={e => sF({...f, contact_phone: e.target.value})} placeholder="04xx xxx xxx"/>
          <Inp label="Company" value={f.company_name} onChange={e => sF({...f, company_name: e.target.value})} placeholder="Brand / Agency"/>
        </div>
        <Inp label="Campaign Goal" required type="textarea" value={f.campaign_goal} onChange={e => sF({...f, campaign_goal: e.target.value})} placeholder="What do you want to achieve?"/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <Inp label="Budget" required type="select" value={f.budget_range} onChange={e => sF({...f, budget_range: e.target.value})}>
            <option value="">Select</option><option>Under $5k</option><option>$5k-$10k</option><option>$10k-$25k</option><option>$25k-$50k</option><option>$50k+</option>
          </Inp>
          <Inp label="Timeline" value={f.timeline} onChange={e => sF({...f, timeline: e.target.value})} placeholder="e.g. Mar 2026"/>
        </div>
        <Inp label="Additional Notes" type="textarea" value={f.message} onChange={e => sF({...f, message: e.target.value})} placeholder="Any specific requirements..."/>
        <div style={{display:'flex',gap:8}}>
          <Btn variant="secondary" onClick={onClose} style={{flex:1,justifyContent:'center'}}>Cancel</Btn>
          <Btn onClick={submit} disabled={sending} style={{flex:1,justifyContent:'center',opacity:sending?.6:1}}>{sending ? 'Submitting...' : (booked ? 'Submit Interest' : 'Submit Enquiry')} →</Btn>
        </div>
      </div>
    </Card>
  </Overlay>
}
