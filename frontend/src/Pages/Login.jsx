import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useAppContext, API_BASE_URL } from '../Context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { setLoggedIn } = useAppContext();

  const handleLogin = (e) => {
    // 1. Prevent default form submission behavior (which causes a page reload)
    e.preventDefault(); 
    
    // Get form data from the event target (the form element)
    const form = e.target; 
    const data = new FormData(form);
    const email = (data.get('email') || '').toString().trim();
    const password = (data.get('password') || '').toString();
    const remember = !!data.get('remember');

    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    fetch(`${API_BASE_URL}/accounts/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember }),
    })
      .then((res) => {
        if (!res.ok) {
          // If the response is not okay (e.g., 401 Unauthorized),
          // throw an error to be caught by the catch block.
          throw new Error('Login failed: Invalid credentials or server error.');
        }
        return res.json();
      })
      .then((json) => {
        console.log('Login successful', json);

        // Store token and user info in localStorage
        localStorage.setItem('token', json.token);
        localStorage.setItem('userEmail', json.email);
        localStorage.setItem('userRole', json.roles[0]);

        // Update AppContext state
        setLoggedIn(true);

        // Navigate on successful login
        navigate('/rooms');
      })
      .catch((err) => {
        // Display the error message
        alert(err.message || 'Network error');
      });
  };

  return (
    <div>
      {/* 2. Attach the handler to the form's onSubmit event */}
      <form className='flex w-[50%] mx-auto my-6' onSubmit={handleLogin}>
        <div className='flex flex-col gap-4 w-full p-10 border border-gray-300 rounded-md shadow-md'>
          <h2 className='text-2xl font-bold mb-4'>Login to Your Account</h2>
          
          <input className='border-solid rounded-sm p-3' name="email" type="email" placeholder="E-Mail" required autoComplete="email" />

          <input className='border-solid rounded-sm p-3' name="password" type="password" placeholder="Password" required autoComplete="current-password" />

          <div className='flex items-center'>
            <input className='mx-2' name="remember" type="checkbox" />
            Remember me
          </div>
          
          {/* 3. Use a standard <button type="submit"> to trigger the form's onSubmit event */}
          <button
            className='rounded text-center bg-green-400 p-2 text-white font-bold hover:bg-green-500 transition-colors'
            type="submit"
          >
            Login
          </button>

          <div style={{ fontSize: 12 }}>
            <Link to="/forgot">Forgot password?</Link> · <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login