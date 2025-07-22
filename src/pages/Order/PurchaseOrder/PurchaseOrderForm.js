import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { useSelector, useDispatch } from "react-redux";
import {
  NumberInputField,
  PreviewCard,
  SaveButton,
  TextInputField,
} from "../../../components/Component";
import { useLocation, useNavigate } from "react-router";
import { Button, Col, Label, Row } from "reactstrap";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import IsRequired from "../../../components/erp-required/erp-required";
import {
  BranchDropdown,
  ProductDropdown,
  SizeDropdown,
  SupplierDropdown,
} from "../../../components/filters/retailFilters";
import {
  useBranches,
  useProducts,
  useSize,
  useSupplierFilter,
} from "../../../components/filters/filterHooks";
import moment from "moment";
import PreviewTable from "../../../components/sds-table/PreviewTable";
import DeleteModal from "../../../components/modals/DeleteModal";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import { isUndefined } from "../../../components/common/calculations/ErpCalculations";
import {
  createOrder,
  getPurchaseOrderById,
  getPurchaseOrderPurchaseSoldDetails,
  updatePurchaseOrderById,
} from "../../../redux/thunks/Order";
import secureLocalStorage from "react-secure-storage";
import { useHotkeys } from "react-hotkeys-hook";

const PurchaseOrderForm = () => {
  const location = useLocation();
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const tableRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const methods = useForm();
  const { branches } = useBranches();
  const { supplier } = useSupplierFilter();
  const { products } = useProducts();
  const { size } = useSize();
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);

  const {
    isLoading: issubmitting,
    purchaseOrderInfo,
    purchaseOrderPurchaseSoldDetails,
  } = useSelector((state) => state.orderReducer);

  // console.log(purchaseOrderPurchaseSoldDetails);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [idBranch, setIdBranch] = useState();
  const [supplierLabel, setSupplierLabel] = useState();
  const [selectSupplier, setSelectSupplier] = useState();
  const [daysOfPayment, setDaysOfPayment] = useState();
  const [paymentDate, setPaymentDate] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [pieces, setPieces] = useState();
  const [grosswt, setGrossWt] = useState();
  const [remarks, setRemarks] = useState();
  //   const [previewDetails, setPreviewDetails] = useState([]);

  const [editIndex, setEditIndex] = useState(null);
  const [orderEditData, setOrderEditData] = useState({});
  const [orderDetails, setOrderDetails] = useState([]);

  const [deleteModal, SetDeleteModal] = useState(false);
  const [modalActionName, SetModalActionName] = useState("");
  const toggle = () => SetDeleteModal(!deleteModal);
  const [delId, SetDelId] = useState();
  
    const inputRef = useRef(null);
  
    useEffect(() => {
      inputRef.current?.focus();
    }, [selectSupplier]);

    // useEffect(() => {
    //   const timer = setTimeout(() => {
    //     inputRef.current?.focus();
    //   }, 100);
    //   return () => clearTimeout(timer);
    // }, []);
    

  const columns = [
    { header: "Product", accessor: "productName", textAlign: "center" },
    {
      header: "Size",
      accessor: "size",
      decimal_places: 0,
      textAlign: "right",
      isTotalReq: false,
    },
    {
      header: "Piece",
      accessor: "pieces",
      decimal_places: 0,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Gwt",
      accessor: "grosswt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },

    {
      header: "Nwt",
      accessor: "netWeight",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },

    // {
    //   header: "Item Cost",
    //   accessor: "itemCost",
    //   decimal_places: 2,
    //   textAlign: "right",
    //   isTotalReq: true,
    //   isCurrency: true,
    // },
  ];

  const resetForm = () => {
    setPieces("");
    setGrossWt("");
    setSelectedSize("");
    setSelectedProduct("");
    setRemarks("");
    inputRef.current.focus();
  };

  const handleEdit = (index) => {
    const item = orderDetails[index];
    // console.log(item);
    let editData = {
      ...item,
    };
    setGrossWt(item?.grosswt);
    setPieces(item?.pieces);
    setSelectedProduct(item?.selectedProduct);
    setSelectedSize(item?.size);
    setRemarks(item?.remarks);

    setOrderEditData(editData);
    setEditIndex(index);
    // console.log(editData);
  };

  const handleDelete = (index) => {
    SetModalActionName("delete");
    SetDeleteModal(true);
    SetDelId(index);
  };

  const deleteOrder = () => {
    const updatedFormData = [...orderDetails];
    updatedFormData.splice(delId, 1);
    setOrderDetails(updatedFormData);
    toggle();
  };

  const handleOrderFormSubmit = async (formData) => {
    const productDetails = products.find(
      (val) => val.pro_id === selectedProduct
    );

    const baseData = {
      ...formData,
      grosswt: grosswt,
      netWeight: grosswt,
      pieces: pieces,
      productName: productDetails.product_name,
      selectedProduct: selectedProduct,
      size: selectedSize,
      remarks: remarks,
    };

    if (editIndex !== null) {
      const oldItem = orderDetails[editIndex];
      const updatedFormData = orderDetails;
      updatedFormData[editIndex] = {
        ...baseData,
        detail_id: oldItem?.detail_id ?? null,
      };
      setOrderDetails([...updatedFormData]);
      resetForm();
      setEditIndex(null);
    } else {
      setOrderDetails((prevData) => [
        ...prevData,
        {
          ...baseData,
          detail_id: null,
        },
      ]);
      resetForm();
    }
  };

  // console.log(orderDetails);

  const saveOrder = async (postData, type) => {
    let response = "";
    try {
      if (id !== "" && id !== undefined) {
        const update_data = { id: id, putData: postData };
        response = await dispatch(
          updatePurchaseOrderById(update_data)
        ).unwrap();
        toastsuccess(response.message);
      } else {
        response = await dispatch(createOrder(postData)).unwrap();
        toastsuccess(response.message);
        let data = {
          settings: settings,
          itemDetails: response.print_data,
        };
        console.log(data);
        secureLocalStorage.setItem("pageState", JSON.stringify(data));
        window.open(
          `${process.env.PUBLIC_URL}/orders/purchase_order/print`,
          "_blank"
        );
      }

      setIsSubmitted(false);
      if (type === "save") {
        navigate(`${process.env.PUBLIC_URL}/order/purchaseorder/list`);
      } else if (type === "saveAndPay") {
        navigate(`${process.env.PUBLIC_URL}/receipt/add`, {
          state: {
            add: true,
            id_branch: idBranch,
            receipt_type: 2,
            orderId: response.order_id,
          },
        });
      }
      // console.log(postData);
    } catch (error) {
      setIsSubmitted(false);
      console.error(error);
    }
  };

  const onClickSave = (type) => {
    // console.log(daysOfPayment);
    if (idBranch === "" || idBranch === null) {
      toastfunc("Please Select the Branch");
    } else if (daysOfPayment === "" || daysOfPayment === undefined) {
      toastfunc("Please Enter the Due Days");
    } else if (orderDetails?.length === 0) {
      toastfunc("Please Add the Item Details");
    } else {
      setIsSubmitted(true);
      const customerDueDate = new Date();
      customerDueDate.setDate(
        customerDueDate.getDate() + parseInt(daysOfPayment)
      );
      //   console.log(orderDetails);
      const orderDet = orderDetails?.map((item) => {
        const container = {};
        container.purity = null;
        container.product = item.selectedProduct;
        container.design = null;
        container.sub_design = null;
        container.id_section = null;
        container.size = item.size;
        container.calculation_type = null;
        container.uom = null;
        container.tax = null;
        container.taxable_amnt = 0;
        container.tax_amnt = 0;
        container.tax_type = null;
        container.item_cost = 0;
        container.wastage_percent = null;
        container.wastage_wt = 0;
        // container.mc_type = item?.mcType;
        container.mc_value = 0;
        container.pieces = isUndefined(item.pieces);
        container.cgst_amnt = isUndefined(item.cgst);
        container.sgst_amnt = isUndefined(item.sgst);
        container.igst_amnt = isUndefined(item.igst);
        container.gross_wt = isUndefined(item.grosswt);
        container.less_wt = isUndefined(item.lessWeight);
        container.net_wt = isUndefined(item.netWeight);
        container.diamond_wt = isUndefined(item.diaWeight);
        container.stone_wt = isUndefined(item.stnWeight);
        container.sell_rate = isUndefined(item.sellRate);
        container.pure_wt = isUndefined(item.pureWeight);
        container.other_metal_wt = isUndefined(item.otherMetalWeight);
        container.rate_per_gram = item?.ratePerGram;
        container.stone_details = [];
        container.other_metal_details = [];
        container.charges_details = [];
        container.attribute_details = [];
        container.order_images = [];
        container.remarks = item?.remarks;
        container.erp_tag = null;
        container.detail_id = item?.detail_id;
        container.karigar_due_date =
          moment(customerDueDate).format("YYYY-MM-DD");
        return container;
      });
      let postData = {
        order_branch: idBranch,
        order_type: 2,
        customer: null,
        supplier: selectSupplier,
        order_details: orderDet,
      };
      saveOrder(postData, type);
      // console.log(postData);
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (id !== undefined) {
        try {
          await dispatch(getPurchaseOrderById(id)).unwrap();
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchOrderDetails();
  }, [dispatch, id]);

  useEffect(() => {
    if (
      purchaseOrderInfo !== undefined &&
      purchaseOrderInfo !== null &&
      id !== undefined
    ) {
      const order_details = purchaseOrderInfo.order_details;
      // console.log(order_details);
      if (order_details?.length > 0) {
        setIdBranch(purchaseOrderInfo.order_branch);
        setSelectSupplier(purchaseOrderInfo.supplier);

        setPaymentDate(
          moment(order_details[0]?.karigar_due_date, "YYYY-MM-DD").format(
            "DD-MM-YYYY"
          )
        );
        const currentDate = new Date(new Date().toISOString().split("T")[0]);
        const customer_due_date = new Date(order_details[0]?.karigar_due_date);
        const differenceInTime = customer_due_date - currentDate; // Difference in milliseconds
        const differenceInDays = Math.ceil(
          differenceInTime / (1000 * 60 * 60 * 24)
        ); // Convert to days
        setDaysOfPayment(differenceInDays);
        let orderDetails = [];
        order_details?.forEach((value) => {
          // value?.image_details && SetOrderImages(orderImages);
          orderDetails?.push({
            productName: value.product_name,
            designName: value.design_name,
            subDesignName: value?.sub_design_name,
            selectedPurity: value.purity,
            selectedCategory: value.cat_id,
            selectedProduct: value.product,
            selectedDesign: value.design,
            selectedSubDesign: value.sub_design,
            selectedSection: value.id_section,
            productCalculationType: value.calculation_type,
            uomId: value.uom,
            tax_id: value.tax,
            taxableAmount: value.taxable_amnt,
            taxAmount: value.tax_amnt,
            taxType: value.tax_type,
            itemCost: value.item_cost,
            wastageWeight: value.wastage_wt,
            pieces: value.pieces,
            cgst: value.cgst_amnt,
            sgst: value.sgst_amnt,
            igst: value.igst_amnt,
            grosswt: value.gross_wt,
            lessWeight: value.less_wt,
            netWeight: value.net_wt,
            diaWeight: value.diamond_wt,
            stnWeight: value.stone_wt,
            sellRate: value.sell_rate,
            pureWeight: value.pure_wt,
            otherMetalWeight: value.other_metal_wt,
            ratePerGram: value.rate_per_gram,
            mcValue: value.mc_value,
            mcType: value.mc_type,
            wastagePercentage: value.wastage_percent,
            id_metal: value.id_metal,

            remarks: value.remarks,
            tagId: value?.erp_tag,
            detail_id: value?.detail_id,
          });
        });
        setOrderDetails(orderDetails);
        // console.log(orderDetails);
      }
    }
  }, [id, purchaseOrderInfo]);

  // useEffect(() => {
  //   if (selectedProduct) {
  //     dispatch(
  //       getPurchaseOrderPurchaseSoldDetails({
  //         product: selectedProduct,
  //       })
  //     );
  //   }
  // }, [selectedProduct, dispatch]);

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/order/purchaseorder/list`);
    }
  }, [add, id, navigate]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      onClickSave("save");
    },
    {
      enableOnFormTags: true,
      preventDefault: true,  
    }
  );
  

  return (
    <React.Fragment>
      <Head title="Purchase Order Add" />
      <Content>
        <PreviewCard className="h-100">
          <FormProvider {...methods}>
            <Row
              md={12}
              className={"form-control-sm"}
              //   style={{ marginTop: "5px" }}
            >
              <Col md={4}>
                <ModifiedBreadcrumb />
              </Col>

              <Col md={8} className="text-right">
                <br></br>
                <Button
                  disabled={isSubmitted}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/order/purchaseorder/list`
                    )
                  }
                >
                  Cancel
                </Button>{" "}
                <Button
                  color="primary"
                  disabled={isSubmitted}
                  size="md"
                  onClick={() => onClickSave("save")}
                >
                  {isSubmitted ? "Saving" : "Save[Ctrl+s]"}
                </Button>{" "}
                {/* <Button
                  color="primary"
                  disabled={isSubmitted}
                  size="md"
                //   onClick={() => onClickSave("saveAndPay")}
                >
                  {isSubmitted ? "Saving" : "Save&Pay"}
                </Button> */}
              </Col>
            </Row>

            <Row
              lg={12}
              className={"form-control-sm g-2"}
              style={{ display: "flex" }}
            >
              <Col md={3} lg={3}>
                <Label>Branch</Label>

                <BranchDropdown
                  register={register}
                  id={"idBranch"}
                  branches={branches}
                  selectedBranch={idBranch}
                  onBranchChange={setIdBranch}
                  isRequired={false}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.idBranch && "Branch is Required"}
                  // tabIndex={1}
                />
              </Col>

              <Col md={3} lg={3}>
                <Label>Supplier</Label>
                <div className="form-group">
                  <SupplierDropdown
                    ref = {inputRef}
                    register={register}
                    id={"supplier"}
                    selectedSupplier={selectSupplier}
                    supplier={supplier}
                    setValue={setValue}
                    selectedSupplierLabel={setSupplierLabel}
                    onSupplierChange={(value) => {
                      setSelectSupplier(value);
                    }}
                    clearErrors={clearErrors}
                    placeholder={"Select Supplier"}
                  />
                </div>
              </Col>
              <Col md={3} lg={2}>
                <Label>
                  Due Date in Days
                  <IsRequired />
                </Label>
                <TextInputField
                  register={register}
                  isRequired={true}
                  id={"daysOfPayment"}
                  placeholder="No. of days"
                  value={daysOfPayment}
                  SetValue={(value) => {
                    setDaysOfPayment(value);
                    const inputDays = value;

                    // Calculate future date if input is a valid number
                    if (!isNaN(inputDays) && inputDays !== "") {
                      const resultDate = new Date();
                      resultDate.setDate(
                        resultDate.getDate() + parseInt(inputDays)
                      );
                      setPaymentDate(moment(resultDate).format("DD-MM-YYYY"));
                    } else {
                      setPaymentDate(); // Clear if input is invalid
                    }

                    clearErrors("daysOfPayment");
                  }}
                  // tabIndex={3}
                />
                {errors?.daysOfPayment && (
                  <span className="text-danger">
                    {errors?.daysOfPayment.message}
                  </span>
                )}
              </Col>
              <Col md={3} lg={3}>
                <Label>
                  Due Date
                  <IsRequired />
                </Label>
                <div className="form-control-wrap">
                  <input
                    disabled
                    className="form-control form-control-sm"
                    id={"payementDate"}
                    type="text"
                    placeholder={"Due Date"}
                    value={paymentDate}
                  />
                </div>
              </Col>
            </Row>

            <div className="custom-grid mt-4">
              <Row
                lg={12}
                className={"form-control-sm g-2"}
                style={{ display: "flex" }}
              >
                {/* <Col md={5} lg={5}>*/}

                <Col md={3} lg={3}>
                  <Label>
                    Product
                    <IsRequired />
                  </Label>
                  <div className="form-control-wrap">
                    <ProductDropdown
                      register={register}
                      id={"selectedProduct"}
                      products={products}
                      ref={inputRef}
                      selectedProduct={selectedProduct}
                      onProductChange={(value) => {
                        setValue("selectedProduct", value);
                        setSelectedProduct(value);
                      }}
                      isRequired={true}
                      clearErrors={clearErrors}
                      setValue={setValue}
                      message={errors.selectedProduct && "Product is Required"}
                    />
                  </div>
                </Col>

                <Col md={3} lg={3}>
                  <Label>
                    Size
                   
                  </Label>
                  <div className="form-control-wrap">
                    <SizeDropdown
                      register={register}
                      id={"selectedSize"}
                      size={size}
                      products={products}
                      selectedProduct={selectedProduct}
                      selectedSize={selectedSize}
                      onSizeChange={(value) => {
                        setValue("selectedSize", value);
                        setSelectedSize(value);
                      }}
                      isRequired={false}
                      isRequiredBasedOnPro={true}
                      clearErrors={clearErrors}
                      setValue={setValue}
                      message={errors.selectedSize && "Size is Required"}
                    />
                  </div>
                </Col>

                <Col md={3} lg={3}>
                  <Label>
                    Pieces
                  </Label>
                  <div className="form-control-wrap">
                    <NumberInputField
                      register={register}
                      placeholder="Pcs"
                      id={"piece"}
                      value={pieces}
                      isRequired={true}
                      min={"1"}
                      setValue={setValue}
                      handleDot={true}
                      handleKeyDownEvents={true}
                      SetValue={(value) => {
                        setPieces(value);
                      }}
                      minError={"Pieces Should greater than or equal to 0"}
                      reqValueError={"Pieces is Required"}
                      message={errors.piece && errors.piece.message}
                    />
                  </div>
                </Col>

                <Col md={3} lg={3}>
                  <Label>
                    Gross Wt.
                    <IsRequired />
                  </Label>
                  <div className="form-control-wrap">
                    <NumberInputField
                      register={register}
                      placeholder="Gross Wt"
                      id={"gross_wt"}
                      value={grosswt}
                      isRequired={true}
                      min={"1"}
                      // setValue={setValue}
                      handleKeyDownEvents={true}
                      SetValue={(value) => {
                        setGrossWt(value);
                      }}
                      reqValueError={"Gross Wt is Required"}
                      message={errors.gross_wt && errors.gross_wt.message}
                      handleDecimalDigits={true}
                      decimalValues={3}
                    />
                  </div>
                </Col>

                <Col md={3} lg={3}>
                  <Label>
                    Remarks
                    <IsRequired />
                  </Label>
                  <div className="form-control-wrap">
                    <textarea
                      {...register("remarks")}
                      id="remarks"
                      style={{ minHeight: "4vw" }}
                      rows="3"
                      className="form-control form-control-sm"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                </Col>

                <Col md={5} lg={5} className="mt-5">
                  {/* <div className="mt-3" style={{ float: "right" }}> */}
                  <SaveButton
                    //   disabled={issubmitting}
                    size="md"
                    color="primary"
                    // tabIndex={17}
                    onClick={handleOrderFormSubmit}
                  >
                    Add to Preview
                  </SaveButton>
                  {/* </div> */}
                </Col>

                {/* </Col> */}

                {/* <Col md={7} lg={7}>
                <div
                  ref={tableRef}
                  className="table-responsive mt-4"
                  style={{
                    maxHeight: "500px",
                    position: "relative",
                    border: " 1px solid #ddd",
                    borderRadius: "8px",
                  }}
                >
                  <table
                    className="table table-bordered"
                    style={{ borderCollapse: "collapse", fontSize: "14px" }}
                  >
                    <thead
                      style={{
                        position: "sticky",
                        top: 0,

                        zIndex: 100,
                      }}
                    >
                      <tr>
                        <th></th>
                        <th>Supplier</th>
                        <th colSpan={2} style={{ textAlign: "center" }}>
                          Purchase
                        </th>
                        <th colSpan={2} style={{ textAlign: "center" }}>
                          Sold
                        </th>
                        <th colSpan={2} style={{ textAlign: "center" }}>
                          Balance
                        </th>
                      </tr>
                      <tr>
                        <th>S.NO </th>
                        <th> </th>
                        <th>PCS </th>
                        <th>Wt. </th>
                        <th>PCS </th>
                        <th>Wt. </th>
                        <th>PCS </th>
                        <th>Wt. </th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseOrderPurchaseSoldDetails?.map((item, idx) => {
                        return (
                          <React.Fragment key={idx}>
                            <tr>
                              <td>{idx + 1}</td>
                              <td>{item?.supplier_name}</td>
                              <td>{item?.purchased_pieces}</td>
                              <td>{item?.purchased_wt}</td>
                              <td>{item?.sold_pieces}</td>
                              <td>{item?.sold_wt}</td>
                              <td>{item?.balance_pieces}</td>
                              <td>{item?.balance_wt}</td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Col> */}
              </Row>
            </div>

            <Row md={12} className="mt-4">
              <PreviewTable
                columns={columns}
                data={orderDetails}
                numericFields={""}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </Row>
          </FormProvider>
        </PreviewCard>
      </Content>
      <DeleteModal
        actionName={"Delete"}
        modal={deleteModal}
        toggle={toggle}
        name={"Item"}
        title={"Purchase Order"}
        clickAction={deleteOrder}
      />
    </React.Fragment>
  );
};

export default PurchaseOrderForm;
