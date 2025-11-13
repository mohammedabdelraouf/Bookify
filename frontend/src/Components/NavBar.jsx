import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const NavBar = () => {
  return (
    <div className='w-100 bg-teal-800 text-white flex flex-row  p-4 align-middle px-20'>
      <h1 className='text-2xl font-bold'><Link href="/"> Bookify </Link></h1>
      <ul className='flex flex-row justify-between  font-bold w-1/4  ms-auto'>
        <NavLink to="/">
          <p>Home</p>
          <hr className='border-red-950  border-2 hidden' />
        </NavLink>
        <NavLink to="/rooms">
          <p>Rooms</p>
          <hr className='border-red-950  border-2 hidden' />
        </NavLink>
        <NavLink to="/login">
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
