import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../Context/AppContext.jsx';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, customers]);

  const fetchAllCustomers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login as admin');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const bookingsData = await response.json();

      // Group bookings by user email to get customer statistics
      const customersMap = {};

      bookingsData.forEach(booking => {
        const email = booking.userEmail;
        if (!customersMap[email]) {
          customersMap[email] = {
            email: email,
            firstName: booking.userFirstName,
            lastName: booking.userLastName,
            totalBookings: 0,
            totalSpent: 0,
            bookings: []
          };
        }
        customersMap[email].totalBookings += 1;
        customersMap[email].totalSpent += booking.totalCost;
        customersMap[email].bookings.push(booking);
      });

      // Convert map to array
      const customersArray = Object.values(customersMap);

      setCustomers(customersArray);
      setFilteredCustomers(customersArray);
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Failed to load customers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(c =>
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-xl'>Loading customers...</p>
      </div>
    );
  }

  return (
    <div className='w-full h-screen overflow-y-auto bg-gray-100'>
      <div className='p-6'>
        {/* Header */}
        <div className='bg-white shadow-sm p-6 rounded-lg mb-6'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Customers Management
          </h1>
          <p className='text-gray-600'>
            View all registered customers and their booking activity
          </p>
        </div>

        {/* Stats and Search */}
        <div className='bg-white shadow-sm p-6 rounded-lg mb-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            {/* Stats */}
            <div className='flex gap-6'>
              <div>
                <p className='text-sm text-gray-600'>Total Customers</p>
                <p className='text-2xl font-bold text-gray-800'>{customers.length}</p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Bookings</p>
                <p className='text-2xl font-bold text-teal-600'>
                  {customers.reduce((sum, c) => sum + c.totalBookings, 0)}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Revenue</p>
                <p className='text-2xl font-bold text-green-600'>
                  ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className='flex-1 max-w-md'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Search Customers
              </label>
              <input
                type='text'
                placeholder='Search by name or email...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
              />
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className='bg-white shadow-sm rounded-lg overflow-hidden'>
          {filteredCustomers.length === 0 ? (
            <div className='text-center py-10'>
              <p className='text-xl text-gray-600'>
                {searchTerm ? 'No customers found matching your search' : 'No customers found'}
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Customer Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Total Bookings
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Total Spent
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Latest Booking
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredCustomers.map((customer) => {
                    const latestBooking = customer.bookings.sort((a, b) =>
                      new Date(b.bookingDate) - new Date(a.bookingDate)
                    )[0];

                    return (
                      <tr key={customer.email} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            {customer.firstName} {customer.lastName}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-900'>
                            {customer.email}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-teal-600'>
                            {customer.totalBookings}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            ${customer.totalSpent.toFixed(2)}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {new Date(latestBooking.bookingDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredCustomers.length > 0 && (
          <div className='mt-6 bg-white shadow-sm p-6 rounded-lg'>
            <div className='flex justify-between items-center'>
              <p className='text-gray-600'>
                Showing {filteredCustomers.length} of {customers.length} customers
              </p>
              <p className='text-sm text-gray-600'>
                Average bookings per customer: {(customers.reduce((sum, c) => sum + c.totalBookings, 0) / customers.length).toFixed(1)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
