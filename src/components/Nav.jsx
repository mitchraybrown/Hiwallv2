import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Btn } from './ui'

export default function Nav({ session, logout }) {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const links = [
    { to: '/', l: 'Browse Walls' },
    { to: '/list', l: 'List a Wall' },
    { to: '/about', l: 'About Us' },
    { to: '/partners', l: 'Partners' },
  ]
  if (session) links.push({ to: '/admin', l: 'Dashboard' })

  const close = () => setOpen(false)

  return <>
    <nav style={{background:'var(--wh)',borderBottom:'1px solid var(--ln)',position:'sticky',top:0,zIndex:100,padding:'0 16px'}}>
      <div style={{maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:56}}>
        <Link to="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:7}}>
          <span style={{fontSize:22}}>👋</span>
          <span style={{fontFamily:'var(--fd)',fontWeight:700,fontSize:18,color:'var(--co)'}}>Hi Wall</span>
        </Link>
        {/* Desktop */}
        <div className="desk" style={{display:'flex',alignItems:'center',gap:3}}>
          {links.map(n => <Link key={n.to} to={n.to} style={{padding:'6px 13px',borderRadius:8,textDecoration:'none',fontSize:13,fontWeight:loc.pathname===n.to?600:500,background:loc.pathname===n.to?'var(--col)':'transparent',color:loc.pathname===n.to?'var(--co)':'var(--sl)'}}>{n.l}</Link>)}
          {session
            ? <button onClick={logout} style={{marginLeft:8,background:'none',border:'none',color:'var(--mu)',cursor:'pointer',fontSize:12}}>Sign Out</button>
            : <div style={{display:'flex',gap:6,marginLeft:8}}>
                <Link to="/admin/login"><Btn variant="secondary" style={{padding:'7px 14px',fontSize:13}}>Log In</Btn></Link>
              </div>}
        </div>
        {/* Mobile hamburger */}
        <button className="mob" onClick={() => setOpen(!open)} style={{display:'none',background:'none',border:'none',cursor:'pointer',padding:8,flexDirection:'column',gap:4}}>
          <span style={{width:20,height:2,background:'var(--ink)',borderRadius:1,transition:'all .2s',transform:open?'rotate(45deg) translate(4px,4px)':'none'}}/>
          <span style={{width:20,height:2,background:'var(--ink)',borderRadius:1,opacity:open?0:1,transition:'opacity .15s'}}/>
          <span style={{width:20,height:2,background:'var(--ink)',borderRadius:1,transition:'all .2s',transform:open?'rotate(-45deg) translate(4px,-4px)':'none'}}/>
        </button>
      </div>
    </nav>
    {open && <div style={{position:'fixed',inset:0,zIndex:99,animation:'fi .15s'}} onClick={close}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.4)'}}/>
      <div onClick={e=>e.stopPropagation()} style={{position:'absolute',top:56,right:0,width:'75%',maxWidth:300,background:'var(--wh)',height:'calc(100vh - 56px)',boxShadow:'-4px 0 20px rgba(0,0,0,.1)',padding:'20px 16px',animation:'sr .2s ease',overflowY:'auto'}}>
        {links.map(n => <Link key={n.to} to={n.to} onClick={close} style={{display:'block',padding:'12px 10px',borderRadius:10,textDecoration:'none',fontSize:15,fontWeight:loc.pathname===n.to?600:400,background:loc.pathname===n.to?'var(--col)':'transparent',color:loc.pathname===n.to?'var(--co)':'var(--ink)',marginBottom:2}}>{n.l}</Link>)}
        <div style={{borderTop:'1px solid var(--ln)',marginTop:12,paddingTop:12}}>
          {session
            ? <button onClick={() => { logout(); close() }} style={{display:'block',width:'100%',textAlign:'left',padding:'12px 10px',borderRadius:10,border:'none',cursor:'pointer',fontSize:15,color:'var(--rd)',background:'transparent'}}>Sign Out</button>
            : <Link to="/admin/login" onClick={close}><Btn style={{width:'100%',justifyContent:'center',padding:13}}>Log In</Btn></Link>}
        </div>
      </div>
    </div>}
  </>
}
