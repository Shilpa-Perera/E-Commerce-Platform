import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Joi, { schema } from "joi-browser";
import { format, parseISO } from "date-fns";
import Form from "../../common/form";
import { getMaxSaleProducts } from "../../../services/reportService";
import BarChart from "../../common/barChart";
import { ThemeProvider, createTheme } from "@mui/material/styles";

class MaxSalesProductsReport extends Form {
	state = {
		data: {
			start: "",
			end: "",
			number: 0,
		},
		errors: {},
		report: [],
	};

	schema = Joi.object({
		start: Joi.date().required().label("Start Date"),
		end: Joi.date().greater(Joi.ref("start")).required().label("End date"),
		number: Joi.number().less(10).required().label("Number of Records"),
	});

	doSubmit = async () => {
		const { start, end, number } = this.state.data;
		let start_ = format(new Date(start), "yyyy-MM-dd HH:mm:ss");
		let end_ = format(new Date(end), "yyyy-MM-dd HH:mm:ss");
		const { data: max_sales } = await getMaxSaleProducts(
			start_,
			end_,
			number
		);

		this.setState({ report: max_sales[0] }, () => {
			console.log(this.state.report[2]);
		});
	};

	render() {
		const darkTheme = createTheme({
			palette: {
				mode: this.props.theme ? "dark" : "light",
			},
		});
		return (
			<ThemeProvider theme={darkTheme}>
				<div className="container">
					<div className="row">
						<div className="col-sm">
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									label="Start Date"
									inputFormat="MM-dd-yyyy"
									value={this.state.data.start}
									onChange={(newValue) => {
										let st = this.state;
										st.data.start = newValue;
										this.setState(st);
									}}
									renderInput={(params) => (
										<TextField {...params} />
									)}
								/>
								{this.state.errors.start && (
									<div className="alert alert-danger">
										{this.state.errors.start}
									</div>
								)}
							</LocalizationProvider>
						</div>
						<div className="col-sm">
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									label="End Date"
									inputFormat="MM-dd-yyyy"
									value={this.state.data.end}
									onChange={(newValue) => {
										let st = this.state;
										st.data.end = newValue;
										this.setState(st);
									}}
									renderInput={(params) => (
										<TextField {...params} />
									)}
								/>
								{this.state.errors.end && (
									<div className="alert alert-danger">
										{this.state.errors.end}
									</div>
								)}
							</LocalizationProvider>
						</div>
						<div className="col-sm">
							<TextField
								id="outlined-basic"
								label="No of Records"
								variant="outlined"
								value={this.state.data.number}
								onChange={(newValue) => {
									const { value } = newValue.target;
									let st = this.state;
									st.data.number = value;
									this.setState(st);

									// this.handleChange
								}}
							/>
							{this.state.errors.number && (
								<div className="alert alert-danger">
									{this.state.errors.number}
								</div>
							)}
						</div>
						<div className="col-sm mt-2">
							<button
								className="btn btn-outline-success hover-focus"
								onClick={this.handleSubmit}
							>
								Find
							</button>
						</div>
					</div>
					{/* {this.state.report.length > 0 && <BarChart labels={} data = {} /> } */}
				</div>
			</ThemeProvider>
		);
	}
}

export default MaxSalesProductsReport;
