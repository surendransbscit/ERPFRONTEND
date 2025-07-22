/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  CancelButton,
  PreviewCard,
  SaveButton,
  DateInputField,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Icon,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import BranchDropdownMulti from "../../../components/common/dropdown/BranchDropdownMulti";
import IsRequired from "../../../components/erp-required/erp-required";
import moment from "moment/moment";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import {
  createDiscount,
  getDiscountById,
  updateDiscountById,
} from "../../../redux/thunks/promotionManagement";
import ReactQuill from "react-quill";
import {
  useCategories,
  useProducts,
} from "../../../components/filters/filterHooks";
import {
  CategoryDropdown,
  ProductDropdown,
} from "../../../components/filters/retailFilters";
import ProductDropdownMulti from "../../../components/common/dropdown/ProductDropdownMulti";

const DiscountForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    setValue,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting } = useSelector(
    (state) => state.promotionManagementDiscountReducer
  );
  const { promotionManagementDiscountInfo } = useSelector(
    (state) => state.promotionManagementDiscountReducer
  );

  const [branches, SetBranches] = useState([]);
  const [discountName, SetDiscountName] = useState();
  const [discountValue, SetDiscountValue] = useState();
  const [discountType, SetDiscountType] = useState();
  const [applyOn, SetApplyOn] = useState("1");
  const [applyOnValue, SetApplyOnValue] = useState();
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());
  const [active, setActive] = useState(true);
  const [maxDiscountAllowed, setMaxDiscountAllowed] = useState("");
  const [conditions, setConditions] = useState("0");
  const [termsAndConditions, setTermsAndConditions] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);

  const { categories } = useCategories();
  const { products } = useProducts();

  const discountTypeOptions = [
    {
      label: "Wastage %",
      value: 1,
    },
    {
      label: "Wastage Value",
      value: 2,
    },
    {
      label: "Making Charge %",
      value: 3,
    },
    {
      label: "Making Charge Value",
      value: 4,
    },
    {
      label: "Gold Rate Discount (₹)",
      value: 5,
    },
    {
      label: "Diamond Value Discount",
      value: 6,
    },
    {
      label: "Flat Bill % Discount",
      value: 7,
    },
    {
      label: "Flat Bill ₹ Discount",
      value: 8,
    },
    {
      label: "Category Discount",
      value: 9,
    },
    {
      label: "Product Discount",
      value: 10,
    },
    {
      label: "Customer Type Discount",
      value: 11,
    },
  ];

  const postData = async () => {
    const addData = {
      branches: branches.map((obj) => {
        const container = obj.value;
        return container;
      }),
      discount_name: discountName,
      discount_value: discountValue,
      discount_type: discountType,
      apply_on: applyOn,
      apply_on_value: applyOnValue,
      start_date: moment(startDate).format("YYYY-MM-DD"),
      end_date: moment(endDate).format("YYYY-MM-DD"),
      is_active: active,
      max_discount_allowed: maxDiscountAllowed,
      conditions,
      terms_and_conditions: termsAndConditions,
      product: selectedProduct?.map((obj) => {
        const container = obj.value;
        return container;
      }),
    };

    try {
      await dispatch(createDiscount(addData)).unwrap();
      toastsuccess("Discount created successfully");
      navigate(
        `${process.env.PUBLIC_URL}/promotional_management/discount/list`
      );
    } catch (error) {
      console.error(error);
    }
  };

  // const postAndCreateNew = async () => {
  //   const addData = {
  //     branches: branches.map((obj) => {
  //       const container = obj.value;
  //       return container;
  //     }),
  //     discount_name: discountName,
  //     discount_value: discountValue,
  //     discount_type: discountType,
  //     apply_on: applyOn,
  //     apply_on_value: applyOnValue,
  //     start_date: moment(startDate).format("YYYY-MM-DD"),
  //     end_date: moment(endDate).format("YYYY-MM-DD"),
  //     is_active: active,
  //     max_discount_allowed: maxDiscountAllowed,
  //     conditions,
  //     terms_and_conditions: termsAndConditions,

  //   };
  //   try {
  //     await dispatch(createDiscount(addData)).unwrap();
  //     toastsuccess("Discount created successfully");
  //     SetBranches("");
  //     SetDiscountName("");
  //     SetDiscountValue("");
  //     SetDiscountType("");
  //     SetApplyOn("");
  //     SetApplyOnValue("");
  //     setActive(true);
  //     setMaxDiscountAllowed("");
  //     setConditions("");
  //     reset();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleChange = (value) => {
    setTermsAndConditions(value);
  };
  useEffect(() => {
    id !== undefined && dispatch(getDiscountById(id));
  }, [dispatch, id]);

  useEffect(() => {
    promotionManagementDiscountInfo !== null &&
      (SetBranches(promotionManagementDiscountInfo?.branches),
      SetDiscountName(promotionManagementDiscountInfo?.discount_name),
      SetDiscountValue(promotionManagementDiscountInfo?.discount_value),
      SetDiscountType(promotionManagementDiscountInfo?.discount_type),
      SetApplyOn(promotionManagementDiscountInfo?.apply_on),
      SetApplyOnValue(promotionManagementDiscountInfo?.apply_on_value),
      SetStartDate(
        moment(promotionManagementDiscountInfo?.start_date).toDate()
      ),
      SetEndDate(moment(promotionManagementDiscountInfo?.end_date).toDate()),
      setActive(promotionManagementDiscountInfo?.is_active),
      setMaxDiscountAllowed(
        promotionManagementDiscountInfo?.max_discount_allowed
      ),
      setConditions(promotionManagementDiscountInfo?.conditions),
      setTermsAndConditions(
        promotionManagementDiscountInfo?.terms_and_conditions
      ),
      setSelectedProduct(promotionManagementDiscountInfo?.product));

    reset();
  }, [promotionManagementDiscountInfo, reset]);

  const putData = async () => {
    const addData = {
      branches: branches.map((obj) => {
        const container = obj.value;
        return container;
      }),
      discount_name: discountName,
      discount_value: discountValue,
      discount_type: discountType,
      apply_on: applyOn,
      apply_on_value: applyOnValue,
      start_date: moment(startDate).format("YYYY-MM-DD"),
      end_date: moment(endDate).format("YYYY-MM-DD"),
      is_active: active,
      max_discount_allowed: maxDiscountAllowed,
      conditions,
      terms_and_conditions: termsAndConditions,
      product: selectedProduct?.map((obj) => {
        const container = obj.value;
        return container;
      }),
    };
    const reduxData = {
      id: id,
      putData: addData,
    };
    try {
      await dispatch(updateDiscountById(reduxData)).unwrap();
      toastsuccess("Discount Edited successfully");
      navigate(
        `${process.env.PUBLIC_URL}/promotional_management/discount/list`
      );
    } catch (error) {
      console.error(error);
    }
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      if (id !== undefined) {
        handleSubmit(putData)();
      } else {
        handleSubmit(postData)();
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/promotional_management/discount/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Discount"} />
      <Content>
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb></ModifiedBreadcrumb>
            </Col>
            <Col md={1}></Col>
            {add !== undefined && (
              <Col md={6} className="text-right flex">
                {/* <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postAndCreateNew(data, "saveAndNew")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton> */}

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postData(data, "saveAndClose")
                  )}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/promotional_management/discount/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={6} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(putData)}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/promotional_management/discount/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>

          <div className="custom-grid">
            <div className="">
              <Row lg={12} className={"form-control-sm"}>
                <Col md={6}>
                  <div className="custom-grid">
                    <Row md={12} className="form-group row g-4">
                      <Col lg={4}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="empType">
                            Branch
                            <IsRequired />
                          </label>
                        </div>
                      </Col>

                      <Col lg="8">
                        <div className="form-group">
                          <BranchDropdownMulti
                            id={"branches"}
                            optionLabel={"Choose Branch..."}
                            register={register}
                            value={branches}
                            SetValue={SetBranches}
                            // getDropdownButtonLabel={getDropdownButtonLabel}
                            // onChange={onChange}
                          />
                          {errors.branches && (
                            <span className="invalid">
                              This field is required
                            </span>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row md={12} className="form-group row g-4">
                      <Col lg={4}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="discountName">
                            Discount Name
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <TextInputField
                            register={register}
                            isRequired={true}
                            id={"discountName"}
                            placeholder="Discount Name"
                            value={discountName}
                            SetValue={SetDiscountName}
                          />
                          {errors?.discountName && (
                            <span className="text-danger">
                              <Icon className={"sm"} name="alert-circle" />
                              {"This field is required"}
                            </span>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row md={12} className="form-group row g-4">
                      <Col lg="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="discountType">
                            Discount Type
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <div className="form-control-select">
                              <select
                                className="form-control form-select"
                                id="discountType"
                                {...register("discountType", {
                                  required: true,
                                })}
                                value={discountType}
                                onChange={(e) => {
                                  SetDiscountType(parseInt(e.target.value));
                                }}
                                placeholder="Discount Type"
                              >
                                <option
                                  label="Select Discount Type"
                                  value=""
                                ></option>
                                {discountTypeOptions?.map((item, index) => (
                                  <option key={index} value={item?.value}>
                                    {item.label}
                                  </option>
                                ))}
                              </select>
                              {errors?.discountType && (
                                <span className="invalid">
                                  This field is required
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row md={12} className="form-group row g-4">
                      <Col lg={4}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="discountValue">
                            Discount Value
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <TextInputField
                            register={register}
                            isRequired={true}
                            id={"discountValue"}
                            placeholder="Discount Value"
                            value={discountValue}
                            SetValue={SetDiscountValue}
                          />
                          {errors?.discountValue && (
                            <span className="text-danger">
                              <Icon className={"sm"} name="alert-circle" />
                              {"This field is required"}
                            </span>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row md={12} className="form-group row g-4">
                      <Col lg="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="applyOn">
                            Apply On
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <ul className="custom-control-group g-3 align-center flex-wrap">
                            <li>
                              <div className="custom-control custom-control-sm custom-radio">
                                <input
                                  id="all"
                                  type="radio"
                                  name={"applyOn"}
                                  value={"1"}
                                  className="custom-control-input"
                                  checked={applyOn == "1"}
                                  onChange={(e) => {
                                    SetApplyOn(e.target.value);
                                  }}
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="all"
                                >
                                  All
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className="custom-control custom-control-sm  custom-radio">
                                <input
                                  id="product"
                                  type="radio"
                                  value={"2"}
                                  name={"applyOn"}
                                  className="custom-control-input "
                                  checked={applyOn == "2"}
                                  onChange={(e) => {
                                    SetApplyOn(e.target.value);
                                  }}
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="product"
                                >
                                  Product
                                </label>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </Col>
                    </Row>

                    {applyOn === "2" && (
                      <>
                        <Row md={12} className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="site-name">
                                Category
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <CategoryDropdown
                              register={register}
                              id="selectedCategory"
                              categories={categories}
                              selectedCategory={selectedCategory}
                              onCategoryChange={setSelectedCategory}
                              isRequired={false}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              // message={
                              //   errors.selectedCategory &&
                              //   "Category is Required"
                              // }
                            />
                          </Col>
                        </Row>

                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="site-name">
                                Product
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <ProductDropdownMulti
                              value={selectedProduct}
                              SetValue={setSelectedProduct}
                              selectedCategory={selectedCategory}
                            />
                          </Col>
                        </Row>
                      </>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="custom-grid">
                    <Row md={12} className="form-group row g-4">
                      <Col lg={4}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="applyOnValue">
                            Apply on Value
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <TextInputField
                            register={register}
                            isRequired={true}
                            id={"applyOnValue"}
                            placeholder="Apply on Value"
                            value={applyOnValue}
                            SetValue={SetApplyOnValue}
                          />
                          {errors?.applyOnValue && (
                            <span className="text-danger">
                              <Icon className={"sm"} name="alert-circle" />
                              {"This field is required"}
                            </span>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <Row md={12} className="form-group row g-4">
                      <Col lg={4}>
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="maxDiscountAllowed"
                          >
                            Max Discount Allowed
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <TextInputField
                            register={register}
                            isRequired={true}
                            id={"maxDiscountAllowed"}
                            placeholder="Max Discount Allowed"
                            value={maxDiscountAllowed}
                            SetValue={setMaxDiscountAllowed}
                          />
                          {errors?.maxDiscountAllowed && (
                            <span className="text-danger">
                              <Icon className={"sm"} name="alert-circle" />
                              {"This field is required"}
                            </span>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row md={12} className="form-group row g-4">
                      <Col lg={4}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="conditions">
                            Conditions
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <TextInputField
                            register={register}
                            isRequired={true}
                            id={"conditions"}
                            placeholder="Conditions"
                            value={conditions}
                            SetValue={setConditions}
                          />
                          {errors?.conditions && (
                            <span className="text-danger">
                              <Icon className={"sm"} name="alert-circle" />
                              {"This field is required"}
                            </span>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row md={12} className="form-group row g-4">
                      <Col lg={4}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="active">
                            Active
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <SwitchInputField
                          register={register}
                          id={"active"}
                          checked={active}
                          SetValue={setActive}
                          name={"active"}
                        />
                      </Col>
                    </Row>
                    <Row md={12} className="form-group row g-4">
                      <Col lg={4}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="startdate">
                            Start Date
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <DateInputField
                          id={"start_date"}
                          showYearDropdown={true}
                          showMonthDropdown={true}
                          selected={startDate}
                          SetValue={SetStartDate}
                          minDate={new Date()}
                        />
                      </Col>
                    </Row>
                    <Row md={12} className="form-group row g-4">
                      <Col lg={4}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="endDate">
                            End Date
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div style={{ "z-index": "999" }}>
                          <DateInputField
                            id={"end_date"}
                            showYearDropdown={true}
                            showMonthDropdown={true}
                            selected={endDate}
                            SetValue={SetEndDate}
                            minDate={new Date()}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Row md={12} className="form-group row g-4">
                  <Col lg="10">
                    <h6> Terms and Conditions</h6>
                    <ReactQuill
                      value={termsAndConditions}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
              </Row>
            </div>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default DiscountForm;
