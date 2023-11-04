import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import ProtectedRoute from './components/common/ProtectedRoute'
import { useAuthContext } from './context/AuthContext'
import { useEffect, useState } from 'react'
import AppLayout from './components/common/AppLayout'
import Profile from './pages/profile'

function App() {
  const { checkAuth } = useAuthContext()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authenticate = async () => {
      await checkAuth()
    }

    authenticate()
    setLoading(false)
  }, [checkAuth])

  if (loading) return <p>Loading...</p>

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path='' element={<Home />} />
          <Route path='profile' element={<Profile />} />
        </Route>
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
