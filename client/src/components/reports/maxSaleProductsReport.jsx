import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Joi from "joi-browser";

export default function MaxSaleProductsReport() {
	const [start, setStart] = useState(null);
	const [end, setEnd] = useState(null);
	const [number, setNumber] = useState(null);

	return (
		<div className="container">
			<div className="row">
				<div className="col-sm">
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label="Start Date"
							inputFormat="dd-MM-yyyy"
							value={start}
							onChange={(newValue) => {
								setStart(newValue);
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
					</LocalizationProvider>
				</div>
				<div className="col-sm">
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label="End Date"
							inputFormat="dd-MM-yyyy"
							value={end}
							onChange={(newValue) => {
								setEnd(newValue);
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
					</LocalizationProvider>
				</div>
				<div className="col-sm">
					<TextField
						id="outlined-basic"
						label="No of Records"
						variant="outlined"
						onChange={(newValue) => {
							const { value } = newValue.target;
							setNumber(value);
						}}
					/>
				</div>
				<div className="col-sm mt-2">
					<button
						className="btn btn-outline-success hover-focus"
						onClick={() => {
							console.log("start: ", start);
							console.log("end: ", end);
							console.log("number: ", number);
						}}
					>
						Find
					</button>
				</div>
			</div>
		</div>
	);
}
