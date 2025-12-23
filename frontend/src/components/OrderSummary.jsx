import React from 'react'
import {motion} from 'framer-motion'
import { useCartStore } from '../stores/useCartStore'
import { Link } from 'react-router-dom';
import { MoveRight } from 'lucide-react';
import {loadStripe} from '@stripe/stripe-js'
import axios from "../lib/axios"

const stripePromise=loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
  // Fallbacks to prevent undefined errors
  const safeSubtotal = typeof subtotal === 'number' && !isNaN(subtotal) ? subtotal : 0;
  const safeTotal = typeof total === 'number' && !isNaN(total) ? total : 0;
  const savings = safeSubtotal - safeTotal;
  const formattedSubtotal = safeSubtotal.toFixed(2);
  const formattedSavings = savings.toFixed(2);
  const formattedTotal = safeTotal.toFixed(2);
  // Calculate coupon discount if not present
  let couponDiscount = 0;
  if (coupon && coupon.discountPercentage) {
    couponDiscount = safeSubtotal * (coupon.discountPercentage / 100);
  }

  const handlePayment=async()=>{
    const res = await axios.post("/payments/create-checkout-session", { products: cart, couponCode: coupon ? coupon.code : null });
    const session = res.data;
    if (session.url) {
      window.location.href = session.url;
    } else {
      console.error("Stripe session URL not found", session);
    }
  }

    // if(result.error){
    //   console.error(result.error.message);
    // }


  
  return (
   <motion.div
   className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6 '
   initial={{opacity:0,y:20}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.5,delay:0.6}}
   >
    <p className='text-xl font-semibold text-emerald-400 '>Order Summary</p>
    <div className='space-y-4'>
      <div className='space-y-2'>
        <dl className='flex items-center justify-between gap-4'>
          <dt className='text-base font-normal text-gray-300 '>Original Price</dt>
          <dd className='text-base font-medium text-white '>₹{formattedSubtotal}</dd>
        </dl>

        {savings>0 && (
        <dl className='flex items-center justify-between gap-4'>
          <dt className='text-base font-normal text-gray-300 '>You Save</dt>
          <dd className='text-base font-medium text-emerald-400 '>-₹{formattedSavings}</dd>
        </dl>
        )}


        {
          coupon && isCouponApplied && (
            <dl className='flex items-center justify-between gap-4'>
              <dt className='text-base font-normal text-gray-300 '>Coupon ({coupon.code}) Applied</dt>
              <dd className='text-base font-medium text-emerald-400 '>
                -₹{couponDiscount.toFixed(2)}
              </dd>
            </dl>
          )
        }


        {
          <dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
            <dt className='text-base font-bold text-white '>Total</dt>
            <dd className='text-base font-bold text-white '> ₹{formattedTotal}</dd>
          </dl>
        }



      </div>

      <motion.button
      className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
      whileHover={{scale:1.05}}
      whileTap={{scale:0.95}}
      onClick={handlePayment}
      >
        Proceed to Checkout
      </motion.button>

      <div className='flex items-center justify-center gap-2'>
        <span className='text-sm font-normal text-gray-400'>or</span>
        <Link to='/' className='text-sm font-medium text-emerald-400 hover:underline'>Continue Shopping
        <MoveRight size={16}></MoveRight>
        </Link>
      </div>
    </div>
   </motion.div>
  )
}

export default OrderSummary