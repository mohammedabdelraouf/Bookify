import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../Context/AppContext.jsx';
import Toast from '../Components/Toast';
import SuccessModal from '../Components/SuccessModal';
import ProgressIndicator from '../Components/ProgressIndicator';
import {
  formatCardNumber,
  formatExpiryDate,
  formatCVV,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  getCardType,
  getCardIcon
} from '../utils/cardUtils.jsx';

const Payment = () => {
  const { RoomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, roomNumber, checkInDate, checkOutDate, totalAmount } = location.state || {};

  const [payMethod, setPayMethod] = useState('stripe');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  // Card form state
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });

  const [cardErrors, setCardErrors] = useState({});
  const [cardType, setCardType] = useState('unknown');

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const fetchBookingDetails = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch booking');

      const data = await response.json();
      setBooking(data);
    } catch (error) {
      showToast('Error loading booking: ' + error.message, 'error');
      setTimeout(() => navigate('/rooms'), 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bookingId) {
      showToast('No booking found', 'error');
      setTimeout(() => navigate('/rooms'), 2000);
    } else {
      fetchBookingDetails();
    }
  }, [bookingId, navigate]);

  const calculateNights = () => {
    const checkIn = new Date(booking?.checkInDate || checkInDate);
    const checkOut = new Date(booking?.checkOutDate || checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights;
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      setCardType(getCardType(formattedValue));
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = formatCVV(value);
    }

    setCardData({ ...cardData, [name]: formattedValue });

    // Clear error for this field
    if (cardErrors[name]) {
      setCardErrors({ ...cardErrors, [name]: '' });
    }
  };

  const validateCardForm = () => {
    const errors = {};

    if (!cardData.cardNumber || !validateCardNumber(cardData.cardNumber)) {
      errors.cardNumber = 'Please enter a valid card number';
    }

    if (!cardData.expiryDate || !validateExpiryDate(cardData.expiryDate)) {
      errors.expiryDate = 'Please enter a valid expiry date';
    }

    if (!cardData.cvv || !validateCVV(cardData.cvv)) {
      errors.cvv = 'Please enter a valid CVV';
    }

    if (!cardData.cardHolderName.trim()) {
      errors.cardHolderName = 'Please enter cardholder name';
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    // Validate card form if payment method requires it
    if (payMethod !== 'cash' && !validateCardForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Please login to continue', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const paymentData = {
      bookingId: bookingId,
      transactionId: transactionId,
      paymentMethod: payMethod.charAt(0).toUpperCase() + payMethod.slice(1),
      amount: amount
    };

    setProcessing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment failed');
      }

      const result = await response.json();

      // Set confirmation data for modal
      setConfirmationData({
        bookingId: bookingId,
        confirmationNumber: transactionId,
        roomNumber: booking?.roomNumber || roomNumber,
        checkInDate: booking?.checkInDate || checkInDate,
        checkOutDate: booking?.checkOutDate || checkOutDate,
        totalAmount: amount
      });

      // Show success modal
      setShowSuccessModal(true);

    } catch (error) {
      showToast('Payment failed: ' + error.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/my-bookings');
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4'></div>
          <p className='text-xl text-gray-600'>Loading booking details...</p>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const amount = booking?.totalCost || totalAmount || 0;
  const pricePerNight = amount / nights;
  const tax = amount * 0.1; // 10% tax example
  const subtotal = amount - tax;

  return (
    <main className='min-h-screen bg-gray-50 py-8 px-4'>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        bookingDetails={confirmationData}
      />

      <div className='max-w-7xl mx-auto'>
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={3} />

        {/* Main Content - Two Column Layout */}
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Left Column - Booking Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-2xl shadow-lg p-6 sticky top-8'>
              <h2 className='text-2xl font-bold mb-6 text-gray-900'>Booking Summary</h2>

              {/* Room Image Placeholder */}
              <div className='bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg h-48 mb-6 flex items-center justify-center'>
                <svg className='w-20 h-20 text-teal-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
                </svg>
              </div>

              <div className='space-y-4 mb-6'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Room Number</span>
                  <span className='font-semibold text-gray-900'>{booking?.roomNumber || roomNumber}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Check-in</span>
                  <span className='font-semibold text-gray-900'>
                    {new Date(booking?.checkInDate || checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Check-out</span>
                  <span className='font-semibold text-gray-900'>
                    {new Date(booking?.checkOutDate || checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Total Nights</span>
                  <span className='font-semibold text-gray-900'>{nights}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className='border-t border-gray-200 pt-4 space-y-3'>
                <h3 className='font-semibold text-gray-900 mb-3'>Price Details</h3>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>${pricePerNight.toFixed(2)} × {nights} nights</span>
                  <span className='text-gray-900'>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Taxes & Fees</span>
                  <span className='text-gray-900'>${tax.toFixed(2)}</span>
                </div>
                <div className='border-t border-gray-200 pt-3 flex justify-between items-center'>
                  <span className='font-bold text-gray-900'>Total Amount</span>
                  <span className='text-2xl font-bold text-teal-600'>${amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className='mt-6 bg-green-50 border border-green-200 rounded-lg p-3'>
                <div className='flex items-center gap-2 text-green-700 text-sm'>
                  <svg className='w-5 h-5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                  </svg>
                  <span className='font-medium'>Secure Payment</span>
                </div>
                <p className='text-xs text-green-600 mt-1 ml-7'>Your payment information is encrypted</p>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-2xl shadow-lg p-8'>
              <h2 className='text-2xl font-bold mb-6 text-gray-900'>Payment Method</h2>

              {/* Payment Method Selection */}
              <div className='grid md:grid-cols-3 gap-4 mb-8'>
                <button
                  onClick={() => setPayMethod('stripe')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    payMethod === 'stripe'
                      ? 'border-teal-600 bg-teal-50 shadow-md'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <div className='flex flex-col items-center gap-2'>
                    <svg className='h-8' viewBox='0 0 48 32' fill='none'>
                      <rect width='48' height='32' rx='4' fill='#635BFF'/>
                      <text x='24' y='20' fontSize='10' fill='white' fontWeight='bold' textAnchor='middle'>Stripe</text>
                    </svg>
                    <span className='text-sm font-medium'>Credit Card</span>
                  </div>
                </button>

                <button
                  onClick={() => setPayMethod('razorpay')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    payMethod === 'razorpay'
                      ? 'border-teal-600 bg-teal-50 shadow-md'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <div className='flex flex-col items-center gap-2'>
                    <svg className='h-8' viewBox='0 0 48 32' fill='none'>
                      <rect width='48' height='32' rx='4' fill='#3395FF'/>
                      <text x='24' y='20' fontSize='9' fill='white' fontWeight='bold' textAnchor='middle'>Razorpay</text>
                    </svg>
                    <span className='text-sm font-medium'>Razorpay</span>
                  </div>
                </button>

                <button
                  onClick={() => setPayMethod('cash')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    payMethod === 'cash'
                      ? 'border-teal-600 bg-teal-50 shadow-md'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <div className='flex flex-col items-center gap-2'>
                    <svg className='h-8 w-8 text-gray-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' />
                    </svg>
                    <span className='text-sm font-medium'>Cash</span>
                  </div>
                </button>
              </div>

              {/* Card Payment Form - Show only for card payments */}
              {payMethod !== 'cash' && (
                <form onSubmit={handlePayment} className='space-y-6'>
                  {/* Card Number */}
                  <div>
                    <label htmlFor='cardNumber' className='block text-sm font-medium text-gray-700 mb-2'>
                      Card Number
                    </label>
                    <div className='relative'>
                      <input
                        id='cardNumber'
                        name='cardNumber'
                        type='text'
                        value={cardData.cardNumber}
                        onChange={handleCardInputChange}
                        placeholder='1234 5678 9012 3456'
                        maxLength='19'
                        className={`block w-full pl-4 pr-12 py-3 border ${
                          cardErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors`}
                        required
                      />
                      <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                        {getCardIcon(cardType)}
                      </div>
                    </div>
                    {cardErrors.cardNumber && (
                      <p className='text-red-600 text-xs mt-1'>{cardErrors.cardNumber}</p>
                    )}
                  </div>

                  {/* Expiry and CVV */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label htmlFor='expiryDate' className='block text-sm font-medium text-gray-700 mb-2'>
                        Expiry Date
                      </label>
                      <input
                        id='expiryDate'
                        name='expiryDate'
                        type='text'
                        value={cardData.expiryDate}
                        onChange={handleCardInputChange}
                        placeholder='MM/YY'
                        maxLength='5'
                        className={`block w-full px-4 py-3 border ${
                          cardErrors.expiryDate ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors`}
                        required
                      />
                      {cardErrors.expiryDate && (
                        <p className='text-red-600 text-xs mt-1'>{cardErrors.expiryDate}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor='cvv' className='block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                        CVV
                        <span className='text-gray-400 text-xs' title='3 or 4 digit security code'>
                          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                          </svg>
                        </span>
                      </label>
                      <input
                        id='cvv'
                        name='cvv'
                        type='text'
                        value={cardData.cvv}
                        onChange={handleCardInputChange}
                        placeholder='123'
                        maxLength='4'
                        className={`block w-full px-4 py-3 border ${
                          cardErrors.cvv ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors`}
                        required
                      />
                      {cardErrors.cvv && (
                        <p className='text-red-600 text-xs mt-1'>{cardErrors.cvv}</p>
                      )}
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label htmlFor='cardHolderName' className='block text-sm font-medium text-gray-700 mb-2'>
                      Cardholder Name
                    </label>
                    <input
                      id='cardHolderName'
                      name='cardHolderName'
                      type='text'
                      value={cardData.cardHolderName}
                      onChange={handleCardInputChange}
                      placeholder='JOHN DOE'
                      className={`block w-full px-4 py-3 border ${
                        cardErrors.cardHolderName ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors uppercase`}
                      required
                    />
                    {cardErrors.cardHolderName && (
                      <p className='text-red-600 text-xs mt-1'>{cardErrors.cardHolderName}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type='submit'
                    disabled={processing}
                    className='w-full py-4 px-6 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2'
                  >
                    {processing ? (
                      <>
                        <svg className='animate-spin h-5 w-5 text-white' fill='none' viewBox='0 0 24 24'>
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                        </svg>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                        </svg>
                        Pay ${amount.toFixed(2)}
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Cash Payment Form */}
              {payMethod === 'cash' && (
                <form onSubmit={handlePayment}>
                  <div className='bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6'>
                    <div className='flex gap-3'>
                      <svg className='w-6 h-6 text-amber-600 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                      </svg>
                      <div>
                        <h4 className='font-semibold text-amber-900 mb-2'>Cash on Arrival</h4>
                        <p className='text-sm text-amber-800'>
                          You can pay in cash when you arrive at the hotel. Please bring the exact amount of ${amount.toFixed(2)} or have change ready.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type='submit'
                    disabled={processing}
                    className='w-full py-4 px-6 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2'
                  >
                    {processing ? (
                      <>
                        <svg className='animate-spin h-5 w-5 text-white' fill='none' viewBox='0 0 24 24'>
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                        </svg>
                        Confirming Booking...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Cancellation Policy */}
              <div className='mt-8 pt-6 border-t border-gray-200'>
                <h3 className='font-semibold text-gray-900 mb-3'>Cancellation Policy</h3>
                <p className='text-sm text-gray-600'>
                  Free cancellation up to 24 hours before check-in. After that, the first night will be charged. No-shows will be charged the full amount.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Payment;
