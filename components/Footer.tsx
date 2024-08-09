"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({user,type}:{user:any,type:string}) => {
    const router = useRouter()
    const handleLogOut = async () => {
        
    }
return (
    <footer className='footer'>
    <div className={type ==='mobile' ? 'footer_name-mobile': 'footer_name'}>
        <p className='text-xl font-bold text-gray-700'>
            {/* {user?.firstName[0]} */} A
        </p>
    </div>
    <div className={type ==='mobile' ? 'footer_email-mobile': 'footer_email'}>
        <h1 className='text-14 truncate font-semibold text-gray-700'>
            {/* {user?.firstName} {user?.lastName} */} alpha fall
        </h1>
        <p className='text-14 truncate font-normal text-gray-700'>
            {/* {user?.email} */} alpha@gmail.com
        </p>
    </div>
    <div className='footer_image' onClick={handleLogOut}>
        <Image src='assets/icons/logout.svg' fill alt='logout logo' />
    </div>
    </footer>
  )
}

export default Footer