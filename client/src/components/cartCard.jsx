import React, {Component} from "react";


class CartCard extends Component {
     
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
              <button className="btn btn-link px-2" onClick={() => this.props.onDecrement(this.props.variant_id)} 
                >
                <i className="fa fa-minus"></i>
              </button>

              <span id="form1" min="0" name="quantity"  type="number"
                className="form-control form-control-sm" >{this.props.number_of_items}</span>

              <button className="btn btn-link px-2" onClick={() => this.props.onIncrement(this.props.variant_id)}
               >
                <i className="fa fa-plus"></i>
              </button>
            </div>
            <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
              <h5 className="mb-0">{this.props.price}</h5>
            </div>
            <div className="col-md-1 col-lg-1 col-xl-1 text-end">
            <button type="button" class="btn btn-default " aria-label="Left Align" >
                <span class="fa fa-trash fa-lg" aria-hidden="true"></span>
            </button>
              {/* <a onClick={this.handleDecrement} className="text-danger"><i className="fa fa-trash fa-lg"></i></a> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

};

 
export default CartCard;