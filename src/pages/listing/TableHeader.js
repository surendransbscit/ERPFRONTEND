import { Button, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { BlockBetween, BlockHead, BlockHeadContent, BlockTitle, Col, Icon, Row } from "../../components/Component";
import CopyToClipboard from "react-copy-to-clipboard";
import { BranchDropdown, SchemeDropdown } from "../../components/filters/retailFilters";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import BranchDropdownMulti from "../../components/common/dropdown/BranchDropdownMulti";

export const DataTableHeader = ({
  setModal,
  navigate,
  data,
  addButtonDisable,
  isAddReq,
  getData,
  setItemPerPage,
  itemPerPage,
  title,
  addPageURL,
  allowAdd,
  isFilterReq,
  isSchemeFilterReq,
  isBranchFilterReq,
  isDateFilterReq,
  schemes,
  branches,
  selectedScheme,
  SetSelectedSchene,
  selectedBranch,
  SetSelectedBranch,
  startDate,
  SetStartDate,
  endDate,
  SetEndDate,
}) => {
  const copyToClipboard = () => {
    setModal(true);
  };
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const setToday = () => {
    const today = new Date();
    SetStartDate(today);
    SetEndDate(today);
  };

  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    SetStartDate(yesterday);
    SetEndDate(yesterday);
  };

  const setLastWeek = () => {
    const today = new Date();
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 7);
    SetStartDate(lastWeekStart);
    SetEndDate(today);
  };

  const setLastMonth = () => {
    const today = new Date();
    const lastMonthStart = new Date(today);
    lastMonthStart.setMonth(today.getMonth() - 1);
    SetStartDate(lastMonthStart);
    SetEndDate(today);
  };

  return (
    <>
      <div className="card-tools me-n1">
        <ul className="btn-toolbar gx-1">
          {isFilterReq && (
            <>
            <li className="btn-toolbar-sep"></li>
              <li>
                <UncontrolledDropdown>
                  <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                    <div className="dot dot-primary"></div>
                    Filters<Icon name="filter-alt"></Icon>
                  </DropdownToggle>
                  <DropdownMenu end className="filter-wg dropdown-menu-xl" style={{ overflowY: "scroll" }}>
                    <div className="dropdown-head">
                      <span className="sub-title dropdown-title">Advanced Filter</span>
                    </div>
                    <div className="dropdown-body dropdown-body-rg">
                      <Row className="gx-6 gy-4">
                        {isSchemeFilterReq && (
                          <Col size="12">
                            <div className="form-group">
                              <SchemeDropdown
                                register={register}
                                id={"id_scheme"}
                                schemes={schemes}
                                selectedScheme={selectedScheme}
                                onSchemeChange={SetSelectedSchene}
                                isRequired={true}
                                clearErrors={clearErrors}
                                setValue={setValue}
                                message={errors.id_scheme && "Scheme is Required"}
                              />
                            </div>
                          </Col>
                        )}
                        {isBranchFilterReq && (
                          <Col size="12">
                            <div className="form-group">
                              <BranchDropdownMulti
                                id={"id_branch"}
                                optionLabel={"Choose Branch..."}
                                register={register}
                                value={selectedBranch}
                                SetValue={SetSelectedBranch}
                              />
                            </div>
                          </Col>
                        )}
                        {isDateFilterReq && (
                          <>
                            <Col size="6">
                              <div className="form-control-wrap">
                                <label className="overline-title overline-title-alt">From</label>
                                <span style={{ zIndex: "999" }}>
                                  <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={startDate}
                                    onChange={(date) => SetStartDate(date)}
                                    style={{ display: "inline-flex" }}
                                    className=" form-control date-picker"
                                  />
                                </span>
                              </div>

                              <div className="form-control-wrap">
                                <label className="overline-title overline-title-alt">To</label>
                                <span style={{ zIndex: "999" }}>
                                  <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={endDate}
                                    onChange={(date) => SetEndDate(date)}
                                    className=" form-control date-picker"
                                  />
                                </span>
                              </div>
                            </Col>
                            <Col size="6" className="">
                              <div className="form-group">
                                <Button className="m-1" color="primary" onClick={setToday}>
                                  Today
                                </Button>
                                <Button className="m-1" color="primary" onClick={setYesterday}>
                                  Yesterday
                                </Button>
                                <Button className="m-1" color="primary" onClick={setLastWeek}>
                                  Last Week
                                </Button>
                                <Button className="m-1" color="primary" onClick={setLastMonth}>
                                  Last Month
                                </Button>
                              </div>
                            </Col>
                          </>
                        )}

                        <Col size="12">
                          <div className="form-group">
                            <Button type="button" onClick={() => getData()} className="btn btn-secondary">
                              Filter
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </li>
              
            </>
          )}

          {/* <li>
          <label>
            <div className="form-control-select">
              {" "}
              <select
                name="DataTables_Table_0_length"
                className="custom-select custom-select-sm form-control form-control-sm"
                onChange={(e) => setItemPerPage(e.target.value)}
                value={itemPerPage}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={30}>40</option>
                <option value={40}>50</option>
              </select>{" "}
            </div>
          </label>
        </li> */}
        </ul>
      </div>
    </>
  );
};

