import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { TokenRefreshLink } from 'apollo-link-token-refresh'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { APP_CONSTANT } from '~/types/constant'
import { getJwtToken, setJwtToken } from './jwt'
import { useAuthContext } from '~/context/AuthContext'

export default function CustomApolloProvider(props: any) {
  const { logoutClient } = useAuthContext()

  const httpLink = createHttpLink({
    uri: 'http://localhost:8888/yasuo/graphql',
    credentials: 'include'
  })

  const getHeaders = () => {
    const headers: any = {}
    const token = getJwtToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
    return headers
  }

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...getHeaders()
      }
    }))

    return forward(operation)
  })

  const refreshTokenLink = new TokenRefreshLink({
    isTokenValidOrUndefined: async () => {
      const token = getJwtToken()

      if (!token) return true

      const claims: JwtPayload = jwtDecode(token)
      const expirationTimeInSeconds = (claims.exp as number) * 1000
      const now = new Date()
      const isValid = expirationTimeInSeconds >= now.getTime()

      return isValid
    },
    fetchAccessToken: async () => {
      const jwt: any = jwtDecode(getJwtToken() as string)
      const userFingerprintHash = jwt?.['fgp']
      const request = await fetch('http://localhost:8888/yasuo/graphql', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
              query refreshToken($userFingerprintHash: String!) {
                refreshToken(userFingerprintHash: $userFingerprintHash) {
                  accessToken
                }
              }
            `,
          variables: {
            userFingerprintHash
          }
        })
      })

      const result = await request.json()
      return result
    },
    handleFetch: (accessToken) => {
      setJwtToken(accessToken)
    },
    handleResponse: () => (response: any) => {
      return { access_token: response?.data?.refreshToken?.accessToken || null }
    },
    handleError: (err) => {
      console.warn('Your refresh token is invalid. Try to reauthenticate.')
      console.error(err)
      logoutClient()
    }
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      )
    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  const client = new ApolloClient({
    link: from([errorLink, refreshTokenLink, authMiddleware, httpLink]),
    cache: new InMemoryCache()
  })
  return <ApolloProvider client={client} {...props} />
}
