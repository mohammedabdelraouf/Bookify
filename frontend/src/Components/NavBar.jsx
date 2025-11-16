import { useState } from 'react';
import { useAppContext } from '../Context/AppContext.jsx';
import { Link, NavLink } from 'react-router-dom';

const NavBar = () => {
  const { loggedIn, logout } = useAppContext();
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className='bg-teal-800 text-white shadow-lg sticky top-0 z-50'>
      <div className='container mx-auto px-4 md:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link to="/" className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
            <div className='bg-white text-teal-800 rounded-lg p-2'>
              <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
              </svg>
            </div>
            <span className='text-2xl font-bold'>Bookify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-1'>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-teal-700 text-white'
                    : 'hover:bg-teal-700 text-white'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-teal-700 text-white'
                    : 'hover:bg-teal-700 text-white'
                }`
              }
            >
              Rooms
            </NavLink>
            {loggedIn && (
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-teal-700 text-white'
                      : 'hover:bg-teal-700 text-white'
                  }`
                }
              >
                My Bookings
              </NavLink>
            )}
            {loggedIn && userRole === 'Admin' && (
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-teal-700 text-white'
                      : 'hover:bg-teal-700 text-white'
                  }`
                }
              >
                Admin
              </NavLink>
            )}
          </div>

          {/* User Section / Login */}
          <div className='hidden md:flex items-center gap-4'>
            {!loggedIn ? (
              <Link
                to="/login"
                className='bg-white text-teal-800 px-6 py-2 rounded-lg font-semibold hover:bg-teal-50 transition-colors'
              >
                Login
              </Link>
            ) : (
              <div className='relative'>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className='flex items-center gap-3 bg-teal-700 hover:bg-teal-600 px-4 py-2 rounded-lg transition-colors'
                >
                  <div className='w-8 h-8 bg-white text-teal-800 rounded-full flex items-center justify-center font-bold text-sm'>
                    {getInitials(userName)}
                  </div>
                  <span className='font-medium'>{userName || 'User'}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 text-gray-800'>
                    <div className='px-4 py-2 border-b border-gray-200'>
                      <p className='text-sm text-gray-600'>Signed in as</p>
                      <p className='font-semibold truncate'>{userName}</p>
                    </div>
                    <Link
                      to="/my-bookings"
                      className='block px-4 py-2 hover:bg-gray-100 transition-colors'
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>
                    {userRole === 'Admin' && (
                      <Link
                        to="/admin/dashboard"
                        className='block px-4 py-2 hover:bg-gray-100 transition-colors'
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className='w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors border-t border-gray-200 mt-2'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden p-2 rounded-lg hover:bg-teal-700 transition-colors'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              {mobileMenuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className='md:hidden pb-4 border-t border-teal-700 mt-2'>
            <div className='flex flex-col gap-2 mt-4'>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all ${
                    isActive ? 'bg-teal-700' : 'hover:bg-teal-700'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/rooms"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all ${
                    isActive ? 'bg-teal-700' : 'hover:bg-teal-700'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Rooms
              </NavLink>
              {loggedIn && (
                <NavLink
                  to="/my-bookings"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all ${
                      isActive ? 'bg-teal-700' : 'hover:bg-teal-700'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </NavLink>
              )}
              {loggedIn && userRole === 'Admin' && (
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all ${
                      isActive ? 'bg-teal-700' : 'hover:bg-teal-700'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </NavLink>
              )}
              {!loggedIn ? (
                <Link
                  to="/login"
                  className='bg-white text-teal-800 px-4 py-2 rounded-lg font-semibold hover:bg-teal-50 transition-colors text-center mt-2'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <div className='border-t border-teal-700 mt-2 pt-2'>
                  <div className='px-4 py-2 text-sm text-teal-200'>
                    Signed in as <span className='font-semibold text-white'>{userName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors mt-2'
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
