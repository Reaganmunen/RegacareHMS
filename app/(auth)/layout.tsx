import Image from 'next/image'
import React from 'react'

const Authlayout = ({children}:{children: React.ReactNode}) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
        <div className="w-1/2 h-full flex items-center justify-center">
            {children}
        </div>
        <div className="hidden md:flex w-1/2 h-full relative">
        <Image src="https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        width={1000}
        height={1000}
        alt="stethoscope"
        className="w-full h-full object-cover"
        />
        <div className="absolute top-0 w-full h-full bg-black/30 bg z-10 flex flex-col items-center justify-center">
            <h1 className="text-3xl 2xl:text-5xl font-bold text-white">RegaCare HMS</h1>
            <p className="text-blue-600 text-base">You're Welcome!</p>
        </div>

        </div>
    </div>
  )
}

export default Authlayout