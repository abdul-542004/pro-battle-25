import React from 'react'
import Navbar from './components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'


function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/slider';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </>
  )
}

export default Layout