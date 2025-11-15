import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets.js'
import ReactImageGallery from 'react-image-gallery'
import "react-image-gallery/styles/css/image-gallery.css";
import { API_BASE_URL } from '../Context/AppContext.jsx'

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchFeaturedRooms()
  }, [])

  const fetchFeaturedRooms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms`)
      if (response.ok) {
        const data = await response.json()
        setFeaturedRooms(data.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const galleryItems = [
    { original: assets.room1 },
    { original: assets.room2 },
    { original: assets.room3 },
    { original: assets.room4 }
  ]

  return (
    <main className='w-full'>
      {/* Hero Section with Gallery */}
      <section className='relative h-[600px] overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <ReactImageGallery
            items={galleryItems}
            showPlayButton={false}
            showFullscreenButton={false}
            autoPlay={true}
            slideInterval={5000}
            showThumbnails={false}
            showNav={false}
            showBullets={true}
          />
        </div>

        {/* Hero Overlay Content */}
        <div className='absolute inset-0 bg-black bg-opacity-40 z-10 flex items-center justify-center'>
          <div className='text-center text-white px-4'>
            <h1 className='text-5xl md:text-6xl font-bold mb-4'>Welcome to Bookify</h1>
            <p className='text-xl md:text-2xl mb-8'>Your Perfect Stay Awaits</p>
            <p className='text-lg md:text-xl mb-8 max-w-2xl mx-auto'>
              Experience luxury and comfort in our premium rooms. Book your dream getaway today.
            </p>
            <button
              onClick={() => navigate('/rooms')}
              className='bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg'
            >
              Browse Rooms
            </button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center mb-12'>Why Choose Bookify?</h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='text-center p-6'>
              <div className='text-5xl mb-4'>📶</div>
              <h3 className='text-xl font-bold mb-2'>Free WiFi</h3>
              <p className='text-gray-600'>High-speed internet in all rooms</p>
            </div>
            <div className='text-center p-6'>
              <div className='text-5xl mb-4'>🏢</div>
              <h3 className='text-xl font-bold mb-2'>Prime Location</h3>
              <p className='text-gray-600'>Easy access to major attractions</p>
            </div>
            <div className='text-center p-6'>
              <div className='text-5xl mb-4'>🍳</div>
              <h3 className='text-xl font-bold mb-2'>Complimentary Breakfast</h3>
              <p className='text-gray-600'>Start your day with a delicious meal</p>
            </div>
            <div className='text-center p-6'>
              <div className='text-5xl mb-4'>🛎️</div>
              <h3 className='text-xl font-bold mb-2'>24/7 Service</h3>
              <p className='text-gray-600'>We're here whenever you need us</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center mb-4'>Featured Rooms</h2>
          <p className='text-center text-gray-600 mb-12'>Discover our most popular accommodations</p>

          {loading ? (
            <div className='text-center py-10'>
              <p className='text-xl text-gray-600'>Loading rooms...</p>
            </div>
          ) : (
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {featuredRooms.map((room) => (
                <div key={room.roomId} className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow'>
                  <div className='h-64 bg-gray-200'>
                    {room.images && room.images.length > 0 ? (
                      <img
                        src={room.images[0]}
                        alt={room.roomTypeName}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-gray-400'>
                        No Image Available
                      </div>
                    )}
                  </div>
                  <div className='p-6'>
                    <h3 className='text-2xl font-bold mb-2'>{room.roomTypeName}</h3>
                    <p className='text-gray-600 mb-4'>Room {room.roomNumber}</p>
                    <div className='flex justify-between items-center mb-4'>
                      <span className='text-3xl font-bold text-teal-600'>${room.pricePerNight}</span>
                      <span className='text-gray-500'>per night</span>
                    </div>
                    <button
                      onClick={() => navigate(`/rooms/${room.roomId}`)}
                      className='w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors'
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='text-center mt-12'>
            <button
              onClick={() => navigate('/rooms')}
              className='bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition-colors'
            >
              View All Rooms
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className='py-16 bg-teal-700 text-white'>
        <div className='container mx-auto px-4'>
          <div className='grid md:grid-cols-3 gap-8 text-center'>
            <div>
              <div className='text-5xl font-bold mb-2'>1000+</div>
              <p className='text-xl'>Happy Guests</p>
            </div>
            <div>
              <div className='text-5xl font-bold mb-2'>500+</div>
              <p className='text-xl'>Rooms Booked</p>
            </div>
            <div>
              <div className='text-5xl font-bold mb-2'>4.8/5</div>
              <p className='text-xl'>Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center mb-12'>What Our Guests Say</h2>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <div className='flex mb-4'>
                <span className='text-yellow-500 text-2xl'>★★★★★</span>
              </div>
              <p className='text-gray-700 mb-4'>
                "Amazing experience! The room was clean, comfortable, and the staff was incredibly helpful. Will definitely come back!"
              </p>
              <p className='font-bold'>- Sarah Johnson</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <div className='flex mb-4'>
                <span className='text-yellow-500 text-2xl'>★★★★★</span>
              </div>
              <p className='text-gray-700 mb-4'>
                "Perfect location and great amenities. The booking process was smooth and easy. Highly recommend Bookify!"
              </p>
              <p className='font-bold'>- Michael Chen</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg'>
              <div className='flex mb-4'>
                <span className='text-yellow-500 text-2xl'>★★★★★</span>
              </div>
              <p className='text-gray-700 mb-4'>
                "Excellent value for money. The complimentary breakfast was delicious and the WiFi was super fast!"
              </p>
              <p className='font-bold'>- Emily Rodriguez</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className='py-16 bg-teal-600 text-white'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-4xl font-bold mb-4'>Ready to Book Your Stay?</h2>
          <p className='text-xl mb-8'>Join thousands of satisfied guests and experience the Bookify difference</p>
          <button
            onClick={() => navigate('/rooms')}
            className='bg-white text-teal-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg'
          >
            Book Now
          </button>
        </div>
      </section>
    </main>
  )
}

export default Home
