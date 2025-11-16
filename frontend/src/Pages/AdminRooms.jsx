import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../Context/AppContext.jsx';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentRoom, setCurrentRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    floor: '',
    status: 'Available',
    roomTypeId: ''
  });

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms`);
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/room-types`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRoomTypes(data);
      }
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      roomNumber: '',
      floor: '',
      status: 'Available',
      roomTypeId: roomTypes[0]?.roomTypeId || ''
    });
    setShowModal(true);
  };

  const openEditModal = (room) => {
    setModalMode('edit');
    setCurrentRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      floor: room.floor,
      status: room.status,
      roomTypeId: room.roomTypeId
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentRoom(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const roomData = {
      roomNumber: formData.roomNumber,
      floor: parseInt(formData.floor),
      status: formData.status,
      roomTypeId: parseInt(formData.roomTypeId)
    };

    try {
      const url = modalMode === 'add'
        ? `${API_BASE_URL}/admin/rooms`
        : `${API_BASE_URL}/admin/rooms/${currentRoom.roomId}`;

      const response = await fetch(url, {
        method: modalMode === 'add' ? 'POST' : 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roomData)
      });

      if (response.ok) {
        alert(`Room ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
        closeModal();
        fetchRooms();
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'Operation failed'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save room');
    }
  };

  const handleDelete = async (roomId) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Room deleted successfully!');
        fetchRooms();
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'Delete failed'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete room');
    }
  };

  const handleStatusChange = async (roomId, newStatus) => {
    const room = rooms.find(r => r.roomId === roomId);
    if (!room) return;

    const token = localStorage.getItem('token');
    const roomData = {
      roomNumber: room.roomNumber,
      floor: room.floor,
      status: newStatus,
      roomTypeId: room.roomTypeId
    };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/rooms/${roomId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roomData)
      });

      if (response.ok) {
        fetchRooms();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'text-green-600 bg-green-100';
      case 'Occupied':
        return 'text-red-600 bg-red-100';
      case 'Maintenance':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-xl'>Loading rooms...</p>
      </div>
    );
  }

  return (
    <div className='w-full h-screen overflow-y-auto bg-gray-100'>
      <div className='p-6'>
        {/* Header */}
        <div className='bg-white shadow-sm p-6 rounded-lg mb-6'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-800 mb-2'>
                Rooms Management
              </h1>
              <p className='text-gray-600'>
                Manage hotel rooms and availability
              </p>
            </div>
            <button
              onClick={openAddModal}
              className='bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm'
            >
              + Add New Room
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
          <div className='bg-white shadow-sm p-6 rounded-lg'>
            <p className='text-sm text-gray-600'>Total Rooms</p>
            <p className='text-2xl font-bold text-gray-800'>{rooms.length}</p>
          </div>
          <div className='bg-white shadow-sm p-6 rounded-lg'>
            <p className='text-sm text-gray-600'>Available</p>
            <p className='text-2xl font-bold text-green-600'>
              {rooms.filter(r => r.status === 'Available').length}
            </p>
          </div>
          <div className='bg-white shadow-sm p-6 rounded-lg'>
            <p className='text-sm text-gray-600'>Occupied</p>
            <p className='text-2xl font-bold text-red-600'>
              {rooms.filter(r => r.status === 'Occupied').length}
            </p>
          </div>
          <div className='bg-white shadow-sm p-6 rounded-lg'>
            <p className='text-sm text-gray-600'>Maintenance</p>
            <p className='text-2xl font-bold text-yellow-600'>
              {rooms.filter(r => r.status === 'Maintenance').length}
            </p>
          </div>
        </div>

        {/* Rooms Table */}
        <div className='bg-white shadow-sm rounded-lg overflow-hidden'>
          {rooms.length === 0 ? (
            <div className='text-center py-10'>
              <p className='text-xl text-gray-600'>No rooms found</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Room Number
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Type
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Floor
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Capacity
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Price/Night
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {rooms.map((room) => (
                    <tr key={room.roomId} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>
                          {room.roomNumber}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {room.roomTypeName}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        Floor {room.floor}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {room.roomTypeCapacity} guests
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        ${room.roomTypePricePerNight}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <select
                          value={room.status}
                          onChange={(e) => handleStatusChange(room.roomId, e.target.value)}
                          className={`px-3 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(room.status)}`}
                        >
                          <option value='Available'>Available</option>
                          <option value='Occupied'>Occupied</option>
                          <option value='Maintenance'>Maintenance</option>
                        </select>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm space-x-2'>
                        <button
                          onClick={() => openEditModal(room)}
                          className='text-blue-600 hover:text-blue-800 font-medium'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(room.roomId)}
                          className='text-red-600 hover:text-red-800 font-medium'
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full p-6'>
            <h2 className='text-2xl font-bold mb-4'>
              {modalMode === 'add' ? 'Add New Room' : 'Edit Room'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='block text-sm font-semibold mb-2'>
                  Room Number *
                </label>
                <input
                  type='text'
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  required
                  maxLength={20}
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-semibold mb-2'>
                  Room Type *
                </label>
                <select
                  value={formData.roomTypeId}
                  onChange={(e) => setFormData({...formData, roomTypeId: e.target.value})}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  required
                >
                  <option value=''>Select Room Type</option>
                  {roomTypes.map((type) => (
                    <option key={type.roomTypeId} value={type.roomTypeId}>
                      {type.name} - ${type.pricePerNight}/night
                    </option>
                  ))}
                </select>
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-semibold mb-2'>
                  Floor *
                </label>
                <input
                  type='number'
                  value={formData.floor}
                  onChange={(e) => setFormData({...formData, floor: e.target.value})}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  required
                  min={1}
                />
              </div>

              <div className='mb-6'>
                <label className='block text-sm font-semibold mb-2'>
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  required
                >
                  <option value='Available'>Available</option>
                  <option value='Occupied'>Occupied</option>
                  <option value='Maintenance'>Maintenance</option>
                </select>
              </div>

              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={closeModal}
                  className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 rounded-lg transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg transition-colors'
                >
                  {modalMode === 'add' ? 'Add Room' : 'Update Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
