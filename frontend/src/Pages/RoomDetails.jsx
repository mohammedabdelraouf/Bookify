import React from 'react'
import assets from '../assets/assets'
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react'
import { AppContext, API_BASE_URL, useAppContext } from '../Context/AppContext.jsx';


const RoomDetails = () => {

    const { RoomId } = useParams();
    const { rooms } = useContext(AppContext);
    const [roomData, setRoomData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userBookingId, setUserBookingId] = useState(null);
    const [canReview, setCanReview] = useState(false);
    const navigate = useNavigate();

    const fetchRoomData = async () => {
      const room = rooms.find((item) => item.id === parseInt(RoomId));
      if (room) {
        setRoomData(room);
        setCurrentImageIndex(0);
      }
    }

    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/reviews/room/${RoomId}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }

    const checkUserBooking = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const bookings = await response.json();
          const confirmedBooking = bookings.find(b =>
            b.roomId === parseInt(RoomId) &&
            b.bookingStatus === 'Confirmed'
          );

          if (confirmedBooking) {
            setUserBookingId(confirmedBooking.bookingId);
            setCanReview(true);
          }
        }
      } catch (err) {
        console.error('Error checking bookings:', err);
      }
    };

    useEffect(() => {
      fetchRoomData();
      fetchReviews();
      checkUserBooking();
    }, [RoomId, rooms])

    const validateBookingDates = () => {
      if (!checkInDate || !checkOutDate) {
        alert('Please select check-in and check-out dates');
        return false;
      }

      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        alert('Check-in date cannot be in the past');
        return false;
      }

      if (checkOut <= checkIn) {
        alert('Check-out date must be after check-in date');
        return false;
      }

      return true;
    };

    const handleBooking = async () => {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to book a room');
        navigate('/login');
        return;
      }

      // Validate dates
      if (!validateBookingDates()) return;

      // Prepare booking data
      const bookingData = {
        roomId: parseInt(RoomId),
        checkInDate: checkInDate,
        checkOutDate: checkOutDate
      };

      setIsBooking(true);

      try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Booking failed');
        }

        const result = await response.json();

        // Show success message
        alert('Booking created successfully!');

        // Navigate to payment page with booking data
        navigate(`/rooms/${RoomId}/payment`, {
          state: {
            bookingId: result.bookingId,
            roomNumber: roomData.number,
            checkInDate,
            checkOutDate,
            totalAmount: result.totalAmount
          }
        });

        // Clear form
        setCheckInDate('');
        setCheckOutDate('');

      } catch (error) {
        alert('Booking failed: ' + error.message);
      } finally {
        setIsBooking(false);
      }
    };

    const handleSubmitReview = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to submit a review');
        navigate('/login');
        return;
      }

      if (!comment.trim()) {
        alert('Please write a comment');
        return;
      }

      if (!userBookingId) {
        alert('You must have a confirmed booking to review this room');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            bookingId: userBookingId,
            rating: parseInt(rating),
            comment: comment
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Review submission failed');
        }

        alert('Review submitted successfully!');
        setComment('');
        setRating(5);
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews list

      } catch (error) {
        alert('Failed to submit review: ' + error.message);
      }
    };

  if (!roomData) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-xl'>Loading room details...</p>
      </div>
    );
  }

  const currentImage = roomData.images[currentImageIndex]?.url || assets.room1;
  const totalImages = roomData.images.length;

  return (
    <>
    <section className='w-[80%] mx-auto my-10'>
      {/* Image Gallery */}
      <div className='mb-8'>
        {/* Main Image */}
        <div className='relative mb-4'>
          <img
            className='w-full h-96 object-cover shadow-xl rounded-md'
            src={currentImage}
            alt={`Room ${roomData.number} - Image ${currentImageIndex + 1}`}
          />
          {totalImages > 0 && (
            <div className='absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded'>
              {currentImageIndex + 1} / {totalImages}
            </div>
          )}
          {/* Navigation Arrows */}
          {totalImages > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1))}
                className='absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80'
              >
                ←
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1))}
                className='absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80'
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {totalImages > 1 && (
          <div className='flex gap-2 overflow-x-auto'>
            {roomData.images.map((image, index) => (
              <img
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                  index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'
                } hover:border-blue-400 transition-all`}
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Room Details */}
      <div className='flex flex-col md:flex-row gap-6'>
        <div className='flex-1'>
          <h2 className='text-2xl font-bold mb-2'>{roomData.type} Room {roomData.number}</h2>
          <p className='mb-4'>{roomData.description}</p>
          <p className='mb-2'><span className='font-semibold'>Capacity:</span> {roomData.capacity} guests</p>
          <p className='mb-2'><span className='font-semibold'>Floor:</span> {roomData.floor}</p>
          <p className='mb-2'><span className='font-semibold'>Status:</span> <span className='text-green-600'>{roomData.status}</span></p>
        </div>
        <div className='md:w-1/3'>
          <div className='bg-gray-100 p-6 rounded-lg'>
            <span className='font-bold text-3xl text-blue-600'>${roomData.price}</span>
            <span className='text-gray-600'> / night</span>
          </div>
        </div>
      </div>
    </section>
    {/* Reviews Section */}
    <section className='w-[80%] mx-auto my-10'>
      <h3 className='text-xl font-bold mb-4'>Customer Reviews</h3>
      <div className='border-t pt-4'>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.reviewId} className='mb-4 p-4 bg-gray-50 rounded'>
              <div className='flex items-center justify-between mb-2'>
                <span className='font-semibold'>{review.userName || 'Anonymous'}</span>
                <span className='text-yellow-500'>
                  {'⭐'.repeat(review.rating)}
                </span>
              </div>
              <p className='text-gray-700 mb-2'>{review.comment}</p>
              <p className='text-sm text-gray-500'>
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>No reviews yet. Be the first to review this room!</p>
        )}
      </div>

      {/* Write Review Button */}
      {canReview && !showReviewForm && (
        <button
          onClick={() => setShowReviewForm(true)}
          className='mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors'
        >
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className='mt-8 border rounded-lg p-6 bg-white shadow-md'>
          <h3 className='text-xl font-bold mb-4'>Write a Review</h3>

          <div className='mb-4'>
            <label className='block mb-2 font-semibold'>Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className='w-full p-2 border rounded'
            >
              <option value="5">5 Stars - Excellent</option>
              <option value="4">4 Stars - Very Good</option>
              <option value="3">3 Stars - Good</option>
              <option value="2">2 Stars - Fair</option>
              <option value="1">1 Star - Poor</option>
            </select>
          </div>

          <div className='mb-4'>
            <label className='block mb-2 font-semibold'>Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Share your experience...'
              rows='4'
              className='w-full p-2 border rounded'
            />
          </div>

          <div className='flex gap-4'>
            <button
              onClick={handleSubmitReview}
              className='bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors'
            >
              Submit Review
            </button>
            <button
              onClick={() => setShowReviewForm(false)}
              className='bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition-colors'
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
    {/*choose time for booking section*/}
    <form onSubmit={(e) => {
      e.preventDefault();
      handleBooking();
    }}
 className='w-[80%] mx-auto my-10 bg-[rgba(10,10,10,0.2)] p-5 rounded-2xl'>
      <h3 className='text-xl font-bold mb-4'>Book This Room</h3>
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex flex-col w-full md:w-1/4'>
          <label className='mb-2 font-semibold'>Check-in Date</label>
          <input
            required
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className='p-2 border rounded'
          />
        </div>
        <div className='flex flex-col w-full md:w-1/4'>
          <label className='mb-2 font-semibold'>Check-out Date</label>
          <input
            required
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            min={checkInDate || new Date().toISOString().split('T')[0]}
            className='p-2 border rounded'
          />
        </div>
      </div>
      <div className='flex flex-col w-full md:w-1/4 justify-center align-items-center my-5'>
       <button
         disabled={isBooking}
         className='bg-green-400 p-2 w-8/12 rounded text-white font-bold hover:bg-green-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
       >
            {isBooking ? 'Booking...' : 'Book Now'}
        </button>
      </div>
    </form>
    </>
  )
}

export default RoomDetails
