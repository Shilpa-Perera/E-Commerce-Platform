import React, { Component } from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getBook, saveBook } from "../services/bookService";
import { getCategories } from "./../services/categoryService";

class BookForm extends Form {
  state = {
    data: { name: "", categoryId: "", numberInStock: "", price: "" },
    categories: [],
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Name"),
    categoryId: Joi.string().required().label("Category"),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(100)
      .label("Number In Stock"),
    price: Joi.number().required().min(0).label("Price"),
  };

  async populateCategories() {
    const { data: categories } = await getCategories();
    this.setState({ categories });
  }

  async populateBook() {
    try {
      const bookId = this.props.match.params.id;
      if (bookId === "new") return;

      const { data: book } = await getBook(bookId);
      this.setState({ data: this.mapToViewModel(book) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateBook();
    await this.populateCategories();
  }

  mapToViewModel(book) {
    return {
      _id: book._id,
      name: book.name,
      categoryId: book.category._id,
      numberInStock: book.numberInStock,
      price: book.price,
    };
  }

  doSubmit = async () => {
    await saveBook(this.state.data);

    this.props.history.push("/books");
  };
  render() {
    return (
      <div>
        <h1>Book Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name")}
          {this.renderSelect("categoryId", "Category", this.state.categories)}
          {this.renderInput("numberInStock", "Number In Stock")}
          {this.renderInput("price", "Price")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default BookForm;
