import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../Context/AppContext'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Form submission will be implemented in next task
    console.log('Form submitted:', formData)
  }

  return (
    <div>
      <form className='flex w-[50%] mx-auto my-6' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 w-full p-10 border border-gray-300 rounded-md shadow-md'>
          <h2 className='text-2xl font-bold mb-4'>Create Your Account</h2>

          <input
            className='border-solid rounded-sm p-3'
            name="firstName"
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <input
            className='border-solid rounded-sm p-3'
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <input
            className='border-solid rounded-sm p-3'
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <input
            className='border-solid rounded-sm p-3'
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          <input
            className='border-solid rounded-sm p-3'
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          <button
            className='rounded text-center bg-green-400 p-2 text-white font-bold hover:bg-green-500 transition-colors'
            type="submit"
          >
            Register
          </button>

          <div style={{ fontSize: 12 }}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Register
