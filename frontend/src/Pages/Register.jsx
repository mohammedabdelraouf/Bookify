import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../Context/AppContext';
import Toast from '../Components/Toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

    return {
      strength,
      label: labels[strength],
      color: colors[strength],
      percentage: (strength / 5) * 100
    };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setIsLoading(true);

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
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Success
      showToast('Registration successful! Redirecting to login...', 'success');

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      showToast(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className='max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden grid lg:grid-cols-2'>
        {/* Left Side - Hero Image */}
        <div className='hidden lg:block relative bg-teal-600'>
          <div className='absolute inset-0'>
            <img
              src='https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop'
              alt='Hotel Room'
              className='w-full h-full object-cover opacity-90'
            />
          </div>
          <div className='absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-800 opacity-90'></div>
          <div className='relative h-full flex flex-col justify-center p-12 text-white'>
            <div className='mb-8'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='bg-white text-teal-800 rounded-lg p-3'>
                  <svg className='w-8 h-8' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
                  </svg>
                </div>
                <h1 className='text-4xl font-bold'>Bookify</h1>
              </div>
              <h2 className='text-3xl font-bold mb-4'>Join Us Today!</h2>
              <p className='text-xl text-teal-100'>
                Create an account and start booking your dream stays at the best hotels.
              </p>
            </div>
            <div className='space-y-4 text-teal-100'>
              <div className='flex items-center gap-3'>
                <svg className='w-6 h-6 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                </svg>
                <span>Exclusive member discounts</span>
              </div>
              <div className='flex items-center gap-3'>
                <svg className='w-6 h-6 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                </svg>
                <span>Easy booking management</span>
              </div>
              <div className='flex items-center gap-3'>
                <svg className='w-6 h-6 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                </svg>
                <span>Priority customer support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className='p-8 sm:p-12 flex flex-col justify-center'>
          <div className='mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>Create Account</h2>
            <p className='text-gray-600'>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* First Name & Last Name */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label htmlFor='firstName' className='block text-sm font-medium text-gray-700 mb-2'>
                  First Name
                </label>
                <input
                  id='firstName'
                  name='firstName'
                  type='text'
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`block w-full px-3 py-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors`}
                  placeholder='John'
                />
                {errors.firstName && (
                  <p className='text-red-600 text-xs mt-1'>{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor='lastName' className='block text-sm font-medium text-gray-700 mb-2'>
                  Last Name
                </label>
                <input
                  id='lastName'
                  name='lastName'
                  type='text'
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`block w-full px-3 py-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors`}
                  placeholder='Doe'
                />
                {errors.lastName && (
                  <p className='text-red-600 text-xs mt-1'>{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                  </svg>
                </div>
                <input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete='email'
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors`}
                  placeholder='you@example.com'
                />
              </div>
              {errors.email && (
                <p className='text-red-600 text-xs mt-1'>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                  </svg>
                </div>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete='new-password'
                  className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors`}
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center hover:text-teal-600 transition-colors'
                >
                  {showPassword ? (
                    <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                    </svg>
                  ) : (
                    <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='text-red-600 text-xs mt-1'>{errors.password}</p>
              )}

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className='mt-2'>
                  <div className='flex justify-between items-center mb-1'>
                    <span className='text-xs text-gray-600'>Password strength:</span>
                    <span className={`text-xs font-semibold ${passwordStrength.strength >= 3 ? 'text-green-600' : 'text-gray-600'}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.percentage}%` }}
                    ></div>
                  </div>
                  <div className='mt-2 text-xs text-gray-500 space-y-1'>
                    <p className={formData.password.length >= 6 ? 'text-green-600' : ''}>
                      • At least 6 characters
                    </p>
                    <p className={/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                      • Mix of uppercase and lowercase letters
                    </p>
                    <p className={/\d/.test(formData.password) ? 'text-green-600' : ''}>
                      • At least one number
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                Confirm Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                  </svg>
                </div>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete='new-password'
                  className={`block w-full pl-10 pr-10 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors`}
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center hover:text-teal-600 transition-colors'
                >
                  {showConfirmPassword ? (
                    <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                    </svg>
                  ) : (
                    <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-red-600 text-xs mt-1'>{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <>
                  <svg className='animate-spin h-5 w-5 text-white' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Divider */}
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <div className='text-center'>
              <Link
                to='/login'
                className='inline-flex items-center gap-2 font-medium text-teal-600 hover:text-teal-700 transition-colors'
              >
                Sign in instead
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                </svg>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
