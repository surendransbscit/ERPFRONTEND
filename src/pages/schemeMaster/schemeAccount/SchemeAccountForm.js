/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
  DateInputField,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, Row, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import moment from "moment/moment";
import {
  createSchemeAccount,
  getAllCustomerMultiScheme,
  getAllScheme,
  getSchemeAccountById,
  updateSchemeAccountById,
} from "../../../redux/thunks/scheme";
import { getAllCustomer, searchCustomer } from "../../../redux/thunks/customer";
import CustomerAutoComplete from "../../../components/common/autoComplete/CustomerAutoComplete";
import {
  BranchDropdown,
  CustomerMultiSchemeDropdown,
  SchemeDropdown,
} from "../../../components/filters/retailFilters";
import {
  useBranches,
  useSchemes,
} from "../../../components/filters/filterHooks";
import { getAccessBranches } from "../../../redux/thunks/coreComponent";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import ShortCutKeys from "../../../components/shortCutKeys/ShortCutKeys";
import { useHotkeys } from "react-hotkeys-hook";
import CreateCustomerConfirmation from "../../../components/modals/CreateCustomerConfirmation";
import { Typeahead } from "react-bootstrap-typeahead";

const SchemeAccountForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const customerId = location?.state?.customerId;
  const customerSearchValue = location?.state?.customerSearchValue;
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
  const {
    isLoading: issubmitting,
    isError,
    createSchemeAccountData,
  } = useSelector((state) => state.schemeAccountReducer);
  const { schemeAccountInfo } = useSelector(
    (state) => state.schemeAccountReducer
  );
  const { searchCustomerList } = useSelector((state) => state.customerReducer);
  const { customerMultiSchemeList } = useSelector(
    (state) => state.schemesReducer
  );
  const {
    userInfo: { settings, user },
    userInfo,
  } = useSelector((state) => state.authUserReducer);

  const [customer, SetCustomer] = useState();
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [scheme, SetScheme] = useState();
  const [branch, SetBranch] = useState();
  const [accountName, SetAccountName] = useState();
  const [startDate, SetStartDate] = useState(new Date());
  const { schemes } = useSchemes(true);
  const { branches } = useBranches();
  const [navigateModal, SetNavigateModal] = useState(false);
  const [inputType, setInputType] = useState();
  const [navigateModalOpened, setNavigateModalOpened] = useState(false);
  const [createMobNum, SetCreateMobNum] = useState();
  const [isSearching, setIsSearching] = useState(false);
  const toggleNavigateModal = () => SetNavigateModal(!navigateModal);

  const navigateCreateCustomer = () => {
    navigate(
      {
        pathname: `${process.env.PUBLIC_URL}/master/customer/add`,
      },
      {
        state: {
          add: true,
          createMobNum: createMobNum,
          navigateLink: `/schememaster/schemeaccount/add`,
        },
      }
    );
  };

  useEffect(() => {
    // dispatch(getAllScheme());
    dispatch(getAccessBranches());
    // dispatch(getAllCustomer());
  }, [dispatch]);

  useEffect(() => {
    if (customerSearchValue && customerId) {
      SetCustomer(customerId);
      SetCustomerSearch(customerSearchValue);
    }
  }, [customerId, customerSearchValue]);

  useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      inputType === "text" &&
      customerSearch[0]?.label?.length > 0 &&
      customer == null
    ) {
      const searchKey = inputType === "number" ? "mob_num" : "name";
      dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
    }
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      inputType === "number" &&
      customerSearch[0]?.label?.length >= 5 &&
      customer == null
    ) {
      const searchKey = inputType === "number" ? "mob_num" : "name";
      dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
    }
  }, [isSearching, customerSearch, customer, dispatch, inputType]);

  // useEffect(() => {
  //   if (
  //     isSearching &&
  //     customerSearch?.length > 0 &&
  //     customerSearch[0]?.label.length >= 9 &&
  //     customer == null &&
  //     searchCustomerList?.length == 0
  //   ) {
  //     SetCreateMobNum(customerSearch[0]?.label);
  //     SetNavigateModal(true);
  //   }
  // }, [isSearching, customerSearch, customer, searchCustomerList]);

  useEffect(() => {
    if (customerSearch?.length > 0) {
      const inputValue = customerSearch[0]?.label;

      // Detect input type when user starts typing
      if (!inputType) {
        setInputType(/^\d/.test(inputValue) ? "number" : "text");
      }

      if (
        inputType === "number" &&
        isSearching &&
        inputValue?.length >= 10 &&
        customer == null &&
        searchCustomerList?.length == 0 &&
        !navigateModalOpened
      ) {
        console.log("Opening Modal...");
        SetCreateMobNum(inputValue);
        SetNavigateModal(true);
        setNavigateModalOpened(true);
      }

      if (inputValue?.length < 10) {
        setNavigateModalOpened(false);
      }
    }
  }, [isSearching, customerSearch, customer, searchCustomerList, inputType]);

  useEffect(() => {
    // if (customerId && customerSearchValue && createSchemeAccountData?.data) {
    if (createSchemeAccountData?.data) {
      let passData = [];
      let val = createSchemeAccountData?.data?.account_name;
      passData?.push(val);

      navigate(
        {
          pathname: `${process.env.PUBLIC_URL}/payments/schemepayment/add`,
        },
        {
          state: {
            add: true,
            customerSearchValue: customerSearch,
            customerId: customer,
            branchId: branch,
            accountSearchValue: passData,
            accountId: createSchemeAccountData?.data?.id_scheme_account,
            // accountValue: customerAccountList,
          },
        }
      );
    }
  }, [customer, customerSearch, createSchemeAccountData, navigate, dispatch]);

  const postData = async () => {
    const addData = {
      id_customer: customer,
      acc_scheme_id: scheme,
      id_branch: branch,
      scheme_acc_number: null,
      account_name: accountName,
      start_date: moment(startDate).format("YYYY-MM-DD"),
    };
    try {
      await dispatch(createSchemeAccount(addData)).unwrap();
      toastsuccess("Scheme Account created successfully");
      // if (customerId && customerSearchValue) {
      //   navigate(
      //     {
      //       pathname: `${process.env.PUBLIC_URL}/payments/schemepayment/add`,
      //     },
      //     {
      //       state: { add: true },
      //     }
      //   );
      // } else {
      //   navigate(`${process.env.PUBLIC_URL}/schememaster/schemeaccount/list`);
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const addData = {
      id_customer: customer,
      acc_scheme_id: scheme,
      id_branch: branch,
      scheme_acc_number: null,
      account_name: accountName,
      start_date: moment(startDate).format("YYYY-MM-DD"),
    };

    try {
      await dispatch(createSchemeAccount(addData)).unwrap();
      toastsuccess("Scheme Account created successfully");
      SetCustomer();
      SetScheme();
      SetBranch();
      SetAccountName();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getSchemeAccountById(id));
  }, [dispatch, id]);

  useEffect(() => {
    schemeAccountInfo != undefined &&
      (SetScheme(schemeAccountInfo?.acc_scheme_id),
      SetCustomerSearch(schemeAccountInfo?.id_customer?.for_search),
      SetCustomer(schemeAccountInfo?.id_customer?.id_customer),
      SetBranch(schemeAccountInfo?.id_branch),
      SetAccountName(schemeAccountInfo?.account_name),
      SetStartDate(moment(schemeAccountInfo?.start_date).toDate()));
    reset();
  }, [schemeAccountInfo, reset]);

  const putData = async () => {
    const addData = {
      id_customer: customer,
      acc_scheme_id: scheme,
      id_branch: branch,
      account_name: accountName,
      start_date: moment(startDate).format("YYYY-MM-DD"),
    };
    const reduxData = {
      id: id,
      putData: addData,
    };
    try {
      await dispatch(updateSchemeAccountById(reduxData)).unwrap();
      toastsuccess("Scheme Account Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/schememaster/schemeaccount/list`);
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

  // Reload Shortcut (Ctrl+R)
  useHotkeys("ctrl+r", (event) => {
    event.preventDefault();
    reset();
  });

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/schememaster/schemeaccount/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Scheme Account"} />
      <Content>
        <CreateCustomerConfirmation
          modal={navigateModal}
          toggle={toggleNavigateModal}
          title={"Create Customer"}
          mobNum={createMobNum}
          clickAction={navigateCreateCustomer}
        />
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
            {add !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postAndCreateNew(data, "saveAndNew")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton>

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
                      `${process.env.PUBLIC_URL}/schememaster/schemeaccount/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={5} className="text-right flex">
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
                      `${process.env.PUBLIC_URL}/schememaster/schemeaccount/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>

          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="customer">
                    Customer
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-control-wrap">
                  <Typeahead
                    id="customerSearch"
                    labelKey="label"
                    onChange={(e) => {
                      if (e?.length > 0) {
                        SetCustomer(e[0]?.value);
                        dispatch(
                          getAllCustomerMultiScheme({
                            customer_id: e[0]?.value,
                          })
                        );
                        SetCustomerSearch(e);
                      } else {
                        SetCustomer(null);
                        SetCustomerSearch([]);
                        setInputType(null); // Reset input type when cleared
                      }
                    }}
                    options={searchCustomerList}
                    placeholder="Choose a customer..."
                    selected={customerSearch}
                    onInputChange={(text) => {
                      if (text?.length === 0) {
                        SetCustomerSearch([]);
                        setInputType(null);
                        return;
                      }

                      const firstChar = text.charAt(0);
                      if (!inputType) {
                        setInputType(/\d/.test(firstChar) ? "number" : "text");
                      }

                      if (inputType === "number" && /^\d*$/.test(text)) {
                        setIsSearching(text?.length >= 5);
                        SetCustomerSearch([{ label: text }]);
                      }
                      if (inputType === "text" && /^[a-zA-Z\s]*$/.test(text)) {
                        setIsSearching(text?.length > 0);
                        SetCustomerSearch([{ label: text }]);
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
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="scheme">
                    Scheme
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <CustomerMultiSchemeDropdown
                    register={register}
                    id={"scheme"}
                    schemes={customerMultiSchemeList?.data}
                    selectedScheme={scheme}
                    onSchemeChange={SetScheme}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.scheme && "Scheme is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="scheme">
                    Branch
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <BranchDropdown
                    register={register}
                    id={"branch"}
                    branches={branches}
                    selectedBranch={branch}
                    onBranchChange={SetBranch}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.branch && "Scheme is Required"}
                  ></BranchDropdown>
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="accountName">
                    Acc.Name
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"accountName"}
                    placeholder="Account Name"
                    value={accountName}
                    SetValue={SetAccountName}
                    setValue={setValue}
                  />
                  {errors?.accountName && (
                    <span className="text-danger">
                      <Icon className={"sm"} name="alert-circle" />
                      {"This field is required"}
                    </span>
                  )}
                </div>
              </Col>
            </Row>
            {settings?.can_edit_account_join_date == true && (
              <Row md={12} className="form-group row g-4">
                <Col lg="1">
                  <div className="form-group">
                    <label className="form-label" htmlFor="startdate">
                      Start Date
                    </label>
                  </div>
                </Col>
                <Col lg="3">
                  <DateInputField
                    id={"start_date"}
                    selected={startDate}
                    SetValue={SetStartDate}
                  />
                </Col>
              </Row>
            )}
          </div>
        </PreviewCard>
        {/* <ShortCutKeys Save={true} Reload={true} /> */}
      </Content>
    </React.Fragment>
  );
};

export default SchemeAccountForm;
