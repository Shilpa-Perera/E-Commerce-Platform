import React, { useState } from "react";

function ScrollToTop() {
	const [visible, setVisible] = useState(false);

	const toggleVisible = () => {
		const scrolled = document.documentElement.scrollTop;
		if (scrolled > 300) {
			setVisible(true);
		} else if (scrolled <= 300) {
			setVisible(false);
		}
	};

	window.addEventListener("scroll", toggleVisible);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const classes = visible
		? "btn btn-primary rounded-circle border-0"
		: "d-none";

	return (
		<button
			className={classes}
			id="scroll-to-top"
			onClick={scrollToTop}
			data-bs-toggle="tooltip"
			data-bs-placement="left"
			title="Back to top"
		>
			<i className="fa fa-2x fa-arrow-up"></i>
		</button>
	);
}

export default ScrollToTop;
