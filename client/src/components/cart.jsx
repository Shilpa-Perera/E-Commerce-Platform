import React, {Component} from "react";
import { getCartProducts } from "../services/cartService";
import CartCard from "./cartCard";

class Cart extends Component {
  state = { 
    variant :  [] 
   } 

   async CartProducts(){
      const { data: variant } = await getCartProducts(1);
      this.setState({variant}) ;

   }
   async componentDidMount() {
       await this.CartProducts();
   }
  render() { 
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

          {this.state.variant.map(product => (
            <CartCard cart_id = {product.cart_id} variant_id = {product.variant_id} title = { product.product_title } variant_name = {product.variant_name} price = {product.price} number_of_items= {product.number_of_items} />
          )
        )}

        </div>
      </div>
    </div>
      
    );
  }
}
 
export default Cart;