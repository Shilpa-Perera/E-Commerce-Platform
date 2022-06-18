import React from "react";

function Loading() {
    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
}

export default Loading;
