import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header'

function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default AppLayout
