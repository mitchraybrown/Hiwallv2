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
    {booked && <div style={{position:'absolute',top:0,left:0,right:0,background:'var(--bl)',color:'#fff',fontSize:10,fontWeight:600,textAlign:'center',padding:'3px 0',zIndex:2,letterSpacing:'0.05em',textTransform:'uppercase'}}>BOOKED — Available {w.available_from}</div>}
    <div style={{position:'relative',paddingBottom:'75%',background:'#F1F0EC'}}><img src={w.primary_image_url || 'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=800&q=80'} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:booked?.7:1}}/><span className="mono" style={{position:'absolute',top:booked?28:10,left:10,background:'rgba(255,255,255,.92)',padding:'3px 10px',borderRadius:20,fontSize:10,fontWeight:700}}>{w.sqm} sqm</span></div>
    <div style={{padding:'14px 16px 16px'}}><h3 style={{fontSize:15,fontWeight:600,marginBottom:4,letterSpacing:-0.2}}>{w.title}</h3><div style={{fontSize:12,color:'var(--mu)',marginBottom:8}}>{w.neighborhood} · {w.width_m}m × {w.height_m}m</div>
      {w.highlights?.length > 0 && <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:10}}>{w.highlights.slice(0,3).map((h,j)=><span key={j} style={{fontSize:10,padding:'3px 8px',borderRadius:20,background:'var(--bg)',color:'var(--sl)',border:'1px solid var(--ln)'}}>{h}</span>)}</div>}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:10,borderTop:'1px solid var(--ln)'}}><span className="mono" style={{fontSize:14,fontWeight:700,color:'var(--co)',letterSpacing:'0.02em',textTransform:'none'}}>{fmt(campPrice(w))}</span><span style={{fontSize:11,color:'var(--mu)'}}>/{w.duration_months}mo</span></div>
    </div>
  </div>
}

