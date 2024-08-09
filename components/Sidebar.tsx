"use client"
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import Footer from './Footer'
import { UserProps } from '@/types'
import { getCurrentUserActions } from '@/lib/actions/user.actions'
import { Menu } from 'lucide-react'
import { Button } from './ui/button'

const Sidebar = () => {
  const pathName = usePathname()
  const router = useRouter();
  const [user, setUser] = useState<UserProps>();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push('/sign-in');
    } else {
      const getCurrentUser = async () => {
        const response = await getCurrentUserActions({ currentUser });
        setUser(response);
      };
      getCurrentUser();
    }
  }, [router]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <section className={`bg-gray-800 text-white h-screen p-4 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }fixed top-0 left-0`}>
      <nav className='flex flex-col gap-4'>
        <div className="flex justify-between mb-12 items-center">
          <Link href={'/'} className='cursor-pointer flex items-center gap-2'>
            <Image src={'/assets/icons/logo.svg'} width={34} height={34} alt='Horizon logo' className='size-[24px] max-lg:size-15 mr-2' />
            <h1 className={`2xl:text-26 text-[26px] font-bold text-black max-xl:${isCollapsed ? 'hidden' : 'block'}`}>E-Vote</h1>
          </Link>
          <Button onClick={() => setIsCollapsed((prev) => !prev)} className=" z-10 bg-gray-700 hover:bg-gray-600">
            <Menu />
          </Button>
        </div>
        {
          sidebarLinks.map((item) => {
            const isActive = pathName === item.route || pathName.startsWith(`/${item.route}`)
            return (
              <Link href={item.route} key={item.label} className={cn('sidebar-link flex items-center gap-4', {'bg-bank-gradient': isActive})}>
                <div className='relative w-6 h-6'>
                  <Image src={item?.imgURL || '' } alt={item.label} fill className={cn({'brightness-[3] invert-0': isActive})} />
                </div>
                {!isCollapsed && (
                  <p className={cn('sidebar-label', {'!text-white': isActive})}>
                    {item.label}
                  </p>
                )}
              </Link>
            )
          })
        }
      </nav>
      <Footer user={user!} type='mobile' />
    </section>
  )
}

export default Sidebar
