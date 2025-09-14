import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import React from 'react'

const CartIcon = ({openModal,cart}) => {
  return (
        <div className="absolute top-6 right-6">
        <button
          onClick={openModal}
          className="relative text-blue-600 hover:text-blue-800 transition-all"
          title="View Cart"
        >
          <ShoppingCartIcon className="w-8 h-8" />
          {(JSON.parse(localStorage.getItem("tests"))?.length || 0) +
            (JSON.parse(localStorage.getItem("packages"))?.length || 0) >
            0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5 shadow-md">
              {cart.length}
            </span>
          )}
        </button>
      </div>
  )
}

export default CartIcon
