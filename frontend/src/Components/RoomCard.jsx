const RoomCard = ({roomData, viewMode = 'list'}) => {
  if (!roomData) {
    return null;
  }

  // Get the main image or first image from the room's images array
  const mainImage = roomData.images?.find(img => img.isMain)?.url || roomData.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image';

  // Determine availability status
  const getStatusBadge = () => {
    const status = roomData.status?.toLowerCase();
    switch (status) {
      case 'available':
        return <span className='px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full'>Available</span>;
      case 'occupied':
        return <span className='px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full'>Occupied</span>;
      case 'maintenance':
        return <span className='px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full'>Maintenance</span>;
      default:
        return <span className='px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full'>Available</span>;
    }
  };

  // Grid view layout
  if (viewMode === 'grid') {
    return (
      <div className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1'>
        <div className='relative h-56'>
          <img src={mainImage} alt={`Room ${roomData.number || 'N/A'}`} className='w-full h-full object-cover' />
          <div className='absolute top-3 right-3'>
            {getStatusBadge()}
          </div>
        </div>
        <div className='p-5'>
          <div className='flex justify-between items-start mb-2'>
            <h2 className='text-xl font-bold text-gray-800'>{roomData.type || 'Room'}</h2>
            <span className='text-xs text-gray-500'>Room {roomData.number || 'N/A'}</span>
          </div>
          <p className='text-gray-600 text-sm mb-3 line-clamp-2'>{roomData.description || 'No description available'}</p>

          <div className='flex items-center gap-4 text-sm text-gray-600 mb-4'>
            <span>👤 {roomData.capacity || 'N/A'} guests</span>
            <span>📍 Floor {roomData.floor || 'N/A'}</span>
          </div>

          <div className='flex justify-between items-center pt-3 border-t border-gray-200'>
            <div>
              <span className='text-2xl font-bold text-teal-600'>${roomData.price || 0}</span>
              <span className='text-sm text-gray-500'> / night</span>
            </div>
            <button className='bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg text-white font-semibold transition-colors'>
              Book Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view layout (default)
  return (
    <div className='flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all'>
      <div className='relative md:w-80 h-64 md:h-auto'>
        <img src={mainImage} alt={`Room ${roomData.number || 'N/A'}`} className='w-full h-full object-cover' />
        <div className='absolute top-3 left-3'>
          {getStatusBadge()}
        </div>
      </div>

      <div className='flex flex-col flex-1 p-6'>
        <div className='flex-1'>
          <div className='flex justify-between items-start mb-3'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-1'>{roomData.type || 'Room'}</h2>
              <p className='text-sm text-gray-500'>Room Number: {roomData.number || 'N/A'}</p>
            </div>
          </div>

          <p className='text-gray-700 mb-4'>{roomData.description || 'No description available'}</p>

          <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
            <div className='flex items-center gap-1'>
              <span>👤</span>
              <span>{roomData.capacity || 'N/A'} guests</span>
            </div>
            <div className='flex items-center gap-1'>
              <span>📍</span>
              <span>Floor {roomData.floor || 'N/A'}</span>
            </div>
            <div className='flex items-center gap-1'>
              <span>📶</span>
              <span>Free WiFi</span>
            </div>
            <div className='flex items-center gap-1'>
              <span>❄️</span>
              <span>AC</span>
            </div>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-4 border-t border-gray-200'>
          <div>
            <span className='text-3xl font-bold text-teal-600'>${roomData.price || 0}</span>
            <span className='text-gray-500'> / night</span>
          </div>
          <button className='w-full sm:w-auto bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-lg text-white font-bold transition-colors'>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomCard
