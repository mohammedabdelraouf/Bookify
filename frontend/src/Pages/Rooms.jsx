import { useState, useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
import RoomCard from '../Components/RoomCard'

const  Rooms = () => {
  const RoomsData = useContext(AppContext);
  const [filter, setFilter] = useState({
    price: [0, 500],
    type: 'all',
    capacity: 1
  });

  // Get actual rooms from AppContext
  const { rooms, isLoading } = RoomsData;

  const [sortBy, setSortBy] = useState('price-asc');

  return (
    <main className='flex flex-col md:flex-row gap-8'>
      <aside className='w-full  md:w-1/4 p-4 border-r border-gray-600'>
        <div className='space-y-4'>
          <div>
            <h3 className='font-bold mb-2'>Price Range</h3>
            <input 
              type="range" 
              min="0" 
              max="1000" 
              value={filter.price[1]} 
              onChange={(e) => setFilter({...filter, price: [0, e.target.value]})}
            />
            <div>${filter.price[0]} - ${filter.price[1]}</div>
          </div>

          <div>
            <h3 className='font-bold mb-2'>Room Type</h3>
            <select 
              value={filter.type} 
              onChange={(e) => setFilter({...filter, type: e.target.value})}
              className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            >
              <option value="all">All</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <h3 className='font-bold text-gray-700 mb-3'>Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </aside>

      <section id='rooms-container' className="flex-1 ">
        <div className="flex flex-col gap-5 p-10 ">
          // Map through filteredRooms instead of rooms// 
          {rooms.map((item, index) => (
            <Link key={index} to="/rooms/:index">
                <RoomCard  roomImg={images[index]} roomID={rooms[index]}/>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Rooms
