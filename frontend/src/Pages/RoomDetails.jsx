import React from 'react'
import assets from '../assets/assets'
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react'
import { AppContext, API_BASE_URL } from '../Context/AppContext.jsx';


const RoomDetails = () => {

    const { RoomId } = useParams();
    const { rooms } = useContext(AppContext);
    const [roomData, setRoomData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [reviews, setReviews] = useState([]);
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

    useEffect(() => {
      fetchRoomData();
      fetchReviews();
    }, [RoomId, rooms])
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
    </section>
    {/*choose time for booking section*/}
    <form onSubmit={(e) => { e.preventDefault(); navigate('/rooms/5/payment'); }}
 className='w-[80%] mx-auto my-10 bg-[rgba(10,10,10,0.2)] p-5 rounded-2xl'>
      <h3 className='text-xl font-bold mb-4'>Please choose date </h3>
      <div className='flex flex-col md:flex-row gap-4'>
         <input required type="date" className='p-2 border rounded w-full md:w-1/4' />
         <input required type="date" className='p-2 border rounded w-full md:w-1/4' />
      </div>
      <div className='flex flex-col w-full md:w-1/4 justify-center align-items-center my-5'>
       <button  className='bg-green-400 p-2  w-8/12  rounded text-white font-bold hover:bg-green-500 transition-colors'>
            Pay Now
        </button>
      </div>
    </form>
    </>
  )
}

export default RoomDetails
