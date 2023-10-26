import { ApolloClient, ApolloLink, InMemoryCache, concat, createHttpLink } from '@apollo/client'
import { getJwtToken } from './jwt'

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

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache()
})

export default client
