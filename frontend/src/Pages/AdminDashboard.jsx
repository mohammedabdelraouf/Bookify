import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { API_BASE_URL } from '../Context/AppContext.jsx';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    availableRooms: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);

  const userEmail = localStorage.getItem('userEmail') || 'Admin';
  const userName = localStorage.getItem('userName') || 'Admin';

  const navigationLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Bookings', path: '/admin/bookings', icon: '📅' },
    { name: 'Rooms', path: '/admin/rooms', icon: '🏨' },
    { name: 'Customers', path: '/admin/customers', icon: '👥' },
    { name: 'Payments', path: '/admin/payments', icon: '💰' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Fetch all data in parallel
      const [bookingsRes, roomsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/rooms`)
      ]);

      const bookingsData = await bookingsRes.json();
      const roomsData = await roomsRes.json();

      // Calculate statistics
      const totalBookings = bookingsData.length;
      const totalRevenue = bookingsData
        .filter(b => b.paymentStatus === 'Succeeded')
        .reduce((sum, b) => sum + b.totalCost, 0);

      // Count unique customers
      const uniqueEmails = new Set(bookingsData.map(b => b.userEmail));
      const totalCustomers = uniqueEmails.size;

      // Count available rooms
      const availableRooms = roomsData.filter(r => r.status === 'Available').length;

      // Get recent 5 bookings
      const recent = bookingsData
        .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
        .slice(0, 5);

      setStats({
        totalBookings,
        totalRevenue,
        totalCustomers,
        availableRooms
      });
      setRecentBookings(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Main Content Area */}
      <main className='flex-1 overflow-y-auto'>
        {/* Top Bar */}
        <header className='bg-white shadow-sm p-4 md:p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl md:text-3xl font-bold text-gray-800'>
                Dashboard
              </h2>
              <p className='text-gray-600 mt-1'>
                Welcome back, {userName}! Here's your hotel overview.
              </p>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className='p-4 md:p-6'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-600 text-sm font-medium'>
                    Total Bookings
                  </p>
                  <p className='text-3xl font-bold text-gray-800 mt-2'>
                    {loading ? '--' : stats.totalBookings}
                  </p>
                </div>
                <div className='text-4xl'>📅</div>
              </div>
              <p className='text-sm text-gray-500 mt-4'>
                All time bookings
              </p>
            </div>

            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-600 text-sm font-medium'>
                    Total Revenue
                  </p>
                  <p className='text-3xl font-bold text-green-600 mt-2'>
                    ${loading ? '--' : stats.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className='text-4xl'>💰</div>
              </div>
              <p className='text-sm text-gray-500 mt-4'>
                All time revenue
              </p>
            </div>

            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-600 text-sm font-medium'>
                    Total Customers
                  </p>
                  <p className='text-3xl font-bold text-blue-600 mt-2'>
                    {loading ? '--' : stats.totalCustomers}
                  </p>
                </div>
                <div className='text-4xl'>👥</div>
              </div>
              <p className='text-sm text-gray-500 mt-4'>
                Registered users
              </p>
            </div>

            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-600 text-sm font-medium'>
                    Available Rooms
                  </p>
                  <p className='text-3xl font-bold text-teal-600 mt-2'>
                    {loading ? '--' : stats.availableRooms}
                  </p>
                </div>
                <div className='text-4xl'>🏨</div>
              </div>
              <p className='text-sm text-gray-500 mt-4'>
                Ready to book
              </p>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
            <h3 className='text-xl font-bold text-gray-800 mb-4'>
              Recent Bookings
            </h3>
            {loading ? (
              <p className='text-gray-600'>Loading...</p>
            ) : recentBookings.length === 0 ? (
              <p className='text-gray-600'>No bookings yet</p>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Booking ID
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Customer
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Room
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Date
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Status
                      </th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {recentBookings.map((booking) => (
                      <tr key={booking.bookingId} className='hover:bg-gray-50'>
                        <td className='px-4 py-3 text-sm'>#{booking.bookingId}</td>
                        <td className='px-4 py-3 text-sm'>{booking.userEmail}</td>
                        <td className='px-4 py-3 text-sm'>{booking.roomTypeName} - {booking.roomNumber}</td>
                        <td className='px-4 py-3 text-sm'>
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </td>
                        <td className='px-4 py-3 text-sm'>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className='px-4 py-3 text-sm font-medium'>${booking.totalCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h3 className='text-xl font-bold text-gray-800 mb-4'>
              Quick Actions
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <NavLink
                to='/admin/bookings'
                className='p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all'
              >
                <div className='text-3xl mb-2'>📅</div>
                <h4 className='font-semibold text-gray-800'>Manage Bookings</h4>
                <p className='text-sm text-gray-600 mt-1'>
                  View and manage all reservations
                </p>
              </NavLink>

              <NavLink
                to='/admin/rooms'
                className='p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all'
              >
                <div className='text-3xl mb-2'>🏨</div>
                <h4 className='font-semibold text-gray-800'>Manage Rooms</h4>
                <p className='text-sm text-gray-600 mt-1'>
                  Add, edit, or update room status
                </p>
              </NavLink>

              <NavLink
                to='/admin/customers'
                className='p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all'
              >
                <div className='text-3xl mb-2'>👥</div>
                <h4 className='font-semibold text-gray-800'>View Customers</h4>
                <p className='text-sm text-gray-600 mt-1'>
                  See all registered customers
                </p>
              </NavLink>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
