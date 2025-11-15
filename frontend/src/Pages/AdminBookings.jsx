import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../Context/AppContext.jsx';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchAllBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [statusFilter, bookings]);

  const fetchAllBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login as admin');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Failed to load bookings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    if (statusFilter === 'All') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.status === statusFilter));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Succeeded':
        return 'text-green-600';
      case 'Pending':
        return 'text-yellow-600';
      case 'Failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-xl'>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className='w-full h-screen overflow-y-auto bg-gray-100'>
      <div className='p-6'>
        {/* Header */}
        <div className='bg-white shadow-sm p-6 rounded-lg mb-6'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Bookings Management
          </h1>
          <p className='text-gray-600'>
            View and manage all hotel reservations
          </p>
        </div>

        {/* Filters and Stats */}
        <div className='bg-white shadow-sm p-6 rounded-lg mb-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            {/* Stats */}
            <div className='flex gap-6'>
              <div>
                <p className='text-sm text-gray-600'>Total Bookings</p>
                <p className='text-2xl font-bold text-gray-800'>{bookings.length}</p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Confirmed</p>
                <p className='text-2xl font-bold text-green-600'>
                  {bookings.filter(b => b.status === 'Confirmed').length}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Pending</p>
                <p className='text-2xl font-bold text-yellow-600'>
                  {bookings.filter(b => b.status === 'Pending').length}
                </p>
              </div>
            </div>

            {/* Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
              >
                <option value='All'>All Status</option>
                <option value='Pending'>Pending</option>
                <option value='Confirmed'>Confirmed</option>
                <option value='Cancelled'>Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className='bg-white shadow-sm rounded-lg overflow-hidden'>
          {filteredBookings.length === 0 ? (
            <div className='text-center py-10'>
              <p className='text-xl text-gray-600'>No bookings found</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Booking ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Room
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Check-in
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Check-out
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Amount
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.bookingId} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>
                          #{booking.bookingId}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {booking.roomTypeName}
                        </div>
                        <div className='text-xs text-gray-500'>
                          Room {booking.roomNumber} • Floor {booking.floor}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {new Date(booking.checkInDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {new Date(booking.checkOutDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        ${booking.totalCost}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className={`text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {booking.paymentMethod}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredBookings.length > 0 && (
          <div className='mt-6 bg-white shadow-sm p-6 rounded-lg'>
            <div className='flex justify-between items-center'>
              <p className='text-gray-600'>
                Showing {filteredBookings.length} of {bookings.length} bookings
              </p>
              <p className='text-lg font-bold text-gray-800'>
                Total Revenue: $
                {filteredBookings.reduce((sum, b) => sum + b.totalCost, 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
