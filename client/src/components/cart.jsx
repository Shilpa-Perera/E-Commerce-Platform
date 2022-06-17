import React, {Component} from "react";
import { getCartProducts } from "../services/cartService";
import CartCard from "./cartCard";
import { updateItemCount } from "../services/cartService";


class Cart extends Component {
  state = { 
    variant :  [] 
   } 

  async CartProducts(){
      const { data: variant } = await getCartProducts(this.props.cart_id);
      this.setState({variant}) ;

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

 handleDelete = (variant_id) => {
    const products = [...this.state.variant];
    const index = products.findIndex(item => item.variant_id === variant_id);
    products[index].number_of_items = 0  ;
    this.setState({variant:products});
    updateItemCount(products[index].cart_id , products[index].variant_id , products[index].number_of_items ) ; 

 }
  render() { 
    return (

    <div className="container h-100 py-5">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-10">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-normal mb-0 text-white">Shopping Cart</h3>
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
            number_of_items= {product.number_of_items}
            onIncrement = {this.handleIncrement}
            onDecrement = {this.handleDecrement} 
            onDelete = {this.handleDelete}/>
          )
        )}

        <div className="card">
          <div className="card-body">
            <button type="button" className="btn btn-warning btn-block btn-lg">Proceed to Pay</button>
          </div>
        </div>

        </div>
      </div>
    </div>
      
    );
  }
}
 
export default Cart;