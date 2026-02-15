import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase, uploadWallImage } from '../../supabase'
import { Card, Btn, Inp, Badge, Spinner, Overlay } from '../../components/ui'
import { calcPrice, NEIGHBORHOODS, TRAFFIC_LEVELS, CONDITIONS, ORIENTATIONS, DURATIONS, ACCESS_OPTS, BUILDING_TYPES, fmt } from '../../lib/pricing'

// ── Admin Nav ────────────────────────────────────────────────────────────
function AdminNav({ logout }) {
  const loc = useLocation()
  const tabs = [{to:'/admin',l:'Overview',exact:true},{to:'/admin/walls',l:'Walls'},{to:'/admin/enquiries',l:'Enquiries'},{to:'/admin/partners',l:'Partners'}]
  return <nav style={{background:'var(--ink)',padding:'0 24px',position:'sticky',top:0,zIndex:100}}>
    <div style={{maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:56}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:20}}>👋</span><span style={{fontFamily:'var(--fd)',fontWeight:700,fontSize:17,color:'var(--co)'}}>Hi Wall</span><span style={{fontSize:10,fontWeight:600,padding:'2px 7px',borderRadius:5,background:'rgba(255,56,92,.2)',color:'var(--co)',textTransform:'uppercase'}}>Admin</span></div>
      <div style={{display:'flex',gap:2,flexWrap:'wrap'}}>
        {tabs.map(t => {
          const active = t.exact ? loc.pathname === t.to : loc.pathname.startsWith(t.to)
          return <Link key={t.to} to={t.to} style={{padding:'6px 12px',borderRadius:6,textDecoration:'none',fontSize:12,fontWeight:active?600:400,background:active?'rgba(255,255,255,.1)':'transparent',color:active?'#fff':'rgba(255,255,255,.45)'}}>{t.l}</Link>
        })}
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <Link to="/" style={{color:'rgba(255,255,255,.4)',fontSize:11,textDecoration:'none'}}>← Site</Link>
        <button onClick={logout} style={{background:'none',border:'1px solid rgba(255,255,255,.2)',borderRadius:7,color:'rgba(255,255,255,.5)',padding:'5px 12px',cursor:'pointer',fontSize:11}}>Sign Out</button>
      </div>
    </div>
  </nav>
}

// ── Overview ─────────────────────────────────────────────────────────────
function Overview() {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    Promise.all([
      supabase.from('walls').select('id,status,availability_status'),
      supabase.from('enquiries').select('id,status'),
      supabase.from('partners').select('id,status'),
    ]).then(([w, e, p]) => {
      const walls = w.data || []; const enq = e.data || []; const parts = p.data || []
      setStats({
        walls: walls.length, pending: walls.filter(x=>x.status==='pending').length,
        approved: walls.filter(x=>x.status==='approved').length,
        booked: walls.filter(x=>x.availability_status==='booked').length,
        enquiries: enq.length, newEnq: enq.filter(x=>x.status==='new').length,
        partners: parts.length
      })
    })
  }, [])
  if (!stats) return <Spinner />
  return <div style={{maxWidth:960,margin:'0 auto',padding:'28px 24px'}}>
    <h1 className="au" style={{fontFamily:'var(--fd)',fontSize:24,fontWeight:700,marginBottom:20}}>Dashboard</h1>
    <div className="au d1" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginBottom:24}}>
      {[{l:'Walls',v:stats.walls,c:'var(--ink)'},{l:'Pending',v:stats.pending,c:'var(--am)'},{l:'Approved',v:stats.approved,c:'var(--gn)'},{l:'Booked',v:stats.booked,c:'var(--bl)'},{l:'Enquiries',v:stats.enquiries,c:'var(--co)'},{l:'New',v:stats.newEnq,c:'var(--rd)'},{l:'Partners',v:stats.partners,c:'var(--sl)'}].map((s,i) =>
        <Card key={i} style={{padding:14}}><div style={{fontSize:11,color:'var(--mu)',marginBottom:3}}>{s.l}</div><div style={{fontFamily:'var(--fd)',fontSize:22,fontWeight:700,color:s.c}}>{s.v}</div></Card>
      )}
    </div>
    <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
      <Link to="/admin/walls"><Btn>Manage Walls →</Btn></Link>
      <Link to="/admin/enquiries"><Btn variant="secondary">View Enquiries →</Btn></Link>
    </div>
  </div>
}

