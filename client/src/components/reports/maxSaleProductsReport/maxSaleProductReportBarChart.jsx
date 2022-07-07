import Report from "../../common/report";

class MaxSaleBarChart extends Report {
	state = {
		options: null,
		data: null,
		loading: true,
	};

	async componentWillMount() {
		console.log("hello");
		const options = this.getOptions(
			"Max sale products",
			"Number of products",
			"Product",
			true
		);
		const data = this.getData(
			"Max sale products",
			this.props.report,
			"product_title",
			"sales"
		);

		this.setState({ options, data, loading: false });
	}
	render() {
		const { options, data, loading } = this.state;
		return <div>{this.renderCanvas(options, data)}</div>;
	}
}

export default MaxSaleBarChart;
