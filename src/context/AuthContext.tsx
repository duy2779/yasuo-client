import { Dispatch, ReactNode, SetStateAction, createContext, useCallback, useContext, useMemo, useState } from 'react'
import { APP_CONSTANT } from '~/types/constant'
import { getJwtToken } from '~/utils/jwt'

interface IAuthContext {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  checkAuth: () => Promise<void>
  logoutClient: () => void
}

const defaultIsAuthenticated = false

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: defaultIsAuthenticated,
  setIsAuthenticated: () => {},
  checkAuth: () => Promise.resolve(),
  logoutClient: () => {}
})

export const useAuthContext = () => useContext(AuthContext)

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(defaultIsAuthenticated)

  const checkAuth = useCallback(async () => {
    const token = getJwtToken()

    if (token) setIsAuthenticated(true)
  }, [])

  const logoutClient = () => {
    sessionStorage.removeItem(APP_CONSTANT.JWT)
    setIsAuthenticated(false)
  }

  const authContextData = {
    isAuthenticated,
    setIsAuthenticated,
    checkAuth,
    logoutClient
  }

  const authProviderData: any = useMemo(() => authContextData, [authContextData])

  return <AuthContext.Provider value={authProviderData}>{children} </AuthContext.Provider>
}

export default AuthContextProvider
