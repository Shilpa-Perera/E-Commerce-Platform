import React from "react";

const quaterlySalesReportModal = ({
    key,
    show,
    handleHide,
    handleDownloadReport,
    elementId,
    startYear,
    QuaterlySalesReportTable,
}) => {
    return (
        <Modal
            key={key}
            show={show}
            onHide={() => handleHide(index)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            fullscreen={true}
        >
            <Modal.Header closeButton>
                <div class="d-flex justify-content-left">
                    <Button
                        variant="primary"
                        onClick={() =>
                            handleDownloadReport(elementId, startYear + index)
                        }
                        key={index}
                    >
                        Download
                    </Button>
                </div>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <div id={elementId}>
                    <Container>
                        <h3>{startYear + index} Quaterly Sales Report</h3>
                        <Row>
                            <Col md={4}>
                                <QuaterlySalesReportTable
                                    dataSource={dataSource}
                                />
                            </Col>

                            <Col md={8}>
                                <BarChart
                                    labels={barChartInputs.labels}
                                    data={barChartInputs.data}
                                />
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default quaterlySalesReportModal;
