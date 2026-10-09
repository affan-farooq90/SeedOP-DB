import React from 'react'

const Navbar = () => {
  return (
    <div className='flex w-screen justify-around px-4 py-2 bg-[#101e34] items-center '>
      <h1 className='text-white text-xl font-semibold bg-[] '> <span className='text-[--buttons-secondary]'>&lt;</span> Seed<span className='text-[--buttons-secondary]'>OP</span><span className='text-[--buttons-secondary]'>/ &gt;</span> </h1>
      <div className='bg-green-500 px-2 py-1 border border-none rounded-xl text-white'>
        <a className='flex gap-2 items-center text-lg font-medium' target='_blank' href="https://github.com/03042006">
        <img className='w-8 text-white bg-[#ffffffca] border border-none rounded-[50%] p-1 shadow-inner ' src="https://img.icons8.com/?size=100&id=106564&format=png&color=000000" alt="github icon" />
        GitHub</a>
      </div>
    </div>
  )
}

export default Navbar
