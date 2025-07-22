import React, { useEffect, useState } from "react";
import {
  Block,
  BlockHeadContent,
  BlockTitle,
  BlockBetween,
  BlockHead,
  DataTableHead,
  DataTableItem,
  DataTableRow,
  Icon,
  TooltipComponent,
  PaginationComponent,
  PreviewAltCard,
  DataTableBody,
  DataTable,
  RSelect,
  Button,
  Row,
  Col,
} from "../Component";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Badge } from "reactstrap";
import { useForm } from "react-hook-form";

const SDSTable = ({ tableData }) => {

  const columns = [];

  const [data, setData] = useState(tableData);
  const [onSearch, setonSearch] = useState(false);

  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(7);
  const [sort, setSortState] = useState("");

  //   useEffect(() => {
  //     setData([...tableData]);
  //   }, [tableData]);

  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData?.sort((a, b) => a?.ref?.localeCompare(b.ref));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData?.sort((a, b) => b?.ref?.localeCompare(a.ref));
      setData([...sortedData]);
    }
  };

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = tableData?.filter((item) => {
        return item?.orderId?.includes(onSearchText);
      });
      setData([...filteredObject]);
    } else {
      setData([...tableData]);
    }
  }, [onSearchText]);

  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = tableData?.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <Block>
      <DataTable className="card-stretch">
        <div className="card-inner">
          <div className="card-title-group">
            <div className="card-title">
              <h5 className="title">All Schemes</h5>
            </div>
            <div className="card-tools me-n1">
              <ul className="btn-toolbar gx-1">
                <li>
                  <Button
                    href="#search"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setonSearch(true);
                    }}
                    className="btn-icon search-toggle toggle-search"
                  >
                    <Icon name="search"></Icon>
                  </Button>
                </li>
                <li className="btn-toolbar-sep"></li>
                <li>
                  <UncontrolledDropdown>
                    <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                      <div className="dot dot-primary"></div>
                      <Icon name="filter-alt"></Icon>
                    </DropdownToggle>
                    <DropdownMenu end className="filter-wg dropdown-menu-xl">
                      <div className="dropdown-head">
                        <span className="sub-title dropdown-title">Advanced Filter</span>
                        <div className="dropdown">
                          <Button size="sm" className="btn-icon">
                            <Icon name="more-h"></Icon>
                          </Button>
                        </div>
                      </div>
                      <div className="dropdown-body dropdown-body-rg">
                        <Row className="gx-6 gy-4">
                          <Col size="6">
                            <div className="form-group">
                              <label className="overline-title overline-title-alt">Type</label>
                              <RSelect options={filterType} placeholder="Any Type" />
                            </div>
                          </Col>
                          <Col size="6">
                            <div className="form-group">
                              <label className="overline-title overline-title-alt">Status</label>
                              <RSelect options={filterStatus} placeholder="Any Status" />
                            </div>
                          </Col>
                          <Col size="6">
                            <div className="form-group">
                              <label className="overline-title overline-title-alt">Pay Currency</label>
                              <RSelect options={filterCoin} placeholder="Any coin" />
                            </div>
                          </Col>
                          <Col size="6">
                            <div className="form-group">
                              <label className="overline-title overline-title-alt">Method</label>
                              <RSelect options={filterPaymentmethod} placeholder="Any Method" />
                            </div>
                          </Col>

                          <Col size="6">
                            <div className="form-group">
                              <div className="custom-control custom-control-sm custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="includeDel" />
                                <label className="custom-control-label" htmlFor="includeDel">
                                  {" "}
                                  Including Deleted
                                </label>
                              </div>
                            </div>
                          </Col>

                          <Col size="12">
                            <div className="form-group">
                              <Button type="button" className="btn btn-secondary">
                                Filter
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="dropdown-foot between">
                        <a
                          href="#reset"
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                          className="clickable"
                        >
                          Reset Filter
                        </a>
                        <a
                          href="#save"
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                        >
                          Save Filter
                        </a>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </li>
                <li>
                  <UncontrolledDropdown>
                    <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                      <Icon name="setting"></Icon>
                    </DropdownToggle>
                    <DropdownMenu end className="dropdown-menu-xs">
                      <ul className="link-check">
                        <li>
                          <span>Show</span>
                        </li>
                        <li className={itemPerPage === 10 ? "active" : ""}>
                          <DropdownItem
                            tag="a"
                            href="#dropdownitem"
                            onClick={(ev) => {
                              ev.preventDefault();
                              setItemPerPage(10);
                            }}
                          >
                            10
                          </DropdownItem>
                        </li>
                        <li className={itemPerPage === 15 ? "active" : ""}>
                          <DropdownItem
                            tag="a"
                            href="#dropdownitem"
                            onClick={(ev) => {
                              ev.preventDefault();
                              setItemPerPage(15);
                            }}
                          >
                            15
                          </DropdownItem>
                        </li>
                      </ul>
                      <ul className="link-check">
                        <li>
                          <span>Order</span>
                        </li>
                        <li className={sort === "dsc" ? "active" : ""}>
                          <DropdownItem
                            tag="a"
                            href="#dropdownitem"
                            onClick={(ev) => {
                              ev.preventDefault();
                              setSortState("dsc");
                              sortFunc("dsc");
                            }}
                          >
                            DESC
                          </DropdownItem>
                        </li>
                        <li className={sort === "asc" ? "active" : ""}>
                          <DropdownItem
                            tag="a"
                            href="#dropdownitem"
                            onClick={(ev) => {
                              ev.preventDefault();
                              setSortState("asc");
                              sortFunc("asc");
                            }}
                          >
                            ASC
                          </DropdownItem>
                        </li>
                      </ul>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </li>
              </ul>
            </div>
            <div className={`card-search search-wrap ${onSearch && "active"}`}>
              <div className="search-content">
                <Button
                  onClick={() => {
                    setSearchText("");
                    setonSearch(false);
                  }}
                  className="search-back btn-icon toggle-search"
                >
                  <Icon name="arrow-left"></Icon>
                </Button>
                <input
                  type="text"
                  className="border-transparent form-focus-none form-control"
                  placeholder="Search by Order Id"
                  value={onSearchText}
                  onChange={(e) => onFilterChange(e)}
                />
                <Button className="search-submit btn-icon">
                  <Icon name="search"></Icon>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DataTableBody bodyclass="nk-tb-tnx">
          <DataTableHead className="nk-tb-item">
            <DataTableRow>
              <span className="sub-text">S.No</span>
            </DataTableRow>
            <DataTableRow>
              <span className="sub-text">Order</span>
            </DataTableRow>
            <DataTableRow size="md">
              <span className="sub-text">Date</span>
            </DataTableRow>
            <DataTableRow>
              <span className="sub-text">Status</span>
            </DataTableRow>
            <DataTableRow size="sm">
              <span className="sub-text">Customer</span>
            </DataTableRow>
            <DataTableRow size="md">
              <span className="sub-text">Purchased</span>
            </DataTableRow>
            <DataTableRow>
              <span className="sub-text">Total</span>
            </DataTableRow>

            <DataTableRow className="nk-tb-col-tools">
              <ul className="nk-tb-actions gx-1 my-n1">
                <li>
                  <UncontrolledDropdown>
                    <DropdownToggle tag="a" className="btn btn-trigger dropdown-toggle btn-icon me-n1">
                      <Icon name="more-h"></Icon>
                    </DropdownToggle>
                    <DropdownMenu end>
                      <ul className="link-list-opt no-bdr">
                        <li>
                          <DropdownItem
                            tag="a"
                            href="#markasdone"
                            onClick={(ev) => {
                              ev.preventDefault();
                              //   selectorMarkAsDelivered();
                            }}
                          >
                            <Icon name="truck"></Icon>
                            <span>Mark As Delivered</span>
                          </DropdownItem>
                        </li>
                        <li>
                          <DropdownItem
                            tag="a"
                            href="#remove"
                            onClick={(ev) => {
                              ev.preventDefault();
                              //   selectorDeleteOrder();
                            }}
                          >
                            <Icon name="trash"></Icon>
                            <span>Remove Orders</span>
                          </DropdownItem>
                        </li>
                      </ul>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </li>
              </ul>
            </DataTableRow>
          </DataTableHead>

          {currentItems?.length > 0
            ? currentItems?.map((item, idx) => (
                <DataTableItem key={item.id}>
                  <DataTableRow size="md">
                    <span>{tableData?.length - (tableData?.length - idx)}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <a href="#id" onClick={(ev) => ev.preventDefault()}>
                      #{item.orderId}
                    </a>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span>{item.date}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span className={`dot bg-${item.status === "Delivered" ? "success" : "warning"} d-sm-none`}></span>
                    <Badge
                      className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                      color={item.status === "Delivered" ? "success" : "warning"}
                    >
                      {item.status}
                    </Badge>
                  </DataTableRow>
                  <DataTableRow size="sm">
                    <span className="tb-sub">{item.customer}</span>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="tb-sub text-primary">{item.purchased}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span className="tb-lead">$ {item.total}</span>
                  </DataTableRow>
                  <DataTableRow className="nk-tb-col-tools">
                    <ul className="nk-tb-actions gx-1">
                      {/* {item.status !== "Delivered" && (
                        <li
                          className="nk-tb-action-hidden"
                          onClick={() => markAsDelivered(item.id)}
                        >
                          <TooltipComponent
                            tag="a"
                            containerClassName="btn btn-trigger btn-icon"
                            id={"delivery" + item.id}
                            icon="truck"
                            direction="top"
                            text="Mark as Delivered"
                          />
                        </li>
                      )}
                      <li
                        className="nk-tb-action-hidden"
                        onClick={() => {
                          loadDetail(item.id);
                          toggle("details");
                        }}
                      >
                        <TooltipComponent
                          tag="a"
                          containerClassName="btn btn-trigger btn-icon"
                          id={"view" + item.id}
                          icon="eye"
                          direction="top"
                          text="View Details"
                        />
                      </li> */}
                      <li>
                        <UncontrolledDropdown>
                          <DropdownToggle tag="a" className="btn btn-icon dropdown-toggle btn-trigger">
                            <Icon name="more-h"></Icon>
                          </DropdownToggle>
                          <DropdownMenu end>
                            <ul className="link-list-opt no-bdr">
                              <li>
                                <DropdownItem
                                  tag="a"
                                  href="#dropdown"
                                  //   onClick={(ev) => {
                                  //     ev.preventDefault();
                                  //     loadDetail(item.id);
                                  //     toggle("details");
                                  //   }}
                                >
                                  <Icon name="eye"></Icon>
                                  <span>Order Details</span>
                                </DropdownItem>
                              </li>
                              {item.status !== "Delivered" && (
                                <li>
                                  <DropdownItem
                                    tag="a"
                                    href="#dropdown"
                                    // onClick={(ev) => {
                                    //   ev.preventDefault();
                                    //   markAsDelivered(item.id);
                                    // }}
                                  >
                                    <Icon name="truck"></Icon>
                                    <span>Mark as Delivered</span>
                                  </DropdownItem>
                                </li>
                              )}
                              <li>
                                <DropdownItem
                                  tag="a"
                                  href="#dropdown"
                                  //   onClick={(ev) => {
                                  //     ev.preventDefault();
                                  //     deleteOrder(item.id);
                                  //   }}
                                >
                                  <Icon name="trash"></Icon>
                                  <span>Remove Order</span>
                                </DropdownItem>
                              </li>
                            </ul>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </li>
                    </ul>
                  </DataTableRow>
                </DataTableItem>
              ))
            : null}
        </DataTableBody>
        <PreviewAltCard>
          {data?.length > 0 ? (
            <PaginationComponent
              itemPerPage={itemPerPage}
              totalItems={data?.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          ) : (
            <div className="text-center">
              <span className="text-silent">No orders found</span>
            </div>
          )}
        </PreviewAltCard>
      </DataTable>
    </Block>
  );
};

export default SDSTable;
