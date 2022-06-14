import React from "react";
import CartCard from "./cartCard";
function Cart() {
    return (

<div class="container h-100 py-5">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-10">

        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-normal mb-0 text-white">Shopping Cart</h3>
          <div>
            <p class="mb-0"><span class="text-muted">Sort by:</span> <a href="#!" class="text-body">price <i
                  class="fa fa-angle-down mt-1"></i></a></p>
          </div>
        </div>

        <CartCard/>
        <CartCard/>

    </div>
    </div>
    </div>
       
    );
}

export default Cart;