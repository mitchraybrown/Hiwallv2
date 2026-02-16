import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { Card, Btn, Overlay, Badge, Spinner } from '../components/ui'
import EnquiryForm from '../components/EnquiryForm'
import MapboxMap from '../components/MapboxMap'
import { fmt, campPrice, TRAFFIC_LEVELS, COORDS, COUNCILS, SUBURB_COUNCIL } from '../lib/pricing'

// ── Wall Card ────────────────────────────────────────────────────────────
function WallCard({ wall: w, onClick }) {
  const booked = w.availability_status === 'booked'
  return <div className="ch" onClick={onClick} style={{background:'var(--wh)',borderRadius:'var(--rl)',overflow:'hidden',cursor:'pointer',border:'1px solid var(--ln)',position:'relative'}}>
    {booked && <div style={{position:'absolute',top:0,left:0,right:0,background:'var(--bl)',color:'#fff',fontSize:10,fontWeight:600,textAlign:'center',padding:'3px 0',zIndex:2}}>BOOKED — Available {w.available_from}</div>}
    <div style={{position:'relative',paddingBottom:'75%',background:'#F1F5F9'}}><img src={w.primary_image_url || 'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=800&q=80'} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:booked?.7:1}}/><span style={{position:'absolute',top:booked?28:8,left:8,background:'rgba(255,255,255,.92)',padding:'2px 8px',borderRadius:6,fontSize:11,fontWeight:600}}>{w.sqm} sqm</span></div>
    <div style={{padding:'12px 14px 14px'}}><h3 style={{fontSize:15,fontWeight:600,marginBottom:3}}>{w.title}</h3><div style={{fontSize:12,color:'var(--mu)',marginBottom:6}}>{w.neighborhood} • {w.width_m}m × {w.height_m}m</div>
      {w.highlights?.length > 0 && <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:8}}>{w.highlights.slice(0,3).map((h,j)=><span key={j} style={{fontSize:10,padding:'2px 6px',borderRadius:5,background:'var(--bg)',color:'var(--sl)',border:'1px solid var(--ln)'}}>{h}</span>)}</div>}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:9,borderTop:'1px solid var(--ln)'}}><span style={{fontFamily:'var(--fd)',fontSize:17,fontWeight:700,color:'var(--co)'}}>{fmt(campPrice(w))}</span><span style={{fontSize:11,color:'var(--mu)'}}>/{w.duration_months}mo</span></div>
    </div>
  </div>
}

// ── Wall Detail Modal ────────────────────────────────────────────────────
function WallModal({ wall: w, onClose, onEnquire }) {
  if (!w) return null
  const booked = w.availability_status === 'booked'
  const hasHeritage = w.heritage_listed || w.council_restrictions || w.strata_approval || w.color_restrictions
  return <Overlay onClose={onClose}><div style={{background:'var(--wh)',borderRadius:'var(--rl)',maxWidth:840,width:'95vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,.15)'}}>
    <div style={{position:'relative',paddingBottom:'40%',background:'#F1F5F9'}}><img src={w.primary_image_url || 'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=800&q=80'} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/><button onClick={onClose} style={{position:'absolute',top:12,right:12,width:32,height:32,borderRadius:'50%',background:'rgba(0,0,0,.5)',border:'none',cursor:'pointer',color:'#fff',fontSize:15}}>✕</button></div>
    <div style={{padding:'20px 24px 24px'}}>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,marginBottom:4}}>
        <div style={{flex:1}}><h2 style={{fontFamily:'var(--fd)',fontSize:22,fontWeight:700,marginBottom:4}}>{w.title}</h2><p style={{color:'var(--mu)',fontSize:13}}>{w.address}</p></div>
        <div style={{background:'var(--col)',padding:'11px 18px',borderRadius:'var(--r)',textAlign:'right'}}><div style={{fontFamily:'var(--fd)',fontSize:24,fontWeight:700,color:'var(--co)'}}>{fmt(campPrice(w))}</div><div style={{fontSize:12,color:'var(--sl)'}}>for {w.duration_months} mo</div></div>
      </div>
      <div style={{marginBottom:14}}><span style={{fontSize:11,fontWeight:600,color:booked?'var(--bl)':'var(--gn)'}}>{booked ? `● Booked — Available from ${w.available_from}` : '● Available now'}</span></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))',gap:7,padding:'14px 0',borderTop:'1px solid var(--ln)',borderBottom:'1px solid var(--ln)',marginBottom:14}}>
        {[{l:'Dimensions',v:`${w.width_m}m × ${w.height_m}m`},{l:'Area',v:`${w.sqm} sqm`},{l:'Traffic',v:w.traffic_level},{l:'Condition',v:w.condition},{l:'Facing',v:w.orientation},{l:'Access',v:(w.access_level||'—').split('(')[0]},{l:'Building',v:w.building_type},{l:'Monthly',v:fmt(campPrice(w)/parseInt(w.duration_months))}].map((s,j)=><div key={j} style={{padding:'6px 9px',background:'var(--bg)',borderRadius:7,fontSize:12}}><div style={{color:'var(--mu)',fontSize:10}}>{s.l}</div><div style={{fontWeight:600}}>{s.v}</div></div>)}
      </div>
      <p style={{fontSize:14,color:'var(--sl)',lineHeight:1.7,marginBottom:14}}>{w.description}</p>
      {hasHeritage && <div style={{background:'var(--ab)',border:'1px solid #FCD34D',borderRadius:10,padding:'12px 16px',marginBottom:14}}><div style={{fontSize:13,fontWeight:600,color:'var(--at)',marginBottom:4}}>⚠️ Heritage & Restrictions</div>{w.heritage_listed && <div style={{fontSize:12,color:'var(--at)'}}>• Heritage-listed building</div>}{w.council_restrictions && <div style={{fontSize:12,color:'var(--at)'}}>• Council restrictions apply</div>}{w.strata_approval && <div style={{fontSize:12,color:'var(--at)'}}>• Strata approval required</div>}{w.color_restrictions && <div style={{fontSize:12,color:'var(--at)'}}>• Colour/content restrictions</div>}{w.restriction_details && <div style={{fontSize:12,color:'var(--at)',marginTop:4,fontStyle:'italic'}}>{w.restriction_details}</div>}</div>}
      {w.highlights?.length > 0 && <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:14}}>{w.highlights.map((h,j)=><span key={j} style={{padding:'4px 10px',borderRadius:7,background:'var(--bg)',fontSize:12,fontWeight:500,border:'1px solid var(--ln)'}}>{h}</span>)}</div>}
      <Btn onClick={() => onEnquire(w)} style={{width:'100%',justifyContent:'center',padding:13,fontSize:15}}>{booked ? 'Express Interest' : 'Enquire About This Wall'}</Btn>
    </div>
  </div></Overlay>
}

