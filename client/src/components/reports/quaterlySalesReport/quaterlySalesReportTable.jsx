import React, { Component } from "react";
import { Table } from "react-bootstrap";

const QuaterlySalesReportTable = ({ dataSource }) => {
    return (
        <Table>
            <thead>
                <tr>
                    <th>Prouct Variant</th>
                    <th>Q1</th>
                    <th>Q2</th>
                    <th>Q3</th>
                    <th>Q4</th>
                </tr>
            </thead>
            <tbody>
                {dataSource.map((row, index) => (
                    <tr>
                        <td>{row.variant_name}</td>
                        <td>{row.q1}</td>
                        <td>{row.q2}</td>
                        <td>{row.q3}</td>
                        <td>{row.q4}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default QuaterlySalesReportTable;