// ── Wall Detail Modal ────────────────────────────────────────────────────
function WallModal({ wall: w, onClose, onEnquire }) {
  if (!w) return null
  const booked = w.availability_status === 'booked'
  const hasHeritage = w.heritage_listed || w.council_restrictions || w.strata_approval || w.color_restrictions
  return <Overlay onClose={onClose}><div style={{background:'var(--wh)',borderRadius:20,maxWidth:840,width:'95vw',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,.12)'}}>
    <div style={{position:'relative',paddingBottom:'40%',background:'#F1F0EC'}}><img src={w.primary_image_url || 'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=800&q=80'} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',borderRadius:'20px 20px 0 0'}}/><button onClick={onClose} style={{position:'absolute',top:14,right:14,width:34,height:34,borderRadius:'50%',background:'rgba(0,0,0,.4)',backdropFilter:'blur(8px)',border:'none',cursor:'pointer',color:'#fff',fontSize:15}}>✕</button></div>
    <div style={{padding:'22px 28px 28px'}}>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,marginBottom:6}}>
        <div style={{flex:1}}><h2 style={{fontSize:24,fontWeight:700,letterSpacing:-0.5,marginBottom:5}}>{w.title}</h2><p style={{color:'var(--mu)',fontSize:13}}>{w.address}</p></div>
        <div style={{background:'var(--col)',padding:'12px 20px',borderRadius:14,textAlign:'right'}}><div className="mono" style={{fontSize:18,fontWeight:700,color:'var(--co)',letterSpacing:'0.02em',textTransform:'none'}}>{fmt(campPrice(w))}</div><div style={{fontSize:12,color:'var(--sl)'}}>for {w.duration_months} mo</div></div>
      </div>
      <div style={{marginBottom:16}}><span className="mono" style={{fontSize:11,fontWeight:600,color:booked?'var(--bl)':'var(--gn)'}}>{booked ? `● Booked — Available from ${w.available_from}` : '● Available now'}</span></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))',gap:8,padding:'16px 0',borderTop:'1px solid var(--ln)',borderBottom:'1px solid var(--ln)',marginBottom:16}}>
        {[{l:'Dimensions',v:`${w.width_m}m × ${w.height_m}m`},{l:'Area',v:`${w.sqm} sqm`},{l:'Traffic',v:w.traffic_level},{l:'Condition',v:w.condition},{l:'Facing',v:w.orientation},{l:'Access',v:(w.access_level||'—').split('(')[0]},{l:'Building',v:w.building_type},{l:'Monthly',v:fmt(campPrice(w)/parseInt(w.duration_months))}].map((s,j)=><div key={j} style={{padding:'8px 10px',background:'var(--bg)',borderRadius:12,fontSize:12}}><div style={{color:'var(--mu)',fontSize:10,marginBottom:2}}>{s.l}</div><div style={{fontWeight:600}}>{s.v}</div></div>)}
      </div>
      <p style={{fontSize:14,color:'var(--sl)',lineHeight:1.7,marginBottom:16}}>{w.description}</p>
      {hasHeritage && <div style={{background:'var(--ab)',border:'1px solid #FCD34D',borderRadius:14,padding:'14px 18px',marginBottom:16}}><div style={{fontSize:13,fontWeight:600,color:'var(--at)',marginBottom:4}}>⚠️ Heritage & Restrictions</div>{w.heritage_listed && <div style={{fontSize:12,color:'var(--at)'}}>• Heritage-listed building</div>}{w.council_restrictions && <div style={{fontSize:12,color:'var(--at)'}}>• Council restrictions apply</div>}{w.strata_approval && <div style={{fontSize:12,color:'var(--at)'}}>• Strata approval required</div>}{w.color_restrictions && <div style={{fontSize:12,color:'var(--at)'}}>• Colour/content restrictions</div>}{w.restriction_details && <div style={{fontSize:12,color:'var(--at)',marginTop:4,fontStyle:'italic'}}>{w.restriction_details}</div>}</div>}
      {w.highlights?.length > 0 && <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:16}}>{w.highlights.map((h,j)=><span key={j} style={{padding:'5px 12px',borderRadius:20,background:'var(--bg)',fontSize:12,fontWeight:500,border:'1px solid var(--ln)'}}>{h}</span>)}</div>}
      <Btn onClick={() => onEnquire(w)} style={{width:'100%',justifyContent:'center',padding:14,fontSize:15,borderRadius:14}}>{booked ? 'Express Interest' : 'Enquire About This Wall'}</Btn>
    </div>
  </div></Overlay>
}

// ── How It Works ──────────────────────────────────────────────────────────
function HowItWorks() {
  return <div className="au d2" style={{marginBottom:28}}>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:0}}>
      {[
        {n:'01',t:'Walls get verified',d:'Dimensions, photos, access, heritage and council constraints — all captured.'},
        {n:'02',t:'Brands browse & book',d:'Search by suburb, size, traffic, price. Submit a campaign brief.'},
        {n:'03',t:'Partners deliver',d:'Vetted muralists and installers bring the campaign to life.'},
        {n:'04',t:'Everyone wins',d:'Income for owners. Impact for brands. Art for neighbourhoods.'}
      ].map((s,j)=><div key={j} style={{padding:'20px 20px',borderLeft:j>0?'1px solid var(--ln)':'none',borderTop:'2px solid var(--ink)'}}>
        <span className="mono" style={{fontSize:11,color:'var(--co)',fontWeight:700,marginBottom:6,display:'block'}}>{s.n}</span>
        <div style={{fontSize:14,fontWeight:600,marginBottom:4,letterSpacing:-0.2}}>{s.t}</div>
        <div style={{fontSize:13,color:'var(--mu)',lineHeight:1.6}}>{s.d}</div>
      </div>)}
    </div>
  </div>
}

