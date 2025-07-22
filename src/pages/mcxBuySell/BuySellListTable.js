import React, { useContext, useEffect, useState } from 'react'
import Head from '../../layout/head/Head';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getPagePermission } from '../../redux/thunks/coreComponent';
import { getAllBuySell } from '../../redux/thunks/mcx';
import Content from '../../layout/content/Content';
import { Block } from '../../components/Component';
import { Card } from 'reactstrap';
import { Table } from '../../components/sds-table/ReactTable';
import styled from "styled-components";
import { McxRateContext } from '../../contexts/MxcRateContext';
import CurrencyDisplay from '../../components/common/moneyFormat/moneyFormat';

const Styles = styled.div`
  padding: 2vh 0.75vw;
  table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid #e1e1e1;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0px 5px;
      border-bottom: 1px solid #e1e1e1;
      border-right: 0px solid black;
      font-size: medium;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

const BuySellListTable = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const pathName = location?.pathname;

    const { mcxRates } = useContext(McxRateContext);

    const [itemPerPage, SetItemPerPage] = useState(50);
    const [page, SetPage] = useState(1);
    const paginate = (pageNumber) => SetPage(pageNumber);

    const { buySellList, isLoading: loadingData } = useSelector((state) => state.buySellReducer);
    const { pagePermission } = useSelector((state) => state.coreCompReducer);

    const columns = buySellList?.columns?.map((col) => {
        col = { ...col, "isChecked": true };
        if (col.accessor === "sno") {
            return {
                ...col,
                Cell: ({ cell }) => cell.row.index + 1,
            };
        }
        if (col.accessor === "mt_rate") {
            return {
                ...col,
                Cell: ({ cell }) => {
                    const goldRate = mcxRates.find((rate) => rate.id == 141);
                    const silverRate = mcxRates.find((rate) => rate.id == 1632);
                    return (
                        <>
                            {cell.row.original?.type == 1 ? (
                                cell.row.original?.metal == 1 ? (
                                    <div>{goldRate ? <CurrencyDisplay value={parseFloat(goldRate.price2).toFixed(2)} /> || 0 : 0}</div>
                                ) : (
                                    <div>{silverRate ? <CurrencyDisplay value={parseFloat(silverRate.price2).toFixed(2)} /> || 0 : 0}</div>
                                )

                            ) : (
                                cell.row.original?.metal == 1 ? (
                                    <div>{goldRate ? <CurrencyDisplay value={parseFloat(goldRate.price1).toFixed(2)} /> || 0 : 0}</div>
                                ) : (
                                    <div>{silverRate ? <CurrencyDisplay value={parseFloat(silverRate.price1).toFixed(2)} /> || 0 : 0}</div>
                                )
                            )}

                        </>
                    )
                }
            };
        }
        if (col.accessor === "premium") {
            return {
                ...col,
                Cell: ({ cell }) => {
                    const goldRate = mcxRates.find((rate) => rate.id == 141);
                    const silverRate = mcxRates.find((rate) => rate.id == 1632);
                    return (
                        <>
                            {cell.row.original?.type == 1 ? (
                                cell.row.original?.metal == 1 ? (
                                    <div>{goldRate ? <CurrencyDisplay value={parseFloat(goldRate.price2) - parseFloat(cell.row.original.rate_per_gram)} /> || 0 : 0}</div>
                                ) : (
                                    <div>{silverRate ? <CurrencyDisplay value={parseFloat(silverRate.price2) - parseFloat(cell.row.original.rate_per_gram)} /> || 0 : 0}</div>
                                )

                            ) : (
                                cell.row.original?.metal == 1 ? (
                                    <div>{goldRate ? <CurrencyDisplay value={parseFloat(goldRate.price1) - parseFloat(cell.row.original.rate_per_gram)} /> || 0 : 0}</div>
                                ) : (
                                    <div>{silverRate ? <CurrencyDisplay value={parseFloat(silverRate.price1) - parseFloat(cell.row.original.rate_per_gram)} /> || 0 : 0}</div>
                                )
                            )}

                        </>
                    )
                }
            };
        }

        return col;
    });



    useEffect(() => {
        dispatch(getPagePermission({ path: pathName }));
    }, [pathName, dispatch]);



    useEffect(() => {
        dispatch(
            getAllBuySell({
                page: page,
                records: itemPerPage,
            })
        );
    }, [dispatch, page, itemPerPage]);
    return (
        <React.Fragment>
            <Head title={pagePermission?.title ? pagePermission?.title : "Customer Outstanding Report"}></Head>
            {pagePermission?.view && (
                <Content>
                    <Block size="lg">
                        <Card className="card-bordered card-preview">
                            <Styles>
                                <Table
                                    columns={buySellList?.columns ? columns : []}
                                    data={buySellList?.rows ? buySellList?.rows : []}
                                    totalPages={buySellList?.total_pages}
                                    loading={loadingData}
                                    currentPage={page}
                                    is_filter_req={false}
                                    paginate={paginate}
                                    showPagination={true}
                                    isGrouping={false}
                                    allowAdd={pagePermission?.add}
                                    addButtonDisable={buySellList?.actions?.is_add_req}
                                    isAddReq={buySellList?.actions?.is_add_req}
                                    addPageURL={"/mcxrate/buy_sell/add"}
                                    pageTitle={pagePermission?.title ? pagePermission?.title : "MCX Buy / Sell"}
                                    // FilterComponent={FilterComponent}
                                    groupingColumns={[]}
                                    itemPerPage={itemPerPage}
                                    SetItemPerPage={SetItemPerPage}
                                />
                            </Styles>
                        </Card>
                    </Block>

                </Content>
            )}
        </React.Fragment>
    )
}

export default BuySellListTable