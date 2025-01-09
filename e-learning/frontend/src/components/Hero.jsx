import React from 'react';
import heroImagen from "../images/heroe/heroImagen.png"

const Hero = () => {
  return (
    <div className='flex flex-col xl:flex-row xl:h-screen items-center pt-[5rem] w-full xl:max-w-[1250px] mx-auto px-4'>
      <div className='flex flex-col flex-1 h-full items-center xl:items-start justify-center text-white text-center xl:text-start space-y-8 mb-[4rem]'>
        <p className='text-[#eB7d0e]'>
            Aplicacion E-Learning
        </p>
        <h1 className='text-[2.5rem] font-bold w-full xl:w-[25rem]'>
            AD UPTNMLS
        </h1>
        <p className='text-xs w-full xl:w-[19rem] text-gray-200'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
        <button className='text-sm w-[10rem] py-2 rounded-full bg-gradient-to-t from-[#D80027] to-[#f89E3C]'>
            Empezar
        </button>
      </div>

      <div className='flex items-center justify-center flex-1 h-full'>
        <img src={heroImagen} alt='hero' />
      </div>

    </div>
  );
};

export default Hero;