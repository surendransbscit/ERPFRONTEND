import { useState, useRef, useEffect } from "react";
import { isUndefined } from "../../../components/common/calculations/ErpCalculations";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, getOrderById } from "../../../redux/thunks/Order";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Select from "react-select";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

const UseOrderFormHandling = (id) => {
  const initialState = {
    selectedProduct: "",
    customizedProductName: "",
    selectedRepairType: [],
    piece: "",
    uomId: 1,
    grossWeight: 0.0,
    lessWeight: 0.0,
    otherMetalWeight: 0.0,
    approxAmount: 0.0,
    stnWeight: 0.0,
    diaWeight: 0.0,
    netWeight: 0.0,
    editIndex: "",
    remarks: "",
    stoneDetails: [],
    otherMetalDetails: [],
  };
  const [formValues, setFormValues] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [repairOrderType, setRepairOrderType] = useState("1");
  const [orderImages, SetOrderImages] = useState([]);
  const [idBranch, setIdBranch] = useState("");
  const [orderBranch, setOrderBranch] = useState("");
  const [rateFixedOnOrder, setRateFixedOnOrder] = useState(1);
  const [customer, SetCustomer] = useState();
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderType, setOrderType] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderEditData, setOrderEditData] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const salesFormRef = useRef(null); // Child component reference
  const [delId, SetDelId] = useState();
  const [deleteModal, SetDeleteModal] = useState(false);
  const [daysOfPayment, setDaysOfPayment] = useState();
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 2);
  const [paymentDate, setPaymentDate] = useState();
  const [modalActionName, SetModalActionName] = useState("");
  const { isLoading, orderInfo } = useSelector((state) => state.orderReducer);
  const toggle = () => SetDeleteModal(!deleteModal);
  const [isSearching, setIsSearching] = useState(false);
    const [navigateModal, SetNavigateModal] = useState(false);
    const toggleNavigateModal = () => SetNavigateModal(!navigateModal);
      const [inputType, setInputType] = useState();
      const [navigateModalOpened, setNavigateModalOpened] = useState(false);
      const [createMobNum, SetCreateMobNum] = useState();
  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [field]: value }));
  };
  const { activeProductList } = useSelector((state) => state.productReducer);
  const { activeRepairDamageMasterList } = useSelector(
    (state) => state.repairDamageMasterReducer
  );
  const { searchCustomerList } = useSelector((state) => state.customerReducer);

  const onClickSave = (data) => {
    if (orderDetails?.length === 0) {
      toastfunc("Please Add the Item Details");
    } else {
      setIsSubmitted(true);
      const orderDet = orderDetails?.map((item) => {
        const container = {};
        container.product = item?.selectedProduct;
        container.order_repair_type = item.selectedRepairType.map((obj) => {
          const container = obj.value;
          return container;
        });
        container.customized_product_name =
          item.customizedProductName != "" ? item?.customizedProductName : null;
        container.uom = item.uomId;
        container.pieces = isUndefined(item.piece);
        container.gross_wt = isUndefined(item.grossWeight);
        container.less_wt = isUndefined(item.lessWeight);
        container.net_wt = isUndefined(item.netWeight);
        container.diamond_wt = isUndefined(item.diaWeight);
        container.stone_wt = isUndefined(item.stnWeight);
        container.stone_details = setStoneDetails(item.stoneDetails);
        container.other_metal_details = [];
        container.charges_details = [];
        container.attribute_details = [];
        container.order_images = setImageDetails(item.order_images);
        container.remarks = item?.remarks;
        container.repair_approx_amt = item?.approxAmount;
        container.customer_due_date = moment(paymentDate, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        );
        return container;
      });
      let postData = {
        order_branch: idBranch,
        order_type: 3,
        customer: customer,
        order_details: orderDet,
      };
      saveOrder(postData);
      console.log(postData);
    }
  };
  console.log(orderInfo);
  const handleSetStoneDetails = (data) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      stoneDetails: data,
    }));
    console.log(data);
  };
  const setEditStoneDetails = (data) => {
    let stone_details = [];
    if (data.length > 0) {
      console.log(data);
      stone_details = data?.map((item) => ({
        show_in_lwt: item.show_in_lwt,
        stone_name: item.stone_name,
        id_stone: item.id_stone,
        stone_type: item.stone_type,
        id_quality_code: item.id_quality_code,
        piece: item.stone_pcs,
        stone_rate: item.pur_st_rate,
        weight: item.stone_wt,
        uom_id: item.uom_id,
        amount: item.pur_stn_cost,
        stn_calc_type: item.pur_stn_cal_type,
        id_lot_inw_stn_detail: item.id_lot_inw_stn_detail,
      }));
    }
    return stone_details;
  };

  const setStoneDetails = (data) => {
    let stone_details = [];
    if (data.length > 0) {
      stone_details = data?.map((item) => ({
        stone: item.id_stone,
        uom_id: item.uom_id,
        pieces: item.piece,
        weight: item.weight,
        calc_type: item.stn_calc_type,
        stone_rate: item.stone_rate,
        stone_type: item.stone_details.stone_type,
        stone_calc_type: item.stn_calc_type,
        stone_amnt: item.stone_amount,
        show_in_lwt: item.show_in_lwt,
        stone_wt: item.weight,
      }));
    }
    return stone_details;
  };

  const setChargesDetails = (data) => {
    let charges_details = [];
    if (data.length > 0) {
      charges_details = data?.map((item) => ({
        charges: item.selectedCharge,
        amount: item.amount,
      }));
    }
    return charges_details;
  };

  const setAttributeDetails = (data) => {
    let attribute_details = [];
    if (data.length > 0) {
      attribute_details = data?.map((item) => ({
        attribute: item.selectedAttribute,
        value: item.attrValue,
      }));
    }
    return attribute_details;
  };

  const setImageDetails = (data) => {
    let order_images = [];
    if (data.length > 0) {
      order_images = data?.map((item) => ({
        image: item.preview,
      }));
    }
    return order_images;
  };

  const setOtherMetalDetails = (data) => {
    let other_metal_details = [];
    if (data.length > 0) {
      other_metal_details = data?.map((item) => ({
        piece: item.piece,
        weight: item.weight,
        wastage_percentage: item.wastagePercentage,
        wastage_weight: item.wastageWeight,
        mc_type: item.mcType,
        mc_value: item.mcValue,
        other_metal_cost: item.amount,
        category: item.selectedCategory,
        purity: item.selectedPurity,
        rate_per_gram: item.ratePerGram,
      }));
    }
    return other_metal_details;
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (id !== undefined) {
        try {
          await dispatch(getOrderById(id)).unwrap();
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchOrderDetails();
  }, [dispatch, id]);

  useEffect(() => {
    if (orderInfo !== undefined && orderInfo !== null && id !== undefined) {
      const order_details = orderInfo.order_details;
      console.log(order_details);
      if (order_details?.length > 0) {
        setIdBranch(orderInfo.order_branch);
        setOrderBranch(orderInfo.order_branch);
        setOrderType(orderInfo.order_type);
        SetCustomer(orderInfo.customer);
        setRateFixedOnOrder(orderInfo.is_rate_fixed_on_order);
        let orderDetails = [];
        order_details?.forEach((value) => {
          const orderImages = value?.image_details?.map((item) => {
            const container = {};
            container.name = item.name;
            container.preview = item.image;
            return container;
          });
          value?.image_details && SetOrderImages(orderImages);
          orderDetails?.push({
            productName: value.product_name,
            repairName: value.repair_name,
            selectedProduct: value.product,
            selectedRepairType: value.repair_type,
            uomId: value.uom,
            piece: value.pieces,
            grossWeight: value.gross_wt,
            lessWeight: value.less_wt,
            netWeight: value.net_wt,
            diaWeight: value.diamond_wt,
            stnWeight: value.stone_wt,
            stoneDetails: value?.stone_details
              ? setEditStoneDetails(value?.stone_details)
              : [],
            order_images: value?.image_details
              ? setImageDetails(value?.image_details)
              : [],
            remarks: value.remarks,
          });
        });
        setOrderDetails(orderDetails);
      }
    }
  }, [id, orderInfo]);

  const saveOrder = async (postData) => {
    try {
      const response = await dispatch(createOrder(postData)).unwrap();
      console.log(response);
      toastsuccess("Order Created Successfully");
      let data = {
        settings: {},
        itemDetails: response.print_data,
      };
      // console.log(data);
      secureLocalStorage.setItem("pageState", JSON.stringify(data));
      window.location.reload();
      window.open(
        `${process.env.PUBLIC_URL}/orders/repairorder/print`,
        "_blank"
      );
      // downloadPDF(response.pdf_path, response.order_id);
      // setIsSubmitted(false);
      //navigate(`${process.env.PUBLIC_URL}/order/repair_order/list`);
      // console.log(postData);
    } catch (error) {
      setIsSubmitted(false);
      console.error(error);
    }
  };

  const downloadPDF = async (printPageURL, id) => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/${printPageURL}/${id}/`,
      {
        headers: {
          Authorization: `Token ${secureLocalStorage.getItem("pref")?.token}`,
        },
      }
    );

    try {
      const response = await axios.get(data?.data?.pdf_url, {
        responseType: "blob",
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(pdfBlob);

      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.target = "_blank";
      tempLink.setAttribute("print", `invoice.pdf`);

      document.body.appendChild(tempLink);
      tempLink.click();

      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const previewDetails = [
    { header: "Product", accessor: "productName", textAlign: "center" },
    { header: "Repair Type", accessor: "repairName", textAlign: "center" },
    {
      header: "Piece",
      accessor: "piece",
      decimal_places: 0,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Gwt",
      accessor: "grossWeight",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Lwt",
      accessor: "lessWeight",
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
  ];

  let orderTypeOptions = [
    {
      label: "Customer Order",
      value: 1,
    },
    {
      label: "Purchase Order",
      value: 2,
    },
    {
      label: "Repair Order",
      value: 3,
    },
  ];

  const handleAddPreview = () => {
    if (
      (formValues.selectedProduct == "" ||
        formValues.selectedProduct == null) &&
      (formValues.customizedProductName == "" ||
        formValues.customizedProductName == null)
    ) {
      toastfunc("Select Product ...");
    } else if (formValues.grossWeight == "" || formValues.grossWeight == null) {
      toastfunc("Invaild Gross Wt ...");
    } else if (
      formValues.selectedRepairType == "" ||
      formValues.selectedRepairType == null
    ) {
      toastfunc("Select Repair Type ...");
    } else if (
      formValues.piece == "" ||
      formValues.piece == null ||
      formValues.piece <= 0
    ) {
      toastfunc("Invaild Piece ...");
    } else {
      let productName =
        activeProductList.find(
          (pro) => pro.pro_id == formValues.selectedProduct
        )?.product_name || formValues.customizedProductName;
      let repairName = formValues.selectedRepairType
        .map((item) => item.label)
        .join(", ");
      formValues.productName = productName;
      formValues.repairName = repairName;

      handleOrderFormSubmit(formValues);
      setFormValues(initialState);
    }
  };

  const handleEdit = (index) => {
    const item = orderDetails[index];
    console.log(item);
    let editData = {
      ...item,
    };
    setFormValues(editData);
    setEditIndex(index);
    console.log(editData);
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
    formData.order_images = orderImages;

    console.log(editIndex);
    if (editIndex !== null) {
      const updatedFormData = orderDetails;
      updatedFormData[editIndex] = formData;
      setOrderDetails(updatedFormData);
    } else {
      setOrderDetails((prevData) => [...prevData, formData]);
    }
    SetOrderImages([]);
    console.log(orderDetails);
  };

  const navigateCreateCustomer = () => {
    navigate(
      {
        pathname: `${process.env.PUBLIC_URL}/master/customer/add`,
      },
      {
        state: { add: true, createMobNum: createMobNum, navigateLink: `/estimation/add` },
      }
    );
  };

  return {
    idBranch,
    setIdBranch,
    orderBranch,
    setOrderBranch,
    orderId,
    setOrderId,
    isSubmitted,
    onClickSave,
    previewDetails,
    orderTypeOptions,
    rateFixedOnOrder,
    setRateFixedOnOrder,
    customer,
    SetCustomer,
    customerSearch,
    SetCustomerSearch,
    orderType,
    setOrderType,

    orderDetails,
    setOrderDetails,
    orderEditData,
    setOrderEditData,
    editIndex,
    setEditIndex,
    handleOrderFormSubmit,
    deleteOrder,
    handleDelete,
    handleEdit,
    handleAddPreview,
    deleteModal,
    SetDeleteModal,
    toggle,
    salesFormRef,
    orderImages,
    SetOrderImages,
    daysOfPayment,
    setDaysOfPayment,
    paymentDate,
    setPaymentDate,
    handleInputChange,
    formValues,
    handleSetStoneDetails,
    setRepairOrderType,
    repairOrderType,
    navigateCreateCustomer,
    createMobNum, SetCreateMobNum,
    navigateModal, SetNavigateModal,
    toggleNavigateModal,
    navigateModalOpened, setNavigateModalOpened,
    inputType, setInputType,
    searchCustomerList,
    isSearching, setIsSearching
  };
};

export default UseOrderFormHandling;
