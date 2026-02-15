import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { Card, Btn, Inp, Toggle } from '../components/ui'
import {
  calcPrice, fmt, campPrice,
  NEIGHBORHOODS, TRAFFIC_LEVELS, CONDITIONS, ORIENTATIONS, DURATIONS,
  BUILDING_TYPES, ACCESS_OPTS, HERITAGE_QS, COUNCILS, SUBURB_COUNCIL
} from '../lib/pricing'

export default function ListWallPage({ session, toast }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [contractText, setContractText] = useState('')
  const [f, setF] = useState({
    title: '', address: '', neighborhood: 'Surry Hills', buildingType: 'Commercial',
    width: '', height: '', trafficLevel: 'Medium', condition: 'Good',
    orientation: 'North', duration: '6', price: '',
    description: '', highlights: '', imageUrl: '',
    accessLevel: 'Ground level (no equipment)', accessNotes: '',
    heritage: { heritageListed: false, councilRestrictions: false, strataApproval: false, colorRestrictions: false, details: '' },
    council: 'City of Sydney',
    termsExpanded: false, termsAccepted: false, signature: '',
    regName: '', regEmail: '', regPassword: ''
  })

  const u = (k, v) => setF(p => ({ ...p, [k]: v }))
  const uh = (k, v) => setF(p => ({ ...p, heritage: { ...p.heritage, [k]: v } }))

  const sqm = f.width && f.height ? Math.round(parseFloat(f.width) * parseFloat(f.height) * 10) / 10 : 0
  const sug = f.width && f.height ? calcPrice({ ...f, width: f.width, height: f.height }) : null
  const needsAccount = !session

  const [isMob, setMob] = useState(typeof window !== 'undefined' && window.innerWidth < 769)
  useEffect(() => { const h = () => setMob(window.innerWidth < 769); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h) }, [])

  // Load contract terms from Supabase
  useEffect(() => {
    supabase.from('contract_terms').select('content').eq('active', true).limit(1).single()
      .then(({ data }) => { if (data?.content) setContractText(data.content) })
  }, [])

  const val = step === 0 ? f.title && f.address && f.width && f.height
    : step === 1 ? true
    : step === 2 ? true
    : step === 3 ? (session || (f.regName && f.regEmail && f.regPassword))
    : step === 4 ? f.termsAccepted && f.signature
    : true

  const STEPS = ['Wall Details', 'Access & Restrictions', 'Review & Pricing', 'Create Account', 'Terms & Sign']
  const totalSteps = needsAccount ? 5 : 4
  const stepLabel = STEPS[needsAccount ? step : step < 3 ? step : step + 1]
  const lastStep = needsAccount ? 4 : 3

  const submit = async () => {
    if (!f.termsAccepted || !f.signature) return
    setSubmitting(true)
    try {
      let userId = session?.user?.id
      // Create account if needed
      if (needsAccount) {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: f.regEmail, password: f.regPassword,
          options: { data: { name: f.regName, role: 'owner' } }
        })
        if (authErr) { toast?.('Account creation failed: ' + authErr.message); setSubmitting(false); return }
        userId = authData.user?.id
      }
      // Insert wall
      const { error } = await supabase.from('walls').insert({
        title: f.title, description: f.description, address: f.address,
        neighborhood: f.neighborhood, council: f.council || SUBURB_COUNCIL[f.neighborhood] || '',
        building_type: f.buildingType, width_m: parseFloat(f.width), height_m: parseFloat(f.height),
        sqm, traffic_level: f.trafficLevel, condition: f.condition,
        orientation: f.orientation, duration_months: parseInt(f.duration),
        access_level: f.accessLevel, access_notes: f.accessNotes,
        heritage_listed: f.heritage.heritageListed, council_restrictions: f.heritage.councilRestrictions,
        strata_approval: f.heritage.strataApproval, color_restrictions: f.heritage.colorRestrictions,
        restriction_details: f.heritage.details,
        price_total: parseInt(f.price) || sug?.ownerTotal || 0,
        price_monthly: sug?.ownerMonthly || 0,
        primary_image_url: f.imageUrl || 'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=800&q=80',
        highlights: f.highlights ? f.highlights.split(',').map(s => s.trim()).filter(Boolean) : [],
        status: 'pending',
        contract_signed: true, contract_signature: f.signature,
        contract_signed_at: new Date().toISOString(),
        owner_id: userId
      })
      if (error) { toast?.('Error: ' + error.message); setSubmitting(false); return }
      // Create owner profile stub
      if (userId) {
        await supabase.from('owner_profiles').upsert({
          user_id: userId,
          name: session?.user?.user_metadata?.name || f.regName,
          email: session?.user?.email || f.regEmail
        }, { onConflict: 'user_id' })
      }
      setDone(true)
      toast?.('Wall submitted for review!')
    } catch (e) { toast?.('Something went wrong'); }
    setSubmitting(false)
  }

  if (done) return <div style={{maxWidth:520,margin:'80px auto',textAlign:'center',padding:36}}>
    <div style={{fontSize:52,marginBottom:16}}>🎉</div>
    <h2 style={{fontFamily:'var(--fd)',fontSize:24,fontWeight:700,marginBottom:8}}>Wall Submitted!</h2>
    <p style={{color:'var(--mu)',fontSize:14,marginBottom:20}}>Your wall is pending review. We'll verify it and update the status.</p>
    <Btn onClick={() => navigate('/')}>Browse Walls →</Btn>
  </div>

  return <div style={{maxWidth:820,margin:'0 auto',padding:'28px 24px 52px'}}>
    <div className="au" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
      <h1 style={{fontFamily:'var(--fd)',fontSize:22,fontWeight:700}}>List Your Wall</h1>
      <Btn variant="ghost" onClick={() => navigate('/')}>← Back</Btn>
    </div>
    <p style={{fontSize:13,color:'var(--mu)',marginBottom:20}}>Step {step + 1} of {totalSteps} — {stepLabel}</p>
    <div style={{display:'flex',gap:4,marginBottom:24}}>
      {(needsAccount ? [0,1,2,3,4] : [0,1,2,4]).map((s, j) => <div key={j} style={{flex:1,height:4,borderRadius:2,background:(needsAccount ? step : step < 3 ? step : step + 1) >= s ? 'var(--co)' : 'var(--ln)',transition:'background .3s'}}/>)}
    </div>

    <div style={{display:'grid',gridTemplateColumns:step === 2 && !isMob ? '1fr 260px' : '1fr',gap:18,alignItems:'start'}}>
      <div>
        {/* Step 0: Wall Details */}
        {step === 0 && <Card style={{padding:22}}>
          <h3 style={{fontSize:16,fontWeight:600,marginBottom:14}}>📍 Wall Details</h3>
          <Inp label="Wall Title" required value={f.title} onChange={e => u('title', e.target.value)} placeholder="e.g. Surry Hills Corner Wall"/>
          <Inp label="Address" required value={f.address} onChange={e => u('address', e.target.value)} placeholder="Street address"/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <Inp label="Neighbourhood" required type="select" value={f.neighborhood} onChange={e => { u('neighborhood', e.target.value); u('council', SUBURB_COUNCIL[e.target.value] || '') }}>
              {Object.keys(NEIGHBORHOODS).map(n => <option key={n}>{n}</option>)}
            </Inp>
            <Inp label="Council" value={f.council} readOnly inputStyle={{background:'var(--bg)'}}/>
          </div>
          <Inp label="Building Type" type="select" value={f.buildingType} onChange={e => u('buildingType', e.target.value)}>
            {BUILDING_TYPES.map(b => <option key={b}>{b}</option>)}
          </Inp>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
            <Inp label="Width (m)" required type="number" value={f.width} onChange={e => u('width', e.target.value)} placeholder="8"/>
            <Inp label="Height (m)" required type="number" value={f.height} onChange={e => u('height', e.target.value)} placeholder="6"/>
            <div style={{marginBottom:15}}><label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:4}}>Area</label><div style={{padding:'10px 13px',background:'var(--bg)',borderRadius:10,fontSize:14,fontWeight:600,border:'1.5px solid var(--ln)'}}>{sqm ? `${sqm} sqm` : '—'}</div></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <Inp label="Traffic Level" type="select" value={f.trafficLevel} onChange={e => u('trafficLevel', e.target.value)}>{TRAFFIC_LEVELS.map(t => <option key={t}>{t}</option>)}</Inp>
            <Inp label="Condition" type="select" value={f.condition} onChange={e => u('condition', e.target.value)}>{CONDITIONS.map(c => <option key={c}>{c}</option>)}</Inp>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <Inp label="Orientation" type="select" value={f.orientation} onChange={e => u('orientation', e.target.value)}>{ORIENTATIONS.map(o => <option key={o}>{o}</option>)}</Inp>
            <Inp label="Duration" type="select" value={f.duration} onChange={e => u('duration', e.target.value)}>{DURATIONS.map(d => <option key={d} value={d}>{d} months</option>)}</Inp>
          </div>
          <Inp label="Description" type="textarea" rows={3} value={f.description} onChange={e => u('description', e.target.value)} placeholder="What makes this wall great? Describe the location, visibility, and any special features."/>
          <Inp label="Highlights (comma-separated)" value={f.highlights} onChange={e => u('highlights', e.target.value)} placeholder="e.g. Corner position, Café strip, High foot traffic"/>
          <div style={{marginBottom:15}}>
            <label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:4}}>Wall Photos</label>
            <div style={{border:'1.5px dashed var(--ln)',borderRadius:12,padding:'20px 16px',textAlign:'center',background:'var(--bg)'}}>
              <Inp label="" value={f.imageUrl} onChange={e => u('imageUrl', e.target.value)} placeholder="Paste an image URL (e.g. https://...)" style={{marginBottom:8}}/>
              {f.imageUrl && <div style={{marginTop:8}}><img src={f.imageUrl} alt="Preview" style={{maxWidth:'100%',maxHeight:160,borderRadius:10,objectFit:'cover'}} onError={e => { e.target.style.display = 'none' }}/></div>}
              <p style={{fontSize:11,color:'var(--mu)',marginTop:6}}>Tip: Right-click any image on the web and copy its URL, or use a service like Imgur to upload.</p>
            </div>
          </div>
        </Card>}

        {/* Step 1: Access & Restrictions */}
        {step === 1 && <Card style={{padding:22}}>
          <h3 style={{fontSize:16,fontWeight:600,marginBottom:14}}>🔐 Access & Heritage</h3>
          <Inp label="Access Level" type="select" value={f.accessLevel} onChange={e => u('accessLevel', e.target.value)}>{ACCESS_OPTS.map(a => <option key={a}>{a}</option>)}</Inp>
          <Inp label="Access Notes" type="textarea" rows={2} value={f.accessNotes} onChange={e => u('accessNotes', e.target.value)} placeholder="Specific access instructions..."/>
          <h4 style={{fontSize:14,fontWeight:600,marginTop:10,marginBottom:10}}>Heritage & Restrictions</h4>
          {HERITAGE_QS.map(q => <div key={q.key} style={{marginBottom:10}}><Toggle checked={f.heritage[q.key]} onChange={v => uh(q.key, v)} label={q.label}/></div>)}
          <Inp label="Restriction Details" type="textarea" rows={2} value={f.heritage.details} onChange={e => uh('details', e.target.value)} placeholder="Describe any restrictions..."/>
        </Card>}

        {/* Step 2: Review & Pricing */}
        {step === 2 && <>
          <h3 style={{fontSize:16,fontWeight:600,marginBottom:14}}>💰 Pricing Breakdown</h3>
          <Card style={{padding:20,marginBottom:14}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
              <div style={{padding:'14px 16px',background:'var(--gb)',borderRadius:12,border:'1px solid var(--gn)'}}><div style={{fontSize:11,color:'var(--gt)',fontWeight:600,marginBottom:2}}>Your Earnings</div><div style={{fontFamily:'var(--fd)',fontSize:24,fontWeight:700,color:'var(--gt)'}}>{sug ? fmt(sug.ownerTotal) : '—'}</div><div style={{fontSize:12,color:'var(--gt)'}}>({sug ? fmt(sug.ownerMonthly) : '—'}/mo for {f.duration}mo)</div></div>
              <div style={{padding:'14px 16px',background:'var(--col)',borderRadius:12,border:'1px solid var(--co)'}}><div style={{fontSize:11,color:'var(--co)',fontWeight:600,marginBottom:2}}>Campaign Price (to brand)</div><div style={{fontFamily:'var(--fd)',fontSize:24,fontWeight:700,color:'var(--co)'}}>{sug ? fmt(sug.campaignTotal) : '—'}</div><div style={{fontSize:12,color:'var(--co)'}}>({sug ? fmt(sug.campaignMonthly) : '—'}/mo for {f.duration}mo)</div></div>
            </div>
            <div style={{padding:'10px 14px',background:'var(--bg)',borderRadius:10,display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:13}}><span style={{color:'var(--sl)'}}>Hi Wall Fee ({sug ? sug.hwFeePercent : 25}%)</span><strong>{sug ? fmt(sug.hwFeeTotal) : '—'}</strong></div>
          </Card>
          <Card style={{padding:18,marginBottom:14}}>
            <h4 style={{fontSize:13,fontWeight:600,marginBottom:10}}>Price Factors</h4>
            {sug && <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,fontSize:12}}>{Object.entries(sug.breakdown).filter(([k]) => k !== 'hwFee').map(([k, v]) => <div key={k} style={{padding:'5px 9px',background:'var(--bg)',borderRadius:7}}><span style={{color:'var(--mu)',textTransform:'capitalize'}}>{k}: </span><strong>{v}</strong></div>)}</div>}
          </Card>
          <Card style={{padding:18}}>
            <Inp label="Override Your Price (optional — or accept suggested)" type="number" value={f.price} onChange={e => u('price', e.target.value)} placeholder={sug ? String(sug.ownerTotal) : ''}/>
            <p style={{fontSize:11,color:'var(--mu)'}}>This sets your owner earnings. The Hi Wall fee will be added on top.</p>
          </Card>
          <div style={{marginTop:16,padding:'14px 18px',background:'var(--gb)',borderRadius:12,border:'1px solid var(--gn)'}}>
            <div style={{fontSize:13,fontWeight:600,color:'var(--gt)',marginBottom:4}}>✓ Looking good!</div>
            <p style={{fontSize:12,color:'var(--gt)'}}>{needsAccount ? 'Next, create your owner account to continue.' : 'Next, review and sign the terms to submit.'}</p>
          </div>
        </>}

        {/* Step 3: Create Account (only if not logged in) */}
        {step === 3 && needsAccount && <Card style={{padding:22}}>
          <h3 style={{fontSize:16,fontWeight:600,marginBottom:4}}>👤 Create Your Owner Account</h3>
          <p style={{fontSize:13,color:'var(--mu)',marginBottom:14}}>To manage your wall and receive payments, we need a few details.</p>
          <Inp label="Full Name" required value={f.regName} onChange={e => u('regName', e.target.value)} placeholder="Your full name"/>
          <Inp label="Email" required type="email" value={f.regEmail} onChange={e => u('regEmail', e.target.value)} placeholder="you@example.com"/>
          <Inp label="Password" required type="password" value={f.regPassword} onChange={e => u('regPassword', e.target.value)} placeholder="6+ characters"/>
        </Card>}

        {/* Terms & Sign (step 4 if public, step 3 if logged in) */}
        {step === lastStep && <>
          <h3 style={{fontSize:16,fontWeight:600,marginBottom:14}}>📜 Terms & Agreement</h3>
          <p style={{fontSize:13,color:'var(--mu)',marginBottom:14}}>Please review and accept the Hi Wall Owner Agreement.</p>
          <div style={{border:'1.5px solid var(--ln)',borderRadius:12,overflow:'hidden',marginBottom:16}}>
            <button onClick={() => u('termsExpanded', !f.termsExpanded)} style={{width:'100%',padding:'12px 16px',background:'var(--bg)',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:14,fontWeight:600}}>
              <span>Hi Wall — Wall Owner Agreement</span><span style={{fontSize:12,color:'var(--mu)'}}>{f.termsExpanded ? '▲ Collapse' : '▼ Expand to Read'}</span>
            </button>
            {f.termsExpanded && <div style={{padding:'16px 18px',maxHeight:300,overflowY:'auto',fontSize:12,color:'var(--sl)',lineHeight:1.8,whiteSpace:'pre-wrap',background:'var(--wh)'}}>{contractText || 'Loading contract terms...'}</div>}
          </div>
          <div style={{background:f.signature ? 'var(--gb)' : 'var(--bg)',border:`1.5px solid ${f.signature ? 'var(--gn)' : 'var(--ln)'}`,borderRadius:12,padding:'16px 18px',marginBottom:14}}>
            <label style={{display:'flex',alignItems:'center',gap:10,marginBottom:f.termsAccepted ? 10 : 0,cursor:'pointer'}}>
              <input type="checkbox" checked={f.termsAccepted} onChange={e => u('termsAccepted', e.target.checked)} style={{width:18,height:18,accentColor:'var(--co)'}}/>
              <span style={{fontSize:14,fontWeight:600}}>I have read and agree to the Hi Wall Owner Agreement</span>
            </label>
            {f.termsAccepted && <div style={{marginTop:8}}>
              <Inp label="Type your full name to sign" required value={f.signature} onChange={e => u('signature', e.target.value)} placeholder="e.g. James Chen" inputStyle={{fontFamily:'var(--fd)',fontSize:16,fontStyle:'italic'}}/>
              {f.signature && <div style={{fontSize:12,color:'var(--gn)',display:'flex',alignItems:'center',gap:6}}>✓ Digitally signed by <strong>{f.signature}</strong> on {new Date().toLocaleDateString('en-AU')}</div>}
            </div>}
          </div>
        </>}
      </div>

      {/* Pricing sidebar on review step */}
      {step === 2 && <div className="au d3" style={{position:'sticky',top:74}}>
        <Card style={{padding:18}}>
          <h4 style={{fontFamily:'var(--fd)',fontSize:16,fontWeight:700,marginBottom:10}}>Wall Summary</h4>
          <div style={{fontSize:13,marginBottom:6}}><strong>{f.title || 'Untitled'}</strong></div>
          <div style={{fontSize:12,color:'var(--mu)',marginBottom:10}}>{f.neighborhood} • {sqm}sqm • {f.duration}mo</div>
          {sug && <>
            <div style={{padding:'10px 0',borderTop:'1px solid var(--ln)',marginBottom:6}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}><span>Owner Earnings</span><strong style={{color:'var(--gn)'}}>{fmt(parseInt(f.price) || sug.ownerTotal)}</strong></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}><span>Hi Wall Fee ({sug.hwFeePercent}%)</span><strong>{fmt(Math.round((parseInt(f.price) || sug.ownerTotal) * sug.hwFeePercent / 100 / 10) * 10)}</strong></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}><span>Duration</span><strong>{f.duration} months</strong></div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:14,fontWeight:700,paddingTop:8,borderTop:'1px solid var(--ln)'}}><span>Campaign Total</span><span style={{color:'var(--co)'}}>{fmt((parseInt(f.price) || sug.ownerTotal) + Math.round((parseInt(f.price) || sug.ownerTotal) * sug.hwFeePercent / 100 / 10) * 10)}</span></div>
          </>}
        </Card>
      </div>}
    </div>

    {/* Navigation */}
    <div style={{display:'flex',gap:10,marginTop:22}}>
      {step > 0 && <Btn variant="secondary" onClick={() => setStep(step - 1)} style={{flex:1,justifyContent:'center'}}>← Back</Btn>}
      {step < lastStep
        ? <Btn onClick={() => { if (val) setStep(step + 1) }} style={{flex:1,justifyContent:'center',opacity:val ? 1 : .5}}>Next →</Btn>
        : <Btn onClick={submit} disabled={submitting} style={{flex:1,justifyContent:'center',opacity:val ? 1 : .5}}>{submitting ? 'Submitting...' : 'Submit for Verification →'}</Btn>}
    </div>
  </div>
}
