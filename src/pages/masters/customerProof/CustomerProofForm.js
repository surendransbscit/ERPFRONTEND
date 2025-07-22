/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import { BlockTitle, CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { createCustomerProof, getCustomerProofById, updateCustomerProofById } from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, Row, SwitchInputField, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { Button, Input, Label } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { ZoomImage } from "../../../components/form-control/ZoomImage";
import { searchCustomer } from "../../../redux/thunks/customer";
import { useHotkeys } from "react-hotkeys-hook";

const CustomerProofForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const customerId = location?.state?.customerId;
  const customerSearchValue = location?.state?.customerSearchValue;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError, createCusProof } = useSelector((state) => state.customerProofReducer);
  const { customerProofInfo } = useSelector((state) => state.customerProofReducer);
  const { searchCustomerList } = useSelector((state) => state.customerReducer);

  const [isSearching, setIsSearching] = useState(false);
  const [customer, SetCustomer] = useState();
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [aadhar_number, setAadharNumber] = useState("");
  const [aadhar_img_page, setAadharImgPage] = useState();
  const [application_img_path, setApplicationImgPath] = useState();
  const [remarks, setRemarks] = useState();
  const [inputType, setInputType] = useState();


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
        customerSearch[0]?.label.length >= 5 &&
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
    if (createCusProof?.data) {
      let passData = [];
      let val = createCusProof?.data?.account_name;
      passData?.push(val);
      navigate(
        {
          pathname: `${process.env.PUBLIC_URL}/master/customerproof/add`,
        },
        {
          state: {
            add: true,
            customerSearchValue: customerSearch,
            customerId: customer,
            accountSearchValue: passData,
            accountId: createCusProof?.data?.id_scheme_account,
          },
        }
      );
    }
  }, [customer, customerSearch, createCusProof, navigate, dispatch]);


  const convert64 = async (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e);
    reader.onload = () => {
      setAadharImgPage(reader?.result);
    };
  };

  const isBase64 = (str) => {
    try {
      return str.startsWith("data:image");
    } catch (err) {
      return false;
    }
  };


  const convert641 = async (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e);
    reader.onload = () => {
      setApplicationImgPath(reader?.result);
    };
  };

  const isBase641 = (str) => {
    try {
      return str.startsWith("data:image");
    } catch (err) {
      return false;
    }
  };



  const postData = async () => {
    const adddata = {
      id_customer: customer,
      aadhar_number,
      aadhar_img_page,
      application_img_path,
      remarks,
    };
    try {
      await dispatch(createCustomerProof(adddata)).unwrap();
      toastsuccess("Customer Proof Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/customerproof/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      id_customer: customer,
      aadhar_number,
      aadhar_img_page,
      application_img_path,
      remarks,
    };
    await dispatch(createCustomerProof(adddata));
    if (isError === false) {
      toastsuccess("Customer Proof Added successfully");
      SetCustomer("");
      setAadharNumber("");
      setAadharImgPage("");
      setApplicationImgPath("");
      setRemarks("");
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getCustomerProofById(id));
  }, [dispatch, id]);

  useEffect(() => {
    customerProofInfo != undefined &&
      (
        SetCustomer(customerProofInfo?.id_customer),
        setAadharNumber(customerProofInfo?.aadhar_number),
        setAadharImgPage(customerProofInfo?.aadhar_img_page),
        setApplicationImgPath(customerProofInfo?.application_img_path),
        setRemarks(customerProofInfo?.remarks),
        reset());
  }, [customerProofInfo, reset]);

  const putData = async () => {
    const adddata = {
      id_customer: customer,
      aadhar_number,
      aadhar_img_page,
      application_img_path,
      remarks,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    await dispatch(updateCustomerProofById(reduxData));
    if (isError === false) {
      toastsuccess("customer proof Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/customerproof/list`);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/customerproof/list`);
    }
  }, [add, id, navigate]);

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    if (id !== undefined) {
      handleSubmit(putData)();
    } else {
      handleSubmit(postData)();
    }
  },{
    enableOnFormTags: true, // Enable hotkeys inside input fields
    preventDefault: true, // Prevent default browser Save
  });

  return (
    <React.Fragment>
      <Head title={title ? title : "Customer Proof"} />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
            <Col md={5}>
              <ModifiedBreadcrumb/>
            </Col>
            <Col md={2}></Col>
            {add !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) => postAndCreateNew(data, "saveAndNew"))}
                >
                  {issubmitting ? "Saving" : "Save & New "}
                </SaveButton>

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) => postData(data, "saveAndClose"))}
                >
                  {issubmitting ? "Saving" : "Save & Close"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/master/customerproof/list`)}
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton disabled={issubmitting} size="md" color="primary" onClick={handleSubmit(putData)}>
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/master/customerproof/list`)}
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col md="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="customer">
                    Customer
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col md="3">
                <div className="form-control-wrap">
                  <Typeahead
                    id="customerSearch"
                    labelKey="label"
                    onChange={(e) => {
                      if (e?.length > 0) {
                        SetCustomer(e[0]?.value), SetCustomerSearch(e);
                      } else {
                        SetCustomer(null);
                        SetCustomerSearch([]);
                      }
                    }}
                    options={searchCustomerList}
                    placeholder="Choose a customer..."
                    // defaultSelected={customerSearch}
                    selected={customerSearch}
                    onInputChange={(text) => {
                      if (text.length === 0) {
                        SetCustomerSearch([]);
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
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Aadhar Number <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"aadhar_number"}
                    placeholder="Aadhar Number"
                    value={aadhar_number}
                    SetValue={(value) => {
                      setAadharNumber(value);
                      clearErrors("aadhar_number");
                    }}
                    message={errors.aadhar_number && " Aadhar number is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row className="form-group row g-4">
              <Col md="2">
                <Label>Aadhar Image <IsRequired /></Label>
              </Col>
              <Col lg="3">
                <div className="form-control-wrap">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">Aadhar Image</span>
                    </div>
                    <div className="form-file">
                      <Input
                        type="file"
                        accept="image/*"
                        id="aadhar_img_page"
                        onChange={(e) => convert64(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>


            <Row className="form-group row g-4">
              <Col md="2">
                <Label>Application Image <IsRequired /></Label>
              </Col>
              <Col lg="3">
                <div className="form-control-wrap">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">Application Image</span>
                    </div>
                    <div className="form-file">
                      <Input
                        type="file"
                        accept="image/*"
                        id="aadhar_img_page"
                        onChange={(e) => convert641(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className=" form-group g-3 align-center">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label">Remarks :</label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-control-wrap">
                  <textarea
                    className="form-control form-control-sm"
                    type="text"
                    placeholder="Remarks"
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>
              </Col>
            </Row>

            {aadhar_img_page == undefined ||
              (aadhar_img_page !== null && (
                <>
                  <Col lg="4">
                    <ZoomImage
                      alt="not found"
                      height={"300px"}
                      width={"600px"}
                      src={isBase64(aadhar_img_page) ? aadhar_img_page : aadhar_img_page + "?" + String()}
                    />
                    <br />
                    <Button
                      className="mt-1 bg-red-500 text-white"
                      size="xs"
                      onClick={() => setAadharImgPage(undefined)}
                    >
                      Remove
                    </Button>
                  </Col>
                </>
              ))}


            {application_img_path == undefined ||
              (application_img_path !== null && (
                <>
                  <Col lg="4">
                    <ZoomImage
                      alt="not found"
                      height={"300px"}
                      width={"600px"}
                      src={isBase641(application_img_path) ? application_img_path : application_img_path + "?" + String()}
                    />
                    <br />
                    <Button
                      className="mt-1 bg-red-500 text-white"
                      size="xs"
                      onClick={() => setApplicationImgPath(undefined)}
                    >
                      Remove
                    </Button>
                  </Col>
                </>
              ))}


          </div>

        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default CustomerProofForm;
