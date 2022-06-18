import React, {Component} from "react";
import { getCartProducts } from "../services/cartService";
import CartCard from "./cartCard";
import { updateItemCount,deletedProduct } from "../services/cartService";


class Cart extends Component {
  state = { 
    variant :  [],
    orderTotal : 0  
   } 

  async CartProducts(){
      const { data: variant } = await getCartProducts(localStorage.getItem("cart_id"));
      let orderTotal = 0;
      if(variant){
          variant.forEach(element => {
          orderTotal += (parseFloat(element.price))*(element.number_of_items);
    });
      }
      

      this.setState({variant}) ;
      this.setState({orderTotal});

   }
  async componentDidMount() {
       await this.CartProducts();
   }

  async componentDidUpdate(){
    await this.CartProducts();
  }



  handleIncrement = (variant_id) => {
        const products = [...this.state.variant];
        const index = products.findIndex(item => item.variant_id === variant_id);
        products[index].number_of_items ++  ;
        this.setState({variant:products});
        updateItemCount(products[index].cart_id , products[index].variant_id , products[index].number_of_items ) ; 
  }

  handleDecrement = (variant_id) => {
    const products = [...this.state.variant];
    const index = products.findIndex(item => item.variant_id === variant_id);
    products[index].number_of_items --  ;
    this.setState({variant:products});
    
    updateItemCount(products[index].cart_id , products[index].variant_id , products[index].number_of_items ) ; 

 }


  render() { 
    return (

    <div className="container h-100 py-5">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-10">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-normal mb-0 text-invert">Shopping Cart</h3>
              <div>
                <p className="mb-0"><span className="text-muted">Sort by:</span> <a href="#!" className="text-body">price <i
                  className="fa fa-angle-down mt-1"></i></a></p>
              </div>
          </div>

          {this.state.variant.length > 0  && this.state.variant.map(product => (
            <CartCard 
            key = {product.variant_id} 
            cart_id = {product.cart_id} 
            variant_id = {product.variant_id} 
            title = { product.product_title } 
            variant_name = {product.variant_name} 
            price = {product.price} 
            image_name = {product.image_name}
            number_of_items= {product.number_of_items}
            onIncrement = {this.handleIncrement}
            onDecrement = {this.handleDecrement} 
            onDelete = {() => this.props.onDeleteFromCart(product.cart_id, product.variant_id)}/>  
          )
        )}

        <div className ="card mb-5">
          <div className ="card-body p-4">
            <div className ="float-end">
              <p className ="mb-0 me-5 d-flex align-items-center">
                <span className ="small text-muted me-2">Order total:</span> <span
                  className ="lead fw-normal">{this.state.orderTotal}</span>
              </p>
            </div>

          </div>
        </div>

        <div className="card">
          <div className="card-body">
              <button type="button" className ="btn btn-success w-100" disabled = {this.state.orderTotal === 0 ? 'disabled' : ""}>Proceed to Pay</button>
          </div>
        </div>

        </div>
      </div>
    </div>
      
    );
  }
}
 
export default Cart;