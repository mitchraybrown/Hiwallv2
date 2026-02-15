import { Link } from 'react-router-dom'

export default function Footer() {
  return <footer style={{background:'var(--ink)',padding:'28px 24px 22px',marginTop:40}}>
    <div style={{maxWidth:1200,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
      <div style={{display:'flex',alignItems:'center',gap:7}}>
        <span style={{fontSize:18}}>👋</span>
        <span style={{fontFamily:'var(--fd)',fontWeight:700,fontSize:16,color:'var(--co)'}}>Hi Wall</span>
        <span style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>© 2026</span>
      </div>
      <div style={{display:'flex',gap:14,alignItems:'center'}}>
        <Link to="/about" style={{fontSize:12,color:'rgba(255,255,255,.4)',textDecoration:'none'}}>About</Link>
        <Link to="/partners" style={{fontSize:12,color:'rgba(255,255,255,.4)',textDecoration:'none'}}>Partners</Link>
        <Link to="/admin/login" style={{fontSize:12,color:'rgba(255,255,255,.25)',textDecoration:'none',fontStyle:'italic'}}>Admin</Link>
      </div>
    </div>
  </footer>
}
