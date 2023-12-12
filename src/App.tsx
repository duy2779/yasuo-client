import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/common/ProtectedRoute'
import { useAuthContext } from './context/AuthContext'
import AppLayout from './layouts/AppLayout'
import CreatePost from './pages/CreateGroup'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import { theme } from './theme'

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
    <MantineProvider theme={theme} defaultColorScheme='dark'>
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
          <Route path='create-group' element={<CreatePost />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
