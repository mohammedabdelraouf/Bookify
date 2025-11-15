import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../Context/AppContext.jsx'
import assets from '../assets/assets.js'
import Title from '../Components/Title.jsx'

const Payment = () => {
    const { RoomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId, roomNumber, checkInDate, checkOutDate, totalAmount } = location.state || {};

    const [payMethod, setPayMethod] = useState('cash');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const fetchBookingDetails = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(
                `${API_BASE_URL}/bookings/${bookingId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (!response.ok) throw new Error('Failed to fetch booking');

            const data = await response.json();
            setBooking(data);
        } catch (error) {
            alert('Error loading booking: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!bookingId) {
            alert('No booking found');
            navigate('/rooms');
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

    const handlePayment = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to continue');
            navigate('/login');
            return;
        }

        // Create mock transaction ID
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Prepare payment data
        const paymentData = {
            bookingId: bookingId,
            transactionId: transactionId,
            paymentMethod: payMethod.charAt(0).toUpperCase() + payMethod.slice(1), // Capitalize first letter
            amount: booking?.totalAmount || totalAmount
        };

        setProcessing(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/bookings/confirm-payment`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(paymentData)
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Payment failed');
            }

            const result = await response.json();
            // Handle success in Task 6
            console.log('Payment successful:', result);

        } catch (error) {
            alert('Payment failed: ' + error.message);
        } finally {
            setProcessing(false);
        }
    };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-xl'>Loading booking details...</p>
      </div>
    );
  }

  return (
    <main className='w-8/12 mx-auto mt-8 mb-8'>
        {/* Booking Summary */}
        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
            <h2 className='text-2xl font-bold mb-4'>Booking Summary</h2>
            <div className='space-y-2'>
                <p><strong>Room Number:</strong> {booking?.roomNumber || roomNumber}</p>
                <p><strong>Check-in:</strong> {new Date(booking?.checkInDate || checkInDate).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(booking?.checkOutDate || checkOutDate).toLocaleDateString()}</p>
                <p><strong>Total Nights:</strong> {calculateNights()}</p>
                <p className='text-xl font-bold text-green-600'>
                    <strong>Total Amount:</strong> ${booking?.totalAmount || totalAmount}
                </p>
                <p><strong>Status:</strong>
                    <span className='text-yellow-600'> {booking?.bookingStatus || 'Pending'}</span>
                </p>
            </div>
        </div>

        <div className='flex flex-col md:flex-row gap-5 justify-center items-center '>
            <div className='flex gap-3 flex-col'>
                <Title text1={"PAYMENT"} text2={'METHOD'} />
                <div onClick={()=>setPayMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                    <p className={`min-w-3.5 h-3.5 border rounded-full ${payMethod == 'stripe' ? 'bg-green-600' : '' }`}></p>
                    <img  className='h-5 mx-4' src={assets.stripe_logo} alt="" />
                </div>
                <div onClick={()=>setPayMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                    <p className={`min-w-3.5 h-3.5 border rounded-full ${payMethod == 'razorpay' ? 'bg-green-600' : '' }`}></p>
                    <img className='h-5 mx-4'  src={assets.razorpay_logo} alt="" />
                </div>
                <div onClick={()=>setPayMethod('cash')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                    <p className={`min-w-3.5 h-3.5 border rounded-full ${payMethod == 'cash' ? 'bg-green-600' : '' }`}></p>
                    <p className="text-gray-500 text-sm font-medium mx-4">Cash On Delivery</p>
                </div>
            </div>
            
            <form onSubmit={handlePayment} className="flex flex-col gap-3 max-w-md mx-auto p-4 border rounded-md w-full space-y-4">
                <h4 className='text-3xl font-bold text-center'>Payment</h4>
                <div  className="flex flex-row  justify-between ">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input  className='border rounded-md p-3 shadow-sm hover:border-s-black' type="text" id="cardNumber" name="cardNumber" placeholder="Enter your card number" required />
                </div>
                <div className="flex flex-row  justify-between ">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input className='border rounded-md p-3 shadow-sm hover:border-s-black'  type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" required />
                </div>
                <div className="flex flex-row  justify-between ">
                    <label htmlFor="cvv">CVV</label>
                    <input className='border rounded-md p-3 shadow-sm hover:border-s-black'  type="text" id="cvv" name="cvv" placeholder="Enter CVV" required />
                </div>
                <div className="flex flex-row  justify-between ">
                    <label htmlFor="cardHolderName">Cardholder Name</label>
                    <input className='border rounded-md p-3 shadow-sm hover:border-s-black'  type="text" id="cardHolderName" name="cardHolderName" placeholder="Enter cardholder name" required />
                </div>
                <button
                    disabled={processing}
                    className={`bg-green-400 p-2 w-full rounded text-white font-bold hover:bg-green-500 transition-colors ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type="submit"
                >
                    {processing ? 'Processing...' : 'Confirm Payment'}
                </button>
            </form>
        </div>
    </main>
  )
}

export default Payment
