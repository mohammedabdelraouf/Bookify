import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const userEmail = localStorage.getItem('userEmail') || 'Admin';
  const userName = localStorage.getItem('userName') || 'Admin';

  const navigationLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Bookings', path: '/admin/bookings', icon: '📅' },
    { name: 'Rooms', path: '/admin/rooms', icon: '🏨' },
    { name: 'Customers', path: '/admin/customers', icon: '👥' },
    { name: 'Payments', path: '/admin/payments', icon: '💰' }
  ];

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className='p-4 border-b border-gray-700 flex items-center justify-between'>
          {sidebarOpen && (
            <h1 className='text-xl font-bold'>Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='text-white hover:text-gray-300 transition-colors'
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className='flex-1 py-4'>
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors ${
                  isActive ? 'bg-gray-700 border-l-4 border-teal-500' : ''
                }`
              }
            >
              <span className='text-2xl'>{link.icon}</span>
              {sidebarOpen && (
                <span className='font-medium'>{link.name}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className='p-4 border-t border-gray-700'>
            <p className='text-sm text-gray-400'>Logged in as:</p>
            <p className='text-sm font-semibold truncate'>{userName}</p>
            <p className='text-xs text-gray-500 truncate'>{userEmail}</p>
          </div>
        )}
      </aside>

      {/* Main Content Area - This is where child routes render */}
      <div className='flex-1 overflow-hidden'>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
