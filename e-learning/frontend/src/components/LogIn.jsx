import React from 'react';
import Forms from './Forms';
const LogIn = () => {
  return (
    <div className='flex w-full h-screen'>
       <div className='w-full flex items-center justify-center lg:w-1/2 '>
        {/* <h1 className='text-white text-4xl font-bold'>Hola</h1> */}
        <Forms />
       </div>
       <div className='hidden relative lg:flex w-1/2 items-center justify-center h-full bg-gray-200 '>
        <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-spin"/>
        <div className="w-full h-1/2 absolute bottom-0 bg-white/10 background-blur-lg"/>
       </div>
    </div>
  );
};

export default LogIn;