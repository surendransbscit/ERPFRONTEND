import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import CurrencyDisplay from '../common/moneyFormat/moneyFormat';
import { useForm } from "react-hook-form";
import { getCashAbstractReport } from "../../redux/thunks/reports";
import moment from "moment";

const CashAbstractPrintComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [fromDate, SetFromDate] = useState(new Date());
    const [toDate, SetToDate] = useState(new Date());
    const [scheme, SetScheme] = useState("");
    const { cashAbstractReportList, isLoading: loadingData } = useSelector((state) => state.reportReducer);
    const [selectedBranch, SetSelectedBranch] = useState([]);
    const [startDate, SetStartDate] = useState(new Date());
    const [endDate, SetEndDate] = useState(new Date());
    useEffect(() => {
        dispatch(
            getCashAbstractReport({
                from_date: moment(startDate).format("YYYY-MM-DD"),
                to_date: moment(endDate).format("YYYY-MM-DD"),
                id_branch: selectedBranch?.map((obj) => {
                    const container = obj.value;
                    return container;
                }),
            })
        );
    }, [dispatch, fromDate, toDate, scheme]);

    
    const calculateTotal = (field, data) => {
        return data.reduce((acc, current) => {
            let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
            let column = columns.find((item) => item.accessor === field);
            let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
            return parseFloat(total).toFixed(decimal_places);
        }, 0);
    };

    const columns = [
        { accessor: "product_name", header: "PRODUCT", isTotalReq: false, textAlign: "left" },
        { accessor: "pcs", header: "PCS", isTotalReq: true, textAlign: "right" },
        { accessor: "grosswt", header: "GRS.WT", isTotalReq: true, textAlign: "right", decimal_places: 3 },
        { accessor: "netwt", header: "NET.WT", isTotalReq: true, textAlign: "right", decimal_places: 3 },
        { accessor: "lesswt", header: "LESS.WT", isTotalReq: true, textAlign: "right", decimal_places: 3 },
        { accessor: "diawt", header: "DIA.WT", isTotalReq: true, decimal_places: 3, textAlign: "right" },
        { accessor: "stonewt", header: "STN.WT", isTotalReq: true, decimal_places: 3, textAlign: "right" },
        { accessor: "taxable", header: "TAXABLE AMT", isTotalReq: true, decimal_places: 2, textAlign: "right" },
        { accessor: "tax", header: "TAX AMT", isTotalReq: true, decimal_places: 2, textAlign: "right" },
        { accessor: "tot_amount", header: "TOTAL AMT", isTotalReq: true, decimal_places: 2, textAlign: "right" },
    ];
    return (
        <div>
            <div className="table-responsive dataTables_wrapper">
                <table className="table-wrapper react_table">
                    <thead>
                        <tr>
                            {columns?.map((column, index) => (
                                <th key={index} style={{ textAlign: column?.textAlign }}>
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {cashAbstractReportList?.sales_data?.length > 0 && (
                            <tr style={{ fontWeight: "bold" }}>
                                <td style={{ textAlign: "left" }}>SALES</td>
                                <td colSpan={columns.length}></td>
                            </tr>
                        )}
                        {cashAbstractReportList?.sales_data?.length > 0 &&
                            cashAbstractReportList?.sales_data?.map((item, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                                            {column.isCurrency ? (
                                                <CurrencyDisplay value={item[column.accessor]} />
                                            ) : column.decimal_places ? (
                                                parseFloat(item[column.accessor]).toFixed(column.decimal_places)
                                            ) : (
                                                item[column.accessor]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        {cashAbstractReportList?.sales_data?.length > 0 && (
                            <tr style={{ fontWeight: "bold" }}>
                                <td>Total</td>
                                {columns?.map((column, index) => {
                                    return (
                                        index !== 0 && (
                                            <td key={index} style={{ textAlign: column?.textAlign }}>
                                                {column.isTotalReq ? (
                                                    column.isCurrency ? (
                                                        <CurrencyDisplay
                                                            value={calculateTotal(column.accessor, cashAbstractReportList?.sales_data)}
                                                        />
                                                    ) : (
                                                        calculateTotal(column.accessor, cashAbstractReportList?.sales_data)
                                                    )
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                        )
                                    );
                                })}
                            </tr>
                        )}
                        {cashAbstractReportList?.sales_return?.length > 0 && (
                            <tr style={{ fontWeight: "bold" }}>
                                <td colSpan={columns.length}>SALES RETURN</td>
                            </tr>
                        )}
                        {cashAbstractReportList?.sales_return?.length > 0 &&
                            cashAbstractReportList?.sales_return?.map((item, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                                            {column.isCurrency ? (
                                                <CurrencyDisplay value={item[column.accessor]} />
                                            ) : column.decimal_places ? (
                                                parseFloat(item[column.accessor]).toFixed(column.decimal_places)
                                            ) : (
                                                item[column.accessor]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {cashAbstractReportList?.sales_return?.length > 0 && (
                            <tr style={{ fontWeight: "bold" }}>
                                <td>Total</td>
                                {columns?.map((column, index) => {
                                    return (
                                        index !== 0 && (
                                            <td key={index} style={{ textAlign: column?.textAlign }}>
                                                {column.isTotalReq ? (
                                                    column.isCurrency ? (
                                                        <CurrencyDisplay
                                                            value={calculateTotal(column.accessor, cashAbstractReportList?.sales_return)}
                                                        />
                                                    ) : (
                                                        calculateTotal(column.accessor, cashAbstractReportList?.sales_return)
                                                    )
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                        )
                                    );
                                })}
                            </tr>
                        )}
                        {cashAbstractReportList?.purchase_data?.length > 0 && (
                            <tr style={{ fontWeight: "bold" }}>
                                <td colSpan={columns.length}>PURCHASE</td>
                            </tr>
                        )}
                        {cashAbstractReportList?.purchase_data?.length > 0 &&
                            cashAbstractReportList?.purchase_data?.map((item, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                                            {column.isCurrency ? (
                                                <CurrencyDisplay value={item[column.accessor]} />
                                            ) : column.decimal_places ? (
                                                isNaN(parseFloat(item[column.accessor]).toFixed(column.decimal_places)) ? (
                                                    item[column.accessor]
                                                ) : (
                                                    parseFloat(item[column.accessor]).toFixed(column.decimal_places)
                                                )
                                            ) : (
                                                item[column.accessor]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        {cashAbstractReportList?.purchase_data?.length > 0 && (
                            <tr style={{ fontWeight: "bold" }}>
                                <td>Total</td>
                                {columns?.map((column, index) => {
                                    return (
                                        index !== 0 && (
                                            <td key={index} style={{ textAlign: column?.textAlign }}>
                                                {column.isTotalReq ? (
                                                    column.isCurrency ? (
                                                        <CurrencyDisplay
                                                            value={calculateTotal(column.accessor, cashAbstractReportList?.purchase_data)}
                                                        />
                                                    ) : (
                                                        calculateTotal(column.accessor, cashAbstractReportList?.purchase_data)
                                                    )
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                        )
                                    );
                                })}
                            </tr>
                        )}
                        {cashAbstractReportList?.sales_summary?.length > 0 && (
                            <tr style={{ fontWeight: "bold" }}>
                                <td style={{ textAlign: "left" }}>CASH ABSTRACT</td>
                                <td colSpan={columns.length}></td>
                            </tr>
                        )}
                        {cashAbstractReportList?.sales_summary?.length > 0 &&
                            cashAbstractReportList?.sales_summary?.map((item, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td style={{ textAlign: "left" }}>{item.lable}</td>
                                    <td></td>
                                    <td></td>
                                    <td style={{ textAlign: "right" }}>{<CurrencyDisplay value={item.value} />}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            ))}

                        {cashAbstractReportList?.sales_summary?.length > 0 && (
                            <tr style={{ fontWeight: "bold" }}>
                                <td style={{ textAlign: "left" }}>TOTAL</td>
                                <td></td>
                                <td></td>
                                <td style={{ textAlign: "right" }}>
                                    {<CurrencyDisplay value={cashAbstractReportList?.total_sale_inward} />}
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        )}

                        {cashAbstractReportList?.payment_summary?.length > 0 &&
                            cashAbstractReportList?.payment_summary?.map((item, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td style={{ textAlign: "left" }}>{item.lable}</td>
                                    <td></td>
                                    <td></td>
                                    <td style={{ textAlign: "right" }}>{<CurrencyDisplay value={item.value} />}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            ))}

                        {cashAbstractReportList?.payment_summary?.length > 0 && (
                            <tr style={{ fontWeight: "bold" }}>
                                <td style={{ textAlign: "left" }}>TOTAL</td>
                                <td></td>
                                <td></td>
                                <td style={{ textAlign: "right" }}>
                                    <CurrencyDisplay value={cashAbstractReportList?.total_payment} />
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        )}
                    </tbody>

                    <tfoot></tfoot>
                </table>
            </div>
        </div>
    )
}

export default CashAbstractPrintComponent