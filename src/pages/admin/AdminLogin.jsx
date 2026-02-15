import { useState } from 'react'
import { supabase } from '../../supabase'
import { Btn, Inp } from '../../components/ui'

export default function AdminLogin({ toast }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async () => {
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
  }

  return <div style={{minHeight:'100vh',display:'flex',flexWrap:'wrap'}}>
    <div style={{flex:'1 1 340px',minWidth:280,background:'linear-gradient(135deg,#1A1A2E,#2D2B55,#3B2667)',padding:'60px 40px',display:'flex',flexDirection:'column',justifyContent:'center',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:-80,right:-80,width:300,height:300,borderRadius:'50%',background:'rgba(255,56,92,.08)',filter:'blur(60px)'}}/>
      <div style={{position:'relative',zIndex:1}}>
        <div className="au" style={{display:'flex',alignItems:'center',gap:9,marginBottom:32}}><span style={{fontSize:30}}>👋</span><span style={{fontFamily:'var(--fd)',fontSize:24,fontWeight:700,color:'var(--co)'}}>Hi Wall Admin</span></div>
        <h1 className="au d2" style={{fontFamily:'var(--fd)',fontSize:34,fontWeight:700,color:'#fff',lineHeight:1.12,marginBottom:14}}>Admin Control Panel</h1>
        <p className="au d3" style={{fontSize:15,color:'rgba(255,255,255,.55)',lineHeight:1.7,maxWidth:340}}>Manage wall listings, enquiries, and the marketplace.</p>
      </div>
    </div>
    <div style={{flex:'1 1 340px',display:'flex',alignItems:'center',justifyContent:'center',padding:'36px 24px'}}>
      <div style={{maxWidth:370,width:'100%'}}>
        <h2 className="au" style={{fontFamily:'var(--fd)',fontSize:22,fontWeight:700,marginBottom:4}}>Sign In</h2>
        <p className="au d1" style={{color:'var(--mu)',fontSize:14,marginBottom:26}}>Admin access only</p>
        {error && <div style={{background:'var(--rb)',color:'var(--rt)',padding:'8px 12px',borderRadius:10,fontSize:12,marginBottom:12}}>{error}</div>}
        <Inp label="Email" required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@hiwall.com.au"/>
        <Inp label="Password" required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
          onKeyDown={e => e.key === 'Enter' && login()}/>
        <Btn onClick={login} disabled={loading} style={{width:'100%',justifyContent:'center',padding:13,fontSize:15,marginTop:4,opacity:loading?.6:1}}>{loading ? 'Signing in...' : 'Sign In'}</Btn>
      </div>
    </div>
  </div>
}
