const { Component } = require("react");


class Order extends Component{
    state = {
        order: null,
        cartId: null
    }
    
    render(){
        const {id} = this.props;
        console.log(id);
        return (
            <div>sssss </div>
        );
    }
}

export default Order