import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import AuthContextProvider from './context/AuthContext.tsx'
import CustomApolloProvider from './utils/CustomApolloProvider.tsx'

if (typeof window !== 'undefined') {
  if (!sessionStorage.length) {
    localStorage.setItem('getSessionStorage', String(Date.now()))
  }

  window.addEventListener('storage', (event) => {
    if (event.key == 'getSessionStorage') {
      localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage))
      localStorage.removeItem('sessionStorage')
    } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
      const data = JSON.parse(event.newValue as string)
      for (let key in data) {
        sessionStorage.setItem(key, data[key])
      }
    }
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthContextProvider>
    <CustomApolloProvider>
      <App />
    </CustomApolloProvider>
  </AuthContextProvider>
)
