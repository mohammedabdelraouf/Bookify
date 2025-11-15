import React from 'react'
import { useAppContext } from '../Context/AppContext.jsx'
import { Link, NavLink } from 'react-router-dom'

const NavBar = () => {
  const { loggedIn, logout } = useAppContext();
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  return (
    <div className='w-100 bg-teal-800 text-white flex flex-row px-5 md:px-20 align-middle py-4  justify-between items-center '>
      <h1 className='text-2xl font-bold'><Link to="/"> Bookify </Link></h1>
      <ul className='flex flex-row items-center gap-6 font-bold ms-auto'>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/rooms">Rooms</NavLink>
        </li>
        {loggedIn && userRole === 'Admin' && (
          <li>
            <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
          </li>
        )}
        {loggedIn && (
          <li>
            <NavLink to="/my-bookings">My Bookings</NavLink>
          </li>
        )}
        {!loggedIn && (
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
        )}
        {loggedIn && (
          <li className='flex items-center gap-4'>
            <span className='text-sm'>Welcome, {userName || 'User'}</span>
            <button
              onClick={logout}
              className='bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors'
            >
              Logout
            </button>
          </li>
        )}
        <li>
          <NavLink to='/about'>About</NavLink>
        </li>
        <li>
          <NavLink to='/contact'>Contact</NavLink>
        </li>
      </ul>
    </div>
  )
}

export default NavBar
