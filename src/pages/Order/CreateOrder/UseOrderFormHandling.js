import { useState, useRef, useEffect } from "react";
import { calculateItemDiscountAmount, isUndefined } from "../../../components/common/calculations/ErpCalculations";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrder,
  getOrderById,
  updateOrderById,
} from "../../../redux/thunks/Order";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getTagDetailsByCode } from "../../../redux/thunks/inventory";
import { createPurchaseItemData, setPurchaseItemDetails, setSalesItem, validateSaleItemDetails } from "../../../components/common/salesForm/salesUtils";
import { v4 as uuid } from "uuid";
import { getEstimationDetailsByNo } from "../../../redux/thunks/estimation";
import secureLocalStorage from "react-secure-storage";
import { employee_id } from "../../../redux/configs";

const UseOrderFormHandling = (id) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const loginpref = secureLocalStorage?.getItem("pref")?.pref;
  const [orderImages, SetOrderImages] = useState([]);
  const [orderVideos, SetOrderVideos] = useState([]);
  const [orderVoices, SetOrderVoices] = useState([]);
  const [files, setFiles] = useState([]);
  const [idBranch, setIdBranch] = useState("");
  const [orderBranch, setOrderBranch] = useState("");
  const [rateFixedOnOrder, setRateFixedOnOrder] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [navigateModal, SetNavigateModal] = useState(false);
  const toggleNavigateModal = () => SetNavigateModal(!navigateModal);
    const [inputType, setInputType] = useState();
    const [navigateModalOpened, setNavigateModalOpened] = useState(false);
    const [createMobNum, SetCreateMobNum] = useState();
  const [customer, SetCustomer] = useState();
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderType, setOrderType] = useState("");
  const [tagCode, setTagCode] = useState("");
  const [oldTagCode, setOldTagCode] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [purchaseItemData, setPurchaseItemData] = useState([]);
  const [previewDetails, setPreviewDetails] = useState([]);
  const [orderEditData, setOrderEditData] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const salesFormRef = useRef(null); // Child component reference
  const purchaseFormRef = useRef(null); // Child component reference
  const [delId, SetDelId] = useState();
  const [deleteModal, SetDeleteModal] = useState(false);
  const [delItem, SetDelItem] = useState("");
  const [paymentModeData, setPaymentModeData] = useState([]);
  const [daysOfPayment, setDaysOfPayment] = useState();
  const [totalBillAmount, setTotalBillAmount] = useState(0);
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [paymentDate, setPaymentDate] = useState();
  const [modalActionName, SetModalActionName] = useState("");
  const [estNo, setEstNo] = useState("");
  const { isLoading, orderInfo } = useSelector((state) => state.orderReducer);
  const toggle = () => SetDeleteModal(!deleteModal);
  const { metalPurityRateList } = useSelector(
    (state) => state.metalPurityRateReducer
  );
  const { categoryList } = useSelector((state) => state.categoryReducer);
  const { metalRateInfo } = useSelector((state) => state.metalRateReducer);
  const { activeProductList } = useSelector((state) => state.productReducer);
  const { activeDiamondRateList } = useSelector(
    (state) => state.diamondRateMasterReducer
  );
  const { searchCustomerList } = useSelector((state) => state.customerReducer);
  const { catPurityRateList } = useSelector(
    (state) => state.metalPurityRateReducer
  );

  const [purchaseFormValues, setPurchaseFormValues] = useState({});
  const [employee, SetEmployee] = useState(null);


   useEffect(() => {
    if (employee_id !== undefined) {
      SetEmployee(employee_id);
    }
  }, [employee_id]);

  const initialStateItemDetails = {
        id_sales_item_detail: uuid(),
        isPartial:0,
        isGrossWeightDisable:false,
        maxGrossWeight:0,
        invoice_sale_item_id:"",
        isMrpItem:false,
        isMrpWeightBasedItem:false,
        selectedCategory: "",
        selectedPurity: "",
        selectedProduct: "",
        selectedSize:"",
        selectedDesign: "",
        selectedSubDesign: "",
        selectedSection:"",
        selectedSize:"",
        huId1:"",
        huId2:"",
        piece: 1,
        uomId: 1,
        grossWeight: 0,
        lessWeight: 0,
        stnWeight: 0,
        diaWeight: 0,
        netWeight: 0,
        sellRate:0,
        otherMetalWeight:0.000,
        wastagePercentage: 0,
        wastageWeight: 0,
        purchaseTouch: 0,
        purchaseWastage: 0,
        pureWeightCalType:2,
        pureWeight:0.000,
        purchaseMcType:1,
        purchaseRate:0,
        purchaseRateType:1,
        purchaseMc:0,
        purchaseCost:0,
        mcValue: 0,
        totalMcValue : 0,
        flatMcValue: 0,
        mcType: 1,
        ratePerGram: 0,
        taxableAmount: 0,
        otherChargesAmount:0.00,
        tax_id: 0,
        taxType: "",
        taxPercentage: 0,
        taxAmount: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        discountAmount: 0,
        itemCost: 0,
        productCalculationType: "",
        editIndex: "",
        stoneDetails: [],
        otherMetalDetails: [],
        otherChargesDetails: [],
        attributeDetails:[],
        tagId:"",
        tagCode:"",
        est_item_id:"",
        detail_id:"",
        rate_type:1, //1-Current Rate , 2- Order Rate
        settingsMcType : '',
        settingsMinVa : '',
        settingsMinMc : '',
        settingsMaxVa : '',
        settingsMaxMc : '',
        settVaType : '',
        settFlatMcMin: '',
        settFlatMcMax: '',
        settTouch : '',
        wastage_calc_type : '',
        remarks:"",
        subEmployee1:"",
        subEmployee2:"",
        employee:employee,
        item_type:0,
        tagGrossWeight:0,
        tagStoneDetails:0,
        vaDiscount:0,
        mcDiscount:0,
        itemDiscount:0,
        wastageAfterDiscount:0,
    };
    const purchaseColumns = [
      { header: "Product", accessor: "productName", textAlign: "center" },
      { header: "Piece", accessor: "piece", decimal_places: 0, textAlign: "right", isTotalReq: true },
      { header: "Gwt", accessor: "grossWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
      { header: "Lwt", accessor: "lessWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
      { header: "Nwt", accessor: "netWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
      { header: "Dia Wt", accessor: "diaWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
      { header: "VA", accessor: "wastageWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
      { header: "Touch", accessor: "touch", decimal_places: 2, textAlign: "right", isTotalReq: true },
      { header: "Pure", accessor: "pureWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
      {
        header: "Item Cost",
        accessor: "itemCost",
        decimal_places: 2,
        textAlign: "right",
        isTotalReq: true,
        isCurrency: true,
      },
    ];

    const convert64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });
    };
  
    console.log(orderImages);
    console.log(orderVideos);
    console.log(orderVoices);

    const handleDropChange = async (acceptedFiles, set) => {

      console.log(acceptedFiles);
        const filesWithPreview = await Promise.all(
            acceptedFiles?.map(async (file) => {
                let preview;
                let base64String;
    
                // Determine file type and create appropriate preview
                if (file.type.startsWith('image/')) {
                    preview = URL.createObjectURL(file); // Image preview
                } else if (file.type.startsWith('video/')) {
                    preview = URL.createObjectURL(file); // Video preview
                } else if (file.type.startsWith('audio/')) {
                    preview = URL.createObjectURL(file); // Audio preview
                } else {
                    preview = URL.createObjectURL(file); // Default preview (e.g., for other file types)
                }
    
                // Convert to base64 for backend
                try {
                    base64String = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
    
                        reader.onload = () => {
                            const base64 = reader.result.split(',')[1]; // Extract base64 part
                            resolve(base64);
                        };
    
                        reader.onerror = (error) => {
                            reject(error);
                        };
    
                        reader.readAsDataURL(file); // Read as data URL
                    });
                } catch (error) {
                    console.error('Error converting to base64:', error);
                    base64String = null; // Or handle the error as needed
                }
    
                return {
                    ...file,
                    preview: preview, // Preview URL (Blob URL)
                    base64: base64String, // Base64 string for backend
                    id: uuid(),
                    default: false,
                };
            })
        );
    
        // set(filesWithPreview);
        set((prev) => [...prev, ...filesWithPreview]);
    
        
    };

  useEffect(()=>{
    handleSalesAddItem(2);
  },[dispatch])

  const handleSalesAddItem = (item_type= null) => {
      let allowAdd = true;
      for (const value of orderDetails) {
        if (value.selectedProduct !== '' && value.selectedProduct !== null) {
          let allowSubmit = validateSaleItemDetails(activeProductList, value, 1, settings);
          if (!allowSubmit) {
            // return postData; // Early return if validation fails
            allowAdd = false
            break;
          }
        }else{
          allowAdd = false
          toastfunc("Fill all Sales Item Details")
        }
      }
      if (allowAdd) {
        console.log('id_employee',employee_id);
        initialStateItemDetails.employee = employee_id;
        setOrderDetails((prevItemDetails) => [...prevItemDetails, { ...initialStateItemDetails, id_sales_item_detail: uuid(), item_type: 2 }]);
      }
    };

  const onClickSave = (type) => {
    // console.log(daysOfPayment);
    if (idBranch === "" || idBranch === null) {
      toastfunc("Please Select the Branch");
    }
    else if (customer === "" || customer === undefined) {
      toastfunc("Please Select the Customer");
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
      console.log(orderDetails);
      const orderDet = orderDetails?.map((item) => {
        const container = {};
        container.purity = item.selectedPurity;
        container.product = item.selectedProduct;
        container.size = item.selectedSize;
        container.design = item.selectedDesign;
        container.sub_design = item.selectedSubDesign;
        container.id_section = item.selectedSection;
        container.size = item.selectedSize;
        container.calculation_type = item.productCalculationType;
        container.uom = item.uomId;
        container.tax = item?.tax_id;
        container.taxable_amnt = isUndefined(item?.taxableAmount);
        container.tax_amnt = isUndefined(item?.taxAmount);
        container.tax_type = item.taxType;
        container.item_cost = item.itemCost;
        container.wastage_percent = item?.wastagePercentage;
        container.wastage_wt = item?.wastageWeight;
        container.mc_type = item?.mcType;
        container.mc_value = item?.mcValue;
        container.flat_mc_value = item?.flatMcValue;
        container.pieces = isUndefined(item.piece);
        container.cgst_amnt = isUndefined(item.cgst);
        container.sgst_amnt = isUndefined(item.sgst);
        container.igst_amnt = isUndefined(item.igst);
        container.gross_wt = isUndefined(item.grossWeight);
        container.less_wt = isUndefined(item.lessWeight);
        container.net_wt = isUndefined(item.netWeight);
        container.diamond_wt = isUndefined(item.diaWeight);
        container.stone_wt = isUndefined(item.stnWeight);
        container.sell_rate = isUndefined(item.sellRate);
        container.pure_wt = isUndefined(item.pureWeight);
        container.other_metal_wt = isUndefined(item.otherMetalWeight);
        container.rate_per_gram = item?.ratePerGram;
        container.ref_emp_id = item?.employee;
        container.stone_details = setStoneDetails(item.stoneDetails);
        container.other_metal_details = setOtherMetalDetails(
          item?.otherMetalDetails
        );
        container.charges_details = setChargesDetails(
          item?.otherChargesDetails
        );
        container.attribute_details = setAttributeDetails(
          item?.attributeDetails ? item?.attributeDetails : []
        );
        container.order_images = setImageDetails(
          item?.order_images ? item?.order_images : []
        );
        container.order_videos = setVideoDetails(
          item?.order_videos ? item?.order_videos : []
        );
        container.order_voices = setVoiceDetails(
          item?.order_voices ? item?.order_voices : []
        );
        container.remarks = item?.remarks;
        container.erp_tag = item?.tagId;
        container.detail_id = item?.detail_id;
        container.customer_due_date =
          moment(customerDueDate).format("YYYY-MM-DD");
        return container;
      });
    
      let postData = {
        order_branch: idBranch,
        is_rate_fixed_on_order: rateFixedOnOrder,
        order_type: 1,
        customer: customer,
        order_details: orderDet,
        id_counter : loginpref?.id_counter,
        total_discount:isUndefined(totalDiscount),
        payment_details: paymentModeData.length > 0 ? setPaymentDetails(paymentModeData,0) : [],
        payment_amount  : isUndefined(paymentAmount),
        purchase_amount: isUndefined(purchaseItemData.reduce((sum, item) => parseFloat(sum) + parseFloat(item.itemCost), 0)),
        deposit_amount: isUndefined(purchaseItemData.reduce((sum, item) => parseFloat(sum) + parseFloat(item.itemCost), 0)),
        purchase_details: purchaseItemData.length > 0 ? createPurchaseItemData(purchaseItemData) : [],
      };
      saveOrder(postData, type);
      console.log(postData);
    }
  };
 
  

  const setPaymentDetails = (data, refundAmount) => {
    let paymentModeDetails = [];
    data.forEach((val) => {
      if (val.payment_amount > 0) {
        paymentModeDetails.push({
          payment_type: parseFloat(refundAmount) > 0 ? 2 : 1,
          payment_mode: val.id_mode,
          short_code: val.short_code,
          payment_amount: val.payment_amount,
          card_no: val.card_no!='' ? val.card_no : null,
          card_holder: val.card_holder!='' ? val.card_holder : null,
          payment_ref_number: val.payment_ref_number!='' ? val.payment_ref_number : null,
          card_type: val.card_type,
          id_nb_type: val.id_nb_type !== "" ? val.id_nb_type : null,
          id_bank: val.id_bank !== "" ? val.id_bank : null,
          id_pay_device: val.id_pay_device!='' ? val.id_pay_device : null,
        });
      }
    });
    return paymentModeDetails;
  };

  const setEditStoneDetails = (data) => {
    let stone_details = [];
    if (data.length > 0) {
      console.log(data);
      stone_details = data?.map((item) => ({
        show_in_lwt: item.show_in_lwt,
        stone_name: item.stone_name,
        id_stone: item.stone,
        stone_type: item.stone_type,
        id_quality_code: "",
        piece: item.pieces,
        stone_rate: item.stone_rate,
        weight: item.stone_wt,
        uom_id: item.uom_id,
        uom_name: item.uom_name,
        stone_amount: item.stone_amnt,
        stn_calc_type: item.stone_calc_type,
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
        stone_type: item.stone_type,
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
    console.log(data);
    
    if (data?.length > 0) {
      order_images = data?.map((item) => ({
        image: item?.preview,
        preview: item?.preview,
        base64: item?.base64,
        id: item?.id,
        default: item?.default,
      }));
    }
    return order_images;
  };
  
  const setVideoDetails = (data) => {
    let order_videos = [];
    console.log(data);

    if (data?.length > 0) {
      order_videos = data?.map((item) => ({
        video: item?.preview,
        preview: item?.preview,
        base64: item?.base64,
        id: item?.id,
        default: item?.default,
      }));
    }
    return order_videos;
  };
  
  const setVoiceDetails = (data) => {
    let order_voices = [];
    console.log(data);

    if (data?.length > 0) {
      order_voices = data?.map((item) => ({
        voice: item?.preview,
        preview: item?.preview,
        base64: item?.base64,
        id: item?.id,
        default: item?.default,
      }));
    }
    return order_voices;
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
    let column = col;
    if (settings?.is_sub_design_req != 1) {
      column = column.filter((item) => item.accessor !== "subDesignName");
    }
    setPreviewDetails(column);
  }, [dispatch]);

  useEffect(() => {
    if (orderInfo !== undefined && orderInfo !== null && id !== undefined) {
      const order_details = orderInfo.order_details;
      console.log(order_details);
      if (order_details?.length > 0) {
        setIdBranch(orderInfo.order_branch);
        setOrderBranch(orderInfo.order_branch);
        // setOrderType(orderInfo.order_type);
        SetCustomer(orderInfo.customer);
        SetCustomerSearch([
          orderInfo.customer_name + "-" + orderInfo.customer_mobile,
        ]);
        setRateFixedOnOrder(orderInfo.is_rate_fixed_on_order);
        setPaymentDate(
          moment(order_details[0]?.customer_due_date, "YYYY-MM-DD").format(
            "DD-MM-YYYY"
          )
        );
        const currentDate = new Date(new Date().toISOString().split("T")[0]);
        const customer_due_date = new Date(order_details[0]?.customer_due_date);
        const differenceInTime = customer_due_date - currentDate; // Difference in milliseconds
        const differenceInDays = Math.ceil(
          differenceInTime / (1000 * 60 * 60 * 24)
        ); // Convert to days
        setDaysOfPayment(differenceInDays);
        let orderDetails = [];
        order_details?.forEach((value) => {
          const orderImages = value?.image_details?.map((item) => {
            const container = {};
            container.id = item.det_order_img_id;
            container.name = item.name;
            container.preview = item.image;
            return container;
          });
          const orderVideos = value?.video_details?.map((item,index) => {
            const container = {};
            container.id = item.det_order_video_id;
            container.name = item.name;
            container.preview = item.video;
            return (
              <div key={item.det_order_video_id || index}>
              </div>
            );
          });
          const orderVoices = value?.voice_details?.map((item,index) => {
            const container = {};
            container.id = item.det_order_audio_id;
            container.name = item.name;
            container.preview = item.voice;
            return  (
              <div key={item.det_order_audio_id || index}>
                <p>{item.name}</p>
               <audio controls>
                  <source src={item.voice} type="audio/mpeg" />
                    Your browser does not support the audio element.
               </audio>
              </div>
            );
          });
          // value?.image_details && SetOrderImages(orderImages);
          orderDetails?.push({
            productName: value.product_name,
            designName: value.design_name,
            subDesignName: value?.sub_design_name,
            selectedPurity: value.purity,
            selectedCategory: value.cat_id,
            selectedProduct: value.product,
            selectedSize: value.size,
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
            piece: value.pieces,
            cgst: value.cgst_amnt,
            sgst: value.sgst_amnt,
            igst: value.igst_amnt,
            grossWeight: value.gross_wt,
            lessWeight: value.less_wt,
            netWeight: value.net_wt,
            diaWeight: value.diamond_wt,
            stnWeight: value.stone_wt,
            sellRate: value.sell_rate,
            pureWeight: value.pure_wt,
            otherMetalWeight: value.other_metal_wt,
            ratePerGram: value.rate_per_gram,
            flatMcValue: value.flat_mc_value,
            mcValue: value.mc_value,
            mcType: value.mc_type,
            wastagePercentage: value.wastage_percent,
            id_metal: value.id_metal,
            stoneDetails: value?.stone_details
              ? setEditStoneDetails(value?.stone_details)
              : [],
            otherMetalDetails: value?.other_metal_details
              ? setOtherMetalDetails(value?.other_metal_details)
              : [],
            otherChargesDetails: value?.charges_details
              ? setChargesDetails(value?.charges_details)
              : [],
            attributeDetails: value?.attribute_details
              ? setAttributeDetails(value?.attribute_details)
              : [],
            order_images: value?.image_details
              ? setImageDetails(orderImages)
              : [],
            order_videos: value?.video_details
              ? setVideoDetails(orderVideos)
              : [],
            order_voices: value?.voice_details
              ? setVoiceDetails(orderVoices)
              : [],
            remarks: value.remarks,
            tagId: value?.erp_tag,
            detail_id: value?.detail_id,
          });
        });
        setOrderDetails(orderDetails);
        console.log(orderDetails);
      }
    }
  }, [id, orderInfo]);

  const saveOrder = async (postData, type) => {
    let response = "";
    try {
      if (id !== "" && id !== undefined) {
        const update_data = { id: id, putData: postData };
        response = await dispatch(updateOrderById(update_data)).unwrap();
        toastsuccess(response.message);
        navigate(`${process.env.PUBLIC_URL}/order/createorder/list`);
      } else {
        response = await dispatch(createOrder(postData)).unwrap();
        toastsuccess(response.message);
        let data = {
          settings: settings,
          itemDetails: response.print_data,
        };
        console.log(data);
        secureLocalStorage.setItem("pageState", JSON.stringify(data));
        window.open(`${process.env.PUBLIC_URL}/orders/order/print`, "_blank");

        // Delay reload slightly to ensure the print window opens first
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }

      setIsSubmitted(false);
      // console.log(postData);
    } catch (error) {
      setIsSubmitted(false);
      console.error(error);
    }
  };

  const col = [
    { header: "Product", accessor: "productName", textAlign: "center" },
    { header: "Design", accessor: "designName", textAlign: "center" },
    { header: "Sub Design", accessor: "subDesignName", textAlign: "center" },
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
    {
      header: "MC",
      accessor: "mcValue",
      decimal_places: 2,
      textAlign: "right",
    },
    {
      header: "Item Cost",
      accessor: "itemCost",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
    },
  ];

  let orderTypeOptions = [
    {
      label: "Order Rate",
      value: 2,
    },
    {
      label: "Delivery Rate",
      value: 1,
    },
  ];

  const handleAddPreview = () => {
    console.log(salesFormRef.current);
    if (salesFormRef.current) {
      salesFormRef.current.submit();
      setOrderId("");
    } else {
      console.log("salesFormRef.current is null");
    }
  };

  const handleEdit = (index) => {
    const item = orderDetails[index];
    console.log(item);
    let editData = {
      ...item,
    };
    setOrderEditData(editData);
    SetOrderImages(editData?.order_images);
    SetOrderVideos(editData?.order_videos);
    SetOrderVoices(editData?.order_voices);
    setEditIndex(index);
    // console.log(editData);
  };

  const handleDelete = (index) => {
    SetModalActionName("delete");
    SetDeleteModal(true);
    SetDelId(index);
  };

  const deleteOrder = () => {
 if (delItem === "purchase") {
      const updatedFormData = [...purchaseItemData];
      updatedFormData.splice(delId, 1);
      setPurchaseItemData(updatedFormData);
    }else{
      const updatedFormData = [...orderDetails];
      updatedFormData.splice(delId, 1);
      setOrderDetails(updatedFormData);
    }

    toggle();
  };

  const handleSalesItemData=(data)=>{
    setOrderDetails(data);
  };

  const handleOrderFormSubmit = async (formData) => {
    console.log(formData);
    formData.order_images = orderImages;
    formData.order_videos = orderVideos;
    formData.order_voices = orderVoices;
    console.log(editIndex);
    if (editIndex !== null) {
      const updatedFormData = orderDetails;
      updatedFormData[editIndex] = formData;
      setOrderDetails(updatedFormData);
    } else {
      setOrderDetails((prevData) => [...prevData, formData]);
    }
    SetOrderImages([]);
    SetOrderVideos([]);
    SetOrderVoices([]);
  };

  useEffect(() => {
    if (tagCode && tagCode.length > 5) {
      handleTagSearch();
    }
  }, [tagCode]);

  useEffect(() => {
    if (oldTagCode && oldTagCode.length > 5) {
      handleTagSearch();
    }
  }, [oldTagCode]);

  const handleTagSearch = async () => {
    const tagDetails = orderDetails?.filter(
      (result) => result.tag_code === tagCode
    );

    if (tagCode === "" && oldTagCode === "") {
      toastfunc("Please Enter The Tag Code");
    } else if (idBranch === "") {
      toastfunc("Please Select Branch");
    } else if (tagDetails.length > 0) {
      toastfunc("Tag Code already exists");
    } else {
      getTagDetails({
        tagCode: tagCode,
        oldTagCode: oldTagCode,
        idBranch: idBranch,
      });
    }
  };

  const getTagDetails = async (requestData) => {
    try {
      let tagDetails = [];
      // let requestData = { tagCode: tagCode, idBranch: idBranch };
      let response = {};
      response = await dispatch(getTagDetailsByCode(requestData)).unwrap();
      let tagResult = {
        ...response,
        id_product: response.tag_product_id,
        id_design: response.tag_design_id,
        id_purity: response.tag_purity_id,
        id_sub_design: response.tag_sub_design_id,
        pieces: response.tag_pcs,
        gross_wt: response.tag_gwt,
        net_wt: response.tag_nwt,
        less_wt: response.tag_lwt,
        stone_wt: response.tag_stn_wt,
        dia_wt: response.tag_dia_wt,
        uom_id: response.tag_uom_id,
        other_metal_wt: response.tag_other_metal_wt,
        wastage_weight: response.tag_wastage_wt,
        wastage_percentage: response.tag_wastage_percentage,
        mc_value: response.tag_mc_value,
        mc_type: response.tag_mc_type,
      };
      tagDetails.push(tagResult);
      console.log(tagDetails);
      setSalesItemDetails(tagDetails);
      setTagCode("");
      // let initialState = setTagDetails(response);
      // setFormValues(initialState);
    } catch (error) {
      // console.error(error);
      toastfunc("Tag No not found");
    }
  };

  const setSalesItemDetails = (item_details) => {
    item_details.forEach((response) => {
      if (response.cat_id && response.id_purity && response.id_product) {
        const estTagDetails = orderDetails?.filter(
          (result) => result.tagCode === response.tag_code
        );
        let itemExists = false;
        if (estTagDetails.length > 0) {
          itemExists = true;
          toastfunc("Tag No already Exists");
        }
        if (!itemExists) {
          let initialState = setSalesItem(
            response,
            categoryList,
            metalPurityRateList,
            metalRateInfo,
            activeProductList,
            catPurityRateList,
            settings,
            activeDiamondRateList
          );

          setOrderDetails((prevData) => [...prevData, initialState]);
          
          // console.log(orderDetails);
        }
      }
    });
  };

  useEffect(() => {
    const totalSalesAmount = [...orderDetails].reduce((sum, item) => parseFloat(sum) + parseFloat(item.itemCost), 0);
    const totalPurchaseAmount = purchaseItemData.reduce((sum, item) => parseFloat(sum) + parseFloat(item.itemCost), 0);
    const totalBillAmount = parseFloat(parseFloat(totalSalesAmount) - parseFloat(totalPurchaseAmount)).toFixed(2);
    setTotalAmountReceived(parseFloat(totalBillAmount).toFixed(2));
    setTotalBillAmount(totalBillAmount);
    console.log('totalSalesAmount',totalSalesAmount);
  },[orderDetails,purchaseItemData]);

  
    
    const handleEstNoSearch = () => {
      if (estNo === "") {
        toastfunc("Please Enter the Est No");
      } else if (idBranch === "") {
        toastfunc("Please Select the Branch");
      } else {
        getEstimationDetails();
      }
    };
    const getEstimationDetails = async () => {
      try {
        let requestData = { est_no: estNo, id_branch: idBranch };
        const estimationDetails = await dispatch(getEstimationDetailsByNo(requestData)).unwrap();
        const item_details = estimationDetails.sales_details;
        const purchase_details = estimationDetails.purchase_details;
        const return_details = estimationDetails.return_details;
       
        if (item_details.length > 0) {
          item_details.forEach((response) => {
            if (response.cat_id && response.id_purity && response.id_product) {
  
              const estItemDetails = orderDetails?.filter((result) => result.est_item_id === response.est_item_id && result.est_item_id);
              const estTagDetails = orderDetails?.filter((result) => result.tagId === response.tag_id);
              let itemExists = false;
              if (estItemDetails.length > 0) {
                itemExists = true;
                toastfunc("Estimation already Exists");
              } else if ( response.tag_id != null && estTagDetails.length > 0) {
                itemExists = true;
                toastfunc("Tag No already Exists");
              }
              if(!itemExists){
                let initialState = setSalesItem(
                  response,
                  categoryList,
                  metalPurityRateList,
                  metalRateInfo,
                  activeProductList,
                  catPurityRateList,
                  settings,
                  activeDiamondRateList,
                );
                setOrderDetails((prevData) => [...prevData, initialState]);
              }
            }
          });
        }
        if (purchase_details.length > 0) {
          purchase_details.forEach((response) => {
            // let initialState = setPurchaseItemDetails(response);
            // setPurchaseItemData((prevData) => [...prevData, initialState]);
            let itemExists = false;
            const estItemDetails = purchaseItemData?.filter(
              (result) => result.est_old_metal_item_id === response.est_old_metal_item_id
            );
            if (estItemDetails.length > 0) {
              itemExists = true;
              toastfunc("Estimation already Exists");
            }
            if (!itemExists) {
              let initialState = setPurchaseItemDetails(response);
              setPurchaseItemData((prevData) => [...prevData, initialState]);
            }
          });
        }
  
  
      } catch (error) {
        console.log(error);
      }
    };

    const handlePurchaseItem = (formData) => {
      const newItem = {
        ...formData,
      };
      if (editIndex !== "" && editIndex !== null) {
        const updatedFormData = [...purchaseItemData];
        updatedFormData[editIndex] = newItem;
        setPurchaseItemData(updatedFormData);
      } else {
        setPurchaseItemData((prevData) => [...prevData, newItem]);
      }
    };

      const handleInputChange = (field, value) => {
        if (field === "totalAmountReceived") {
          if (parseFloat(value) > parseFloat(totalBillAmount)) {
            toastfunc("Received Amount Is Exceed than the Bill Amount");
            setTotalAmountReceived(totalBillAmount);
            setTotalDiscount(0);
          }  else {
            let discount = parseFloat(parseFloat(totalBillAmount) - parseFloat(value)).toFixed(2);
            setTotalDiscount(discount);
            setTotalAmountReceived(value);
            setNetAmount(value);
          }
        }
        if (field === "paymentAmount") {
            setPaymentAmount(value);
        }
        if (field === "totalDiscount") {
          if (value < 0) {
            setTotalDiscount(0);
          } else {
            let netAmount = parseFloat(parseFloat(totalBillAmount) - parseFloat(value)).toFixed(2);
            setTotalDiscount(value);
            setTotalAmountReceived(netAmount);
            setNetAmount(netAmount);
          }
        }
      };

     const calculateDiscountAmount = () => {
          const salesAmount = orderDetails.reduce((sum, item) => sum + parseFloat(item.itemCost || 0), 0);
          let updateSalesItemData = calculateItemDiscountAmount(orderDetails, totalDiscount, activeProductList, salesAmount);
          let minSaleAmount =0
          let  saleAmount = 0;
          updateSalesItemData.forEach(val => {
            console.log('val',val)
            saleAmount =  parseFloat(saleAmount) +parseFloat(isUndefined(val.itemCost))
            console.log('saleAmount',saleAmount);
            console.log('itemCost',val.itemCost);
          })
          if (parseFloat(saleAmount) >= parseFloat(minSaleAmount)) {
            setOrderDetails(updateSalesItemData);
          } else {
            toastfunc("Discount Cannot be Applied Bellow Minimum Sale Amount"+ minSaleAmount);
            
            handleInputChange("totalDiscount", 0);
            updateSalesItemData = calculateItemDiscountAmount(orderDetails, 0, activeProductList, salesAmount);
            setOrderDetails(updateSalesItemData);
          }
        };
  
    const handlePurchaseEdit = (index) => {
      setPurchaseFormValues({ ...purchaseItemData[index], editIndex: index });
      setEditIndex(index);
    };

  const handlePurchaseDelete = (index) => {
    SetModalActionName("delete");
    SetDeleteModal(true);
    SetDelId(index);
    SetDelItem("purchase");
  };

  const handlePurchaseAddPreview = () => {
    if (purchaseFormRef.current) {
      purchaseFormRef.current.submit();
    } else {
      console.log("purchaseFormRef.current is null");
    }
    setEditIndex(null);
  };

  const handlePaymentData = (data) => {
    setPaymentModeData(data);
    // const totalPaidAmount = data.reduce((sum, item) => {
    //   return sum + parseFloat(item.payment_amount || 0);
    // }, 0);
    // setPaymentAmount(totalPaidAmount);
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
    SetCustomer,
    customerSearch,
    customer,
    SetCustomerSearch,
    orderType,
    setOrderType,
    tagCode,
    setTagCode,
    oldTagCode,
    setOldTagCode,
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
    purchaseFormRef,
    orderImages,
    SetOrderImages,
    orderVideos,
    SetOrderVideos,
    orderVoices,
    SetOrderVoices,
    daysOfPayment,
    setDaysOfPayment,
    paymentDate,
    setPaymentDate,
    handleTagSearch,
    handleDropChange,
    handleSalesItemData,
    estNo,
    setEstNo,
    handleEstNoSearch,
    purchaseFormValues,
    handlePurchaseItem,
    setTotalDiscount,
    totalDiscount,
    totalAmountReceived,
    handleInputChange,
    calculateDiscountAmount,
    purchaseItemData,
    purchaseColumns,
    handlePurchaseEdit,
    handlePurchaseDelete,
    handlePurchaseAddPreview,
    handlePaymentData,
    totalBillAmount,
    netAmount,
    paymentAmount,
    setPaymentAmount,
    paymentModeData,
    employee,
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
