import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Btn } from './ui'

export default function Nav({ session, logout }) {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const links = [
    { to: '/', l: 'Browse' },
    { to: '/list', l: 'List a Wall' },
    { to: '/about', l: 'About' },
    { to: '/partners', l: 'Partners' },
  ]
  if (session) links.push({ to: '/admin', l: 'Dashboard' })

  const close = () => setOpen(false)

  return <>
    <nav style={{background:'rgba(250,250,248,0.88)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--ln)',position:'sticky',top:0,zIndex:100,padding:'0 20px'}}>
      <div style={{maxWidth:1400,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:60}}>
        <Link to="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:3}}>
          <span className="mono" style={{fontSize:20,lineHeight:0.95,display:'flex',flexDirection:'column',letterSpacing:'0.06em',fontWeight:700}}>
            <span style={{color:'var(--ink)'}}>HI</span>
            <span style={{color:'var(--co)'}}>WALL</span>
          </span>
        </Link>
        {/* Desktop */}
        <div className="desk" style={{display:'flex',alignItems:'center',gap:4}}>
          {links.map(n => <Link key={n.to} to={n.to} style={{padding:'7px 14px',borderRadius:20,textDecoration:'none',fontSize:13,fontWeight:loc.pathname===n.to?600:500,background:loc.pathname===n.to?'var(--col)':'transparent',color:loc.pathname===n.to?'var(--co)':'var(--sl)',transition:'all .2s'}}>{n.l}</Link>)}
          {session
            ? <button onClick={logout} style={{marginLeft:8,background:'none',border:'none',color:'var(--mu)',cursor:'pointer',fontSize:12}}>Sign Out</button>
            : <div style={{marginLeft:10}}>
                <Link to="/admin/login"><Btn variant="secondary" style={{padding:'8px 18px',fontSize:13,borderRadius:20}}>Log In</Btn></Link>
              </div>}
        </div>
        {/* Mobile hamburger */}
        <button className="mob" onClick={() => setOpen(!open)} style={{display:'none',background:'none',border:'none',cursor:'pointer',padding:8,flexDirection:'column',gap:5}}>
          <span style={{width:22,height:2,background:'var(--ink)',borderRadius:2,transition:'all .2s',transform:open?'rotate(45deg) translate(5px,5px)':'none'}}/>
          <span style={{width:22,height:2,background:'var(--ink)',borderRadius:2,opacity:open?0:1,transition:'opacity .15s'}}/>
          <span style={{width:22,height:2,background:'var(--ink)',borderRadius:2,transition:'all .2s',transform:open?'rotate(-45deg) translate(5px,-5px)':'none'}}/>
        </button>
      </div>
    </nav>
    {open && <div style={{position:'fixed',inset:0,zIndex:99,animation:'fi .15s'}} onClick={close}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.3)'}}/>
      <div onClick={e=>e.stopPropagation()} style={{position:'absolute',top:60,right:0,width:'80%',maxWidth:320,background:'var(--wh)',height:'calc(100vh - 60px)',boxShadow:'-4px 0 24px rgba(0,0,0,.08)',padding:'24px 20px',animation:'sr .2s ease',overflowY:'auto',borderRadius:'20px 0 0 0'}}>
        {links.map(n => <Link key={n.to} to={n.to} onClick={close} style={{display:'block',padding:'14px 14px',borderRadius:14,textDecoration:'none',fontSize:16,fontWeight:loc.pathname===n.to?600:400,background:loc.pathname===n.to?'var(--col)':'transparent',color:loc.pathname===n.to?'var(--co)':'var(--ink)',marginBottom:2}}>{n.l}</Link>)}
        <div style={{borderTop:'1px solid var(--ln)',marginTop:16,paddingTop:16}}>
          {session
            ? <button onClick={() => { logout(); close() }} style={{display:'block',width:'100%',textAlign:'left',padding:'14px',borderRadius:14,border:'none',cursor:'pointer',fontSize:16,color:'var(--rd)',background:'transparent'}}>Sign Out</button>
            : <Link to="/admin/login" onClick={close}><Btn style={{width:'100%',justifyContent:'center',padding:14,borderRadius:14}}>Log In</Btn></Link>}
        </div>
      </div>
    </div>}
  </>
}
