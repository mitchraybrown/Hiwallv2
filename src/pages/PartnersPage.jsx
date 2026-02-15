import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { Card, Btn, Inp, Overlay, Spinner } from '../components/ui'

export default function PartnersPage({ toast }) {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [sel, setSel] = useState(null)
  const [f, setF] = useState({ company: '', services: '', portfolio: '', contact: '', description: '', website: '', logo: '' })

  useEffect(() => {
    supabase.from('partners').select('*').eq('status', 'approved').order('company_name')
      .then(({ data }) => { setPartners(data || []); setLoading(false) })
  }, [])

  const submit = async () => {
    if (!f.company || !f.services || !f.contact) { toast?.('Fill required fields'); return }
    const { error } = await supabase.from('partners').insert({
      company_name: f.company, services: f.services, portfolio_url: f.portfolio,
      contact_email: f.contact, description: f.description, website: f.website,
      logo_url: f.logo, status: 'pending'
    })
    if (error) { toast?.('Error submitting'); return }
    setF({ company: '', services: '', portfolio: '', contact: '', description: '', website: '', logo: '' })
    setShow(false)
    toast?.('Application submitted!')
  }

  return <div style={{maxWidth:900,margin:'0 auto',padding:'32px 24px 52px'}}>
    <div className="au" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
      <div>
        <h1 style={{fontFamily:'var(--fd)',fontSize:28,fontWeight:700,marginBottom:4}}>Verified Partners</h1>
        <p style={{color:'var(--mu)',fontSize:14}}>Approved creative, production, and installation partners</p>
      </div>
      <Btn onClick={() => setShow(!show)}>{show ? 'Cancel' : '+ Become a Partner'}</Btn>
    </div>

    {show && <Card className="au" style={{padding:24,marginBottom:24}}>
      <h3 style={{fontFamily:'var(--fd)',fontSize:18,fontWeight:700,marginBottom:4}}>Partner Application</h3>
      <p style={{fontSize:12,color:'var(--mu)',marginBottom:16}}>Tell us about your creative business. We'll review your application.</p>
      <div style={{maxWidth:480}}>
        <Inp label="Company Name" required value={f.company} onChange={e => setF({...f, company: e.target.value})} placeholder="Company"/>
        <Inp label="Services Offered" required value={f.services} onChange={e => setF({...f, services: e.target.value})} placeholder="Creative, Production, Install..."/>
        <Inp label="Brief Description" type="textarea" rows={2} value={f.description} onChange={e => setF({...f, description: e.target.value})} placeholder="What does your company do?"/>
        <Inp label="Portfolio URL" value={f.portfolio} onChange={e => setF({...f, portfolio: e.target.value})} placeholder="https://..."/>
        <Inp label="Website" value={f.website} onChange={e => setF({...f, website: e.target.value})} placeholder="https://..."/>
        <Inp label="Logo URL (or emoji)" value={f.logo} onChange={e => setF({...f, logo: e.target.value})} placeholder="🎨 or https://..."/>
        <Inp label="Contact Email" required type="email" value={f.contact} onChange={e => setF({...f, contact: e.target.value})} placeholder="hello@company.com"/>
        <div style={{display:'flex',gap:8}}>
          <Btn variant="secondary" onClick={() => setShow(false)} style={{flex:1,justifyContent:'center'}}>Cancel</Btn>
          <Btn onClick={submit} style={{flex:1,justifyContent:'center'}}>Submit Application</Btn>
        </div>
      </div>
    </Card>}

    {loading ? <Spinner /> : partners.length === 0
      ? <Card style={{padding:36,textAlign:'center'}}><p style={{color:'var(--mu)'}}>No partners yet — be the first to apply!</p></Card>
      : <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:16}}>
        {partners.map(p => <Card key={p.id} className="ch" onClick={() => setSel(p)} style={{padding:'20px 18px',cursor:'pointer'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            <div style={{width:40,height:40,borderRadius:10,background:'var(--col)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>
              {p.logo_url?.startsWith('http') ? <img src={p.logo_url} alt="" style={{width:40,height:40,borderRadius:10,objectFit:'cover'}}/> : (p.logo_url || '🎨')}
            </div>
            <div>
              <div style={{fontSize:15,fontWeight:600}}>{p.company_name}</div>
              <div style={{fontSize:12,color:'var(--co)'}}>Verified Partner</div>
            </div>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:8}}>
            {(p.services || '').split(',').map((s, i) => <span key={i} style={{fontSize:10,padding:'2px 7px',borderRadius:5,background:'var(--bg)',color:'var(--sl)',border:'1px solid var(--ln)'}}>{s.trim()}</span>)}
          </div>
          {p.description && <p style={{fontSize:12,color:'var(--mu)',lineHeight:1.6}}>{p.description.slice(0, 100)}{p.description.length > 100 ? '...' : ''}</p>}
        </Card>)}
      </div>}

    {/* Profile overlay */}
    {sel && <Overlay onClose={() => setSel(null)}>
      <Card style={{maxWidth:480,width:'95vw',padding:24}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
          <div style={{width:52,height:52,borderRadius:12,background:'var(--col)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,flexShrink:0}}>
            {sel.logo_url?.startsWith('http') ? <img src={sel.logo_url} alt="" style={{width:52,height:52,borderRadius:12,objectFit:'cover'}}/> : (sel.logo_url || '🎨')}
          </div>
          <div>
            <h3 style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:700}}>{sel.company_name}</h3>
            <div style={{fontSize:13,color:'var(--co)',fontWeight:600}}>Verified Partner</div>
          </div>
        </div>
        {sel.description && <p style={{fontSize:14,color:'var(--sl)',lineHeight:1.7,marginBottom:14}}>{sel.description}</p>}
        <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:14}}>
          {(sel.services || '').split(',').map((s, i) => <span key={i} style={{padding:'4px 10px',borderRadius:7,background:'var(--bg)',fontSize:12,fontWeight:500,border:'1px solid var(--ln)'}}>{s.trim()}</span>)}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:16}}>
          {sel.contact_email && <div style={{fontSize:13}}><strong>Contact:</strong> <a href={`mailto:${sel.contact_email}`} style={{color:'var(--co)'}}>{sel.contact_email}</a></div>}
          {sel.portfolio_url && <div style={{fontSize:13}}><strong>Portfolio:</strong> <a href={sel.portfolio_url} target="_blank" rel="noopener" style={{color:'var(--co)'}}>{sel.portfolio_url}</a></div>}
          {sel.website && <div style={{fontSize:13}}><strong>Website:</strong> <a href={sel.website} target="_blank" rel="noopener" style={{color:'var(--co)'}}>{sel.website}</a></div>}
        </div>
        <Btn variant="secondary" onClick={() => setSel(null)} style={{width:'100%',justifyContent:'center'}}>Close</Btn>
      </Card>
    </Overlay>}
  </div>
}
