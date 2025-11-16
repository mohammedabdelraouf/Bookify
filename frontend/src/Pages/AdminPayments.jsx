import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../Context/AppContext.jsx';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchAllPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [methodFilter, statusFilter, payments]);

  const fetchAllPayments = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login as admin');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/payments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data = await response.json();
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      alert('Failed to load payments: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    if (methodFilter !== 'All') {
      filtered = filtered.filter(p => p.paymentMethod === methodFilter);
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(p => p.paymentStatus === statusFilter);
    }

    setFilteredPayments(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Succeeded':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'Stripe':
        return 'text-purple-600 bg-purple-100';
      case 'CashOnArrival':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-xl'>Loading payments...</p>
      </div>
    );
  }

  return (
    <div className='w-full h-screen overflow-y-auto bg-gray-100'>
      <div className='p-6'>
        {/* Header */}
        <div className='bg-white shadow-sm p-6 rounded-lg mb-6'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Payments Management
          </h1>
          <p className='text-gray-600'>
            View and track all payment transactions
          </p>
        </div>

        {/* Filters and Stats */}
        <div className='bg-white shadow-sm p-6 rounded-lg mb-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            {/* Stats */}
            <div className='flex gap-6'>
              <div>
                <p className='text-sm text-gray-600'>Total Payments</p>
                <p className='text-2xl font-bold text-gray-800'>{payments.length}</p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Succeeded</p>
                <p className='text-2xl font-bold text-green-600'>
                  {payments.filter(p => p.paymentStatus === 'Succeeded').length}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Pending</p>
                <p className='text-2xl font-bold text-yellow-600'>
                  {payments.filter(p => p.paymentStatus === 'Pending').length}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Revenue</p>
                <p className='text-2xl font-bold text-teal-600'>
                  ${payments.filter(p => p.paymentStatus === 'Succeeded').reduce((sum, p) => sum + p.totalCost, 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className='flex gap-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Payment Method
                </label>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                >
                  <option value='All'>All Methods</option>
                  <option value='Stripe'>Stripe</option>
                  <option value='CashOnArrival'>Cash On Arrival</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                >
                  <option value='All'>All Status</option>
                  <option value='Succeeded'>Succeeded</option>
                  <option value='Pending'>Pending</option>
                  <option value='Failed'>Failed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className='bg-white shadow-sm rounded-lg overflow-hidden'>
          {filteredPayments.length === 0 ? (
            <div className='text-center py-10'>
              <p className='text-xl text-gray-600'>No payments found</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Payment ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Booking ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Room
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Amount
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Method
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Transaction ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.paymentId} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>
                          #{payment.paymentId}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          #{payment.bookingId}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {payment.roomTypeName}
                        </div>
                        <div className='text-xs text-gray-500'>
                          Room {payment.roomNumber}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        ${payment.totalCost}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMethodColor(payment.paymentMethod)}`}>
                          {payment.paymentMethod}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-xs text-gray-500 font-mono'>
                          {payment.transactionId || 'N/A'}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {payment.paymentDate
                          ? new Date(payment.paymentDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.paymentStatus)}`}>
                          {payment.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredPayments.length > 0 && (
          <div className='mt-6 bg-white shadow-sm p-6 rounded-lg'>
            <div className='flex justify-between items-center'>
              <p className='text-gray-600'>
                Showing {filteredPayments.length} of {payments.length} payments
              </p>
              <p className='text-lg font-bold text-gray-800'>
                Filtered Revenue: $
                {filteredPayments.filter(p => p.paymentStatus === 'Succeeded').reduce((sum, p) => sum + p.totalCost, 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
