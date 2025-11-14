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

  // Apply filters and sorting to rooms
  const filteredAndSortedRooms = useMemo(() => {
    if (!rooms || rooms.length === 0) {
      return [];
    }

    let result = [...rooms];

    // Filter by price range
    result = result.filter(room =>
      room.price >= filter.price[0] && room.price <= filter.price[1]
    );

    // Filter by room type
    if (filter.type !== 'all') {
      result = result.filter(room =>
        room.type.toLowerCase() === filter.type.toLowerCase()
      );
    }

    // Sort rooms
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          // Placeholder for future rating implementation
          return 0;
        default:
          return 0;
      }
    });

    return result;
  }, [rooms, filter, sortBy]);

  return (
    <main className='flex flex-col md:flex-row gap-8'>
      <aside className='w-full  md:w-1/4 p-4 border-r border-gray-600'>
        <div className='space-y-4'>
          <div>
            <h3 className='font-bold mb-2'>Price Range</h3>
            <input
              type="range"
              min="0"
              max="500"
              value={filter.price[1]}
              onChange={(e) => setFilter({...filter, price: [0, parseInt(e.target.value)]})}
              className='w-full'
            />
            <div className='text-sm mt-1'>${filter.price[0]} - ${filter.price[1]} per night</div>
          </div>

          <div>
            <h3 className='font-bold mb-2'>Room Type</h3>
            <select
              value={filter.type}
              onChange={(e) => setFilter({...filter, type: e.target.value})}
              className='w-full p-2 border rounded'
            >
              <option value="all">All</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="presidential">Presidential</option>
            </select>
          </div>

          <div>
            <h3 className='font-bold mb-2'>Sort By</h3>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className='w-full p-2 border rounded '
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
          {isLoading ? (
            <div className="text-center text-gray-500 py-10">
              <p className="text-xl">Loading rooms...</p>
            </div>
          ) : filteredAndSortedRooms.length > 0 ? (
            filteredAndSortedRooms.map((room) => (
              <Link key={room.id} to={`/rooms/${room.id}`}>
                <RoomCard roomData={room}/>
              </Link>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p className="text-xl">No rooms found matching your filters.</p>
              <p className="mt-2">Try adjusting your search criteria.</p>
              <p className="mt-2 text-sm">Total rooms available: {rooms?.length || 0}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Rooms
