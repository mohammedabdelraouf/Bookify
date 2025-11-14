import React from 'react'

const RoomCard = ({roomData}) => {
  if (!roomData) {
    return null;
  }

  // Get the main image or first image from the room's images array
  const mainImage = roomData.images?.find(img => img.isMain)?.url || roomData.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className='flex flex-col gap-24 md:flex-row text-white bg-slate-400 rounded-lg shadow-md hover:bg-slate-800 transition-colors overflow-hidden'>
      <img src={mainImage} alt={`Room ${roomData.number || 'N/A'}`} className='w-100 md:w-44 object-cover' />
      <div className='flex flex-col justify-between p-5'>
        <div>
          <h2 className='text-2xl font-bold mb-2'>{roomData.type || 'Room'} - Room {roomData.number || 'N/A'}</h2>
          <p className='mb-4'>{roomData.description || 'No description available'}</p>
          <p className='text-sm mb-2'>Floor: {roomData.floor || 'N/A'} | Capacity: {roomData.capacity || 'N/A'} guests</p>
        </div>
        <div className='flex justify-between items-center'>
          <span className='font-bold text-lg'>${roomData.price || 0} / night</span>
        </div>
      </div>
      <div className='flex items-center p-5'>
        <button className='bg-green-400 p-2 w-full rounded text-white font-bold hover:bg-green-500 transition-colors'>
          Book Now
        </button>
      </div>
    </div>
  )
}

export default RoomCard
