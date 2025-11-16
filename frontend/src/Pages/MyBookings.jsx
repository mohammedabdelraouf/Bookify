import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../Context/AppContext.jsx';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
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

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setRating(0);
    setComment('');
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedBooking(null);
    setRating(0);
    setComment('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      alert('Comment must be at least 10 characters long');
      return;
    }

    if (comment.length > 500) {
      alert('Comment must be less than 500 characters');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to submit a review');
      navigate('/login');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookingId: selectedBooking.bookingId,
          rating: rating,
          comment: comment.trim()
        })
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        closeReviewModal();
        fetchMyBookings(); // Refresh bookings to update hasReview status
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'Failed to submit review'));
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canWriteReview = (booking) => {
    const token = localStorage.getItem('token');
    if (!token) return false; // User must be logged in

    if (booking.status !== 'Confirmed') return false; // Booking must be confirmed

    const checkoutDate = new Date(booking.checkOutDate);
    const now = new Date();
    if (checkoutDate > now) return false; // Checkout date must have passed

    if (booking.hasReview) return false; // User hasn't already reviewed

    return true;
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
                Booked on: {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              {canWriteReview(booking) && (
                <div className='mt-4 pt-4 border-t'>
                  <button
                    onClick={() => openReviewModal(booking)}
                    className='bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md'
                  >
                    Write Review
                  </button>
                </div>
              )}

              {booking.hasReview && (
                <div className='mt-4 pt-4 border-t'>
                  <p className='text-sm text-green-600 font-medium'>✓ You have reviewed this booking</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showReviewModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full p-6'>
            <h2 className='text-2xl font-bold mb-4'>Write a Review</h2>
            <p className='text-gray-600 mb-4'>
              {selectedBooking?.roomTypeName} - Room {selectedBooking?.roomNumber}
            </p>

            <form onSubmit={handleSubmitReview}>
              <div className='mb-4'>
                <label className='block text-sm font-semibold mb-2'>Rating *</label>
                <div className='flex gap-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type='button'
                      onClick={() => setRating(star)}
                      className={`text-3xl ${
                        star <= rating ? 'text-yellow-500' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className='text-sm text-gray-600 mt-1'>
                    {rating} star{rating > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className='mb-6'>
                <label className='block text-sm font-semibold mb-2'>
                  Comment * (10-500 characters)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder='Share your experience with this room...'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  rows='4'
                  required
                  minLength={10}
                  maxLength={500}
                />
                <p className='text-xs text-gray-500 mt-1'>
                  {comment.length}/500 characters
                </p>
              </div>

              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={closeReviewModal}
                  className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 rounded-lg transition-colors'
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={submitting || rating === 0 || comment.trim().length < 10}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
