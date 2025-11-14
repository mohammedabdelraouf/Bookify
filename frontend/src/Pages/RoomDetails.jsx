import React from 'react'
import assets from '../assets/assets'
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../Context/AppContext.jsx';


const RoomDetails = () => {

    const { RoomId } = useParams();
    const { rooms } = useContext(AppContext);
    const [roomData, setRoomData] = useState(null);
    const [img, setImg] = useState('')
    const navigate = useNavigate();

    const fetchRoomData = async () => {
      const room = rooms.find((item) => item.id === parseInt(RoomId));
      if (room) {
        setRoomData(room);
        setImg(room.images[0]?.url || '');
      }
    }

    useEffect(() => {
      fetchRoomData();
    }, [RoomId, rooms])
  if (!roomData) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-xl'>Loading room details...</p>
      </div>
    );
  }

  return (
    <>
    <section className='flex flex-col md:flex-row w-[80%] mx-auto my-10 ' >
      <div className='w-full md:w-1/4 overflow-hidden'>
        <img className='w-full shadow-xl rounded-md' src={img || assets.room1} alt={`Room ${roomData.number}`} />
      </div>
        <div className='flex flex-col justify-between p-5 w-full md:w-3/4'>
        <div></div>
          <h2 className='text-2xl font-bold mb-2'>{roomData.type} Room {roomData.number}</h2>
          <p className='mb-4'>{roomData.description}</p>
          <p className='mb-2'><span className='font-semibold'>Capacity:</span> {roomData.capacity} guests</p>
          <p className='mb-2'><span className='font-semibold'>Floor:</span> {roomData.floor}</p>
          <p className='mb-2'><span className='font-semibold'>Status:</span> <span className='text-green-600'>{roomData.status}</span></p>
        </div>
        <div className='flex justify-between items-center'>
          <span className='font-bold text-lg'>${roomData.price} / night</span>
        </div>


    </section>
    {/* Reviews Section */}
    <section className='w-[80%] mx-auto my-10'>
      <h3 className='text-xl font-bold mb-4'>Reviews</h3>
      <div className='border-t pt-4'>
        <p className='mb-2'><span className='font-bold'>User1:</span> Great room, very comfortable!</p>
        <p className='mb-2'><span className='font-bold'>User2:</span> Excellent service and amenities.</p>
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
