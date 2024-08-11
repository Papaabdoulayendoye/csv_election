"use client"
import { UserProps } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({isCollapsed,toggleSidebar,user,type}:{isCollapsed:boolean,toggleSidebar:()=> void,user:UserProps,type:string}) => {
    const router = useRouter()
    const handleLogOut = async () => {
        
    }
return (
    <footer className='footer'>
    <div className={type ==='mobile' ? 'footer_name-mobile': 'footer_name'}>
        <p className='text-xl font-bold text-gray-700'>
            {user?.nom[0]}
        </p>
    </div>
    {!isCollapsed && (
    <div className={type ==='mobile' ? 'footer_email-mobile': 'footer_email'}>
        <h1 className='text-14 truncate font-semibold text-gray-700'>
            {user?.nom}
        </h1>
        <p className='text-14 truncate font-normal text-gray-700'>
            {user?.email}
        </p>
    </div>
    )}
    {!isCollapsed && (
    <div className='footer_image' onClick={handleLogOut}>
        <Image src='/assets/icons/logout.svg' fill alt='logout logo' />
    </div>
    )}
    </footer>
  )
}

export default Footer