// ── Wall List + Edit ─────────────────────────────────────────────────────
function WallsAdmin({ toast }) {
  const [walls, setWalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = list, 'new' = new, uuid = editing
  const nav = useNavigate()

  const load = useCallback(async () => {
    const { data } = await supabase.from('walls').select('*').order('created_at',{ascending:false})
    setWalls(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <Spinner />
  if (editing !== null) return <WallForm id={editing} toast={toast} onDone={() => { setEditing(null); load() }} />

  return <div style={{maxWidth:1000,margin:'0 auto',padding:'28px 24px'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
      <h1 style={{fontFamily:'var(--fd)',fontSize:24,fontWeight:700}}>Walls</h1>
      <Btn onClick={() => setEditing('new')}>+ Add Wall</Btn>
    </div>
    {walls.map(w => <Card key={w.id} style={{padding:'12px 16px',marginBottom:8,display:'flex',alignItems:'center',gap:12,cursor:'pointer'}} onClick={() => setEditing(w.id)}>
      <img src={w.primary_image_url || 'https://via.placeholder.com/60'} alt="" style={{width:50,height:50,borderRadius:8,objectFit:'cover',flexShrink:0}}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}><span style={{fontSize:14,fontWeight:600}}>{w.title}</span><Badge status={w.status}/>{w.availability_status==='booked' && <Badge status="booked"/>}</div>
        <div style={{fontSize:12,color:'var(--mu)'}}>{w.neighborhood} • {w.sqm}sqm • {fmt(w.price_total||0)}</div>
      </div>
      <span style={{fontSize:12,color:'var(--mu)'}}>Edit →</span>
    </Card>)}
  </div>
}

// ── Wall Form (Create / Edit) ────────────────────────────────────────────
function WallForm({ id, toast, onDone }) {
  const isNew = id === 'new'
  const [f, sF] = useState({
    title:'',description:'',address:'',neighborhood:'Surry Hills',building_type:'Commercial',
    width_m:'',height_m:'',traffic_level:'Medium',condition:'Good',orientation:'North',
    access_level:'Ground level (no equipment)',access_notes:'',
    heritage_listed:false,council_restrictions:false,strata_approval:false,color_restrictions:false,restriction_details:'',
    price_total:'',price_monthly:'',duration_months:'6',hw_fee_percent:'25',
    availability_status:'available',booked_until:'',available_from:'',
    status:'pending',highlights:'',owner_name:'',owner_email:'',owner_phone:'',
    latitude:'',longitude:'',primary_image_url:''
  })
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!isNew) {
      supabase.from('walls').select('*').eq('id',id).single().then(({ data }) => {
        if (data) {
          sF({...data, highlights: (data.highlights||[]).join(', '), width_m: String(data.width_m), height_m: String(data.height_m), price_total: String(data.price_total||''), price_monthly: String(data.price_monthly||''), duration_months: String(data.duration_months||6), hw_fee_percent: String(data.hw_fee_percent||25), latitude: String(data.latitude||''), longitude: String(data.longitude||''), booked_until: data.booked_until||'', available_from: data.available_from||''})
        }
        setLoading(false)
      })
      supabase.from('wall_images').select('*').eq('wall_id',id).order('display_order').then(({ data }) => setImages(data||[]))
    }
  }, [id, isNew])

  const u = (k, v) => sF(p => ({...p, [k]: v}))

  const save = async () => {
    if (!f.title || !f.address || !f.width_m || !f.height_m) { toast('Fill required fields'); return }
    setSaving(true)
    const row = {
      title: f.title, description: f.description, address: f.address, neighborhood: f.neighborhood,
      building_type: f.building_type, width_m: parseFloat(f.width_m), height_m: parseFloat(f.height_m),
      traffic_level: f.traffic_level, condition: f.condition, orientation: f.orientation,
      access_level: f.access_level, access_notes: f.access_notes,
      heritage_listed: f.heritage_listed, council_restrictions: f.council_restrictions,
      strata_approval: f.strata_approval, color_restrictions: f.color_restrictions,
      restriction_details: f.restriction_details,
      price_total: parseInt(f.price_total)||null, price_monthly: parseInt(f.price_monthly)||null, hw_fee_percent: parseFloat(f.hw_fee_percent)||25,
      suggested_price: calcPrice({...f, width_m: parseFloat(f.width_m), height_m: parseFloat(f.height_m)}).total,
      duration_months: parseInt(f.duration_months)||6,
      availability_status: f.availability_status,
      booked_until: f.booked_until||null, available_from: f.available_from||null,
      status: f.status, highlights: f.highlights.split(',').map(s=>s.trim()).filter(Boolean),
      owner_name: f.owner_name, owner_email: f.owner_email, owner_phone: f.owner_phone,
      latitude: parseFloat(f.latitude)||null, longitude: parseFloat(f.longitude)||null,
      primary_image_url: f.primary_image_url,
    }
    let error
    if (isNew) {
      ({ error } = await supabase.from('walls').insert(row))
    } else {
      ({ error } = await supabase.from('walls').update({...row, updated_at: new Date().toISOString()}).eq('id', id))
    }
    setSaving(false)
    if (error) { toast('Error: ' + error.message); return }
    toast(isNew ? 'Wall created!' : 'Wall updated!')
    onDone()
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length || isNew) return
    setUploading(true)
    for (const file of files) {
      try {
        const { path, url } = await uploadWallImage(file, id)
        await supabase.from('wall_images').insert({ wall_id: id, image_url: url, storage_path: path, display_order: images.length })
        setImages(prev => [...prev, { image_url: url, storage_path: path }])
        if (!f.primary_image_url) u('primary_image_url', url)
      } catch (err) { toast('Upload failed: ' + err.message) }
    }
    setUploading(false)
    toast('Images uploaded!')
  }

  const deleteWall = async () => {
    if (!confirm('Delete this wall permanently?')) return
    await supabase.from('walls').delete().eq('id', id)
    toast('Wall deleted')
    onDone()
  }

  if (loading) return <Spinner />

  const sug = f.width_m && f.height_m ? calcPrice({...f, width_m:parseFloat(f.width_m), height_m:parseFloat(f.height_m)}) : null

  return <div style={{maxWidth:800,margin:'0 auto',padding:'28px 24px 52px'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
      <h1 style={{fontFamily:'var(--fd)',fontSize:22,fontWeight:700}}>{isNew ? 'Add Wall' : 'Edit Wall'}</h1>
      <Btn variant="ghost" onClick={onDone}>← Back</Btn>
    </div>

    <Card style={{padding:22,marginBottom:16}}>
      <h3 style={{fontSize:15,fontWeight:600,marginBottom:14}}>Basic Info</h3>
      <Inp label="Title" required value={f.title} onChange={e=>u('title',e.target.value)} placeholder="e.g. Surry Hills Corner"/>
      <Inp label="Address" required value={f.address} onChange={e=>u('address',e.target.value)} placeholder="42 Crown St, Surry Hills"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <Inp label="Neighborhood" type="select" value={f.neighborhood} onChange={e=>u('neighborhood',e.target.value)}>{NEIGHBORHOODS.map(n=><option key={n}>{n}</option>)}</Inp>
        <Inp label="Building Type" type="select" value={f.building_type} onChange={e=>u('building_type',e.target.value)}>{BUILDING_TYPES.map(b=><option key={b}>{b}</option>)}</Inp>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
        <Inp label="Width (m)" required type="number" value={f.width_m} onChange={e=>u('width_m',e.target.value)}/>
        <Inp label="Height (m)" required type="number" value={f.height_m} onChange={e=>u('height_m',e.target.value)}/>
        <div style={{marginBottom:15}}><label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:4}}>Area</label><div style={{padding:'10px 13px',background:'var(--bg)',borderRadius:10,fontSize:14,fontWeight:600,border:'1.5px solid var(--ln)'}}>{f.width_m && f.height_m ? `${(parseFloat(f.width_m)*parseFloat(f.height_m)).toFixed(1)} sqm` : '—'}</div></div>
      </div>
      <Inp label="Description" type="textarea" rows={3} value={f.description} onChange={e=>u('description',e.target.value)} placeholder="What makes this wall special?"/>
      <Inp label="Highlights (comma-separated)" value={f.highlights} onChange={e=>u('highlights',e.target.value)} placeholder="Corner position, Café strip, North-facing"/>
    </Card>

    <Card style={{padding:22,marginBottom:16}}>
      <h3 style={{fontSize:15,fontWeight:600,marginBottom:14}}>Attributes</h3>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <Inp label="Traffic" type="select" value={f.traffic_level} onChange={e=>u('traffic_level',e.target.value)}>{TRAFFIC_LEVELS.map(t=><option key={t}>{t}</option>)}</Inp>
        <Inp label="Condition" type="select" value={f.condition} onChange={e=>u('condition',e.target.value)}>{CONDITIONS.map(c=><option key={c}>{c}</option>)}</Inp>
        <Inp label="Orientation" type="select" value={f.orientation} onChange={e=>u('orientation',e.target.value)}>{ORIENTATIONS.map(o=><option key={o}>{o}</option>)}</Inp>
        <Inp label="Access Level" type="select" value={f.access_level} onChange={e=>u('access_level',e.target.value)}>{ACCESS_OPTS.map(a=><option key={a}>{a}</option>)}</Inp>
      </div>
      <Inp label="Access Notes" value={f.access_notes} onChange={e=>u('access_notes',e.target.value)} placeholder="Specific instructions..."/>
    </Card>

    <Card style={{padding:22,marginBottom:16}}>
      <h3 style={{fontSize:15,fontWeight:600,marginBottom:14}}>Heritage & Restrictions</h3>
      {[{k:'heritage_listed',l:'Heritage-listed building'},{k:'council_restrictions',l:'Council restrictions on signage'},{k:'strata_approval',l:'Requires strata/body corp approval'},{k:'color_restrictions',l:'Colour or content restrictions'}].map(q =>
        <label key={q.k} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10,cursor:'pointer',fontSize:14}}>
          <input type="checkbox" checked={f[q.k]} onChange={e=>u(q.k,e.target.checked)} style={{width:18,height:18}}/>
          {q.l}
        </label>
      )}
      <Inp label="Restriction Details" type="textarea" rows={2} value={f.restriction_details} onChange={e=>u('restriction_details',e.target.value)} placeholder="Describe any restrictions..."/>
    </Card>

    <Card style={{padding:22,marginBottom:16}}>
      <h3 style={{fontSize:15,fontWeight:600,marginBottom:14}}>Pricing & Availability</h3>
      {sug && <div style={{background:'var(--col)',padding:'10px 14px',borderRadius:10,marginBottom:14,fontSize:13}}>💡 Suggested owner price: <strong>{fmt(sug.ownerTotal)}</strong> ({fmt(sug.ownerMonthly)}/mo) · Campaign total (incl. {sug.hwFeePercent}% fee): <strong>{fmt(sug.campaignTotal)}</strong></div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:10}}>
        <Inp label="Total Price ($)" type="number" value={f.price_total} onChange={e=>u('price_total',e.target.value)} placeholder={sug?String(sug.ownerTotal):''}/>
        <Inp label="Monthly ($)" type="number" value={f.price_monthly} onChange={e=>u('price_monthly',e.target.value)} placeholder={sug?String(sug.ownerMonthly):''}/>
        <Inp label="Duration" type="select" value={f.duration_months} onChange={e=>u('duration_months',e.target.value)}>{DURATIONS.map(d=><option key={d} value={d}>{d} months</option>)}</Inp>
        <Inp label="Hi Wall Fee %" type="number" value={f.hw_fee_percent} onChange={e=>u('hw_fee_percent',e.target.value)} placeholder="25"/>
      </div>
      {parseFloat(f.hw_fee_percent||25) !== 25 && <div style={{fontSize:12,color:'var(--co)',fontWeight:600,marginBottom:8}}>⚡ Custom fee rate: {f.hw_fee_percent}% (standard is 25%)</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <Inp label="Status" type="select" value={f.status} onChange={e=>u('status',e.target.value)}><option value="pending">Pending</option><option value="approved">Approved</option><option value="denied">Denied</option></Inp>
        <Inp label="Availability" type="select" value={f.availability_status} onChange={e=>u('availability_status',e.target.value)}><option value="available">Available</option><option value="booked">Booked</option></Inp>
      </div>
      {f.availability_status === 'booked' && <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <Inp label="Booked Until" type="date" value={f.booked_until} onChange={e=>u('booked_until',e.target.value)}/>
        <Inp label="Available From" type="date" value={f.available_from} onChange={e=>u('available_from',e.target.value)}/>
      </div>}
    </Card>

    <Card style={{padding:22,marginBottom:16}}>
      <h3 style={{fontSize:15,fontWeight:600,marginBottom:14}}>Owner Info</h3>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
        <Inp label="Owner Name" value={f.owner_name} onChange={e=>u('owner_name',e.target.value)}/>
        <Inp label="Owner Email" value={f.owner_email} onChange={e=>u('owner_email',e.target.value)}/>
        <Inp label="Owner Phone" value={f.owner_phone} onChange={e=>u('owner_phone',e.target.value)}/>
      </div>
    </Card>

    <Card style={{padding:22,marginBottom:16}}>
      <h3 style={{fontSize:15,fontWeight:600,marginBottom:14}}>Map Coordinates</h3>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <Inp label="Latitude" type="number" step="any" value={f.latitude} onChange={e=>u('latitude',e.target.value)} placeholder="-33.884"/>
        <Inp label="Longitude" type="number" step="any" value={f.longitude} onChange={e=>u('longitude',e.target.value)} placeholder="151.211"/>
      </div>
    </Card>

    <Card style={{padding:22,marginBottom:16}}>
      <h3 style={{fontSize:15,fontWeight:600,marginBottom:14}}>Images</h3>
      <Inp label="Primary Image URL" value={f.primary_image_url} onChange={e=>u('primary_image_url',e.target.value)} placeholder="https://..."/>
      {!isNew && <>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:12}}>
          {images.map((img,i) => <img key={i} src={img.image_url} alt="" style={{width:80,height:80,borderRadius:8,objectFit:'cover'}}/>)}
        </div>
        <label style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 18px',background:'var(--bg)',borderRadius:10,border:'2px dashed var(--ln)',cursor:'pointer',fontSize:13}}>
          📷 {uploading ? 'Uploading...' : 'Upload Images'}
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{display:'none'}} disabled={uploading}/>
        </label>
      </>}
      {isNew && <p style={{fontSize:12,color:'var(--mu)'}}>Save the wall first, then you can upload images.</p>}
    </Card>

    <div style={{display:'flex',gap:10}}>
      <Btn onClick={save} disabled={saving} style={{flex:1,justifyContent:'center',padding:14,fontSize:16,opacity:saving?.6:1}}>{saving ? 'Saving...' : (isNew ? 'Create Wall' : 'Save Changes')}</Btn>
      {!isNew && <Btn variant="danger" onClick={deleteWall} style={{padding:'14px 20px'}}>Delete</Btn>}
    </div>
  </div>
}

