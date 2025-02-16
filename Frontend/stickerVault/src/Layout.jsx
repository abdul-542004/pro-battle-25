import React from 'react'
import Header from './components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'

function Layout() {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideHeader && <Header />}
      <Outlet />
    </>
  )
}

export default Layout