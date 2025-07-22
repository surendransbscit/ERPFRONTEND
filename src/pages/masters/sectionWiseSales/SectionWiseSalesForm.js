/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import { CancelButton, DateInputField, Icon, PreviewCard, SaveButton } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSectionWiseSales, getSectionWiseSalesItems } from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Row } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { BranchDropdown, SectionDropdown } from "../../../components/filters/retailFilters";
import { useBranches, useProducts, useSections } from "../../../components/filters/filterHooks";
import moment from "moment";

const SectionWiseSalesForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting } = useSelector((state) => state.sectionWiseSalesReducer);
  const { sectionWiseSalesItemList } = useSelector((state) => state.sectionWiseSalesReducer);
  const { branches } = useBranches();
  const { sections } = useSections();
  const { products } = useProducts();

  const [itemList, SetItemList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());

  const handelChange = (index, field, value) => {
    SetItemList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

  const postData = async () => {
    const section_wise_target = itemList?.map((obj) => {
      const container = {};
      container.branch = selectedBranch;
      container.section = selectedSection;
      container.from_date = moment(selectedFromDate).format("YYYY-MM-DD");
      container.to_date = moment(selectedToDate).format("YYYY-MM-DD");
      container.target_weight = obj.target_weight;
      container.amount = obj.amount;
      container.product = obj.product_id;
      container.target_pieces = obj.target_pieces;
      return container;
    });
    const adddata = {
      section: selectedSection,
      branch: selectedBranch,
      from_date: moment(selectedFromDate).format("YYYY-MM-DD"),
      to_date: moment(selectedToDate).format("YYYY-MM-DD"),
      section_wise_target,
    };

    try {
      await dispatch(createSectionWiseSales(adddata)).unwrap();
      toastsuccess("Section Wise sales updated successfully");
      setSelectedBranch();
      setSelectedSection();
      setSelectedFromDate();
      setSelectedToDate();
      SetItemList([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    SetItemList(sectionWiseSalesItemList);
  }, [sectionWiseSalesItemList]);

  // useEffect(() => {
  //   if (add === undefined) {
  //     navigate(`${process.env.PUBLIC_URL}/master/section_wise_sales/list`);
  //   }
  // }, [add, navigate]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Section Wise Sales"} />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>

            <Col md={5} className="text-right flex">
              <SaveButton
                disabled={issubmitting || itemList?.length == 0}
                size="md"
                color="primary"
                onClick={handleSubmit((data) => postData(data, "save"))}
              >
                {issubmitting ? "Saving" : "Save "}
              </SaveButton>

              <CancelButton
                disabled={issubmitting}
                color="danger"
                size="md"
                onClick={() => navigate(`${process.env.PUBLIC_URL}/master/section_wise_sales/list`)}
              >
                Cancel
              </CancelButton>
            </Col>
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col md="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="branch">
                    Branch
                    <IsRequired />
                  </label>
                  <BranchDropdown
                    register={register}
                    id={"selectedBranch"}
                    branches={branches}
                    selectedBranch={selectedBranch}
                    onBranchChange={setSelectedBranch}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectedBranch && "Branch is Required"}
                  />
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="id_section">
                    Section
                    <IsRequired />
                  </label>
                  <SectionDropdown
                    isMulti={false}
                    register={register}
                    isRequired={true}
                    id={"selectedSection"}
                    placeholder="Section"
                    value={selectedSection}
                    selectedSection={selectedSection}
                    optionLabel="Select Section"
                    sectionOptions={sections}
                    setValue={setValue}
                    onSectionChange={(value) => {
                      setSelectedSection(value);
                      dispatch(getSectionWiseSalesItems({ section_id: value }));
                      clearErrors("selectedSection");
                    }}
                    message={errors.selectedSection && "section is Required"}
                  />
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedFromDate">
                    From Date
                    <IsRequired />
                  </label>
                  <DateInputField
                    showYearDropdown={true}
                    showMonthDropdown={true}
                    id={"selectedFromDate"}
                    selected={selectedFromDate}
                    SetValue={setSelectedFromDate}
                  />
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedToDate">
                    To Date
                    <IsRequired />
                  </label>
                  <DateInputField
                    showYearDropdown={true}
                    showMonthDropdown={true}
                    id={"selectedToDate"}
                    selected={selectedToDate}
                    SetValue={setSelectedToDate}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <div className="table-responsive ">
                {itemList?.length > 0 ? (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>S.NO</th>
                        <th>Product</th>
                        <th>Pieces</th>
                        <th>weight</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemList?.map((obj, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="form-group">{obj.product_name}</div>
                            </td>
                            <td>
                              <input
                                {...register(`target_pieces${index}`, {
                                  required: "Required",
                                })}
                                type="number"
                                name="target_pieces"
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Enter Target Piece"
                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                value={obj?.target_pieces}
                                onChange={(e) => {
                                  handelChange(index, "target_pieces", e.target.value);
                                  setValue("target_pieces" + index, e.target.value);
                                }}
                              />
                              {errors?.[`target_pieces` + `${String(index)}`] && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {errors?.[`target_pieces` + `${String(index)}`].message}
                                </span>
                              )}
                            </td>
                            <td>
                              <input
                                {...register(`target_weight${index}`, {
                                  required: "Required",
                                })}
                                type="number"
                                name="target_weight"
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Enter Target Weight"
                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                value={obj?.target_weight}
                                onChange={(e) => {
                                  handelChange(index, "target_weight", e.target.value);
                                  setValue("target_weight" + index, e.target.value);
                                }}
                              />
                              {errors?.[`target_weight` + `${String(index)}`] && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {errors?.[`target_weight` + `${String(index)}`].message}
                                </span>
                              )}
                            </td>
                            <td>
                              <input
                                {...register(`amount${index}`, {
                                  required: "Required",
                                })}
                                type="number"
                                name="amount"
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Enter Amount"
                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                value={obj?.amount}
                                onChange={(e) => {
                                  handelChange(index, "amount", e.target.value);
                                  setValue("amount" + index, e.target.value);
                                }}
                              />
                              {errors?.[`amount` + `${String(index)}`] && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {errors?.[`amount` + `${String(index)}`].message}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="custom-grid">
                    <div>No products found</div>
                  </div>
                )}
              </div>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default SectionWiseSalesForm;