// ── Enquiries ────────────────────────────────────────────────────────────
function EnquiriesAdmin({ toast }) {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('enquiries').select('*, walls(title)').order('created_at',{ascending:false}).then(({ data }) => {
      setEnquiries(data || [])
      setLoading(false)
    })
  }, [])

  const updateStatus = async (id, status) => {
    await supabase.from('enquiries').update({ status }).eq('id', id)
    setEnquiries(prev => prev.map(e => e.id === id ? {...e, status} : e))
    toast('Status updated')
  }

  if (loading) return <Spinner />

  return <div style={{maxWidth:960,margin:'0 auto',padding:'28px 24px'}}>
    <h1 className="au" style={{fontFamily:'var(--fd)',fontSize:24,fontWeight:700,marginBottom:18}}>Enquiries</h1>
    {enquiries.length === 0 ? <Card style={{padding:36,textAlign:'center'}}><p style={{color:'var(--mu)'}}>No enquiries yet</p></Card>
    : enquiries.map(e => <Card key={e.id} style={{padding:'16px 20px',marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
        <div>
          <div style={{fontSize:15,fontWeight:600}}>{e.contact_name} {e.company_name && <span style={{color:'var(--mu)',fontWeight:400}}>— {e.company_name}</span>}</div>
          <div style={{fontSize:12,color:'var(--mu)'}}>{e.contact_email} {e.contact_phone && `• ${e.contact_phone}`} • {new Date(e.created_at).toLocaleDateString()}</div>
          <div style={{fontSize:12,color:'var(--sl)',marginTop:2}}>Wall: {e.walls?.title || '—'}</div>
        </div>
        <Badge status={e.status}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:6,marginBottom:8,fontSize:12}}>
        <div style={{padding:'5px 10px',background:'var(--bg)',borderRadius:7}}><strong>Budget:</strong> {e.budget_range}</div>
        <div style={{padding:'5px 10px',background:'var(--bg)',borderRadius:7}}><strong>Timeline:</strong> {e.timeline || '—'}</div>
      </div>
      {e.campaign_goal && <p style={{fontSize:13,color:'var(--sl)',marginBottom:8}}><strong>Goal:</strong> {e.campaign_goal}</p>}
      {e.message && <p style={{fontSize:13,color:'var(--sl)',marginBottom:8}}><strong>Notes:</strong> {e.message}</p>}
      <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
        {['new','contacted','converted','archived'].map(s => <button key={s} onClick={() => updateStatus(e.id, s)} style={{padding:'4px 10px',borderRadius:6,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,textTransform:'capitalize',background:e.status===s?'var(--co)':'var(--bg)',color:e.status===s?'#fff':'var(--sl)'}}>{s}</button>)}
      </div>
    </Card>)}
  </div>
}

