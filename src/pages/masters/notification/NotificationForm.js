import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createNotification,
  getNotificationById,
  updateNotificationById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Icon,
  NumberInputField,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import ReactQuill from "react-quill";
import { Button, Input } from "reactstrap";
import { ZoomImage } from "../../../components/form-control/ZoomImage";
import {
  getActiveCustomers,
  getAllApprovalCustomer,
  getAllCustomer,
  searchCustomer,
} from "../../../redux/thunks/customer";

const NotificationForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
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
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.notificationReducer
  );
  const { notificationInfo } = useSelector(
    (state) => state.notificationReducer
  );

  const { customerActiveList } = useSelector((state) => state.customerReducer);

  const [tittle, setTittle] = useState();
  const [image, setImage] = useState(null);
  const [content, setContent] = useState();
  const [isActive, setActive] = useState(true);
  const [sendTo, setSendTo] = useState(1);
  const [customerList, setCustomerList] = useState([]);

  const [searchText, setSearchText] = useState("");

  const filteredCustomers = customerList?.filter(
    (customer) =>
      customer.firstname?.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.mobile?.includes(searchText)
  );

  // const [selectedCustomers, setSelectedCustomers] = useState([]);

  // const handleCustomerSelection = (id) => {
  //   setSelectedCustomers((prev) =>
  //     prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
  //   );
  // };

  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const selectedCustomers = customerList?.filter(
      (item) => item?.isChecked === true
    );
    const adddata = {
      title: tittle,
      image: image,
      content: content,
      active: isActive,
      send_to: sendTo,
      send_to_customers:
        sendTo === 2
          ? selectedCustomers?.map((obj) => {
              const container = obj.id_customer;
              return container;
            })
          : [],
    };
    try {
      await dispatch(createNotification(adddata)).unwrap();
      toastsuccess("Notification Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/notification/list`);
    } catch (error) {
      console.error(error);
    }
  };

  // const postAndCreateNew = async () => {
  //   const selectedCustomers = customerList?.filter(
  //     (item) => item?.isChecked === true
  //   );
  //   const adddata = {
  //     title: tittle,
  //     image: image,
  //     content: content,
  //     is_active: isActive,
  //     send_to: sendTo,
  //     send_to_customers: sendTo === 2 ? selectedCustomers?.map((obj) => {
  //       const container = obj.id_customer;
  //       return container;
  //     }) : [],
  //   };
  //   try {
  //     await dispatch(createNotification(adddata)).unwrap();
  //     toastsuccess("Notification Added successfully");
  //     setTittle("");
  //     setImage(null);
  //     setActive(true);
  //     setContent();
  //     setSendTo(1);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const selectAllCustomers = (value) => {
    customerList.map((item, rowIndex) => {
      handleCustomerSelectionChange(rowIndex, "isChecked", value);
    });
  };

  const handleCustomerSelectionChange = (index, field, value) => {
    setCustomerList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

  const handleChange = (value) => {
    setContent(value);
  };

  const convert64 = async (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e);
    reader.onload = () => {
      setImage(reader?.result);
    };
  };

  const isBase64 = (str) => {
    try {
      return str.startsWith("data:image");
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    dispatch(getActiveCustomers());
  }, [dispatch]);

  console.log(customerActiveList);

  useEffect(() => {
    if (customerActiveList?.length > 0) {
      setCustomerList(customerActiveList);
    }
  }, [customerActiveList]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        // if (id !== undefined) {
        //   handleSubmit(putData)();
        // } else {
        handleSubmit(postData)();
        // }
      }, 0);
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  return (
    <React.Fragment>
      <Head title={title ? title : "Notification"} />
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
            <Col md={2}></Col>

            <Col md={5} className="text-right flex">
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
                onClick={handleSubmit((data) => postData(data, "saveAndClose"))}
              >
                {issubmitting ? "Saving" : "Save[Ctrl+s]"}
              </SaveButton>

              <CancelButton
                disabled={issubmitting}
                color="danger"
                size="md"
                onClick={() => navigate(`${process.env.PUBLIC_URL}/`)}
              >
                Cancel
              </CancelButton>
            </Col>
          </Row>

          <div className="">
            <Row lg={12} className={"form-control-sm"}>
              <Col md={6}>
                <div className="custom-grid">
                  <Row md={12} className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="tittle">
                          Title <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"tittle"}
                          placeholder="Title"
                          value={tittle}
                          SetValue={(value) => {
                            setTittle(transformWord(value));
                            clearErrors("tittle");
                          }}
                          message={errors.tittle && "Title is required"}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="tittle">
                          Content
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <ReactQuill value={content} onChange={handleChange} />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="tittle">
                          Image <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-control-wrap">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">Upload</span>
                          </div>
                          <div className="form-file">
                            <Input
                              type="file"
                              accept="image/*"
                              id="image"
                              onChange={(e) => convert64(e.target.files[0])}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="deviceType">
                          Send to
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="customers"
                                type="radio"
                                name={"sendTo"}
                                value={"1"}
                                className="custom-control-input"
                                checked={sendTo == 1}
                                onChange={(e) => {
                                  setSendTo(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="customers"
                              >
                                All Customer
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="Particular"
                                type="radio"
                                value={"2"}
                                name={"sendTo"}
                                className="custom-control-input "
                                checked={sendTo == 2}
                                onChange={(e) => {
                                  setSendTo(2);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="Particular"
                              >
                                Particular
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="isActive">
                          Active
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <SwitchInputField
                        register={register}
                        id={"isActive"}
                        checked={isActive}
                        SetValue={setActive}
                        name={"isActive"}
                      />
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col lg="2"></Col>
                    {image == undefined ||
                      (image !== null && (
                        <>
                          <Col lg="5">
                            <ZoomImage
                              alt="not found"
                              height={"300px"}
                              width={"600px"}
                              src={
                                isBase64(image) ? image : image + "?" + String()
                              }
                            />
                            <br />
                            <Button
                              className="mt-1 bg-red-500 text-white"
                              size="xs"
                              onClick={() => setImage(undefined)}
                            >
                              Remove
                            </Button>
                          </Col>
                        </>
                      ))}
                  </Row>
                </div>
              </Col>
              {sendTo === 2 && (
                <Col md={6}>
                  <div className="custom-grid">
                    <Row className="mt-4">
                      <Col md={12}>
                        <h6 className="mb-3">Customer List</h6>
                        <Row className="mb-2">
                          <Col md={12}>
                            <Input
                              type="text"
                              placeholder="Search by name or mobile..."
                              value={searchText}
                              onChange={(e) => setSearchText(e.target.value)}
                            />
                          </Col>
                        </Row>
                        <div className="table-responsive">
                          <div
                            style={{ maxHeight: "310px", overflowY: "auto" }}
                          >
                            <table className="table table-bordered">
                              <thead
                                className="thead-light"
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  background: "#808080",
                                  zIndex: 1,
                                }}
                              >
                                <tr>
                                  <th>S.No</th>
                                  <th>Name</th>
                                  <th>Mobile</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredCustomers?.length > 0 ? (
                                  filteredCustomers?.map((customer, index) => (
                                    <tr key={customer.id}>
                                      <td>
                                        {index + 1}{" "}
                                        <input
                                          type="checkbox"
                                          onChange={(event) => {
                                            handleCustomerSelectionChange(
                                              index,
                                              "isChecked",
                                              event.target.checked
                                            );
                                          }}
                                          checked={customer.isChecked}
                                        />
                                      </td>
                                      <td>{customer.firstname}</td>
                                      <td>{customer.mobile}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="3" className="text-center">
                                      No customers found
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default NotificationForm;
