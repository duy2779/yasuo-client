import { Outlet } from 'react-router-dom'
import Header from './header'

function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default AppLayout