// ── How It Works (simplified for homepage — Creative Fit moved to About) ──
function HowItWorks() {
  return <Card className="au d2" style={{padding:'26px 30px',marginBottom:24}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4,flexWrap:'wrap',gap:8}}>
      <h3 style={{fontFamily:'var(--fd)',fontSize:18,fontWeight:700}}>How It Works</h3>
    </div>
    <p style={{fontSize:13,color:'var(--mu)',marginBottom:18,maxWidth:520}}>Hi Wall focuses on inventory, verification, and booking. Delivery is handled through approved partners.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:14}}>
      {[{i:'✅',t:'1. Walls Get Verified',d:'Eligibility checks, constraints captured, status applied.'},{i:'🔍',t:'2. Brands Reserve',d:'Browse by suburb, size, environment, and availability.'},{i:'🤝',t:'3. Partners Deliver',d:'Creative, production, and install via approved partners.'},{i:'🎨',t:'4. Campaign Goes Live',d:'Outdoor impact plus optional content capture for digital.'}].map((s,j)=><div key={j} style={{display:'flex',gap:10}}><div style={{width:36,height:36,borderRadius:9,background:'var(--col)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,flexShrink:0}}>{s.i}</div><div><div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{s.t}</div><div style={{fontSize:12,color:'var(--mu)',lineHeight:1.5}}>{s.d}</div></div></div>)}
    </div>
  </Card>
}

// ── Hero ─────────────────────────────────────────────────────────────────
function Hero() {
  const [images, setImages] = useState([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    supabase.from('hero_images').select('image_url').eq('active', true).order('display_order')
      .then(({ data }) => setImages(data?.map(d => d.image_url) || []))
  }, [])

  useEffect(() => {
    if (images.length < 2) return
    const timer = setInterval(() => setIdx(i => (i + 1) % images.length), 6000)
    return () => clearInterval(timer)
  }, [images])

  const hasImages = images.length > 0

  return <section style={{position:'relative',overflow:'hidden',minHeight:hasImages ? 'clamp(280px,40vw,420px)' : 'auto'}}>
    {/* Background images with crossfade */}
    {hasImages && images.map((url, i) => <div key={i} style={{
      position:'absolute',inset:0,
      backgroundImage:`url(${url})`,backgroundSize:'cover',backgroundPosition:'center',
      opacity:i === idx ? 1 : 0,transition:'opacity 1.5s ease-in-out',zIndex:0
    }}/>)}
    {/* Dark overlay for text readability */}
    <div style={{position:hasImages ? 'absolute' : 'relative',inset:0,zIndex:1,
      background:hasImages
        ? 'linear-gradient(135deg,rgba(26,26,46,.85),rgba(45,43,85,.75),rgba(59,38,103,.7))'
        : 'linear-gradient(135deg,#1A1A2E,#2D2B55,#3B2667)',
      padding:'clamp(32px,6vw,52px) 16px clamp(36px,7vw,58px)'
    }}>
      <div style={{position:'absolute',top:-80,right:-80,width:350,height:350,borderRadius:'50%',background:'rgba(255,56,92,.08)',filter:'blur(70px)'}}/>
      <div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2}}>
        <div className="au" style={{maxWidth:520}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(255,56,92,.15)',padding:'4px 13px',borderRadius:20,marginBottom:14,backdropFilter:'blur(8px)'}}><span style={{fontSize:12}}>🇦🇺</span><span style={{color:'var(--co)',fontSize:11,fontWeight:600}}>Sydney's Wall Marketplace</span></div>
          <h1 style={{fontFamily:'var(--fd)',fontSize:'clamp(26px,4vw,42px)',fontWeight:700,color:'#fff',lineHeight:1.1,marginBottom:10,textShadow:hasImages?'0 2px 20px rgba(0,0,0,.3)':'none'}}>Turn blank walls into<br/><span style={{color:'var(--co)'}}>bold statements.</span></h1>
          <p style={{fontSize:14,color:'rgba(255,255,255,.65)',lineHeight:1.6,maxWidth:400,textShadow:hasImages?'0 1px 8px rgba(0,0,0,.3)':'none'}}>Verified wall inventory. Brand-quality murals. Delivered by approved partners.</p>
        </div>
        {/* Image indicator dots */}
        {images.length > 1 && <div style={{display:'flex',gap:6,marginTop:20}}>
          {images.map((_, i) => <button key={i} onClick={() => setIdx(i)} style={{width:i===idx?24:8,height:8,borderRadius:4,background:i===idx?'var(--co)':'rgba(255,255,255,.35)',border:'none',cursor:'pointer',transition:'all .3s',padding:0}}/>)}
        </div>}
      </div>
    </div>
  </section>
}


// ── Browse Page (Main) ───────────────────────────────────────────────────
export default function BrowsePage({ toast }) {
  const [walls, setWalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, sQ] = useState(''); const [fT, sFT] = useState(''); const [fN, sFN] = useState(''); const [sort, sS] = useState('')
  const [sel, sSel] = useState(null); const [enquiry, sEnq] = useState(null); const [fC, sFC] = useState(""); const [fA, sFA] = useState(''); const [hov, sHov] = useState(null)
  const [view, sView] = useState('split')
  const [isMob, setMob] = useState(typeof window !== 'undefined' && window.innerWidth < 769)

  useEffect(() => {
    const h = () => setMob(window.innerWidth < 769)
    window.addEventListener('resize', h); return () => window.removeEventListener('resize', h)
  }, [])

  // Fetch walls from Supabase
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('walls')
        .select('*')
        .or('status.eq.approved,availability_status.eq.booked')
        .order('created_at', { ascending: false })
      if (error) console.error(error)
      else setWalls(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const hoods = [...new Set(walls.map(w => w.neighborhood))]
  let list = walls.filter(w => {
    const s = q.toLowerCase()
    return (!s || w.title.toLowerCase().includes(s) || w.neighborhood.toLowerCase().includes(s))
      && (!fT || w.traffic_level === fT)
      && (!fN || w.neighborhood === fN)
      && (!fC || w.council === fC || SUBURB_COUNCIL[w.neighborhood] === fC) && (!fA || (fA === 'available' && w.availability_status !== 'booked') || (fA === 'booked' && w.availability_status === 'booked'))
  })
  if (sort === 'pa') list = [...list].sort((a,b) => a.price_total - b.price_total)
  if (sort === 'pd') list = [...list].sort((a,b) => b.price_total - a.price_total)
  if (sort === 'sz') list = [...list].sort((a,b) => b.sqm - a.sqm)
  const activeView = isMob ? (view === 'split' ? 'grid' : view) : view

  if (loading) return <><Hero/><Spinner/></>

  return <div>
    <Hero/>
    <div style={{maxWidth:1400,margin:'0 auto',padding:isMob?'20px 16px 16px':'28px 24px 20px'}}><HowItWorks/></div>
    <div style={{maxWidth:1400,margin:'0 auto',padding:isMob?'0 16px 40px':'0 24px 52px'}}>
      <Card className="au d4" style={{padding:isMob?'10px 12px':'12px 16px',marginBottom:16,display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
        <div style={{flex:'1 1 140px',position:'relative'}}><span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--mu)',fontSize:13}}>🔍</span><input value={q} onChange={e=>sQ(e.target.value)} placeholder="Search..." style={{width:'100%',padding:'9px 11px 9px 32px',border:'1.5px solid var(--ln)',borderRadius:10,fontSize:13,outline:'none'}}/></div>
        {[{v:fN,s:sFN,p:'Suburb',o:hoods.map(n=>({v:n,l:n}))},{v:fT,s:sFT,p:'Traffic',o:TRAFFIC_LEVELS.map(t=>({v:t,l:t}))},{v:fA,s:sFA,p:'Avail',o:[{v:'available',l:'Available'},{v:'booked',l:'Booked'}]},{v:fC,s:sFC,p:'Council',o:COUNCILS.map(c=>({v:c,l:c}))},{v:sort,s:sS,p:'Sort',o:[{v:'pa',l:'Price ↑'},{v:'pd',l:'Price ↓'},{v:'sz',l:'Size ↓'}]}].map((fl,j)=><select key={j} value={fl.v} onChange={e=>fl.s(e.target.value)} style={{padding:'9px 8px',border:'1.5px solid var(--ln)',borderRadius:10,fontSize:12,cursor:'pointer',background:'var(--wh)',outline:'none',minWidth:isMob?70:95,flex:isMob?'1 1 70px':'0 0 auto'}}><option value="">{fl.p}</option>{fl.o.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select>)}
        <div style={{display:'flex',gap:2,padding:3,background:'var(--bg)',borderRadius:8,border:'1px solid var(--ln)',marginLeft:isMob?0:'auto'}}>
          {(isMob?[{id:'grid',l:'⊞ List'},{id:'map',l:'🗺️ Map'}]:[{id:'split',l:'🗺️ Split'},{id:'grid',l:'⊞ Grid'}]).map(v=><button key={v.id} onClick={()=>sView(v.id)} style={{padding:'5px 10px',borderRadius:6,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,background:view===v.id?'var(--wh)':'transparent',color:view===v.id?'var(--ink)':'var(--mu)'}}>{v.l}</button>)}
        </div>
      </Card>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}><h2 style={{fontFamily:'var(--fd)',fontSize:isMob?17:19,fontWeight:700}}>Available Walls</h2><span style={{fontSize:12,color:'var(--mu)'}}>{list.length} walls</span></div>

      {activeView==='split' ? (
        <div style={{display:'grid',gridTemplateColumns:'minmax(320px,1fr) 1fr',gap:18,alignItems:'start'}}>
          <div style={{maxHeight:'calc(100vh - 180px)',overflowY:'auto',display:'flex',flexDirection:'column',gap:10,paddingRight:6}}>
            {list.map(w => <Card key={w.id} onClick={()=>sSel(w)} onMouseEnter={()=>sHov(w.id)} onMouseLeave={()=>sHov(null)} style={{padding:12,display:'flex',gap:12,cursor:'pointer',border:hov===w.id?'1.5px solid var(--co)':'1px solid var(--ln)',position:'relative'}}>
              <img src={w.primary_image_url || 'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=800&q=80'} alt="" style={{width:80,height:80,borderRadius:10,objectFit:'cover',flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <h4 style={{fontSize:14,fontWeight:600,marginBottom:2}}>{w.title}</h4>
                <div style={{fontSize:12,color:'var(--mu)',marginBottom:6}}>{w.neighborhood} • {w.sqm}sqm</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontFamily:'var(--fd)',fontSize:16,fontWeight:700,color:'var(--co)'}}>{fmt(campPrice(w))}</span><span style={{fontSize:10,color:'var(--mu)'}}>/{w.duration_months}mo</span></div>
              </div>
            </Card>)}
          </div>
          <div style={{position:'sticky',top:74,height:'calc(100vh - 180px)',borderRadius:14,overflow:'hidden',border:'1px solid var(--ln)'}}><MapboxMap walls={list} onSelect={sSel} hoveredId={hov} onHover={sHov}/></div>
        </div>
      ) : activeView==='map' ? (
        <div style={{height:isMob?'calc(100vh - 260px)':'calc(100vh - 240px)',borderRadius:14,overflow:'hidden',border:'1px solid var(--ln)'}}><MapboxMap walls={list} onSelect={sSel} hoveredId={hov} onHover={sHov}/></div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:isMob?'1fr':'repeat(auto-fill,minmax(260px,1fr))',gap:isMob?12:16}}>{list.map(w=><WallCard key={w.id} wall={w} onClick={()=>sSel(w)}/>)}</div>
      )}
    </div>
    {sel && <WallModal wall={sel} onClose={()=>sSel(null)} onEnquire={w => { sSel(null); sEnq(w) }}/>}
    {enquiry && <EnquiryForm wall={enquiry} onClose={()=>sEnq(null)} toast={toast}/>}
  </div>
}
