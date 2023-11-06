import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '~/context/AuthContext'

interface Props {
  children: ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuthContext()
  if (!isAuthenticated) {
    return <Navigate to='/login' />
  }
  return children
}

export default ProtectedRoute
