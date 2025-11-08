import React from 'react'

const Footer = () => {
    return (
        <div className='w-100 bg-emerald-700 text-white p-4 flex flex-row gap-28  justify-around'>
            <div className='flex flex-col gap-6'>
                <h1 className='font-bold text-4xl' >Bookify</h1>
                <p className='align-bottom'>© 2025 Bookify. All rights reserved.</p>
            </div>
            <div className='w-1/3'>
                <h2 className='text-3xl font-bold'>info</h2>
                <p >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid est inventore blanditiis! Ea aut numquam atque omnis distinctio, laboriosam neque doloribus, voluptatum blanditiis ipsa aspernatur quam dolores tempore minus at?</p>
            </div>
            <div className='flex flex-col ml-20 gap-2'>
                <h2 className='font-bold text-2xl'>Contact Us</h2>
                <p>Email:Bookify@DEPI.eg </p>
                <p>Phone: +20 123 456 7890</p>
                <p>Address: 123 Book St, Cairo, Egypt</p>
            </div>



        </div>
    )
}

export default Footer
