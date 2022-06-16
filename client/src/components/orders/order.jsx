import React, { Component } from "react";
import {useParams} from "react-router-dom";


class OrderView extends Component{
    state = {
        order: null,
        cartId: null
    }

    // async componentDidMount(){
    //     const { id } = this.props;
    // }
    
    render(){
        const {id} = this.props;
        console.log(id);
        return (
            <div>Order Id is :  {id} </div>
        );
    }
}

function Order(props) {
    const { id } = useParams();
    return <OrderView {...{ props, id}} />;
}

export default Order