// ── Suburb Marquee ────────────────────────────────────────────────────────
function SuburbMarquee() {
  const suburbs = ["Surry Hills","Newtown","Bondi Beach","Paddington","Marrickville","Alexandria","Enmore","Redfern","Glebe","Darlinghurst","Chippendale","Pyrmont","Balmain","Coogee","Manly","Leichhardt"]
  return <div style={{borderTop:'1px solid var(--ln)',borderBottom:'1px solid var(--ln)',padding:'12px 0',overflow:'hidden',whiteSpace:'nowrap',marginBottom:28}}>
    <div style={{display:'flex',animation:'marquee 25s linear infinite'}}>
      {[0,1].map(ri => <div key={ri} style={{display:'flex',gap:40,paddingRight:40}}>
        {suburbs.map((s,i)=><span key={i} className="mono" style={{fontSize:11,color:'var(--ln)',letterSpacing:'0.08em'}}>{s}</span>)}
      </div>)}
    </div>
  </div>
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

  return <section style={{padding:'clamp(40px,8vw,80px) 24px clamp(32px,5vw,48px)',maxWidth:1400,margin:'0 auto',position:'relative'}}>
    <div style={{display:'grid',gridTemplateColumns:hasImages ? '1fr 1fr' : '1fr',gap:40,alignItems:'center'}}>
      {/* Left: text */}
      <div>
        <div className="au mono" style={{color:'var(--co)',marginBottom:16}}>Sydney's Wall Marketplace</div>
        <h1 className="au d1" style={{fontSize:'clamp(36px,5.5vw,60px)',fontWeight:700,lineHeight:0.98,letterSpacing:-2,marginBottom:20,opacity:0}}>
          Walls that{' '}<br/>
          <em style={{fontFamily:'var(--fd)',color:'var(--co)',fontStyle:'italic',fontWeight:400}}>speak</em> for<br/>
          your brand.
        </h1>
        <p className="au d2" style={{fontSize:16,color:'var(--mu)',lineHeight:1.7,maxWidth:420,marginBottom:32,opacity:0}}>
          Verified locations. Curated creative partners. Neighbourhood-first campaigns.
        </p>
        <div className="au d3" style={{display:'flex',gap:12,opacity:0}}>
          <Btn style={{padding:'14px 32px',fontSize:15,borderRadius:14}}>Browse Walls →</Btn>
          <Btn variant="secondary" style={{padding:'13px 28px',fontSize:15,borderRadius:14}}>List Your Wall</Btn>
        </div>
      </div>
      {/* Right: hero image(s) */}
      {hasImages && <div className="au d2" style={{position:'relative',borderRadius:20,overflow:'hidden',aspectRatio:'4/3',opacity:0}}>
        {images.map((url, i) => <div key={i} style={{
          position:'absolute',inset:0,
          backgroundImage:`url(${url})`,backgroundSize:'cover',backgroundPosition:'center',
          opacity:i === idx ? 1 : 0,transition:'opacity 1.5s ease-in-out',borderRadius:20
        }}/>)}
      </div>}
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
    <div style={{maxWidth:1400,margin:'0 auto',padding:isMob?'8px 16px 0':'0 24px'}}>
      <SuburbMarquee/>
      <HowItWorks/>
    </div>
    <div style={{maxWidth:1400,margin:'0 auto',padding:isMob?'0 16px 40px':'0 24px 52px'}}>
      <Card className="au d4" style={{padding:isMob?'10px 12px':'12px 16px',marginBottom:18,display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
        <div style={{flex:'1 1 140px',position:'relative'}}><span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--mu)',fontSize:13}}>🔍</span><input value={q} onChange={e=>sQ(e.target.value)} placeholder="Search walls..." style={{width:'100%',padding:'10px 12px 10px 34px',border:'1.5px solid var(--ln)',borderRadius:14,fontSize:13,outline:'none',background:'var(--wh)'}}/></div>
        {[{v:fN,s:sFN,p:'Suburb',o:hoods.map(n=>({v:n,l:n}))},{v:fT,s:sFT,p:'Traffic',o:TRAFFIC_LEVELS.map(t=>({v:t,l:t}))},{v:fA,s:sFA,p:'Avail',o:[{v:'available',l:'Available'},{v:'booked',l:'Booked'}]},{v:fC,s:sFC,p:'Council',o:COUNCILS.map(c=>({v:c,l:c}))},{v:sort,s:sS,p:'Sort',o:[{v:'pa',l:'Price ↑'},{v:'pd',l:'Price ↓'},{v:'sz',l:'Size ↓'}]}].map((fl,j)=><select key={j} value={fl.v} onChange={e=>fl.s(e.target.value)} style={{padding:'10px 10px',border:'1.5px solid var(--ln)',borderRadius:14,fontSize:12,cursor:'pointer',background:'var(--wh)',outline:'none',minWidth:isMob?70:95,flex:isMob?'1 1 70px':'0 0 auto'}}><option value="">{fl.p}</option>{fl.o.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select>)}
        <div style={{display:'flex',gap:2,padding:3,background:'var(--bg)',borderRadius:12,border:'1px solid var(--ln)',marginLeft:isMob?0:'auto'}}>
          {(isMob?[{id:'grid',l:'⊞ List'},{id:'map',l:'🗺️ Map'}]:[{id:'split',l:'🗺️ Split'},{id:'grid',l:'⊞ Grid'}]).map(v=><button key={v.id} onClick={()=>sView(v.id)} style={{padding:'6px 12px',borderRadius:10,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,background:view===v.id?'var(--wh)':'transparent',color:view===v.id?'var(--ink)':'var(--mu)',transition:'all .2s'}}>{v.l}</button>)}
        </div>
      </Card>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}><h2 style={{fontSize:isMob?20:24,fontWeight:700,letterSpacing:-0.5}}>Available Walls</h2><span className="mono" style={{fontSize:11,color:'var(--mu)'}}>{list.length} walls</span></div>

      {activeView==='split' ? (
        <div style={{display:'grid',gridTemplateColumns:'minmax(320px,1fr) 1fr',gap:18,alignItems:'start'}}>
          <div style={{maxHeight:'calc(100vh - 180px)',overflowY:'auto',display:'flex',flexDirection:'column',gap:10,paddingRight:6}}>
            {list.map(w => <Card key={w.id} onClick={()=>sSel(w)} onMouseEnter={()=>sHov(w.id)} onMouseLeave={()=>sHov(null)} style={{padding:14,display:'flex',gap:14,cursor:'pointer',border:hov===w.id?'1.5px solid var(--co)':'1px solid var(--ln)',position:'relative',transition:'border-color .2s'}}>
              <img src={w.primary_image_url || 'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=800&q=80'} alt="" style={{width:80,height:80,borderRadius:14,objectFit:'cover',flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <h4 style={{fontSize:14,fontWeight:600,marginBottom:3,letterSpacing:-0.2}}>{w.title}</h4>
                <div style={{fontSize:12,color:'var(--mu)',marginBottom:6}}>{w.neighborhood} · {w.sqm}sqm</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span className="mono" style={{fontSize:14,fontWeight:700,color:'var(--co)',letterSpacing:'0.02em',textTransform:'none'}}>{fmt(campPrice(w))}</span><span style={{fontSize:10,color:'var(--mu)'}}>/{w.duration_months}mo</span></div>
              </div>
            </Card>)}
          </div>
          <div style={{position:'sticky',top:74,height:'calc(100vh - 180px)',borderRadius:18,overflow:'hidden',border:'1px solid var(--ln)'}}><MapboxMap walls={list} onSelect={sSel} hoveredId={hov} onHover={sHov}/></div>
        </div>
      ) : activeView==='map' ? (
        <div style={{height:isMob?'calc(100vh - 260px)':'calc(100vh - 240px)',borderRadius:18,overflow:'hidden',border:'1px solid var(--ln)'}}><MapboxMap walls={list} onSelect={sSel} hoveredId={hov} onHover={sHov}/></div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:isMob?'1fr':'repeat(auto-fill,minmax(260px,1fr))',gap:isMob?12:18}}>{list.map(w=><WallCard key={w.id} wall={w} onClick={()=>sSel(w)}/>)}</div>
      )}
    </div>
    {sel && <WallModal wall={sel} onClose={()=>sSel(null)} onEnquire={w => { sSel(null); sEnq(w) }}/>}
    {enquiry && <EnquiryForm wall={enquiry} onClose={()=>sEnq(null)} toast={toast}/>}
  </div>
}
