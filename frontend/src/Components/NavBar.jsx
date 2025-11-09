import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <div className='w-100 bg-teal-800 text-white flex flex-row  p-4 align-middle px-20'>
        <h1 className='text-2xl font-bold'><Link href="/"> Bookify </Link></h1>
        <ul className='flex flex-row justify-between  font-bold w-1/4  ms-auto'>
            <li><Link to="/"> Home</Link></li>
            <li><Link to="/rooms">Rooms</Link></li>
            <li><Link to="/login"> Login</Link></li>
        </ul>
      
    </div>
  )
}

export default NavBar
