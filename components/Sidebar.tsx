import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Footer from './Footer';
import { UserProps } from '@/types';


const Sidebar = ({isCollapsed,toggleSidebar,user}:{isCollapsed:boolean,toggleSidebar:()=> void,user:UserProps}) => {
  const pathName = usePathname()
  return (
    <div className={`bg-gray-800 text-white p-4 flex flex-col min-h-screen fixed top-0 left-0 ${isCollapsed ? 'w-20' : 'w-68'} transition-width duration-300`}>
      <div className="flex items-center text-white justify-between p-4 font-bold text-2xl">
          <Link href="/" className='mb-12 cursor-pointer flex items-center gap-2'>
          <Image src={'/assets/icons/logo.svg'} className='rounded-[25px] bg-white' width={24} height={24} alt='logo'/>
          {!isCollapsed && <h1>E-Vote Admin</h1>}
          </Link>
        <button onClick={toggleSidebar} className="mb-12 text-white focus:outline-none">
          <Menu className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1">
        <ul>
          {sidebarLinks.map((item) => {
            const isActive = pathName === item.route || pathName.startsWith(`/${item.route}`);
            return (
              <li key={item.label}>
                <Link href={item.route} className={cn('flex gap-3 items-center py-1 md:p-3 2xl:p-4 rounded-lg justify-center xl:justify-start', {'bg-bank-gradient': isActive})}>
                  <div className="relative size-6">
                    <Image 
                      src={item.imgURL} 
                      alt={item.label} 
                      fill
                      // width={24}
                      // height={24}
                      className={cn({'brightness-[3] invert-0': isActive})} 
                    />
                  </div>
                  {!isCollapsed && (
                    <p className={cn('text-16 font-semibold text-black-2 max-xl:hidden', {'!text-white': isActive})}>
                      {item.label}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <Footer user={user!} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} type='mobile' />
    </div>
  );
};

export default Sidebar;
