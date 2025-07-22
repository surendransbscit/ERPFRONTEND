import React, { useEffect, useState, useRef } from "react";
import Head from "../../../layout/head/Head";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Col,
  Row,
  PreviewCard,
  SaveButton,
  UserAvatar,
  TextInputField,
} from "../../../components/Component";
import Content from "../../../layout/content/Content";
import "../../../assets/css/sales_form.css";
import "../../../assets/css/datatable.css";
import { BranchDropdown } from "../../../components/filters/retailFilters";
import { useBranches } from "../../../components/filters/filterHooks";
import { Button, ButtonGroup } from "reactstrap";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useDispatch } from "react-redux";
import { getTagFilterdedData } from "../../../redux/thunks/inventory";
import secureLocalStorage from "react-secure-storage";
import TagPrnPrint from "../tagging/tagPrnPrint";
import DownloadTagPrint from "../tagging/tagPrnDownload";
import { getPagePermission } from "../../../redux/thunks/coreComponent";
const DuplicateTagForm = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const { isLoading: issubmitting, tagList } = useSelector(
    (state) => state.tagBulkEditReducer
  );
  // const {
  //     userInfo: { settings },
  // } = useSelector((state) => state.authUserReducer);
  const {
    userInfo: { settings, user },
    userInfo,
  } = useSelector((state) => state.authUserReducer);
  const methods = useForm();
  const { branches } = useBranches();

  const [selectAll, setSelectAll] = useState(true);
  const dispatch = useDispatch();
  const [selectedTagCode, setSelectedTagCode] = useState();
  const [selectedBranch, setSelectedBranch] = useState();

  const handleFormChange = (index, field, value) => {
    setFilterTagList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

  const [filterTagList, setFilterTagList] = useState(tagList);

  // useEffect(() => {
  //   setFilterTagList(tagList);
  // }, [tagList]);

  // const searchTag = () => {
  //   if (selectedBranch || selectedTagCode) {
  //     dispatch(
  //       getTagFilterdedData({
  //         filter_details: {
  //           tag_code: selectedTagCode,
  //           tag_current_branch: selectedBranch,
  //           tag_product_id: "",
  //           tag_design_id: "",
  //           tag_sub_design_id: "",
  //           tag_purity_id: "",
  //           tag_mc_value: "",
  //           tag_mc_type: "",
  //         },
  //         custom_filter_details: {
  //           tagDateFrom: "",
  //           tagDateTo: "",
  //           lotId: "",
  //           vaWeightFrom: "",
  //           vaWeightTo: "",
  //           selectedSupplier: "",
  //           grossWeightFrom: "",
  //           grossWeightTo: "",
  //         },
  //       })
  //     );
  //   } else {
  //     toastfunc("Select Any One Of these Branch or Tag Code to Filter Tag");
  //   }
  // };

  const searchTag = () => {
    if (selectedBranch && selectedTagCode) { 
      dispatch(
        getTagFilterdedData({
          filter_details: {
            tag_code: selectedTagCode,
            tag_current_branch: selectedBranch,
            tag_product_id: "",
            tag_design_id: "",
            tag_sub_design_id: "",
            tag_purity_id: "",
            tag_mc_value: "",
            tag_mc_type: "",
          },
          custom_filter_details: {
            tagDateFrom: "",
            tagDateTo: "",
            lotId: "",
            vaWeightFrom: "",
            vaWeightTo: "",
            selectedSupplier: "",
            grossWeightFrom: "",
            grossWeightTo: "",
          },
        })
      ).then((response) => {
        console.log(response);

        if (response?.payload) {
          if (selectedTagCode) {
            // Append results when searching by tag code
            setFilterTagList((prevList) => [
              ...prevList,
              ...response.payload?.filter(
                (newItem) =>
                  !prevList?.some((item) => item.tag_code === newItem.tag_code)
              ),
            ]);
          } else {
            // Replace results when searching by branch
            setFilterTagList(response.payload);
          }
        }
      });
    } else {
      toastfunc("Select Branch and enter Tag Code");
    }
  };

  const selectAllCol = (value) => {
    filterTagList?.map((item, rowIndex) => {
      handleFormChange(rowIndex, "isChecked", value);
    });
  };

  const printTags = async () => {
    let response = "";
    const checkedtags = filterTagList.filter((tag) => tag.isChecked === true);

    console.log(checkedtags);
    // response = await dispatch(printBulkTag({ tagData: checkedtags })).unwrap();
    // if (response?.message !== undefined && response?.message?.includes("Enter")) {
    //     toastsuccess(response?.message);
    // } else {
    //     window.open(response?.tag_url, "_blank");
    // }
    DownloadTagPrint(checkedtags, userInfo);
    // secureLocalStorage.setItem("pageState", JSON.stringify(data));
    // window.open(`${process.env.PUBLIC_URL}/tag/print`, "_blank");
  };

  const handlePrint = (itemDetails, settings, user) => {
    let prn = "";
    let uniqueFileName = `labels_${Date.now()}_sds.prn`;
    itemDetails.forEach((element, index) => {
      let tagcode = element.tag_code;
      let productName = element.product_name;
      let grossWeight = element.tag_gwt;
      let size = element?.size_name;
      let wastagePercentage = element.tag_wastage_percentage;
      let mc = element.tag_mc_value;
      let sellRate = element.tag_sell_rate;
      let fixedRateType = element.fixed_rate_type;
      if (fixedRateType == 1) {
        sellRate = element.tag_sell_rate;
      } else {
        sellRate = element.tag_item_cost;
      }
      let salesMode = element.sales_mode;

      let code = `I8,A,001
                        Q125,024
                        q1020
                        S2
                        D08
                        ZT
                        JF
                        O
                        R58,0
                        F100
                        N
                        A700,85,2,4,1,1,N,"${tagcode}"
                        A700,55,2,4,1,1,N,"G:${grossWeight}gm"
                        `;
      if (size != undefined) {
        code += `\nA700,20,2,3,1,1,N,"Sz:${size}"`;
      }
      code += `\nA500,90,2,3,1,1,N,"${productName}"`;
      if (salesMode == 1) {
        code += `\nA500,60,2,1,1,2,N,"VA:${wastagePercentage}/gm"
                      \nA500,30,2,1,1,2,N,"Mc:${mc}/-"`;
      } else {
        code += `\nA500,60,2,1,1,2,N,"Rs: ${sellRate}/-`;
      }
      code += `\nb320,10,Q,m2,s3,eL,iA,"${tagcode}"
                    P1`;

      prn += code;

      if (index != 0) {
        prn += "\r\n";
      }
    });

    const blob = new Blob([prn], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = uniqueFileName;
    document.body.appendChild(a);
    a.click();
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const pathName = location?.pathname;
  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    if (
      pagePermission?.view === false ||
      pagePermission === undefined ||
      pagePermission === null
    ) {
      navigate(`${process.env.PUBLIC_URL}/`);
    }
  }, [pagePermission, navigate]);


  return (
    <React.Fragment>
      <Head title="Duplicate Tag" />
      <Content>
        <PreviewCard className="h-100">
          <FormProvider {...methods}>
            <Row lg={12} className={""} style={{ marginTop: "10px" }}>
              <Col md={9}>
                <ModifiedBreadcrumb />
              </Col>

              <Col md={3} className="">
                <ButtonGroup>
                  <div>
                    <Button
                      disabled={
                        filterTagList.filter((tag) => tag.isChecked === true)
                          ?.length == 0 || issubmitting || !pagePermission?.print
                      }
                      type="button"
                      className="m-1 btn btn-secondary"
                      onClick={() => printTags()}
                    >
                      {issubmitting ? "Printing" : "Print"}
                    </Button>
                  </div>
                  <SaveButton
                    disabled={issubmitting}
                    size="md"
                    color=""
                    onClick={handleSubmit((data) => searchTag())}
                  >
                    Search
                  </SaveButton>
                </ButtonGroup>
              </Col>
            </Row>

            <Row lg={12} className={"form-control-sm"}>
              <Col md={3}>
                <div className="custom-grid">
                  {/* <Row className="form-group row g-2">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="radioSize">
                          Filter by
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                register={register}
                                type="radio"
                                className="custom-control-input"
                                name="radioSize"
                                id="customRadioYes"
                                value={1}
                                onChange={(e) => {
                                  setSearchByOpt(1);
                                }}
                                checked={parseInt(searchByOpt) === 1}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="customRadioYes"
                              >
                                Tag
                              </label>
                            </div>
                          </li>

                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                register={register}
                                type="radio"
                                className="custom-control-input"
                                name="radioSize"
                                id="customRadioNo"
                                value={2}
                                checked={parseInt(searchByOpt) === 2}
                                onChange={(e) => {
                                  setSearchByOpt(2);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="customRadioNo"
                              >
                                Branch
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row> */}

                  <Row className="form-group row g-2">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="selectedTagCode">
                          Tag Code
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <TextInputField
                        register={register}
                        placeholder="Tag Code"
                        id={"selectedTagCode"}
                        value={selectedTagCode}
                        isRequired={false}
                        type={"text"}
                        setValue={setValue}
                        SetValue={(value) => {
                          setSelectedTagCode(value);
                          clearErrors("selectedTagCode");
                        }}
                        message={
                          errors.selectedTagCode &&
                          errors.selectedTagCode.message
                        }
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="selectedBranch">
                          Branch
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <BranchDropdown
                        register={register}
                        id={"selectedBranch"}
                        branches={branches}
                        selectedBranch={selectedBranch}
                        onBranchChange={(value) => {
                          setSelectedBranch(value);
                        }}
                        isRequired={false}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.selectedBranch && "Branch is Required"}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            <Row className="form-group row g-4">
              <Col md={12}>
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
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          S.NO{" "}
                          <input
                            type="checkbox"
                            onChange={(event) => {
                              selectAllCol(event.target.checked);
                              setSelectAll(event.target.checked);
                            }}
                            checked={selectAll}
                          />{" "}
                        </th>
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
                          Supplier Name
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
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Design Name
                        </th>

                         <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Sub Design
                        </th>
                       
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
                          Nwt
                        </th>
                         <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          V.A
                        </th>
                         <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          MC
                        </th>
                         <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Flat MC
                        </th>
                         <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          HUID
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          HUID2
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterTagList?.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>
                            {rowIndex + 1}{" "}
                            <input
                              type="checkbox"
                              onChange={(event) => {
                                handleFormChange(
                                  rowIndex,
                                  "isChecked",
                                  event.target.checked
                                );
                              }}
                              checked={item.isChecked}
                            />{" "}
                          </td>
                          <td>{item.tag_code}</td>
                          <td>{item.supplier_name}</td>
                          <td>{item.product_name}</td>
                          <td>{item.design_name}</td>
                          <td>{item.sub_design_name}</td>
                          <td>{item.tag_pcs}</td>
                          <td>{item.tag_gwt}</td>
                          <td>{item.tag_nwt}</td>
                          <td>{item.tag_wastage_percentage}</td>
                          <td>{item.tag_mc_value}</td>
                          <td>{item.flat_mc_value}</td>
                          <td>{item.tag_huid}</td>
                          <td>{item.tag_huid2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </FormProvider>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default DuplicateTagForm;
