import React, { useContext } from 'react'
import { useState } from 'react'
import { AppContext } from '../Context/AppContext.jsx'
import { Link, NavLink } from 'react-router-dom'

const NavBar = () => {
  const loggedIn = useContext(AppContext);
  return (
    <div className='w-100 bg-teal-800 text-white flex flex-row px-5 md:px-20 align-middle py-4  justify-between items-center '>
      <h1 className='text-2xl font-bold'><Link to="/"> Bookify </Link></h1>
      <ul className='flex flex-row justify-between  font-bold w-2/3 lg:w-1/3  ms-auto'>
        <NavLink to="/">
          <p>Home</p>
          <hr className='border-red-950  border-2 hidden' />
        </NavLink>
        <NavLink to="/rooms">
          <p>Rooms</p>
          <hr className='border-red-950  border-2 hidden' />
        </NavLink>
        <NavLink className={loggedIn? 'hidden': 'block'} to="/login">
          <p>Login</p>
          <hr className='border-red-950  border-2 hidden' />
        </NavLink>
        <NavLink to='/about'>
          <p>About</p>
          <hr className='border-red-950  border-2 hidden' />
        </NavLink>
        <NavLink to='/contact'>
          <p>Contact</p>
          <hr className='border-red-950  border-2 hidden' />
        </NavLink>
      </ul>
    </div>
  )
}

export default NavBar
