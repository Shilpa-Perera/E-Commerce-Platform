import React from "react";
import { productImageUrl } from "../../services/imageService";
const CartCanvasCard = (props) => {
	const { title, variant_name, price, image_name, number_of_items } = props;
	const image =
		image_name === null
			? "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4QWs8?ver=95ec&q=90&m=6&h=270&w=270&b=%23FFFFFFFF&f=jpg&o=f&aim=true"
			: productImageUrl(image_name);
	return (
		<div>
			<div className="d-flex flex-row align-items-center mb-5">
				<div className="col-4">
					<img
						src={image}
						className="img-fluid rounded-3"
						alt="Shopping item"
						style={{ width: "100px" }}
					></img>
				</div>
				<div className="col-6">
					<h5>{title}</h5>
					<h6 className="text-muted">{variant_name}</h6>
					<h6 className="text-muted">x {number_of_items}</h6>
					<h6 className="text-muted">
						Rs. {(price * number_of_items).toFixed(2)}
					</h6>
				</div>
			</div>
		</div>
	);
};

export default CartCanvasCard;
