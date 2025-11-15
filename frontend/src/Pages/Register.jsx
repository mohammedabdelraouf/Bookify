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
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid'
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      // Success - show message and navigate to login
      alert('Registration successful! Please login with your credentials.')
      navigate('/login')

    } catch (error) {
      alert(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form className='flex w-[50%] mx-auto my-6' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 w-full p-10 border border-gray-300 rounded-md shadow-md'>
          <h2 className='text-2xl font-bold mb-4'>Create Your Account</h2>

          <div>
            <input
              className='border-solid rounded-sm p-3 w-full'
              name="firstName"
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <p className='text-red-600 text-sm mt-1'>{errors.firstName}</p>
            )}
          </div>

          <div>
            <input
              className='border-solid rounded-sm p-3 w-full'
              name="lastName"
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className='text-red-600 text-sm mt-1'>{errors.lastName}</p>
            )}
          </div>

          <div>
            <input
              className='border-solid rounded-sm p-3 w-full'
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && (
              <p className='text-red-600 text-sm mt-1'>{errors.email}</p>
            )}
          </div>

          <div>
            <input
              className='border-solid rounded-sm p-3 w-full'
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password && (
              <p className='text-red-600 text-sm mt-1'>{errors.password}</p>
            )}
          </div>

          <div>
            <input
              className='border-solid rounded-sm p-3 w-full'
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className='text-red-600 text-sm mt-1'>{errors.confirmPassword}</p>
            )}
          </div>

          <button
            className='rounded text-center bg-green-400 p-2 text-white font-bold hover:bg-green-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
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
