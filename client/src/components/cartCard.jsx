import React, {Component} from "react";
import { productImageUrl } from "../services/imageService" ;

class CartCard extends Component {
     
  render() { 

    const{
        title , 
        variant_name ,
        image_name , 
        onDecrement ,
        onIncrement ,
        onDelete, 
        variant_id , 
        number_of_items,
        price}  = this.props ;

    const image =
        image_name === null
          ? "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4QWs8?ver=95ec&q=90&m=6&h=270&w=270&b=%23FFFFFFFF&f=jpg&o=f&aim=true"
          : productImageUrl(image_name);

    return (
     
     <div className="card rounded-3 mb-4">
        <div className="card-body p-4">
          <div className="row d-flex justify-content-between align-items-center">
            <div className="col-md-2 col-lg-2 col-xl-2">
              <img
                src= {image} className="img-fluid rounded-3" alt="image"/>
            </div>
            <div className="col-md-3 col-lg-3 col-xl-3">
              <p className="lead fw-normal mb-2">{title}</p>
              <p><span className="text-muted">{variant_name} </span></p>
            </div>
            <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
              <button className="btn btn-link px-2" onClick={() => onDecrement(variant_id)} disabled = {number_of_items === 1 ? 'disabled' : ""}
                >
                <i className="fa fa-minus"></i>
              </button>

              <span id="form1" min="0" name="quantity"  type="number"
                className="form-control form-control-sm " >{number_of_items}</span>

              <button className="btn btn-link px-2" onClick={() => onIncrement(variant_id)}
               >
                <i className="fa fa-plus"></i>
              </button>
            </div>
            <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
              <h5 className="mb-0">{price*number_of_items}</h5>
            </div>
            <div className="col-md-1 col-lg-1 col-xl-1 text-end">
            <button type="button" className="btn btn-default " aria-label="Left Align" onClick={() => onDelete(variant_id)} >
                <span className="fa fa-trash fa-lg" aria-hidden="true"></span>
            </button>
              {/* <a onClick={() => onDelete(variant_id)} className="text-danger"><i className="fa fa-trash fa-lg"></i></a> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

};

 
export default CartCard;