import { CheckCircle } from 'lucide-react'
import React, { use, useEffect, useState } from 'react'
import { useCartStore } from '../stores/useCartStore';
import axios from '../lib/axios';
import Confetti from 'react-confetti'

const PurchaseSuccessPage = () => {
  const [isProcessing,setIsProcessing]=useState(true);
  const {clearCart}=useCartStore();
  const [error,setError]=useState(null);
  useEffect(()=>{
    const handleCheckoutSuccess=async()=>{
      try {
        await axios.post('/payments/checkout-success',{
          sessionId
        })
        clearCart();
      } catch (error) {
        console.error("Error handling checkout success:",error)
      }finally{
        setIsProcessing(false)
      }
    }
    const sessionId=new URLSearchParams(window.location.search).get('session_id');
    if(sessionId){
      handleCheckoutSuccess(sessionId)
    }else{
      setIsProcessing(false);
      setError("No session ID found in the URL");
    }
  },[clearCart])
  if(isProcessing)return "Processing..."
  if(error) return `Error: ${error}`

  return (
    <div className='h-screen flex items-center justify-center px-4 '>
      
      {/* confetti */}
      <Confetti 
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{zIndex:99}}
        numberOfPieces={700}
        recycle={false}
      />

      <div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
        <div className='p-6 sm:p-8 '>
          <CheckCircle className='text-emerald-400 w-16 h-16 mb-4'/>
        </div>
        <h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
          Purchase Successful!
        </h1>
        <p className='text-gray-300 text-center mb-2'>
          Thank You for you order. {"We're"} processing your order and will update you once it ships.
        </p>
        <p className='text-gray-400 text-center mb-6'>
          You will receive an email with the order details shortly.
        </p>

        <div className='bg-gray-700 rounded-lg p-4 mb-6'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm text-gray-400 '>Order number</span>
            <span className='text-sm font-semibold text-emerald-400'>#123456</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-400 '>Estimated delivery</span>
            <span className='text-sm font-semibold text-emerald-400'>3-5 business days</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseSuccessPage