import React, { Component } from 'react'; 
import { getCustomers } from './../../services/customerService';

class Customers extends Component {
    state = {
        customers: [], 
        currentPage: 1,
        pageSize: 4,
        searchQuery: "",
        selectedCategory: null,
        sortColumn: { path: "title", order: "asc" },
     } 

     async componentDidMount() {
        const { data: customers } = await getCustomers();
        
        this.setState({ customers: customers });
     }
    render() { 
        const { length: count } = this.state.customers;

        if (count === 0) return <p>There are no customers in the database.</p>

        return (
            <h1>Customers</h1>
        );
    }
}
 
export default Customers;