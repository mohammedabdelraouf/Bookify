import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
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

    useEffect(() => {
        if (!bookingId) {
            alert('No booking found');
            navigate('/rooms');
        }
    }, [bookingId, navigate]);

    const handlePayment = (event) => {
        event.preventDefault();
        const paymentData = {
            cardNumber: event.target.cardNumber.value,
            expiryDate: event.target.expiryDate.value,
            cvv: event.target.cvv.value,
            cardHolderName: event.target.cardHolderName.value,
        };
        console.log("Processing payment with data:", paymentData);
        // Add logic to handle payment processing here

    };
  return (
    <main className='w-8/12 mx-auto mt-8 mb-8'>  
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
                <button className='bg-green-400 p-2  w-full rounded text-white font-bold hover:bg-green-500 transition-colors' type="submit">Pay Now</button>
            </form>
        </div>
    </main>
  )
}

export default Payment
