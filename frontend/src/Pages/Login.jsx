import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext, API_BASE_URL } from '../Context/AppContext';
import Toast from '../Components/Toast';

const Login = () => {
  const navigate = useNavigate();
  const { setLoggedIn } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);
    const email = (data.get('email') || '').toString().trim();
    const password = (data.get('password') || '').toString();
    const remember = !!data.get('remember');

    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials. Please check your email and password.');
      }

      const json = await response.json();

      // Store token and user info in localStorage
      localStorage.setItem('token', json.token);
      localStorage.setItem('userEmail', json.email);
      localStorage.setItem('userName', json.firstName);
      localStorage.setItem('userRole', json.roles[0]);

      // Update AppContext state
      setLoggedIn(true);

      showToast('Login successful! Redirecting...', 'success');

      // Navigate after a brief delay to show success message
      setTimeout(() => {
        navigate('/rooms');
      }, 1000);

    } catch (err) {
      showToast(err.message || 'Network error. Please try again.', 'error');
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
              src='https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop'
              alt='Hotel Lobby'
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
              <h2 className='text-3xl font-bold mb-4'>Welcome Back!</h2>
              <p className='text-xl text-teal-100'>
                Sign in to continue your journey with us and discover amazing hotel experiences.
              </p>
            </div>
            <div className='space-y-4 text-teal-100'>
              <div className='flex items-center gap-3'>
                <svg className='w-6 h-6 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                </svg>
                <span>Secure booking platform</span>
              </div>
              <div className='flex items-center gap-3'>
                <svg className='w-6 h-6 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                </svg>
                <span>Best price guarantee</span>
              </div>
              <div className='flex items-center gap-3'>
                <svg className='w-6 h-6 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                </svg>
                <span>24/7 customer support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className='p-8 sm:p-12 flex flex-col justify-center'>
          <div className='mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>Sign In</h2>
            <p className='text-gray-600'>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleLogin} className='space-y-6'>
            {/* Email Input */}
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
                  autoComplete='email'
                  required
                  className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors'
                  placeholder='you@example.com'
                />
              </div>
            </div>

            {/* Password Input */}
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
                  autoComplete='current-password'
                  required
                  className='block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors'
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember'
                  name='remember'
                  type='checkbox'
                  className='h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer'
                />
                <label htmlFor='remember' className='ml-2 block text-sm text-gray-700 cursor-pointer'>
                  Remember me
                </label>
              </div>
              <Link to='/forgot' className='text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors'>
                Forgot password?
              </Link>
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
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>New to Bookify?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className='text-center'>
              <Link
                to='/signup'
                className='inline-flex items-center gap-2 font-medium text-teal-600 hover:text-teal-700 transition-colors'
              >
                Create an account
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

export default Login;
