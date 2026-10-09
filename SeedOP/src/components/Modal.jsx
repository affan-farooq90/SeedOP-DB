// components/Modal.js
import React from 'react';
import { useRef } from 'react';

const Modal = ({ isOpen, onClose, item, notify }) => {
  if (!isOpen) return null;
  const seedRef = useRef()

  const handleCopy = () => {
    let copyText;
    if(item.seedPhrase) {
      copyText = item.seedPhrase.toString().replace(/,/g , ' ');
    }else{
      copyText = seedRef.current.innerText
    }
    navigator.clipboard.writeText(copyText)  
    notify("Copied")
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[hsla(125,87%,91%,0.95)] p-5 rounded-lg shadow-lg w-[60%] h-max relative view-modal">
        <div className='flex flex-row-reverse justify-between'>
        <button
            onClick={onClose}
            className=" bg-red-500 text-white p-2 rounded-3xl ">
            <img width={'24px'} src="/close.svg" alt="Copy" />
        </button>
        <h2 className="text-lg font-bold mb-2">Wallet Details</h2>
        </div>
        {item.seedPhrase ? (
          <div className='flex flex-col'>
            <h2 className='flex items-center gap-2'>Wallet Name :  <h1 className='text-lg font-medium'>  {item.walletName}</h1> </h2>
            <div className='flex justify-between items-center my-2  w-[100%]'>
                <h3 className="font-medium">Seed Phrase:</h3> <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded" id='copyBtn' onClick={handleCopy}>
                <img width={'24px'} src="/copy.svg" alt="Copy" />
                </button>
            </div>
            <div className='grid grid-cols-3 place-items-center'>
            {item.seedPhrase.map((code, index)=>(
                <code key={index} ref={seedRef} className='bg-[#101e34] text-green-500 p-2 px-3 my-2 border border-none rounded-md w-max min-w-[50%] h-max text-center'>{code}</code>
            ))}
            </div>
            {/* <code ref={seedRef} className='bg-[#101e34] text-green-500 p-2 px-3 my-2 border border-none rounded-md min-w-[100%]'>{item.seedPhrase.join(' ')}</code> */}
          </div>
        ) : (
          <div>
             <h2 className='flex items-center'>Wallet Name :  <h1 className='text-lg font-medium'>  {item.walletName}</h1> </h2>
            <div className='flex justify-between items-center'>
            <h3 className="font-medium">Private Key:</h3>
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded text-right" onClick={handleCopy} id='copyBtn'>
              <img width={'24px'} src="/copy.svg" alt="Copy" />
            </button>
            </div>
            <code ref={seedRef} className='bg-[#101e34] text-green-500 p-2 border border-none rounded-md'>{item.privateKey}</code>
          </div>
        )}
        
        
      </div>
    </div>
  );
};

export default Modal;
