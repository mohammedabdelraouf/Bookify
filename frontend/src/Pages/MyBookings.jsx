import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../Context/AppContext.jsx';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to view your bookings');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Failed to load bookings: ' + error.message);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-xl'>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className='w-[90%] md:w-[80%] mx-auto my-10'>
      <h1 className='text-3xl font-bold mb-8'>My Bookings</h1>

      {bookings.length === 0 ? (
        <div className='text-center py-10'>
          <p className='text-xl text-gray-600 mb-4'>You don't have any bookings yet.</p>
          <button
            onClick={() => navigate('/rooms')}
            className='bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors'
          >
            Browse Rooms
          </button>
        </div>
      ) : (
        <div className='grid gap-6'>
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className='bg-white rounded-lg shadow-lg p-6 border border-gray-200'
            >
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h2 className='text-xl font-bold'>
                    {booking.roomTypeName} - Room {booking.roomNumber}
                  </h2>
                  <p className='text-gray-600'>Booking ID: #{booking.bookingId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className='grid md:grid-cols-2 gap-4 mb-4'>
                <div>
                  <p className='text-sm text-gray-600'>Check-in</p>
                  <p className='font-semibold'>
                    {new Date(booking.checkInDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Check-out</p>
                  <p className='font-semibold'>
                    {new Date(booking.checkOutDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className='border-t pt-4 mt-4'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-sm text-gray-600'>Total Amount</p>
                    <p className='text-2xl font-bold text-green-600'>${booking.totalAmount}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-gray-600'>Payment Status</p>
                    <p className={`font-semibold ${booking.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {booking.paymentStatus}
                    </p>
                  </div>
                </div>
                {booking.paymentMethod && (
                  <p className='text-sm text-gray-600 mt-2'>
                    Payment Method: {booking.paymentMethod}
                  </p>
                )}
              </div>

              <div className='mt-4 text-sm text-gray-500'>
                Booked on: {new Date(booking.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
