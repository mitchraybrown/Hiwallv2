import { useEffect } from 'react'

export function Badge({ status }) {
  const colors = {
    approved: { bg:'var(--gb)',tx:'var(--gt)',dot:'var(--gn)' },
    pending:  { bg:'var(--ab)',tx:'var(--at)',dot:'var(--am)' },
    denied:   { bg:'var(--rb)',tx:'var(--rt)',dot:'var(--rd)' },
    booked:   { bg:'var(--bb)',tx:'var(--bt)',dot:'var(--bl)' },
    new:      { bg:'var(--bb)',tx:'var(--bt)',dot:'var(--bl)' },
  }
  const c = colors[status] || colors.pending
  return <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:.4,background:c.bg,color:c.tx}}><span style={{width:6,height:6,borderRadius:'50%',background:c.dot}}/>{status}</span>
}

export function Btn({ children, variant='primary', style:sx, ...p }) {
  const base = {border:'none',borderRadius:10,fontWeight:600,fontSize:14,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:8,transition:'all .2s',lineHeight:1}
  const variants = {
    primary:   {...base,background:'var(--co)',color:'#fff',padding:'11px 22px'},
    secondary: {...base,background:'var(--wh)',color:'var(--ink)',padding:'10px 20px',border:'1.5px solid var(--ln)'},
    ghost:     {...base,background:'transparent',color:'var(--sl)',padding:'8px 14px'},
    danger:    {...base,background:'var(--rb)',color:'var(--rt)',padding:'10px 18px',border:'1px solid #FCA5A5'},
    success:   {...base,background:'var(--gb)',color:'var(--gt)',padding:'10px 18px',border:'1px solid #6EE7B7'},
  }
  return <button style={{...variants[variant],...sx}} {...p}>{children}</button>
}

export function Inp({ label, error, required, style:sx, inputStyle, ...p }) {
  const s = {width:'100%',padding:'10px 13px',border:`1.5px solid ${error?'var(--co)':'var(--ln)'}`,borderRadius:10,fontSize:14,color:'var(--ink)',background:'var(--wh)',outline:'none',...inputStyle}
  return <div style={{marginBottom:15,...sx}}>
    {label && <label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:4}}>{label}{required && <span style={{color:'var(--co)'}}> *</span>}</label>}
    {p.type==='textarea' ? <textarea {...p} type={undefined} style={{...s,resize:'vertical'}} rows={p.rows||3}/> : p.type==='select' ? <select {...p} type={undefined} style={{...s,cursor:'pointer'}}>{p.children}</select> : <input {...p} style={s}/>}
    {error && <span style={{fontSize:11,color:'var(--co)',marginTop:2,display:'block'}}>{error}</span>}
  </div>
}

export function Card({ children, style:sx, className='', ...p }) {
  return <div className={className} style={{background:'var(--wh)',borderRadius:'var(--rl)',border:'1px solid var(--ln)',boxShadow:'0 1px 3px rgba(0,0,0,.06)',...sx}} {...p}>{children}</div>
}

export function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  return <div style={{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:'var(--ink)',color:'#fff',padding:'12px 24px',borderRadius:12,fontWeight:500,fontSize:14,zIndex:9999,animation:'fu .3s',boxShadow:'0 12px 40px rgba(0,0,0,.12)',display:'flex',alignItems:'center',gap:9}}><span style={{color:'var(--gn)'}}>✓</span>{msg}</div>
}

export function Overlay({ children, onClose }) {
  return <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',backdropFilter:'blur(4px)',zIndex:1000,display:'flex',justifyContent:'center',alignItems:'flex-start',padding:'40px 20px',overflowY:'auto',animation:'fi .2s'}}><div onClick={e => e.stopPropagation()} style={{animation:'si .3s'}}>{children}</div></div>
}

export function Toggle({ checked, onChange, label }) {
  return <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',fontSize:14}}>
    <div onClick={() => onChange(!checked)} style={{width:38,height:20,borderRadius:10,background:checked?'var(--co)':'var(--ln)',position:'relative',transition:'background .2s',flexShrink:0}}>
      <div style={{width:16,height:16,borderRadius:'50%',background:'#fff',position:'absolute',top:2,left:checked?20:2,transition:'left .2s',boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}/>
    </div>{label}
  </label>
}

export function Spinner() {
  return <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:40}}><div style={{width:28,height:28,border:'3px solid var(--ln)',borderTopColor:'var(--co)',borderRadius:'50%',animation:'spin .6s linear infinite'}}/></div>
}
