import React, { useEffect, useRef, useState } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Icon, PreviewCard, SaveButton } from "../../../components/Component";
import { Button, Col, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import {
  useBranches,
  useEmployeeDropdown,
  useSchemes,
  useOtherInventoryItem
} from "../../../components/filters/filterHooks";
import {
  ActiveEmployeeDropdown,
  BranchDropdown,
  IssueToDropdown,
  SchemeDropdown,
  OtherInventoryItemDropdown
} from "../../../components/filters/retailFilters";
import { Typeahead } from "react-bootstrap-typeahead";

import { searchCustomer } from "../../../redux/thunks/customer";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import IsRequired from "../../../components/erp-required/erp-required";
import { getAllScheme, getCustomerAccount } from "../../../redux/thunks/scheme";
import { createOtherInventoryItemIssue } from "../../../redux/thunks/otherInventory";
import {
  NumberInputField
} from "../../../components/Component";

const OtherInventoryItemIssueForm = () => {
  const location = useLocation();
  const add = location?.state?.add;
  const id = location?.state?.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const title = location?.state?.title;
  const { customerId } = location?.state || {};
  const { customerAccountList, isError: cusAccountError } = useSelector((state) => state.schemeAccountReducer);
  const customerSearchValue = location?.state?.customerSearchValue;
  const accountSearchValue = location?.state?.accountSearchValue;
  const { isLoading: issubmitting, isError } = useSelector((state) => state.otherInventoryItemIssueReducer);
  const isSubmitting = useSelector((state) => state?.customerReducer?.isLoading);
  const searchCustomerList = useSelector((state) => state?.customerReducer?.searchCustomerList);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const { branches } = useBranches();
  const { employees } = useEmployeeDropdown();
  const { schemes } = useSchemes();
  const [inputType, setInputType] = useState();
  const [srchSchemeAccNumber, setSrchSchemeAccNumber] = useState("");
  const [schemeAccNumber, setSchemeAccNumber] = useState("Scheme A/c No");

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [idBranch, setIdBranch] = useState(location?.state?.id_branch || "");
  const [remarks, setRemarks] = useState("");
  const [type, setType] = useState(1);
  const [employee, setEmployee] = useState(null);
  const [issueTo, setIssueTo] = useState(1);
  const [scheme, SetScheme] = useState();

  const [customer, setCustomer] = useState(location?.state?.customer || null);
  const [customerSearch, setCustomerSearch] = useState(
    location?.state?.customerSearch || null
  );

  const [isSearching, setIsSearching] = useState(false);

  const { otherInventoryItems } = useOtherInventoryItem();
  const [item, setItem] = useState();
  const [pieces, setPieces] = useState();
  const [IndiSchemeAccDetails, setIndiSchemeAccDetails] = useState();


  useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      customerSearch[0]?.label?.length >= 5 &&
      customer == null
    ) {
      dispatch(searchCustomer({ mob_num: customerSearch[0]?.label }));
    }
  }, [isSearching, customerSearch, customer, dispatch]);

  useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      customerSearch[0]?.label.length >= 5 &&
      customer == null
    ) {
      const searchKey = inputType === "number" ? "mob_num" : "name";
      dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
    }
  }, [isSearching, customerSearch, customer, dispatch, inputType]);

  useEffect(() => {
    if (customerSearchValue && customerId && accountSearchValue) {
      setCustomerSearch(customerSearchValue);
      setCustomer(customerId);
      setSrchSchemeAccNumber(accountSearchValue);
      dispatch(
        getCustomerAccount({
          customer: customerId,
        })
      );
    }
  }, [customerSearchValue, accountSearchValue, customerId, dispatch]);


  useEffect(() => {
    srchSchemeAccNumber == "" && customer == "" && customer == null && setSchemeAccNumber("");
  }, [srchSchemeAccNumber, customer, setSchemeAccNumber]);

  useEffect(() => {
    customer != "" && customer != null && setSchemeAccNumber(null);
  }, [customer]);


  const postData = async () => {
    const adddata = {
      branch: idBranch,
      issue_to: issueTo,
      issue_to_cus: customer,
      issue_to_emp: employee,
      issued_for: type,
      scheme_account: schemeAccNumber,
      item: item,
      pieces: pieces,
      remarks,
    };
    try {
      await dispatch(createOtherInventoryItemIssue(adddata)).unwrap();
      toastsuccess("Item Issue Added successfully");
      navigate(`${process.env.PUBLIC_URL}/other_inventory/item_issue/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getAllScheme());
  }, [dispatch]);

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/other_inventory/item_issue/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Other Inventory - Item Issue"} />
      <Content>
        <PreviewCard className="h-full">
          <Row lg={12}>
            <Col md={8}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={4} className="text-right flex">
              <SaveButton
                disabled={issubmitting}
                size="md"
                color="primary"
                onClick={handleSubmit((data) =>
                  postData(data, "saveAndClose")
                )}
              >
                {issubmitting ? "Saving" : "Save"}
              </SaveButton>{" "}
              <Button
                disabled={isSubmitting}
                color="danger"
                size="md"
                onClick={() =>
                  navigate(
                    `${process.env.PUBLIC_URL}/other_inventory/item_issue/list`
                  )
                }
              >
                Cancel
              </Button>
            </Col>
          </Row>

          <Row className="gy-3 form-control-sm" style={{ marginTop: "6px" }}>

            <div className="custom-grid">
              <Row className="form-group row g-4">
                <Col md="1">
                  <div className="form-group">
                    <label className="form-label" htmlFor="issueTo">
                      Branch
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="4">
                  <div className="form-group">
                    <BranchDropdown
                      register={register}
                      id={"idBranch"}
                      branches={branches}
                      selectedBranch={idBranch}
                      onBranchChange={setIdBranch}
                      isRequired={true}
                      clearErrors={clearErrors}
                      setValue={setValue}
                      message={errors.idBranch && "Branch is Required"}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col md="1">
                  <div className="form-group">
                    <label className="form-label" htmlFor="issueTo">
                      Issue To
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="4">
                  <div className="form-group">
                    <IssueToDropdown
                      register={register}
                      id={"issueTo"}
                      selectedType={issueTo}
                      onTypeChange={setIssueTo}
                      isRequired={true}
                      clearErrors={clearErrors}
                      setValue={setValue}
                      message={errors.issueTo && "Issue type is Required"}
                    />
                  </div>
                </Col>
              </Row>

              {issueTo != 3 &&
                <Row className="form-group row g-4">
                  <Col md="1">
                    <div className="form-group">
                      <label className="form-label" htmlFor="form_type">
                        Issue For
                        <IsRequired />
                      </label>
                    </div>
                  </Col>
                  <Col lg="4">
                    <div className="form-group">
                      <ul className="custom-control-group g-3 align-center flex-wrap">
                        <li>
                          <div className="custom-control custom-control-sm custom-radio">
                            <input
                              type="radio"
                              id="issue_type"
                              value={1}
                              className="custom-control-input"
                              checked={type == 1}
                              onChange={(e) => {
                                setType(e.target.value);
                              }}
                            />
                            <label
                              htmlFor="issue_type"
                              className="custom-control-label"
                            >
                              {" "}
                              Against Bill
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-radio">
                            <input
                              type="radio"
                              id="receipt_type"
                              value={2}
                              className="custom-control-input"
                              checked={type == 2}
                              onChange={(e) => {
                                setType(e.target.value);
                              }}
                            />
                            <label
                              htmlFor="receipt_type"
                              className="custom-control-label"
                            >
                              Against Chit
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              }

              {issueTo === 1 && (
                <Row className="form-group row g-4">
                  <Col md="1">
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="customerSearch"
                      >
                        Customer
                        <IsRequired />
                      </label>
                    </div>
                  </Col>
                  <Col lg="4">
                    <Typeahead
                      id="customerSearch"
                      labelKey="label"
                      onChange={(e) => {
                        if (e?.length > 0) {
                          setCustomer(e[0]?.value),
                            e[0]?.value &&
                            dispatch(
                              getCustomerAccount({
                                customer: e[0]?.value,
                              })
                            );
                          setCustomerSearch(e);
                        } else {
                          setCustomer(null);
                          setCustomerSearch([]);
                        }
                      }}
                      options={searchCustomerList}
                      placeholder="Choose a customer..."
                      // defaultSelected={customerSearch}
                      selected={customerSearch}
                      onInputChange={(text) => {
                        if (text.length === 0) {
                          setCustomerSearch([]);
                          setInputType(null);
                          return;
                        }

                        const firstChar = text.charAt(0);
                        if (!inputType) {
                          setInputType(/\d/.test(firstChar) ? "number" : "text");
                        }

                        if (
                          (inputType === "number" && /^\d*$/.test(text)) ||
                          (inputType === "text" && /^[a-zA-Z\s]*$/.test(text))
                        ) {
                          setIsSearching(text.length >= 5);
                          setCustomerSearch([{ label: text }]);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (inputType === "number" && !/\d/.test(e.key)) {
                          if (
                            ![
                              "Backspace",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                            ].includes(e.key)
                          ) {
                            e.preventDefault(); // Prevent letters but allow backspace, delete, and arrows
                          }
                        }
                        if (inputType === "text" && /\d/.test(e.key)) {
                          e.preventDefault(); // Prevent typing numbers if inputType is text
                        }
                      }}
                    />
                  </Col>
                </Row>
              )}
              {issueTo === 2 && (
                <Row className="form-group row g-4">
                  <Col md="1">
                    <div className="form-group ">
                      <label className="form-label" htmlFor="employee">
                        Employee
                        <IsRequired />
                      </label>
                    </div>
                  </Col>
                  <Col lg="4">
                    <div className="form-group">
                      <ActiveEmployeeDropdown
                        register={register}
                        id={"employee"}
                        selectedEmployee={employee}
                        onEmployeeChange={setEmployee}
                        isRequired={true}
                        options={employees}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.employee && "Employee is Required"}
                      />
                    </div>
                  </Col>
                </Row>
              )}


              {type == 2 &&
                <>
                  {schemeAccNumber == "" && customer == "" && customer == null ? (
                    <Row className="form-group row g-4">
                      <Col lg="1">
                        <div className="form-group">
                          <label className="form-label" htmlFor="customerSearch">
                            Scheme A/C No
                          </label>
                        </div>
                      </Col>
                      <Col lg="4">
                        <div className="form-control-wrap">
                          <input className="form-control form-control-sm" type="text" placeholder="Name" disabled />
                        </div>
                      </Col>
                    </Row>
                  ) : cusAccountError == false && customer != "" && customer != null ? (
                    <Row className="form-group row g-4">
                      <Col lg="1">
                        <div className="form-group">
                          <label className="form-label" htmlFor="srchSchemeAccNumber">
                            Scheme A/C No
                          </label>
                        </div>
                      </Col>
                      <Col lg="4">
                        <div className="form-group">
                          <Typeahead
                            id="srchSchemeAccNumber"
                            labelKey="for_search"
                            onChange={(e) => {
                              setSchemeAccNumber(e[0]?.id_scheme_account),
                                setSrchSchemeAccNumber(e),
                                setIndiSchemeAccDetails(e[0]);
                            }}
                            options={customerAccountList?.data}
                            placeholder="Choose a Scheme Account..."
                            // defaultSelected={customerSearch}
                            selected={srchSchemeAccNumber}
                          />
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <Row className="form-group row g-4">
                      <Col lg="1">
                        <div className="form-group">
                          <label className="form-label" htmlFor="customerSearch">
                            Scheme A/C no
                          </label>
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="form-control-wrap">
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            placeholder="scheme_acc_number"
                            disabled
                            value={schemeAccNumber}
                          />
                        </div>
                      </Col>
                    </Row>
                  )}
                </>
              }

              <Row md={12} className="form-group row g-4">
                <Col lg="1">
                  <div className="form-group">
                    <label className="form-label">
                      Item <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="4">
                  <div className="form-group">
                    <OtherInventoryItemDropdown
                      register={register}
                      id="item"
                      name="item"
                      otherInventoryItems={otherInventoryItems}
                      selectedOtherInventoryItem={item}
                      onOtherInventoryItemChange={setItem}
                      isRequired={true}
                      clearErrors={clearErrors}
                      setValue={setValue}
                      message={errors?.item && "Item is Required"}
                    />
                  </div>

                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col md="1">
                  <div className="form-group">
                    <label className="form-label">
                      Pieces <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="4">
                  <div className="form-group">
                    <NumberInputField
                      register={register}
                      placeholder={"Pieces"}
                      id={"pieces"}
                      value={pieces}
                      minValue={0}
                      type={"number"}
                      isRequired={true}
                      SetValue={(value) => {
                        setPieces(value);
                        clearErrors('pieces');
                      }}
                      reqValueError={"Pcs is Required"}
                      handleKeyDownEvents={true}
                      handleDot={true}
                    />
                    {errors?.pieces && (<span className="text-danger">{errors?.pieces.message}</span>)}

                  </div>
                </Col>
              </Row>

              <Row className="form-group row g-4">
                <Col md="1">
                  <div className="form-group">
                    <label className="form-label">
                      Remarks <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="4">
                  <div className="form-group">
                    <textarea
                      {...register("remarks", {
                        required: "Remarks is required",
                      })}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows="2"
                      className="form-control"
                    />
                    {errors?.remarks && (
                      <span className="invalid">
                        <Icon className={"sm"} name="alert-circle" />
                        {errors.remarks.message}
                      </span>
                    )}
                  </div>
                </Col>
              </Row>
            </div>

          </Row>
        </PreviewCard>
      </Content >
    </React.Fragment >
  );
};

export default OtherInventoryItemIssueForm;
