import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Define the Context
export const AppContext = createContext();

// Define a custom hook for easy access to the context
export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }) => { // Accept children prop
    const navigate = useNavigate();
    const API_BASE_URL = 'https://localhost:7010/api';

    // 2. Use useState to store the actual data and loading/error states
    const [rooms, setRooms] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

    // 3. Centralized Fetch Function
    const fetchData = async (endpoint, setDataState) => {
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // If the user isn't logged in (401 Unauthorized), we can log them out/redirect
                if (response.status === 401 && endpoint !== '/rooms') {
                    console.warn('Unauthorized access. Logging out...');
                    localStorage.removeItem('token');
                    setLoggedIn(false);
                    navigate('/login');
                    return;
                }
                throw new Error(`HTTP error! Status: ${response.status} for ${endpoint}`);
            }

            const data = await response.json();
            
            if (endpoint.includes('Room')) {
                // Clean up room data structure as done previously
                const cleanedRooms = data.map(room => ({
                    id: room.roomId,
                    number: room.roomNumber,
                    floor: room.floor,
                    status: room.status,
                    type: room.roomTypeName,
                    description: room.roomTypeDescription,
                    capacity: room.roomTypeCapacity,
                    price: room.roomTypePricePerNight
                }));
                setDataState(cleanedRooms.filter(room => room.status === 'Available'));
            } else {
                setDataState(data);
            }

            console.log(`Successfully fetched data from ${endpoint}:`, data);
            return data;

        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
            setError(error.message);
            setDataState([]); // Clear data on error
        }
    };

    // 4. useEffect to call fetch functions once on mount
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);
            
            // Note: I'm using the corrected endpoints based on your API structure
            const roomPromise = fetchData('/Room/GetAvailableRooms', setRooms); 
            
            // Only fetch users and bookings if the user is logged in
            if (loggedIn) {
                const userPromise = fetchData('/Users', setUsers); 
                const bookingPromise = fetchData('/Bookings', setBookings);
                await Promise.all([roomPromise, userPromise, bookingPromise]);
            } else {
                // Wait for rooms to load, but don't fetch users/bookings
                await roomPromise; 
            }
            
            setIsLoading(false);
        };

        fetchAllData();
    }, [loggedIn, navigate]); // Rerun if login status changes

    // 5. Value to be provided to consumers
    const contextValue = {
        // State
        rooms,
        users,
        bookings,
        isLoading,
        error,
        loggedIn,
        
        // Functions
        setLoggedIn,
        navigate,
        fetchData: fetchData, // Expose fetchData if components need to refresh data manually
    };
    
    // 6. Provide the context
    return (
        <AppContext.Provider value={contextValue}>
            {/* Render children passed to the provider, which includes App */}
            {children} 
        </AppContext.Provider>
    );
}

export default AppContextProvider;