// ── Partners Admin ───────────────────────────────────────────────────────
function PartnersAdmin({ toast }) {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('partners').select('*').order('created_at',{ascending:false}).then(({ data }) => {
      setPartners(data || [])
      setLoading(false)
    })
  }, [])

  const updateStatus = async (id, status) => {
    await supabase.from('partners').update({ status }).eq('id', id)
    setPartners(prev => prev.map(p => p.id === id ? {...p, status} : p))
    toast('Updated')
  }

  if (loading) return <Spinner />

  return <div style={{maxWidth:800,margin:'0 auto',padding:'28px 24px'}}>
    <h1 className="au" style={{fontFamily:'var(--fd)',fontSize:24,fontWeight:700,marginBottom:18}}>Partners</h1>
    {partners.map(p => <Card key={p.id} style={{padding:'14px 18px',marginBottom:8,display:'flex',alignItems:'center',gap:12}}>
      <div style={{width:36,height:36,borderRadius:8,background:'var(--col)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15}}>🤝</div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:600}}>{p.company}</div>
        <div style={{fontSize:12,color:'var(--mu)'}}>{p.services} • {p.contact_email}</div>
      </div>
      <Badge status={p.status}/>
      <div style={{display:'flex',gap:3}}>{['pending','approved','denied'].map(s =>
        <button key={s} onClick={() => updateStatus(p.id, s)} style={{padding:'3px 8px',borderRadius:5,border:'none',cursor:'pointer',fontSize:10,fontWeight:600,textTransform:'capitalize',background:p.status===s?'var(--co)':'var(--bg)',color:p.status===s?'#fff':'var(--mu)'}}>{s}</button>
      )}</div>
    </Card>)}
  </div>
}

// ── Main Admin Dashboard ─────────────────────────────────────────────────
export default function AdminDashboard({ session, logout, toast }) {
  return <div style={{minHeight:'100vh',background:'var(--bg)'}}>
    <AdminNav logout={logout} />
    <Routes>
      <Route index element={<Overview />} />
      <Route path="walls" element={<WallsAdmin toast={toast} />} />
      <Route path="enquiries" element={<EnquiriesAdmin toast={toast} />} />
      <Route path="partners" element={<PartnersAdmin toast={toast} />} />
    </Routes>
  </div>
}
