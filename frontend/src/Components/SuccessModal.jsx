const SuccessModal = ({ isOpen, onClose, bookingDetails }) => {
  if (!isOpen) return null;

  const { bookingId, confirmationNumber, roomNumber, checkInDate, checkOutDate, totalAmount } = bookingDetails || {};

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-slideIn'>
        {/* Success Icon */}
        <div className='flex justify-center mb-6'>
          <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center'>
            <svg className='w-12 h-12 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className='text-3xl font-bold text-center text-gray-900 mb-2'>
          Booking Confirmed!
        </h2>
        <p className='text-center text-gray-600 mb-6'>
          Your payment was successful and your booking has been confirmed.
        </p>

        {/* Booking Details Card */}
        <div className='bg-gray-50 rounded-lg p-6 mb-6 space-y-3'>
          <div className='flex justify-between items-center pb-3 border-b border-gray-200'>
            <span className='text-sm text-gray-600'>Confirmation Number</span>
            <span className='text-lg font-bold text-teal-600'>{confirmationNumber || bookingId}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600'>Room Number</span>
            <span className='font-semibold text-gray-900'>{roomNumber}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600'>Check-in</span>
            <span className='font-semibold text-gray-900'>
              {new Date(checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600'>Check-out</span>
            <span className='font-semibold text-gray-900'>
              {new Date(checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className='flex justify-between items-center pt-3 border-t border-gray-200'>
            <span className='text-sm text-gray-600'>Total Paid</span>
            <span className='text-xl font-bold text-green-600'>${totalAmount}</span>
          </div>
        </div>

        {/* Info Message */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
          <div className='flex gap-3'>
            <svg className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
            </svg>
            <p className='text-sm text-blue-800'>
              A confirmation email has been sent to your registered email address with all booking details.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3'>
          <button
            onClick={() => window.print()}
            className='flex-1 px-4 py-3 border border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z' />
            </svg>
            Print
          </button>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors'
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
