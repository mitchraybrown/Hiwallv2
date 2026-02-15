import { useState } from 'react'
import { supabase } from '../supabase'
import { Card, Btn, Inp, Overlay } from '../components/ui'

export default function AboutPage({ toast }) {
  const [show, setShow] = useState(false)
  const [f, setF] = useState({name:'',org:'',email:'',phone:'',message:''})
  const u = (k,v) => setF(p => ({...p,[k]:v}))

  const submit = async () => {
    if (!f.name || !f.org || !f.email) return
    const { error } = await supabase.from('enquiries').insert({
      contact_name: f.name,
      contact_email: f.email,
      contact_phone: f.phone,
      company_name: f.org,
      message: `[COUNCIL ENQUIRY] ${f.message}`,
      status: 'new'
    })
    if (error) { toast?.('Error submitting'); return }
    toast?.("Enquiry submitted — we'll be in touch!")
    setShow(false)
    setF({name:'',org:'',email:'',phone:'',message:''})
  }

  return <div style={{maxWidth:900,margin:'0 auto',padding:'32px 24px 52px'}}>
    <div className="au" style={{marginBottom:28}}>
      <h1 style={{fontFamily:'var(--fd)',fontSize:28,fontWeight:700,marginBottom:6}}>About Hi Wall</h1>
      <p style={{color:'var(--sl)',fontSize:15,lineHeight:1.7,maxWidth:600}}>We believe outdoor advertising should enhance neighbourhoods, not just occupy them.</p>
    </div>
    <Card className="au d1" style={{padding:'28px 32px',marginBottom:20,background:'linear-gradient(135deg,#1A1A2E,#2D2B55)',border:'none'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}><span style={{fontSize:22}}>🎨</span><h2 style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:700,color:'#fff'}}>Art, Not Just Ads</h2></div>
      <p style={{fontSize:14,color:'rgba(255,255,255,.6)',lineHeight:1.8,marginBottom:16}}>Every Hi Wall campaign balances brand impact with neighbourhood authenticity. We call it the Creative Fit Standard — three checks that ensure every wall enhances its surroundings.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:14}}>
        {[{t:'Street Fit',d:'Would locals accept this as enhancing the streetscape?',icon:'🏘️'},{t:'Brand Fit',d:'Is the brand presence clear enough to justify spend?',icon:'📊'},{t:'Artist Fit',d:'Does the execution allow genuine craft and pride?',icon:'🖌️'}].map((c,i) =>
          <div key={i} style={{background:'rgba(255,255,255,.06)',borderRadius:12,padding:'18px 16px',border:'1px solid rgba(255,255,255,.08)'}}>
            <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:8}}><span style={{fontSize:15}}>{c.icon}</span><span style={{fontFamily:'var(--fd)',fontSize:15,fontWeight:700,color:'var(--co)'}}>{c.t}</span></div>
            <p style={{fontSize:13,color:'rgba(255,255,255,.55)',lineHeight:1.6}}>{c.d}</p>
          </div>)}
      </div>
    </Card>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:16,marginBottom:20}}>
      <Card className="au d2" style={{padding:'24px 22px'}}><div style={{fontSize:28,marginBottom:10}}>🎭</div><h3 style={{fontFamily:'var(--fd)',fontSize:17,fontWeight:700,marginBottom:6}}>Supporting Local Creatives</h3><p style={{fontSize:13,color:'var(--sl)',lineHeight:1.7}}>In an era of AI-generated content, Hi Wall champions real human artistry. Our campaigns provide meaningful paid work for muralists, illustrators, and street artists — keeping craft alive in communities that value it.</p></Card>
      <Card className="au d3" style={{padding:'24px 22px'}}><div style={{fontSize:28,marginBottom:10}}>🏙️</div><h3 style={{fontFamily:'var(--fd)',fontSize:17,fontWeight:700,marginBottom:6}}>Beautifying Neighbourhoods</h3><p style={{fontSize:13,color:'var(--sl)',lineHeight:1.7}}>Blank walls become landmarks. Faded facades become conversation pieces. We work with councils and property owners to transform unused wall space into curated public art — making every street a little more worth walking down.</p></Card>
      <Card className="au d4" style={{padding:'24px 22px'}}><div style={{fontSize:28,marginBottom:10}}>📍</div><h3 style={{fontFamily:'var(--fd)',fontSize:17,fontWeight:700,marginBottom:6}}>Hyper-Localised Campaigns</h3><p style={{fontSize:13,color:'var(--sl)',lineHeight:1.7}}>Forget generic billboards. Hi Wall campaigns are designed for their specific neighbourhood, audience, and streetscape. The result? Outdoor media that performs just as well digitally (through content capture) as it presents physically on the wall.</p></Card>
    </div>
    <Card className="au d5" style={{padding:'24px 28px',textAlign:'center'}}>
      <h3 style={{fontFamily:'var(--fd)',fontSize:18,fontWeight:700,marginBottom:6}}>Councils, we want to work with you.</h3>
      <p style={{fontSize:13,color:'var(--sl)',lineHeight:1.7,maxWidth:500,margin:'0 auto 14px'}}>Hi Wall helps councils support local creatives, beautify streetscapes, and generate community value from underutilised wall space — all through a governed, quality-controlled marketplace.</p>
      <Btn onClick={() => setShow(true)}>Get in Touch →</Btn>
    </Card>
    {show && <Overlay onClose={() => setShow(false)}><Card style={{maxWidth:480,width:'95vw',padding:22}}>
      <h3 style={{fontFamily:'var(--fd)',fontSize:18,fontWeight:700,marginBottom:4}}>Council Enquiry</h3>
      <p style={{fontSize:12,color:'var(--mu)',marginBottom:14}}>We'd love to discuss how Hi Wall can support your community.</p>
      <Inp label="Your Name" required value={f.name} onChange={e => u('name',e.target.value)} placeholder="Full name"/>
      <Inp label="Council / Organisation" required value={f.org} onChange={e => u('org',e.target.value)} placeholder="e.g. City of Sydney"/>
      <Inp label="Email" required type="email" value={f.email} onChange={e => u('email',e.target.value)} placeholder="you@council.nsw.gov.au"/>
      <Inp label="Phone" value={f.phone} onChange={e => u('phone',e.target.value)} placeholder="02 xxxx xxxx"/>
      <Inp label="Message" type="textarea" rows={3} value={f.message} onChange={e => u('message',e.target.value)} placeholder="How can we help?"/>
      <div style={{display:'flex',gap:8}}>
        <Btn variant="secondary" onClick={() => setShow(false)} style={{flex:1,justifyContent:'center'}}>Cancel</Btn>
        <Btn onClick={submit} style={{flex:1,justifyContent:'center'}}>Send Enquiry</Btn>
      </div>
    </Card></Overlay>}
  </div>
}
