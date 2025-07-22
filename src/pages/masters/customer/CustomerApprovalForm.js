import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import PreviewImagesModal from "../../../components/modals/PreviewImagesModal";
import {
  Col,
  PreviewCard,
  Row,
  SaveButton,
  UserAvatar,
} from "../../../components/Component";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  createApprovalCustomer,
  getAllApprovalCustomer,
} from "../../../redux/thunks/customer";
import { Badge } from "reactstrap";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";
import OrderAssignModel from "../../../components/modals/OrderAssignModel";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import { useHotkeys } from "react-hotkeys-hook";

const CustomerApprovalForm = () => {
  const { register, handleSubmit, setValue } = useForm();
  const dispatch = useDispatch();
  const { isLoading: issubmitting, approvalCustomerList } = useSelector(
    (state) => state.customerReducer
  );

  const [selectAll, setSelectAll] = useState(false);
  const [imageModal, SetImageModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const toggle = () => setOpenModal(!openModal);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const rejectToggle = () => setOpenRejectModal(!openRejectModal);
  const [previewImages, SetPreviewImages] = useState([]);
  const imageModalClose = () => {
    SetImageModal(!imageModal);
    SetPreviewImages([]);
  };

  const [approveCustomerList, setApproveCustomerList] = useState([]);

  const handelChange = (index, field, value) => {
    setApproveCustomerList((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[index] = { ...updatedValues[index], [field]: value };
      return updatedValues;
    });

    setValue(`${field}${index}`, value);
  };

  const selectAllCol = (value) => {
    approveCustomerList?.map((item, rowIndex) => {
      handelChange(rowIndex, "isChecked", value);
    });
  };

  const handleImagePreview = (data) => {
    if (data?.length > 0) {
      SetPreviewImages(data);
      SetImageModal(true);
    }
  };

  const saveFunction = async (type) => {
    const checkedData = approveCustomerList?.filter(
      (item) => item.isChecked === true
    );
    if (checkedData?.length > 0) {
      if (type === 1) {
        toggle(true);
      } else if (type === 2) {
        rejectToggle(true);
      }
    } else {
      toastfunc("Select Customers To Approve");
    }
  };

  const approveCustomers = async () => {
    let assignData = [];
    approveCustomerList?.map((item, rowIndex) => {
      if (item.isChecked) {
        assignData.push({
          pk_id: item.pk_id,
        });
      }
    });
    if (assignData.length > 0) {
      let data = {
        approved_through: 1,
        approved_status: 2,
        approve_ids: assignData,
      };
      try {
        await dispatch(createApprovalCustomer(data)).unwrap();
        toggle();
        dispatch(getAllApprovalCustomer());
      } catch (error) {
        let message = error?.response?.data?.error_message;
        if (Array.isArray(message)) {
          message.forEach((msg) => {
            toastfunc(msg);
          });
        }
      }
    } else {
      toastfunc("Select Customers To Approve");
    }
  };

  const rejectCustomers = async () => {
    let assignData = [];
    approveCustomerList?.map((item, rowIndex) => {
      if (item.isChecked) {
        assignData.push({
          pk_id: item.pk_id,
        });
      }
    });
    if (assignData.length > 0) {
      let data = {
        approved_through: 1,
        approved_status: 3,
        approve_ids: assignData,
      };
      try {
        await dispatch(createApprovalCustomer(data)).unwrap();
        rejectToggle();
        dispatch(getAllApprovalCustomer());
      } catch (error) {
        let message = error?.response?.data?.error_message;
        if (Array.isArray(message)) {
          message.forEach((msg) => {
            toastfunc(msg);
          });
        }
      }
    } else {
      toastfunc("Select Customers To Approve");
    }
  };

  useEffect(() => {
    dispatch(getAllApprovalCustomer());
  }, [dispatch]);

  useEffect(() => {
    setApproveCustomerList(approvalCustomerList?.rows);
  }, [approvalCustomerList]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      if (id !== undefined) {
        handleSubmit(putData)();
      } else {
        handleSubmit(saveFunction)();
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  return (
    <React.Fragment>
      <Head title="Customer Approval" />

      <Content>
        <PreviewImagesModal
          modal={imageModal}
          toggle={imageModalClose}
          files={previewImages}
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
            <Col md={5} className="text-right flex">
              <SaveButton
                disabled={issubmitting}
                size="md"
                color="primary"
                onClick={handleSubmit(() => saveFunction(1))}
              >
                {issubmitting ? "Approving" : "Approve"}
              </SaveButton>
              <SaveButton
                disabled={issubmitting}
                size="md"
                color="secondary"
                onClick={handleSubmit(() => saveFunction(2))}
              >
                {issubmitting ? "Rejecting" : "Reject"}
              </SaveButton>
            </Col>
          </Row>

          <Row className="mt-2" md={12}>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>
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
                    {approvalCustomerList?.columns?.map((column, index) => (
                      <th key={index} style={{ textAlign: column?.textAlign }}>
                        {column.Header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {approveCustomerList?.length > 0 ? (
                    approveCustomerList?.map((item, rowIndex) => (
                      <tr key={rowIndex}>
                        <td>
                          {rowIndex + 1}{" "}
                          <input
                            {...register(`isChecked${rowIndex}`)}
                            type="checkbox"
                            onChange={(event) => {
                              handelChange(
                                rowIndex,
                                "isChecked",
                                event.target.checked
                              );
                            }}
                            checked={item.isChecked}
                          />{" "}
                        </td>
                        {approvalCustomerList?.columns?.map(
                          (column, colIndex) => (
                            <td
                              key={colIndex}
                              style={{ textAlign: column?.textAlign }}
                            >
                              {column.type === "lable" ? (
                                <Badge
                                  className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                                  color={item["colour"]}
                                >
                                  {item[column.accessor]}
                                </Badge>
                              ) : column.type === "image" ? (
                                item[column.accessor] ? (
                                  <img
                                    onClick={() =>
                                      handleImagePreview(item?.preview_images)
                                    }
                                    src={item[column.accessor]}
                                    alt={column.accessor}
                                    style={{
                                      maxWidth: "200px",
                                      maxHeight: "200px",
                                      width: "60px",
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                    }}
                                  />
                                ) : (
                                  <UserAvatar text={item["image_text"]} />
                                )
                              ) : column.isCurrency ? (
                                <CurrencyDisplay
                                  value={item[column.accessor]}
                                />
                              ) : column.decimal_places ? (
                                parseFloat(item[column.accessor]).toFixed(
                                  column.decimal_places
                                )
                              ) : (
                                item[column.accessor]
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    ))
                  ) : (
                    <div
                      style={{ textAlign: "center", justifyContent: "center" }}
                    >
                      <h3
                        style={{ textAlign: "center", justifyItems: "center" }}
                      >
                        No Data Found
                      </h3>
                    </div>
                  )}
                </tbody>

                {/* <tfoot>
                                    <tr style={{ fontWeight: "bold" }}>
                                        <td>Total</td>
                                        {approvalCustomerList?.columns.map((column, index) => (
                                            <td key={index} style={{ textAlign: column?.textAlign }}>
                                                {column.isTotalReq ? (
                                                    column.isCurrency ? (
                                                        <CurrencyDisplay value={calculateTotal(column.accessor)} />
                                                    ) : (
                                                        calculateTotal(column.accessor)
                                                    )
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                        ))}
                                        <td></td>
                                    </tr>
                                </tfoot> */}
              </table>
            </div>
          </Row>
        </PreviewCard>
      </Content>

      <OrderAssignModel
        modal={openModal}
        toggle={toggle}
        title={"Approve Registration Requests"}
        name={`Customers`}
        actionName={`approve ${
          approveCustomerList?.filter((item) => item.isChecked === true)?.length
        } registration requests from`}
        clickAction={approveCustomers}
      />
      <OrderAssignModel
        modal={openRejectModal}
        toggle={rejectToggle}
        title={"Reject Registration Requests"}
        name={`Customers`}
        actionName={`reject ${
          approveCustomerList?.filter((item) => item.isChecked === true)?.length
        } registration requests from`}
        clickAction={rejectCustomers}
      />
    </React.Fragment>
  );
};

export default CustomerApprovalForm;
