import React from 'react';
import { HiMenu } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  }

  return (
    <div className='absolute w-full h-[5rem]'>
      <div className='hidden lg:flex items-center w-full h-full xl:max-w-[1250px] mx-auto px-4'>
        <p className='font-bold text-[1.5rem] cursor-pointer text-[#eefb03]'>LOGO</p>

        <div className='flex-1 flex items-center justify-end space-x-10'>
          <ul className='flex items-center space-x-6'>
            <li className='text-sm text-gray-200 cursor-pointer hover:text-[#eefb03]'>
              <a href='#'>Inicio</a>
            </li>
            <li className='text-sm text-gray-200 cursor-pointer hover:text-[#eefb03]'>
              <a href='#'>Cursos</a>
            </li>
            <li className='text-sm text-gray-200 cursor-pointer hover:text-[#eefb03]'>
              <a href='#'>Contacto</a>
            </li>
          </ul>

          <button onClick={() => handleNavigation('/LogIn')} className='w-[8rem] py-2 text-gray-200 hover:border border-[#eefb03] rounded-lg'>
            Iniciar sesion
          </button>
          <button onClick={() => handleNavigation('/SignUp')} className='w-[8rem] py-2 bg-[#eefb03] border-rounded-lg text-black rounded-md'>
            Registrarse
          </button>
        </div>
    
      </div>
      
      <div className='w-full h-full flex items-center px-4 text-white'>
        <HiMenu size={24} className='lg:hidden' />
      </div>
    </div>
  );
};

export default Header;
