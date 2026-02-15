import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom'
import { supabase } from './supabase'
import Nav from './components/Nav'
import Footer from './components/Footer'
import { Toast } from './components/ui'
import BrowsePage from './pages/BrowsePage'
import PartnersPage from './pages/PartnersPage'
import AboutPage from './pages/AboutPage'
import ListWallPage from './pages/ListWallPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toastMsg, setToast] = useState(null)
  const navigate = useNavigate()
  const toast = useCallback(m => setToast(m), [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    navigate('/')
  }

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'var(--fd)',fontSize:20,color:'var(--mu)'}}>Loading...</div>

  return (
    <>
      <Routes>
        <Route path="/" element={<><Nav session={session} logout={logout} /><BrowsePage toast={toast} /><Footer /></>} />
        <Route path="/list" element={<><Nav session={session} logout={logout} /><ListWallPage session={session} toast={toast} /><Footer /></>} />
        <Route path="/about" element={<><Nav session={session} logout={logout} /><AboutPage toast={toast} /><Footer /></>} />
        <Route path="/partners" element={<><Nav session={session} logout={logout} /><PartnersPage toast={toast} /><Footer /></>} />
        <Route path="/admin/login" element={session ? <Navigate to="/admin" /> : <AdminLogin toast={toast} />} />
        <Route path="/admin/*" element={session ? <AdminDashboard session={session} logout={logout} toast={toast} /> : <Navigate to="/admin/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {toastMsg && <Toast msg={toastMsg} onClose={() => setToast(null)} />}
    </>
  )
}
