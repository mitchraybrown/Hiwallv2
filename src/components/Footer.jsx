import { Link } from 'react-router-dom'

export default function Footer() {
  return <footer style={{borderTop:'1px solid var(--ln)',padding:'36px 24px 28px',marginTop:48}}>
    <div style={{maxWidth:1400,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:20}}>
      <div>
        <div className="mono" style={{fontSize:20,lineHeight:0.95,display:'flex',flexDirection:'column',marginBottom:12,fontWeight:700,letterSpacing:'0.06em'}}>
          <span style={{color:'var(--ink)'}}>HI</span>
          <span style={{color:'var(--co)'}}>WALL</span>
        </div>
        <div className="mono" style={{fontSize:10,color:'var(--mu)'}}>Sydney's Wall Marketplace © 2026</div>
      </div>
      <div style={{display:'flex',gap:40}}>
        <div>
          <div className="mono" style={{fontSize:10,color:'var(--mu)',marginBottom:10}}>Marketplace</div>
          {[{to:'/',l:'Browse Walls'},{to:'/list',l:'List a Wall'},{to:'/partners',l:'Partners'}].map((n,i)=>
            <div key={i}><Link to={n.to} style={{fontSize:14,color:'var(--sl)',textDecoration:'none',lineHeight:2.2}}>{n.l}</Link></div>
          )}
        </div>
        <div>
          <div className="mono" style={{fontSize:10,color:'var(--mu)',marginBottom:10}}>Company</div>
          {[{to:'/about',l:'About'},{to:'/admin/login',l:'Admin'}].map((n,i)=>
            <div key={i}><Link to={n.to} style={{fontSize:14,color:'var(--sl)',textDecoration:'none',lineHeight:2.2}}>{n.l}</Link></div>
          )}
        </div>
      </div>
    </div>
  </footer>
}
