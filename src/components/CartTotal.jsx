import React, { useContext } from "react";
import { CartContext } from "../context/Cartcontext";
import Title from "./Title";

const CartTotal = () => {
  const { getCartTotal } = useContext(CartContext);

  const currency = "$";     // or add this in ProductContext if needed
  const delivery_fee = 10;  // static shipping fee

  const subTotal = getCartTotal();
  const total = subTotal === 0 ? 0 : subTotal + delivery_fee;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTAL"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm pr-10">

        {/* Subtotal */}
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency} {subTotal.toFixed(2)}
          </p>
        </div>

        <hr />

        {/* Shipping Fee */}
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {delivery_fee.toFixed(2)}
          </p>
        </div>

        <hr />

        {/* Total */}
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency} {total.toFixed(2)}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
