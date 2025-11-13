import React from 'react'

const Login = () => {
  return (
    <div>
      <form className='flex w-[50%] mx-auto my-6' action="">
        <div className='flex flex-col gap-4 w-full p-10 border border-gray-300 rounded-md shadow-md'>
          <h2 className='text-2xl font-bold mb-4'>Login to Your Account</h2>
          <input className='border-solid rounded-sm p-3' name="email" type="email" placeholder="E-Mail" required autoComplete="email" />

          <input className='border-solid rounded-sm p-3'  name="password" type="password" placeholder="Password" required autoComplete="current-password" />

          <div className='flex items-center'>
            <input className='mx-2' name="remember" type="checkbox" />
            Remember me
          </div>

          <button
           className='rounded bg-green-400 p-2 text-white font-bold hover:bg-green-500 transition-colors'
            type="button"
            onClick={(e) => {
              const form = e.target.form;
              const data = new FormData(form);
              const email = (data.get('email') || '').toString().trim();
              const password = (data.get('password') || '').toString();
              const remember = !!data.get('remember');

              if (!email || !password) {
                alert('Please enter both email and password.');
                return;
              }

              fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, remember }),
              })
                .then((res) => {
                  if (!res.ok) throw new Error('Login failed');
                  return res.json();
                })
                .then((json) => {
                  console.log('Login successful', json);
                  // redirect or update UI as needed
                })
                .catch((err) => {
                  alert(err.message || 'Network error');
                });
            }}
          >
            Login
          </button>

          <div style={{fontSize: 12}}>
            <a href="/forgot">Forgot password?</a> · <a href="/signup">Sign up</a>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login
