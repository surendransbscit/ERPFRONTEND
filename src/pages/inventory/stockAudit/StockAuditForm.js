import React, { useEffect, useState, useRef } from "react";
import Head from "../../../layout/head/Head";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Col,
  Row,
  PreviewCard,
  SaveButton,
  Icon,
} from "../../../components/Component";
import { TextInputField } from "../../../components/form-control/InputGroup";
import Content from "../../../layout/content/Content";
import "../../../assets/css/sales_form.css";
import {
  BranchDropdown,
  ProductDropdown,
} from "../../../components/filters/retailFilters";
import {
  useProducts,
  useBranches,
} from "../../../components/filters/filterHooks";
import { Button, Badge } from "reactstrap";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useDispatch } from "react-redux";
import {
  createTagScanAudit,
  closeTagScanAudit,
  createContainerScanAudit,
  closeContainerScanAudit,
} from "../../../redux/thunks/inventory";
import IsRequired from "../../../components/erp-required/erp-required";
import styled from "styled-components";

const ScannedRow = styled.tr`
  && {
    background-color: ${(props) =>
      props.isScanned ? "green !important" : "transparent"};
  }
`;

const StockAuditForm = () => {
  const location = useLocation();
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const {
    isLoading: issubmitting,
    tagList,
    containerTagDetails,
  } = useSelector((state) => state.tagAuditReducer);
  const methods = useForm();
  const { products } = useProducts();
  const { branches } = useBranches();
  const dispatch = useDispatch();
  const filterValuesDefalut = {
    selectedBranch: 1,
    tagCode: "",
    selectedProduct: "",
    containerCode: "",
    id_container: "",
  };
  const [filterValues, setFilterValues] = useState(filterValuesDefalut);
  const [filterTagList, setFilterTagList] = useState([]);
  const [filterContainerList, setFilterContainerList] = useState([]);
  const [containerWt, setContainerWt] = useState(0);

  const onClickSave = () => {
    console.log(filterValues);
    if (
      filterValues?.selectedBranch === "" ||
      filterValues?.selectedBranch === null
    ) {
      toastfunc("Please Select From Branch");
    } else if (
      filterValues.selectedProduct === "" ||
      filterValues.selectedProduct === null
    ) {
      toastfunc("Please Select Product");
    } else {
      dispatch(
        closeTagScanAudit({
          id_branch: filterValues.selectedBranch,
          id_product: filterValues.selectedProduct,
        })
      );
      reset_form();
    }
  };

  const closeScan = (tagDetails = []) => {
    console.log(filterValues);
    if (
      filterValues?.selectedBranch === "" ||
      filterValues?.selectedBranch === null
    ) {
      toastfunc("Please Select From Branch");
    } else if (
      filterValues?.id_container === "" ||
      filterValues?.id_container === null
    ) {
      toastfunc("Please Select Container");
    } else {
      dispatch(
        closeContainerScanAudit({
          id_container: filterValues.id_container,
          id_branch: filterValues.selectedBranch,
          tag_details: tagDetails,
        })
      );
      reset_form();
    }
  };

  const handleFilterChange = (field, value) => {
    setFilterValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  useEffect(() => {
    if (Object.keys(tagList).length > 0) {
      let data = [...filterTagList, tagList];
      setFilterTagList(data);
      updateStatus(tagList);
      console.log(filterTagList);
      handleFilterChange("tagCode", "");
    }
  }, [tagList]);

  useEffect(() => {
    if (containerTagDetails?.data) {
      setFilterContainerList(containerTagDetails.data);
      setContainerWt(containerTagDetails.container_wt);
      handleFilterChange(
        "id_container",
        containerTagDetails?.container_data?.id_container
      );
    }
  }, [containerTagDetails]);

  const handleDeleteTag = (index) => {
    const updatedFormData = [...filterTagList];
    updatedFormData.splice(index, 1);
    setFilterTagList(updatedFormData);
  };

  const reset_form = async () => {
    reset("");
    setFilterTagList([]);
    setFilterValues(filterValuesDefalut);
    setContainerWt(0);
    setFilterContainerList([]);
  };

  useEffect(() => {
    if (filterValues.tagCode.length > 5 && filterValues.tagCode !== "") {
      handleAddPreview();
    }
  }, [filterValues.tagCode]);

  useEffect(() => {
    if (
      filterValues.containerCode.length > 2 &&
      filterValues.containerCode !== ""
    ) {
      handleAddPreviewContainer();
    }
  }, [filterValues.containerCode]);
  const searchContainer = () => {
    dispatch(
      createContainerScanAudit({
        container_code: filterValues.containerCode,
        id_branch: filterValues.selectedBranch,
      })
    );
  };

  const searchTag = () => {
    dispatch(
      createTagScanAudit({
        tag_code: filterValues.tagCode,
        id_container: filterValues.id_container,
        id_branch: filterValues.selectedBranch,
      })
    );
    // filterValues.tagCode = "";
  };

  const handleAddPreview = () => {
    if (
      filterValues?.id_container === "" ||
      filterValues?.id_container === null
    ) {
      toastfunc("Please Select Container");
    } else if (filterValues.tagCode === "" || filterValues.tagCode === null) {
      toastfunc("Please Enter Tag Code" + filterValues.tagCode);
    } else {
      searchTag();
    }
  };

  const handleAddPreviewContainer = () => {
    if (
      filterValues?.selectedBranch === "" ||
      filterValues?.selectedBranch === null
    ) {
      toastfunc("Please Select From Branch");
    } else if (
      filterValues.containerCode === "" ||
      filterValues.containerCode === null
    ) {
      toastfunc("Please Enter Container Code" + filterValues.containerCode);
    } else {
      searchContainer();
    }
  };

  const handleFormChange = (index, field, value) => {
    setFilterContainerList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;
      return updatedValues;
    });
  };

  const updateStatus = (data) => {
    let index = filterContainerList.findIndex(
      (value) => value.tag_id === data.tag_id
    );
    handleFormChange(index, "isScanned", true);
    console.log(index, filterTagList[index]);
  };

  var totalPiece = filterTagList?.reduce(
    (sum, obj) =>
      sum + (obj?.tag_pcs != null || undefined ? parseFloat(obj?.tag_pcs) : 0),
    0
  );

  var totalGrsWt = filterTagList?.reduce(
    (sum, obj) =>
      sum + (obj?.tag_gwt != null || undefined ? parseFloat(obj?.tag_gwt) : 0),
    0
  );

  var totalLessWt = filterTagList?.reduce(
    (sum, obj) =>
      sum + (obj?.tag_lwt != null || undefined ? parseFloat(obj?.tag_lwt) : 0),
    0
  );

  var totalStWt = filterTagList?.reduce(
    (sum, obj) =>
      sum +
      (obj?.tag_stn_wt != null || undefined ? parseFloat(obj?.tag_stn_wt) : 0),
    0
  );

  var totalNetWt = filterTagList?.reduce(
    (sum, obj) =>
      sum + (obj?.tag_nwt != null || undefined ? parseFloat(obj?.tag_nwt) : 0),
    0
  );

  var totalDiaWt = filterTagList?.reduce(
    (sum, obj) =>
      sum +
      (obj?.tag_dia_wt != null || undefined ? parseFloat(obj?.tag_dia_wt) : 0),
    0
  );

  const calculateTotal = (field, data, decimal_places = 3) => {
    return data.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };
  // useEffect(() => {
  //     if (add === undefined && id === undefined) {
  //         navigate(`${process.env.PUBLIC_URL}/inventory/stock_transfer/list`);
  //     }
  // }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title="Stock Transfer " />
      <Content>
        <PreviewCard className="h-100">
          <FormProvider {...methods}>
            <Row
              lg={12}
              className={"form-control-sm"}
              style={{ marginTop: "10px" }}
            >
              <Col md={9}>
                <ModifiedBreadcrumb></ModifiedBreadcrumb>
              </Col>

              <Col md={3} className="text-right">
                <Button
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(process.env.PUBLIC_URL)}
                >
                  Cancel
                </Button>{" "}
              </Col>
            </Row>
            <Row
              lg={12}
              className={"form-control-sm"}
              style={{ marginTop: "10px" }}
            >
              <Col md={12}>
                <div className="custom-grid">
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                    CONTAINER AUDIT
                    <hr style={{ marginTop: "0px" }} />
                  </div>
                  <Row lg={12} className={"form-control-sm"}>
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Branch
                          <IsRequired />
                        </label>

                        <BranchDropdown
                          register={register}
                          id={"idBranch"}
                          branches={branches}
                          selectedBranch={filterValues?.selectedBranch}
                          onBranchChange={(value) => {
                            handleFilterChange("selectedBranch", value);
                          }}
                          isRequired={false}
                          clearErrors={clearErrors}
                          setValue={setValue}
                          message={errors.idBranch && "Branch is Required"}
                        />
                      </div>
                    </Col>

                    {/* <Col md="3">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        Container Code
                                                    </label>


                                                    <TextInputField
                                                        register={register}
                                                        placeholder="Container Code"
                                                        id={"containerCode"}
                                                        value={filterValues.containerCode}
                                                        isRequired={true}
                                                        type={"text"}
                                                        setValue={setValue}
                                                        SetValue={(value) => {
                                                            console.log('containerCode', value)
                                                            handleFilterChange('containerCode', value);
                                                            clearErrors("containerCode");
                                                        }}
                                                        message={errors.containerCode && errors.containerCode.message}
                                                    />
                                                </div>
                                            </Col> */}
                    <Col md={6}>
                      <div className="form-control-wrap">
                        <label className="form-label" htmlFor="site-name">
                          Container Code
                        </label>
                        <div className="input-group">
                          <TextInputField
                            register={register}
                            isRequired={true}
                            id={"containerCode"}
                            placeholder="Container Code"
                            value={filterValues.containerCode}
                            SetValue={(value) => {
                              console.log("containerCode", value);
                              handleFilterChange("containerCode", value);
                              clearErrors("containerCode");
                            }}
                            message={
                              errors.containerCode &&
                              errors.containerCode.message
                            }
                          />
                          <div
                            className="input-group-append"
                            style={{ height: "29px" }}
                          >
                            <Button
                              outline
                              color="primary"
                              className="btn-dim"
                              onClick={handleAddPreviewContainer}
                            >
                              <Icon name="search" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Col>

                    {/* <Col md="2" >
                                                <div className="form-group" >
                                                    <br />
                                                    <SaveButton
                                                        disabled={issubmitting}
                                                        size="md"
                                                        color="primary"
                                                        tabIndex={17}
                                                        onClick={handleAddPreviewContainer}
                                                    >
                                                        Scan
                                                    </SaveButton>
                                                </div>
                                            </Col> */}
                    {/* 
                                        <Col md="2" >
                                            <div className="form-group" >
                                                <br />
                                                <SaveButton
                                                    disabled={issubmitting}
                                                    size="md"
                                                    color="warning"
                                                    tabIndex={17}
                                                    onClick={() => {
                                                        let scanned = filterContainerList.filter((value) => value.isScanned === true)
                                                        if (scanned.length > 0) {
                                                            closeScan();
                                                        } else {
                                                            closeScan(filterContainerList);
                                                        }
                                                    }}
                                                >
                                                    Close
                                                </SaveButton>
                                            </div>
                                        </Col> */}
                  </Row>

                  <br />

                  <Row
                    className="form-group row g-4"
                    style={{ fontSize: "14px" }}
                  >
                    <Col md={12}>
                      {/* <br /> */}
                      <Col md={12} className="form-group row g-4">
                        <Col md={12}>
                          <div style={{ fontWeight: "bold" }}>
                            SCANNED DETAILS :{" "}
                          </div>
                        </Col>

                        <Col md={6} className="form-group row g-1">
                          <Row>
                            {" "}
                            <Col>
                              <div>
                                {" "}
                                Container Wt &nbsp;&nbsp;&nbsp; :{" "}
                                {parseFloat(containerWt).toFixed(3)} GM{" "}
                              </div>
                            </Col>{" "}
                          </Row>
                          <Row>
                            {" "}
                            <Col>
                              <div>
                                {" "}
                                Other Wt
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                :{" "}
                                {calculateTotal(
                                  "product_other_wt",
                                  filterContainerList
                                )}{" "}
                                GM{" "}
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <div style={{ fontWeight: "bold" }}>
                              {" "}
                              TOTAL WEIGHT :{" "}
                              {parseFloat(
                                parseFloat(
                                  calculateTotal("tag_gwt", filterContainerList)
                                ) +
                                  parseFloat(
                                    calculateTotal(
                                      "product_other_wt",
                                      filterContainerList
                                    )
                                  ) +
                                  parseFloat(containerWt)
                              ).toFixed(3)}{" "}
                              GM{" "}
                            </div>
                          </Row>
                        </Col>
                      </Col>

                      <Row md={12}>
                        <div
                          className="table-responsive"
                          style={{ maxHeight: "400px", overflowY: "auto" }}
                        >
                          <table className="table table-bordered">
                            <thead
                              style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                                backgroundColor: "#f8f9fa",
                              }}
                            >
                              <tr>
                                {/* <th></th> */}
                                {/* <th>S.NO</th> */}
                                <th
                                  style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  Tag Code
                                </th>
                                <th
                                  style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  Product
                                </th>
                                {/* <th>Design</th>
                                                                    <th>S.Design</th> */}

                                <th
                                  style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  Piece
                                </th>
                                <th
                                  style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  Gwt
                                </th>
                                <th
                                  style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  Lwt
                                </th>
                                <th
                                  style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  Nwt
                                </th>
                                {/* <th>Status</th> */}
                                {/* <th>Stn Wt</th>
                                                                    <th>Dia Wt</th>
                                                                    <th>Action</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {console.log(
                                filterContainerList,
                                "filterContainerList"
                              )}

                              {filterContainerList?.map((item, rowIndex) => (
                                <tr key={`row-${rowIndex}`}>
                                  <td
                                    style={{
                                      color: item.isScanned ? "blue" : "",
                                    }}
                                  >
                                    {item.tag_code}
                                  </td>
                                  <td>{item.product_name}</td>
                                  <td style={{ textAlign: "right" }}>
                                    {" "}
                                    {item.tag_pcs}
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    {item.tag_gwt}
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    {item.tag_lwt}
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    {item.tag_nwt}
                                  </td>
                                  {/* <td style={{ textAlign: "right" }}>          
                                                                        <Badge className="badge-sm badge-dot has-bg d-none d-sm-inline-flex" color={item.isScanned ? 'primary':'warning'}>
                                                                            {item.isScanned ? 'Scanned':'UnScanned'}
                                                                        </Badge></td> */}
                                </tr>
                              ))}
                            </tbody>
                            <tfoot
                              style={{
                                position: "sticky",
                                bottom: "0",
                                backgroundColor: "#f8f9fa",
                                zIndex: "1",
                              }}
                            >
                              <tr style={{ fontWeight: "bold" }}>
                                <td
                                  style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  Total
                                </td>
                                {/* <td></td> */}
                                <td
                                  style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                ></td>
                                {/* <td></td>
                                                                    <td></td> */}

                                <td
                                  style={{
                                    textAlign: "right",
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {calculateTotal(
                                    "tag_pcs",
                                    filterContainerList,
                                    0
                                  )}
                                </td>
                                <td
                                  style={{
                                    textAlign: "right",
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {calculateTotal(
                                    "tag_gwt",
                                    filterContainerList
                                  )}
                                </td>
                                <td
                                  style={{
                                    textAlign: "right",
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {calculateTotal(
                                    "tag_lwt",
                                    filterContainerList
                                  )}
                                </td>
                                <td
                                  style={{
                                    textAlign: "right",
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {calculateTotal(
                                    "tag_nwt",
                                    filterContainerList
                                  )}
                                </td>
                                {/* <td style={{ textAlign: "right" }}>
                                                                        {parseFloat(totalStWt).toFixed(2)}
                                                                    </td>
                                                                    <td style={{ textAlign: "right" }}>
                                                                        {parseFloat(totalDiaWt).toFixed(2)}
                                                                    </td> */}
                                {/* <td></td> */}
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </Col>
              {/* <Col md={6}>
                                <div className="custom-grid">
                                    <Row lg={12} className={"form-control-sm"}>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                            PHYSICAL TAG SCAN
                                            <hr style={{ marginTop: '0px' }} />
                                        </div>
   


<Col md={6}>
                                            <div className="form-control-wrap" >
                                                <label className="form-label" htmlFor="site-name">
                                                Tag Code
                                                 </label>
                                                <div className="input-group" >
                                                    <TextInputField
                                                        register={register}
                                                        isRequired={true}
                                                        id={"tagCode"}
                                                        placeholder="Tag Code"
                                                        value={filterValues.tagCode}
                                                        SetValue={(value) => {
                                                            console.log('tagCode', value)
                                                            handleFilterChange('tagCode', value);
                                                            clearErrors("tagCode");
                                                        }}
                                                        message={errors.tagCode && errors.tagCode.message}
                                                    />
                                                    <div className="input-group-append" style={{ height: "29px"}}>
                                                        <Button outline color="primary" className="btn-dim" onClick={handleAddPreview}>
                                                          <Icon name="search" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col> 






                                    </Row>


                                    <Row className="form-group row g-4" style={{ marginTop: '20px' }}>
                                        <Col md={12}>
                                            <br />
                                            <Row md={12} className="form-group row g-4" >


                                                <Col md={3}><div style={{ fontWeight: 'bold' }}>SCANNED DETAILS:</div></Col>
                                                
                                                <Col md={3}>
                                                    <div style={{ fontWeight: 'bold' }}>
                                                        SCAN PCS :  {totalPiece}

                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div style={{ fontWeight: 'bold' }}>
                                                        SCAN WT : {parseFloat(totalGrsWt).toFixed(2)}

                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row md={12}>
                                                <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto", overflowX: "hidden"}} >
                                                    <table className="table table-bordered">
                                                        <thead style={{ position: "sticky", top: "0",zIndex: "1" }}>

                                                            <tr >
                                                               
                                                                <th>Tag Code</th>
                                                                <th>Product</th>
                                                              

                                                                <th>Piece</th>
                                                                <th>Gwt</th>
                                                                <th>Lwt</th>
                                                                <th>Nwt</th>
                                                            </tr>

                                                        </thead>
                                                        <tbody>

                                                            {filterTagList?.map((item, rowIndex) => (
                                                                <tr key={rowIndex}>

                                                                   
                                                                    <td>{item.tag_code}</td>
                                                                    <td>{item.product_name}</td>
                                                                   

                                                                    <td style={{ textAlign: "right" }}> {item.tag_pcs}</td>
                                                                    <td style={{ textAlign: "right" }}>{item.tag_gwt}</td>
                                                                    <td style={{ textAlign: "right" }}>{item.tag_lwt}</td>
                                                                    <td style={{ textAlign: "right" }}>{item.tag_nwt}</td>
                                                                   
                                                                </tr>
                                                            ))}


                                                        </tbody>
                                                        <tfoot style={{ position: "sticky", bottom: "0",zIndex: "1" }} >


                                                            <tr style={{ fontWeight: 'bold' }}>
                                                                <td>Total</td>
                                                                <td></td>

                                                                <td style={{ textAlign: "right" }}>
                                                                    {totalPiece}
                                                                </td>
                                                                <td style={{ textAlign: "right" }}>
                                                                    {parseFloat(totalGrsWt).toFixed(2)}
                                                                </td>
                                                                <td style={{ textAlign: "right" }}>
                                                                    {parseFloat(totalLessWt).toFixed(2)}
                                                                </td>
                                                                <td style={{ textAlign: "right" }}>
                                                                    {parseFloat(totalNetWt).toFixed(2)}
                                                                </td>
                                                            </tr>

                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </Col> */}
            </Row>
          </FormProvider>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default StockAuditForm;