export const NoDataTableHeader = ({
  navigate,
  title,
  addPageURL,
  allowAdd,
  isAddReq,
  getData,
  isFilterReq,
  isSchemeFilterReq,
  isBranchFilterReq,
  isDateFilterReq,
  schemes,
  branches,
  selectedScheme,
  SetSelectedSchene,
  selectedBranch,
  SetSelectedBranch,
  startDate,
  SetStartDate,
  endDate,
  SetEndDate,
}) => {
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const setToday = () => {
    const today = new Date();
    SetStartDate(today);
    SetEndDate(today);
  };

  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    SetStartDate(yesterday);
    SetEndDate(yesterday);
  };

  const setLastWeek = () => {
    const today = new Date();
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 7);
    SetStartDate(lastWeekStart);
    SetEndDate(today);
  };

  const setLastMonth = () => {
    const today = new Date();
    const lastMonthStart = new Date(today);
    lastMonthStart.setMonth(today.getMonth() - 1);
    SetStartDate(lastMonthStart);
    SetEndDate(today);
  };
  return (
    <BlockHead size="sm">
      <BlockBetween>
        <BlockHeadContent>
          <BlockTitle page>{title}</BlockTitle>
        </BlockHeadContent>
        <BlockHeadContent>
          <div className="toggle-wrap nk-block-tools-toggle">
            <div className="card-tools me-n1">
              <ul className="btn-toolbar gx-1">
                {isAddReq && (
                  <>
                    <li>
                      <label>
                        <Button
                          hidden={!allowAdd}
                          className="toggle btn-icon d-md-none"
                          color="primary"
                          onClick={() => {
                            navigate(
                              {
                                pathname: `${process.env.PUBLIC_URL}${addPageURL}`,
                              },
                              {
                                state: { add: true },
                              }
                            );
                          }}
                        >
                          <Icon name="plus"></Icon>
                        </Button>
                        <Button
                          hidden={!allowAdd}
                          className="toggle d-none d-md-inline-flex"
                          color="primary"
                          onClick={() => {
                            navigate(
                              {
                                pathname: `${process.env.PUBLIC_URL}${addPageURL}`,
                              },
                              {
                                state: { add: true },
                              }
                            );
                          }}
                        >
                          <Icon name="plus"></Icon>
                          <span>Create {title}</span>
                        </Button>
                      </label>
                    </li>
                    <li className="btn-toolbar-sep"></li>
                  </>
                )}
                {isFilterReq && (
                  <>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                          <div className="dot dot-primary"></div>
                          <Icon name="filter-alt"></Icon>
                        </DropdownToggle>
                        <DropdownMenu end className="filter-wg dropdown-menu-xl" style={{ overflowY: "scroll" }}>
                          <div className="dropdown-head">
                            <span className="sub-title dropdown-title">Advanced Filter</span>
                          </div>
                          <div className="dropdown-body dropdown-body-rg">
                            <Row className="gx-6 gy-4">
                              {isSchemeFilterReq && (
                                <Col size="12">
                                  <div className="form-group">
                                    <SchemeDropdown
                                      register={register}
                                      id={"id_scheme"}
                                      schemes={schemes}
                                      selectedScheme={selectedScheme}
                                      onSchemeChange={SetSelectedSchene}
                                      isRequired={true}
                                      clearErrors={clearErrors}
                                      setValue={setValue}
                                      message={errors.id_scheme && "Scheme is Required"}
                                    />
                                  </div>
                                </Col>
                              )}
                              {isBranchFilterReq && (
                                <Col size="12">
                                  <div className="form-group">
                                    <BranchDropdownMulti
                                      id={"id_branch"}
                                      optionLabel={"Choose Branch..."}
                                      register={register}
                                      value={selectedBranch}
                                      SetValue={SetSelectedBranch}
                                    />
                                  </div>
                                </Col>
                              )}
                              {isDateFilterReq && (
                                <>
                                  <Col size="6">
                                    <div className="form-control-wrap">
                                      <label className="overline-title overline-title-alt">From</label>
                                      <span style={{ zIndex: "999" }}>
                                        <DatePicker
                                          dateFormat="dd/MM/yyyy"
                                          selected={startDate}
                                          onChange={(date) => SetStartDate(date)}
                                          style={{ display: "inline-flex" }}
                                          className=" form-control date-picker"
                                        />
                                      </span>
                                    </div>

                                    <div className="form-control-wrap">
                                      <label className="overline-title overline-title-alt">To</label>
                                      <span style={{ zIndex: "999" }}>
                                        <DatePicker
                                          dateFormat="dd/MM/yyyy"
                                          selected={endDate}
                                          onChange={(date) => SetEndDate(date)}
                                          className=" form-control date-picker"
                                        />
                                      </span>
                                    </div>
                                  </Col>
                                  <Col size="6" className="">
                                    <div className="form-group">
                                      <Button className="m-1" color="primary" onClick={setToday}>
                                        Today
                                      </Button>
                                      <Button className="m-1" color="primary" onClick={setYesterday}>
                                        Yesterday
                                      </Button>
                                      <Button className="m-1" color="primary" onClick={setLastWeek}>
                                        Last Week
                                      </Button>
                                      <Button className="m-1" color="primary" onClick={setLastMonth}>
                                        Last Month
                                      </Button>
                                    </div>
                                  </Col>
                                </>
                              )}

                              <Col size="12">
                                <div className="form-group">
                                  <Button type="button" onClick={() => getData()} className="btn btn-secondary">
                                    Filter
                                  </Button>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li className="btn-toolbar-sep"></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </BlockHeadContent>
      </BlockBetween>
    </BlockHead>
  );
};
