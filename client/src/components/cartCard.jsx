import React, {Component} from "react";
import { updateItemCount } from "../services/cartService";
// import React from "react";
// import { useEffect, useNavigate, useState } from "react-router-dom";
// import { getCartProducts } from "../services/cartService";



// function CartCard(){

  
//     // const [product, setProduct] = useState(null);

//     // useEffect(async () => {
//     //     try {
//     //         const { data } = await getCartProducts(1);
//     //         setProduct(data);
//     //     } catch (e) {
//     //         if (e.response && e.response.status === 404)
//     //             useNavigate()("/not-found", { replace: true });
//     // }

//     // },[])
        
    
//     return(
      
//         <div className="card rounded-3 mb-4">
//         <div className="card-body p-4">
//           <div className="row d-flex justify-content-between align-items-center">
//             <div className="col-md-2 col-lg-2 col-xl-2">
//               <img
//                 src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img1.webp"
//                 className="img-fluid rounded-3" alt="Cotton T-shirt"/>
//             </div>
//             <div className="col-md-3 col-lg-3 col-xl-3">
//               <p className="lead fw-normal mb-2">Basic T-shirt</p>
//               <p><span className="text-muted">Size: </span>M <span className="text-muted">Color: </span>Grey</p>
//             </div>
//             <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
//               <button className="btn btn-link px-2"
//                 onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
//                 <i className="fa fa-minus"></i>
//               </button>

//               <input id="form1" min="0" name="quantity" value="2" type="number"
//                 className="form-control form-control-sm" />

//               <button className="btn btn-link px-2"
//                 onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
//                 <i className="fa fa-plus"></i>
//               </button>
//             </div>
//             <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
//               <h5 className="mb-0">$499.00</h5>
//             </div>
//             <div className="col-md-1 col-lg-1 col-xl-1 text-end">
//               <a href="#!" className="text-danger"><i className="fa fa-trash fa-lg"></i></a>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
// }

// export default CartCard ;

class CartCard extends Component {
 
  state = { 
    number_of_items: this.props.number_of_items 

   } ;

   handleIncrement = () => {
      this.setState({number_of_items: this.state.number_of_items+1})
      updateItemCount(this.props.cart_id , this.props.variant_id ,this.state.number_of_items ) ; 
   }

   handleDecrement = () => {

   }
    
  render() { 

    return (
     
     <div className="card rounded-3 mb-4">
        <div className="card-body p-4">
          <div className="row d-flex justify-content-between align-items-center">
            <div className="col-md-2 col-lg-2 col-xl-2">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img1.webp"
                className="img-fluid rounded-3" alt="Cotton T-shirt"/>
            </div>
            <div className="col-md-3 col-lg-3 col-xl-3">
              <p className="lead fw-normal mb-2">{this.props.title}</p>
              <p><span className="text-muted">{this.props.variant_name} </span></p>
            </div>
            <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
              <button className="btn btn-link px-2"
                >
                <i className="fa fa-minus"></i>
              </button>

              <span id="form1" min="0" name="quantity"  type="number"
                className="form-control form-control-sm" >{this.formatCount()}</span>

              <button className="btn btn-link px-2" onClick={this.handleIncrement}
               >
                <i className="fa fa-plus"></i>
              </button>
            </div>
            <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
              <h5 className="mb-0">{this.props.price}</h5>
            </div>
            <div className="col-md-1 col-lg-1 col-xl-1 text-end">
            <button type="button" class="btn btn-default " aria-label="Left Align" onClick={this.handleDelete}>
                <span class="fa fa-trash fa-lg" aria-hidden="true"></span>
            </button>
              {/* <a onClick={this.handleDecrement} className="text-danger"><i className="fa fa-trash fa-lg"></i></a> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  formatCount(){
    const {number_of_items} = this.state ;
    return number_of_items === 0 ? 'Zero' : number_of_items;
  }
};

 
export default CartCard;