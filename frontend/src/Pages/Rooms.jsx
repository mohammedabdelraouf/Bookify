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
  const [viewMode, setViewMode] = useState('grid'); // 'list' or 'grid'

  // Reset all filters
  const resetFilters = () => {
    setFilter({
      price: [0, 500],
      type: 'all',
      capacity: 1
    });
    setSortBy('price-asc');
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filter.price[1] < 500) count++;
    if (filter.type !== 'all') count++;
    if (filter.capacity > 1) count++;
    return count;
  }, [filter]);

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

    // Filter by capacity
    if (filter.capacity > 1) {
      result = result.filter(room =>
        room.capacity >= filter.capacity
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
    <main className='flex flex-col md:flex-row gap-6 px-4 md:px-8 py-6'>
      {/* Enhanced Filter Sidebar */}
      <aside className='w-full md:w-1/4 bg-white rounded-lg shadow-md p-6 h-fit sticky top-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Filters</h2>
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className='text-sm text-teal-600 hover:text-teal-700 font-semibold'
            >
              Clear All ({activeFiltersCount})
            </button>
          )}
        </div>

        <div className='space-y-6'>
          {/* Price Range Filter */}
          <div className='pb-6 border-b border-gray-200'>
            <h3 className='font-bold text-gray-700 mb-3'>Price Range</h3>
            <input
              type="range"
              min="0"
              max="500"
              value={filter.price[1]}
              onChange={(e) => setFilter({...filter, price: [0, parseInt(e.target.value)]})}
              className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600'
            />
            <div className='flex justify-between items-center mt-3'>
              <span className='text-sm font-semibold text-gray-700'>${filter.price[0]}</span>
              <span className='text-sm font-semibold text-teal-600'>${filter.price[1]}</span>
            </div>
            <p className='text-xs text-gray-500 mt-1'>per night</p>
          </div>

          {/* Room Type Filter */}
          <div className='pb-6 border-b border-gray-200'>
            <h3 className='font-bold text-gray-700 mb-3'>Room Type</h3>
            <select
              value={filter.type}
              onChange={(e) => setFilter({...filter, type: e.target.value})}
              className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            >
              <option value="all">All Types</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="presidential">Presidential</option>
            </select>
          </div>

          {/* Capacity Filter */}
          <div className='pb-6 border-b border-gray-200'>
            <h3 className='font-bold text-gray-700 mb-3'>Minimum Capacity</h3>
            <select
              value={filter.capacity}
              onChange={(e) => setFilter({...filter, capacity: parseInt(e.target.value)})}
              className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            >
              <option value="1">1+ Guest</option>
              <option value="2">2+ Guests</option>
              <option value="3">3+ Guests</option>
              <option value="4">4+ Guests</option>
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

      {/* Rooms Section */}
      <section className="flex-1">
        {/* Results Header */}
        <div className='bg-white rounded-lg shadow-md p-4 mb-6'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>Available Rooms</h1>
              <p className='text-sm text-gray-600 mt-1'>
                Showing {filteredAndSortedRooms.length} of {rooms?.length || 0} rooms
              </p>
            </div>

            {/* View Toggle */}
            <div className='flex gap-2 bg-gray-100 p-1 rounded-lg'>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-teal-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-teal-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Rooms Grid/List */}
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 lg:grid-cols-2 gap-6'
          : 'flex flex-col gap-6'
        }>
          {isLoading ? (
            <div className="col-span-full text-center text-gray-500 py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
              <p className="text-xl">Loading rooms...</p>
            </div>
          ) : filteredAndSortedRooms.length > 0 ? (
            filteredAndSortedRooms.map((room) => (
              <Link key={room.id} to={`/rooms/${room.id}`}>
                <RoomCard roomData={room} viewMode={viewMode} />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center bg-white rounded-lg shadow-md p-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-bold text-gray-800 mb-2">No rooms found</p>
              <p className="text-gray-600 mb-4">Try adjusting your filters to see more options.</p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className='bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg transition-colors'
                >
                  Clear Filters
                </button>
              )}
              <p className="mt-4 text-sm text-gray-500">Total rooms available: {rooms?.length || 0}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Rooms
