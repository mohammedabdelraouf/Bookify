import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext, API_BASE_URL } from '../Context/AppContext.jsx';
import Toast from '../Components/Toast';
import ImageLightbox from '../Components/ImageLightbox';
import assets from '../assets/assets';

const RoomDetailsEnhanced = () => {
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
  const [toast, setToast] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const fetchRoomData = async () => {
    const room = rooms.find((item) => item.id === parseInt(RoomId));
    if (room) {
      setRoomData(room);
      setCurrentImageIndex(0);
    }
  };

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
  };

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
  }, [RoomId, rooms]);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateTotalPrice = () => {
    if (!roomData) return 0;
    const nights = calculateNights();
    return nights * roomData.price;
  };

  const validateBookingDates = () => {
    if (!checkInDate || !checkOutDate) {
      showToast('Please select check-in and check-out dates', 'error');
      return false;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      showToast('Check-in date cannot be in the past', 'error');
      return false;
    }

    if (checkOut <= checkIn) {
      showToast('Check-out date must be after check-in date', 'error');
      return false;
    }

    return true;
  };

  const handleBooking = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Please login to book a room', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!validateBookingDates()) return;

    const bookingData = {
      roomId: parseInt(RoomId),
      checkIn: checkInDate,
      checkOut: checkOutDate
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

      showToast('Booking created successfully!', 'success');

      setTimeout(() => {
        navigate(`/rooms/${RoomId}/payment`, {
          state: {
            bookingId: result.bookingId,
            roomNumber: roomData.number,
            checkInDate,
            checkOutDate,
            totalAmount: result.totalCost
          }
        });
      }, 1500);

    } catch (error) {
      showToast('Booking failed: ' + error.message, 'error');
    } finally {
      setIsBooking(false);
    }
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Please login to submit a review', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!comment.trim()) {
      showToast('Please write a comment', 'error');
      return;
    }

    if (!userBookingId) {
      showToast('You must have a confirmed booking to review this room', 'error');
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

      showToast('Review submitted successfully!', 'success');
      setComment('');
      setRating(5);
      setShowReviewForm(false);
      fetchReviews();

    } catch (error) {
      showToast('Failed to submit review: ' + error.message, 'error');
    }
  };

  const handleLightboxNavigate = (direction) => {
    if (!roomData || !roomData.images) return;
    const totalImages = roomData.images.length;

    if (typeof direction === 'number') {
      setCurrentImageIndex(direction);
    } else if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    } else if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${roomData.type} Room ${roomData.number}`,
        text: `Check out this amazing room at Bookify!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingBreakdown = () => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      breakdown[review.rating] = (breakdown[review.rating] || 0) + 1;
    });
    return breakdown;
  };

  if (!roomData) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4'></div>
          <p className='text-xl text-gray-600'>Loading room details...</p>
        </div>
      </div>
    );
  }

  const currentImage = roomData.images[currentImageIndex]?.url || assets.room1;
  const totalImages = roomData.images.length;
  const nights = calculateNights();
  const totalPrice = calculateTotalPrice();
  const averageRating = getAverageRating();
  const ratingBreakdown = getRatingBreakdown();

  return (
    <main className='min-h-screen bg-gray-50'>
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Image Lightbox */}
      {showLightbox && (
        <ImageLightbox
          images={roomData.images}
          currentIndex={currentImageIndex}
          onClose={() => setShowLightbox(false)}
          onNavigate={handleLightboxNavigate}
        />
      )}

      {/* Breadcrumb */}
      <div className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-4 py-3'>
          <nav className='text-sm text-gray-600'>
            <span className='hover:text-teal-600 cursor-pointer' onClick={() => navigate('/')}>Home</span>
            <span className='mx-2'>›</span>
            <span className='hover:text-teal-600 cursor-pointer' onClick={() => navigate('/rooms')}>Rooms</span>
            <span className='mx-2'>›</span>
            <span className='text-gray-900 font-medium'>{roomData.type} Room {roomData.number}</span>
          </nav>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Header Section */}
        <div className='mb-6'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h1 className='text-4xl font-bold text-gray-900 mb-2'>
                {roomData.type} Room {roomData.number}
              </h1>
              <div className='flex items-center gap-4 text-sm'>
                <div className='flex items-center gap-1'>
                  <span className='text-yellow-500'>⭐</span>
                  <span className='font-semibold'>{averageRating}</span>
                  <span className='text-gray-600'>({reviews.length} reviews)</span>
                </div>
                <span className='text-gray-600'>Floor {roomData.floor}</span>
              </div>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={handleShare}
                className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' />
                </svg>
                Share
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  isFavorite ? 'bg-red-50 border-red-300 text-red-600' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <svg className='w-5 h-5' fill={isFavorite ? 'currentColor' : 'none'} stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className='mb-8'>
          {/* Main Image */}
          <div className='relative mb-4 cursor-pointer' onClick={() => setShowLightbox(true)}>
            <img
              className='w-full h-[500px] object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow'
              src={currentImage}
              alt={`Room ${roomData.number} - Image ${currentImageIndex + 1}`}
            />
            <div className='absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
              <span className='font-medium'>View all {totalImages} photos</span>
            </div>
            {totalImages > 0 && (
              <div className='absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg'>
                {currentImageIndex + 1} / {totalImages}
              </div>
            )}
            {/* Navigation Arrows */}
            {totalImages > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLightboxNavigate('prev');
                  }}
                  className='absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 text-gray-900 p-3 rounded-full hover:bg-white transition-all shadow-lg'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLightboxNavigate('next');
                  }}
                  className='absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 text-gray-900 p-3 rounded-full hover:bg-white transition-all shadow-lg'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {totalImages > 1 && (
            <div className='grid grid-cols-6 gap-2'>
              {roomData.images.slice(0, 6).map((image, index) => (
                <img
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-24 object-cover rounded-lg cursor-pointer border-2 ${
                    index === currentImageIndex ? 'border-teal-600' : 'border-transparent'
                  } hover:border-teal-400 transition-all`}
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Left Column - Room Info */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Room Overview */}
            <div className='bg-white rounded-xl shadow-md p-6'>
              <h2 className='text-2xl font-bold mb-4'>Room Overview</h2>
              <p className='text-gray-700 mb-6'>{roomData.description}</p>

              {/* Quick Facts */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                  <svg className='w-8 h-8 mx-auto mb-2 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                  </svg>
                  <p className='font-semibold'>{roomData.capacity}</p>
                  <p className='text-sm text-gray-600'>Guests</p>
                </div>
                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                  <svg className='w-8 h-8 mx-auto mb-2 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                  </svg>
                  <p className='font-semibold'>Floor {roomData.floor}</p>
                  <p className='text-sm text-gray-600'>Level</p>
                </div>
                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                  <svg className='w-8 h-8 mx-auto mb-2 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                  </svg>
                  <p className='font-semibold'>{roomData.type}</p>
                  <p className='text-sm text-gray-600'>Room Type</p>
                </div>
                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                  <svg className='w-8 h-8 mx-auto mb-2 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  <p className='font-semibold'>{roomData.status}</p>
                  <p className='text-sm text-gray-600'>Status</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className='bg-white rounded-xl shadow-md p-6'>
              <h2 className='text-2xl font-bold mb-4'>Amenities</h2>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <div className='flex items-center gap-3'>
                  <svg className='w-6 h-6 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' />
                  </svg>
                  <span>Free WiFi</span>
                </div>
                <div className='flex items-center gap-3'>
                  <svg className='w-6 h-6 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                  <span>Smart TV</span>
                </div>
                <div className='flex items-center gap-3'>
                  <svg className='w-6 h-6 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
                  </svg>
                  <span>Air Conditioning</span>
                </div>
                <div className='flex items-center gap-3'>
                  <svg className='w-6 h-6 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                  </svg>
                  <span>Safe</span>
                </div>
                <div className='flex items-center gap-3'>
                  <svg className='w-6 h-6 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                  </svg>
                  <span>Mini Bar</span>
                </div>
                <div className='flex items-center gap-3'>
                  <svg className='w-6 h-6 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
                  </svg>
                  <span>Room Service</span>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className='bg-white rounded-xl shadow-md p-6'>
              <h2 className='text-2xl font-bold mb-6'>Guest Reviews</h2>

              {/* Rating Overview */}
              {reviews.length > 0 && (
                <div className='mb-8 p-6 bg-gray-50 rounded-lg'>
                  <div className='flex items-center gap-8'>
                    <div className='text-center'>
                      <div className='text-5xl font-bold text-teal-600 mb-2'>{averageRating}</div>
                      <div className='flex justify-center mb-1'>
                        {'⭐'.repeat(Math.round(averageRating))}
                      </div>
                      <p className='text-sm text-gray-600'>{reviews.length} reviews</p>
                    </div>
                    <div className='flex-1'>
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className='flex items-center gap-3 mb-2'>
                          <span className='text-sm w-12'>{star} star</span>
                          <div className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-teal-600'
                              style={{ width: `${reviews.length > 0 ? (ratingBreakdown[star] / reviews.length) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span className='text-sm w-8 text-right'>{ratingBreakdown[star]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className='space-y-4'>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.reviewId} className='border-b pb-4 last:border-0'>
                      <div className='flex items-start justify-between mb-2'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-semibold'>
                            {review.userName?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className='font-semibold'>{review.userName || 'Anonymous'}</p>
                            <p className='text-sm text-gray-500'>
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className='text-yellow-500'>
                          {'⭐'.repeat(review.rating)}
                        </div>
                      </div>
                      <p className='text-gray-700 ml-13'>{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-8 text-gray-500'>
                    <svg className='w-16 h-16 mx-auto mb-3 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' />
                    </svg>
                    <p>No reviews yet. Be the first to review this room!</p>
                  </div>
                )}
              </div>

              {/* Write Review Button */}
              {canReview && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className='mt-6 w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold'
                >
                  Write a Review
                </button>
              )}

              {/* Review Form */}
              {showReviewForm && (
                <div className='mt-6 p-6 bg-gray-50 rounded-lg'>
                  <h3 className='text-lg font-bold mb-4'>Write Your Review</h3>

                  {/* Star Rating Input */}
                  <div className='mb-4'>
                    <label className='block mb-2 font-semibold'>Rating</label>
                    <div className='flex gap-2'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type='button'
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className='text-4xl transition-all transform hover:scale-110'
                        >
                          <span className={star <= (hoveredStar || rating) ? 'text-yellow-500' : 'text-gray-300'}>
                            ⭐
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className='text-sm text-gray-600 mt-2'>
                      {rating === 5 && 'Excellent'}
                      {rating === 4 && 'Very Good'}
                      {rating === 3 && 'Good'}
                      {rating === 2 && 'Fair'}
                      {rating === 1 && 'Poor'}
                    </p>
                  </div>

                  <div className='mb-4'>
                    <label className='block mb-2 font-semibold'>Your Review</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder='Share your experience with this room...'
                      rows='4'
                      className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                    />
                  </div>

                  <div className='flex gap-3'>
                    <button
                      onClick={handleSubmitReview}
                      className='flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold'
                    >
                      Submit Review
                    </button>
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className='flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sticky Booking Widget */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
              <div className='mb-6'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-4xl font-bold text-teal-600'>${roomData.price}</span>
                  <span className='text-gray-600'>/ night</span>
                </div>
                {nights > 0 && (
                  <p className='text-sm text-gray-600 mt-2'>
                    {nights} night{nights > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleBooking();
              }} className='space-y-4'>
                <div>
                  <label className='block mb-2 font-semibold text-gray-700'>Check-in</label>
                  <input
                    required
                    type='date'
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                  />
                </div>

                <div>
                  <label className='block mb-2 font-semibold text-gray-700'>Check-out</label>
                  <input
                    required
                    type='date'
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || new Date().toISOString().split('T')[0]}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                  />
                </div>

                {/* Price Breakdown */}
                {nights > 0 && (
                  <div className='border-t pt-4 space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>${roomData.price} × {nights} nights</span>
                      <span className='text-gray-900'>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Service fee</span>
                      <span className='text-gray-900'>$0.00</span>
                    </div>
                    <div className='border-t pt-2 flex justify-between font-bold'>
                      <span>Total</span>
                      <span className='text-teal-600'>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <button
                  type='submit'
                  disabled={isBooking}
                  className='w-full bg-teal-600 text-white py-4 rounded-lg hover:bg-teal-700 transition-colors font-bold disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
                >
                  {isBooking ? (
                    <span className='flex items-center justify-center gap-2'>
                      <svg className='animate-spin h-5 w-5' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Reserve Now'
                  )}
                </button>

                <p className='text-xs text-center text-gray-500'>
                  You won't be charged yet
                </p>
              </form>

              {/* Trust Signals */}
              <div className='mt-6 pt-6 border-t space-y-3'>
                <div className='flex items-center gap-3 text-sm'>
                  <svg className='w-5 h-5 text-green-600 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  <span className='text-gray-700'>Free cancellation for 24 hours</span>
                </div>
                <div className='flex items-center gap-3 text-sm'>
                  <svg className='w-5 h-5 text-green-600 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  <span className='text-gray-700'>Best price guarantee</span>
                </div>
                <div className='flex items-center gap-3 text-sm'>
                  <svg className='w-5 h-5 text-green-600 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  <span className='text-gray-700'>Instant booking confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RoomDetailsEnhanced;
