import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Icon, Row } from "../../Component";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Label,
  Button,
} from "reactstrap";
import {
  getNBType,
  getPayDevices,
  getPaymentModes,
} from "../../../redux/thunks/payment";
import { getAllBank } from "../../../redux/thunks/retailMaster";
import getCurrencySymbol from "../moneyFormat/currencySymbol";
import {
  InputFieldWithDropdown,
  TextInputField,
} from "../../form-control/InputGroup";
import { useForm } from "react-hook-form";
import { SelectDropdown } from "../../filters/retailFilters";
import { toastfunc, toastsuccess } from "../../sds-toast-style/toast-style";
import {
  getAdvanceDetails,
  getChitDetails,
  getDepositDetails,
} from "../../../redux/thunks/billing";
import "../../../assets/css/datatable.css";
import moment from "moment";
import { useHotkeys } from "react-hotkeys-hook";
import { useBillSettingContext } from "../../../contexts/BillSettingContext";
import { getVoucherIssueDetails } from "../../../redux/thunks/promotionManagement";
import CurrencyDisplay from "../moneyFormat/moneyFormat";
import { isUndefined } from "../calculations/ErpCalculations";

const PaymentModeComponent = forwardRef(
  (
    {
      onUpdateFormData,
      customer,
      isAdvanceAdjustment,
      isChitAdjustment,
      isGift,
      isLoyalty,
      isDepositAdjustment,
      totalVA,
      totalMC,
      totalWeight,
      metalPurityRateList,
      metalRateInfo,
      salesItemData,
      totalSalesAmount,
      initialData = [],
      ...props
    },
    ref
  ) => {
    const dispatch = useDispatch();
    const [billTypeTab, setBillTypeTab] = useState(1);
    const [advanceTab, setAdvanceTab] = useState("");
    const { billSettingType } = useBillSettingContext();
    const { paymentModes } = useSelector(
      (state) => state.paymentOptionsreducer
    );
    const { userInfo } = useSelector((state) => state.authUserReducer);
    const { paymentDevices } = useSelector(
      (state) => state.paymentOptionsreducer
    );
    const { NBtypes } = useSelector((state) => state.paymentOptionsreducer);
    const { bankList } = useSelector((state) => state.bankReducer);
    const { searchVoucherInfo } = useSelector(
      (state) => state.promotionManagementVoucherIssueReducer
    );

    const { catPurityRateList } = useSelector(
      (state) => state.metalPurityRateReducer
    );

    const inputRefs = useRef({});

    const [inputValues, setInputValues] = useState({});
    const [sch_account, set_sch_account] = useState();
    const [customerAdvanceDetails, setCustomerAdvanceDetails] = useState([]);
    const [customerDepositDetails, setCustomerDepositDetails] = useState([]);
    const [VoucherDetails, setVoucherDetails] = useState([]);

    const [customerChitDetails, setCustomerChitDetails] = useState([]);
    const [chitUtilized, setChitUtilized] = useState([]);
    const [utilized, setUtilizedDetails] = useState([]);
    const [depositUtilized, setDepositUtilizedDetails] = useState([]);

    const [gifts, setGifts] = useState("");

    const [totalAmount, setTotalAmount] = useState(0);

    const [loyalty, setLoyalty] = useState("");
    const [loyaltyDetails, setLoyaltyDetails] = useState([]);

    let deviceOptions = [];
    let netBankingOptions = [];
    let bankingOptions = [];
    if (paymentDevices.length > 0) {
      deviceOptions = paymentDevices.map((val) => ({
        value: val.id_device,
        label: val.device_name,
      }));
    }
    if (bankList?.rows?.length > 0) {
      bankingOptions = bankList?.rows.map((val) => ({
        value: val.id_bank,
        label: val.bank_name,
      }));
    }
    if (NBtypes.length > 0) {
      netBankingOptions = NBtypes.map((val) => ({
        value: val.id,
        label: val.name,
      }));
    }
    const [initialPaymentData, setInitialPaymentData] = useState([]);
    const [formData, setFormData] = useState([]);

    const {
      register,
      formState: { errors },
      clearErrors,
      setValue,
      watch,
      reset,
    } = useForm();
    const cardTypeArr = [
      {
        label: "Credit Card",
        value: 1,
      },
      {
        label: "Debit Card",
        value: 2,
        isDefault: true,
      },
    ];
    useEffect(() => {
      dispatch(getPaymentModes());
      dispatch(getAllBank());
      dispatch(getPayDevices());
      dispatch(getNBType());
    }, [dispatch]);

    useImperativeHandle(ref, () => ({
      resetForm: () => {
        resetForm();
      },
    }));

    const resetForm = () => {
      initialPaymentData.forEach((data) => {
        Object.keys(data).forEach((key) => {
          setValue(`${data.short_code}_${key}`, "");
        });
      });
      setInitialPaymentData(initialPaymentModeData());
      setCustomerAdvanceDetails([]);
      setCustomerDepositDetails([]);
      setVoucherDetails([]);
      setLoyaltyDetails([]);
      setCustomerChitDetails([]);
      setChitUtilized([]);
      setUtilizedDetails([]);
      setDepositUtilizedDetails([]);
      reset();
    };

    useEffect(() => {
      if (paymentModes.length > 0) {
        const initialFormData = paymentModes.map((mode) => ({
          id_mode: mode.id_mode,
          payment_amount: 0,
          card_no: "",
          card_holder: "",
          payment_ref_number: "",
          card_type: 2,
          id_nb_type: null,
          id_bank: null,
          id_pay_device: null,
        }));
        setFormData(initialFormData);
        // Reset form with initial values
        initialFormData.forEach((data) => {
          Object.keys(data).forEach((key) => {
            setValue(key, data[key]);
          });
        });
      }
    }, [paymentModes, setValue]);

    useEffect(() => {
      if (paymentModes.length > 0) {
        let paymentData = initialPaymentModeData();
        if (initialData.length > 0) {
          const initialDataMap = new Map(
            initialData.map((item) => [item.payment_mode, item])
          );

          paymentData.forEach((element) => {
            const pay = initialDataMap.get(element.id_mode); // Use Map for efficient lookup
            if (pay) {
              Object.assign(element, {
                payment_amount: pay.payment_amount,
                card_no: pay.card_no,
                card_holder: pay.card_holder,
                payment_ref_number: pay.payment_ref_number,
                card_type: pay.card_type,
                id_nb_type: pay.NB_type,
                id_bank: pay.id_bank,
                id_pay_device: pay.id_pay_device,
                ref_id: "",
              });
            }
          });
        }
        setInitialPaymentData(paymentData);
      }
    }, [paymentModes]);

    useEffect(() => {
      if (initialData.length > 0) {
        let paymentData = initialPaymentModeData();

        const initialDataMap = new Map(
          initialData.map((item) => [item.payment_mode, item])
        );

        paymentData.forEach((element) => {
          const pay = initialDataMap.get(element.id_mode); // Use Map for efficient lookup
          if (pay) {
            Object.assign(element, {
              payment_amount: pay.payment_amount,
              card_no: pay.card_no,
              card_holder: pay.card_holder,
              payment_ref_number: pay.payment_ref_number,
              card_type: pay.card_type,
              id_nb_type: pay.NB_type,
              id_bank: pay.id_bank,
              id_pay_device: pay.id_pay_device,
              ref_id: "",
            });
          }
        });
        paymentData.forEach((element) => {
          Object.keys(element).forEach((key) => {
            setValue(`${element.short_code}_${key}`, element[key]);
          });
        });
        onUpdateFormData(paymentData);
        setInitialPaymentData(paymentData);
      }
    }, [initialData, paymentModes]);

    // useEffect(() => {

    // }, [initialPaymentData]);

    const initialPaymentModeData = () => {
      const paymentData = paymentModes.map((mode) => ({
        id_mode: mode.id_mode,
        mode_name: mode.mode_name,
        short_code: mode.short_code,
        payment_amount: 0,
        card_no: "",
        card_holder: "",
        payment_ref_number: "",
        card_type: 2,
        id_nb_type: "",
        id_bank: "",
        id_pay_device: "",
      }));
      return paymentData;
    };

    // const handleInputChange = (id_mode, field, value) => {
    //   initialPaymentData?.forEach((element) => {
    //     if (element.id_mode === id_mode) {
    //       element[field] = value;
    //     }
    //   });
    //   onUpdateFormData(initialPaymentData);
    // };

    const handleInputChange = (id_mode, field, value) => {
      const updatedPaymentData = [...initialPaymentData];

      // Update current payment mode value
      updatedPaymentData.forEach((element) => {
        if (element.id_mode === id_mode) {
          element[field] = parseFloat(value) || 0;
        }
      });

      if (parseFloat(props?.initialAmountReceived) > 0) {
        // Find all other payment modes *except* the first one
        const otherAmounts = updatedPaymentData
          .slice(1) // Exclude first mode
          .reduce((total, item) => {
            return total + (parseFloat(item.payment_amount) || 0);
          }, 0);

        const voucherTotal = VoucherDetails.reduce(
          (total, item) => total + parseFloat(item?.amount || 0),
          0
        );

        const AdvanceTotal = Object.values(inputValues).reduce(
          (sum, val) => sum + Number(val),
          0
        );

        const chitTotal = customerChitDetails.reduce(
          (total, item) => total + parseFloat(item.amount || 0),
          0
        );

        console.log(
          "otherAmounts",
          voucherTotal,
          VoucherDetails,
          AdvanceTotal,
          inputValues,
          chitTotal,
          customerChitDetails
        );

        // Calculate remaining for the first mode
        const remaining =
          parseFloat(props?.initialAmountReceived) -
          otherAmounts -
          voucherTotal -
          AdvanceTotal -
          chitTotal;
        updatedPaymentData[0].payment_amount = remaining >= 0 ? remaining : 0;

        // Update first mode's form value too
        setValue(
          `${updatedPaymentData[0].short_code}_payment_amount`,
          updatedPaymentData[0].payment_amount
        );
      }
      // console.log(updatedPaymentData);

      onUpdateFormData(updatedPaymentData);
    };

    const handelChitChange = (index, field, value) => {
      let chits = customerChitDetails;
      let chit = chits[index];
      chit.isChecked = value;
      chits[index] = chit;
      setCustomerChitDetails(chits);
      let adjustedChit = customerChitDetails.filter(
        (item) => item.isChecked === true
      );
      setChitUtilized(adjustedChit);
    };

    const handelDepositChange = (index, field, value) => {
      let deposits = customerDepositDetails;
      let deposit = deposits[index];
      deposit.isChecked = value;
      deposits[index] = deposit;
      setCustomerDepositDetails(deposits);
      let adjusteDeposit = customerDepositDetails?.filter(
        (item) => item.isChecked === true
      );
      console.log(adjusteDeposit);

      setDepositUtilizedDetails(adjusteDeposit);
    };

    const handleAdvanceInputChange = (
      idx,
      event,
      actualAmount,
      id_issue_receipt
    ) => {
      let value = event.target.value;
      if (value < 0) {
        toastfunc("Please enter the Valid Amount");
        value = actualAmount;
      } else {
        if (parseFloat(actualAmount) < parseFloat(value)) {
          toastfunc("Adjustment Amount is exceed than the Actual Amount");
          value = actualAmount;
        }
      }
      setInputValues((prevState) => ({
        ...prevState,
        [idx]: value,
      }));

      customerAdvanceDetails.forEach((item) => {
        if (item.id_issue_receipt === id_issue_receipt) {
          item.utilized_amount = value;
        }
      });
      const utilizedDetails = customerAdvanceDetails.filter(
        (item) =>
          item?.utilized_amount !== "" && parseFloat(item?.utilized_amount) > 0
      );
      setUtilizedDetails(utilizedDetails);
    };

    const handleChitAdjChange = (index, field, value) => {
      let currentRowItemDetails = customerChitDetails[index];

      setCustomerChitDetails((prevValues) => {
        const updatedValues = [...prevValues];
        const updatedObject = { ...updatedValues[index] };
        updatedObject[field] = value;
        updatedValues[index] = updatedObject;
        return updatedValues;
      });
    };

    useEffect(() => {
      if (userInfo?.settings?.add_chit_adj_manually == "1") {
        const updatedChitItemDetails = customerChitDetails.map((item) => {
          let amount = parseFloat(
            parseFloat(
              (parseFloat(item?.closing_weight) +
                parseFloat(isUndefined(item?.va))) *
                parseFloat(item?.rate_per_gram)
            ) + parseFloat(isUndefined(item?.mc))
          ).toFixed(2);
          return {
            ...item,
            amount: isNaN(parseFloat(amount)) ? 0 : parseFloat(amount),
          };
        });
        if (
          JSON.stringify(customerChitDetails) !==
          JSON.stringify(updatedChitItemDetails)
        ) {
          setCustomerChitDetails(updatedChitItemDetails);
        }
        setChitUtilized(customerChitDetails);
      } else if (userInfo?.settings?.add_chit_adj_manually == "2") {
        // const updatedChitItemDetails = customerChitDetails.map((item) => {
        //   // let amount = parseFloat(
        //   //   parseFloat(
        //   //     (parseFloat(item?.closing_weight) + parseFloat(isUndefined(item?.va))) *
        //   //       parseFloat(item?.rate_per_gram)
        //   //   ) + parseFloat(isUndefined(item?.mc))
        //   // ).toFixed(2);
        //   let weight = parseFloat(parseFloat(item?.amount)/parseFloat(item?.rate_per_gram)).toFixed(3)
        //   return {
        //     ...item,
        //     closing_weight: isNaN(parseFloat(weight)) ? 0 : parseFloat(weight),
        //   };
        // });
        // if (
        //   JSON.stringify(customerChitDetails) !==
        //   JSON.stringify(updatedChitItemDetails)
        // ) {
        //   setCustomerChitDetails(updatedChitItemDetails);
        // }
        setChitUtilized(customerChitDetails);
      }
    }, [customerChitDetails]);

    useEffect(() => {
      if (isAdvanceAdjustment) {
        props?.onUpdateAdvanceFormData(utilized);
      }
    }, [props, utilized]);

    useEffect(() => {
      if (isChitAdjustment) {
        props?.onUpdateChitFormData(chitUtilized);
      }
    }, [props, chitUtilized]);

    useEffect(() => {
      if (isGift) {
        props?.onUpdateGiftFormData(VoucherDetails);
      }
    }, [props, VoucherDetails]);

    useEffect(() => {
      if (isLoyalty) {
        props?.onUpdateLoyaltyFormData(loyaltyDetails);
      }
    }, [props, loyaltyDetails]);

    useEffect(() => {
      if (isDepositAdjustment) {
        props?.onUpdateDepositFormData(depositUtilized);
      }
    }, [props, depositUtilized]);

    useEffect(() => {
      if (parseFloat(props?.initialAmountReceived) > 0) {
        const updatedPaymentData = [...initialPaymentData];
        // Find all other payment modes *except* the first one
        const otherAmounts = updatedPaymentData
          .slice(1) // Exclude first mode
          .reduce((total, item) => {
            return total + (parseFloat(item.payment_amount) || 0);
          }, 0);

        const voucherTotal = VoucherDetails.reduce(
          (total, item) => total + parseFloat(item?.amount || 0),
          0
        );

        // const AdvanceTotal = inputValues?.reduce(
        //   (total, item) => total + parseFloat(item || 0),
        //   0
        // );
        const AdvanceTotal = Object.values(inputValues).reduce(
          (sum, val) => sum + Number(val),
          0
        );

        const chitTotal = customerChitDetails.reduce(
          (total, item) => total + parseFloat(item.amount || 0),
          0
        );

        console.log(
          "otherAmounts",
          voucherTotal,
          VoucherDetails,
          AdvanceTotal,
          inputValues,
          chitTotal,
          customerChitDetails
        );

        // Calculate remaining for the first mode
        const remaining =
          parseFloat(props?.initialAmountReceived) -
          otherAmounts -
          voucherTotal -
          AdvanceTotal -
          chitTotal;
        updatedPaymentData[0].payment_amount = remaining >= 0 ? remaining : 0;

        // Update first mode's form value too
        setValue(
          `${updatedPaymentData[0].short_code}_payment_amount`,
          updatedPaymentData[0].payment_amount
        );
        onUpdateFormData(updatedPaymentData);
      }
    }, [
      VoucherDetails,
      customerDepositDetails,
      customerAdvanceDetails,
      customerChitDetails,
      inputValues,
      props?.initialAmountReceived,
    ]);

    useEffect(() => {
      if (customer) {
        const getCustomerAdvance = async () => {
          try {
            let postData = {
              id_customer: customer,
              settings_bill_type: billSettingType,
            };
            const advanceDetails = await dispatch(
              getAdvanceDetails(postData)
            ).unwrap();
            const updatedAdvanceDetails = advanceDetails?.data?.map((item) => ({
              ...item,
              utilized_amount: 0,
            }));
            setCustomerAdvanceDetails(updatedAdvanceDetails);
          } catch (error) {
            console.error("Error fetching financial years:", error);
          }
        };
        getCustomerAdvance(); // Call the async function inside useEffect
      } else {
        setCustomerAdvanceDetails([]);
        setUtilizedDetails([]);
      }
    }, [dispatch, customer, billSettingType]);

    const getRatePerGram = () => {
      let metalId = props?.metalId;
      let catid = 0;
      let id_purity = 0;
      let rate_per_gram = 0;

      if (metalId == 1) {
        catid = userInfo?.settings?.chit_gold_cat_id;
        id_purity = userInfo?.settings?.chit_gold_purity_id;
      } else {
        catid = userInfo?.settings?.chit_silver_cat_id;
        id_purity = userInfo?.settings?.chit_silver_purity_id;
      }
      if (parseInt(userInfo?.settings?.metal_rate_type) == 1) {
        const rateDetails = catPurityRateList?.find(
          (val) => val.category == catid && val.purity == id_purity
        );
        rate_per_gram = isNaN(rateDetails?.rate_per_gram)
          ? 0
          : rateDetails?.rate_per_gram;
      } else if (parseInt(userInfo?.settings?.metal_rate_type) == 2) {
        const rateDetails = metalPurityRateList?.find(
          (val) => val.id_metal == metalId && val.id_purity == id_purity
        );
        let rate_field = rateDetails?.rate_field;
        if (rate_field) {
          rate_per_gram = metalRates[rate_field];
        }
      }
      return rate_per_gram;
    };

    useEffect(() => {
      if (customer) {
        const getCustomerChit = async () => {
          try {
            let postData = { id_customer: customer };
            if (
              userInfo?.settings?.add_chit_adj_manually == "1" ||
              userInfo?.settings?.add_chit_adj_manually == "2"
            ) {
              let rate_per_gram = getRatePerGram();

              let updatedChitDetails = {
                scheme_acc_number: "",
                rate_per_gram: rate_per_gram,
                closing_weight: "0",
                amount: "0",
                va: "0",
                mc: "0",
              };
              setCustomerChitDetails([updatedChitDetails]);
            } else {
              const chitDetails = await dispatch(
                getChitDetails(postData)
              ).unwrap();
              const updatedChitDetails = chitDetails?.data.map((item) => {
                if (parseFloat(item?.closing_weight) > 0.0) {
                  if (parseFloat(item?.closing_weight) > totalWeight) {
                    const rateDetails = metalPurityRateList?.find(
                      (val) =>
                        val.id_metal == item.id_metal &&
                        val.id_purity == item?.id_purity
                    );
                    const todaysRate = parseFloat(
                      metalRateInfo[rateDetails?.rate_field]
                    );
                    const closingWeight = parseFloat(item.closing_weight);
                    const wastageBenefit = parseFloat(item.wastage_benefit);
                    const mcBenefit = parseFloat(item.mc_benefit);

                    // Calculate VA and MC based on the given formula
                    const VA = (
                      ((totalVA / totalWeight) *
                        closingWeight *
                        wastageBenefit) /
                      100
                    ).toFixed(2);
                    const MC = (
                      ((totalMC / totalWeight) * closingWeight * mcBenefit) /
                      100
                    ).toFixed(2);

                    // Calculate the amount
                    const amount = (
                      (closingWeight + parseFloat(VA)) * todaysRate +
                      parseFloat(MC)
                    ).toFixed(2);

                    return {
                      ...item,
                      isChecked: false,
                      rate_per_gram: todaysRate,
                      va: isNaN(parseFloat(VA)) ? 0 : parseFloat(VA),
                      mc: isNaN(parseFloat(MC)) ? 0 : parseFloat(MC),
                      amount: isNaN(parseFloat(amount))
                        ? 0
                        : parseFloat(amount),
                    };
                  } else {
                    // const rateDetails = metalPurityRateList?.find(
                    //   (val) => val.id_metal == item.id_metal && val.id_purity == item?.id_purity
                    // );
                    let rate_field = "";
                    if (item.id_metal == 1) {
                      rate_field = "gold_22ct";
                    } else if (item.id_metal == 2) {
                      rate_field = "silver_G";
                    }
                    const todaysRate = parseFloat(metalRateInfo[rate_field]);
                    const closingWeight = parseFloat(item.closing_weight);
                    const wastageBenefit = parseFloat(item.wastage_benefit);
                    const mcBenefit = parseFloat(item.mc_benefit);

                    // Calculate VA and MC based on the given formula
                    const VA = ((totalVA * wastageBenefit) / 100).toFixed(2);
                    const MC = ((totalMC * mcBenefit) / 100).toFixed(2);

                    // Calculate the amount
                    const amount = (
                      (closingWeight + parseFloat(VA)) * todaysRate +
                      parseFloat(MC)
                    ).toFixed(2);

                    return {
                      ...item,
                      isChecked: false,
                      rate_per_gram: todaysRate,
                      va: parseFloat(VA),
                      mc: parseFloat(MC),
                      amount: parseFloat(amount),
                    };
                  }
                }
                return {
                  ...item,
                  isChecked: false,
                  rate_per_gram: 0,
                  va: 0,
                  mc: 0,
                  amount: parseFloat(item?.closing_amount),
                };
              });
              setCustomerChitDetails((prevState) => {
                return prevState.length === 0
                  ? updatedChitDetails
                  : [...prevState, ...updatedChitDetails];
              });
            }
          } catch (error) {
            console.error("Error fetching Chit Details:", error);
          }
        };
        getCustomerChit(); // Call the async function inside useEffect
      } else {
        setCustomerChitDetails([]);
        setChitUtilized([]);
      }
    }, [
      dispatch,
      customer,
      totalMC,
      metalPurityRateList,
      totalVA,
      totalWeight,
    ]);

    const handleSearchSchemeAccount = async () => {
      try {
        let postData = { id_sch_account: sch_account };
        const chitDetails = await dispatch(getChitDetails(postData)).unwrap();

        const updatedChitDetails = chitDetails?.data.map((item) => {
          if (parseFloat(item?.closing_weight) > 0.0) {
            if (parseFloat(item?.closing_weight) > totalWeight) {
              const rateDetails = metalPurityRateList?.find(
                (val) =>
                  val.id_metal == item.id_metal &&
                  val.id_purity == item?.id_purity
              );
              const todaysRate = parseFloat(
                metalRateInfo[rateDetails?.rate_field]
              );
              const closingWeight = parseFloat(item.closing_weight);
              const wastageBenefit = parseFloat(item.wastage_benefit);
              const mcBenefit = parseFloat(item.mc_benefit);

              const VA = (
                ((totalVA / totalWeight) * closingWeight * wastageBenefit) /
                100
              ).toFixed(2);
              const MC = (
                ((totalMC / totalWeight) * closingWeight * mcBenefit) /
                100
              ).toFixed(2);
              const amount = (
                (closingWeight + parseFloat(VA)) * todaysRate +
                parseFloat(MC)
              ).toFixed(2);

              return {
                ...item,
                isChecked: false,
                rate_per_gram: todaysRate,
                va: isNaN(parseFloat(VA)) ? 0 : parseFloat(VA),
                mc: isNaN(parseFloat(MC)) ? 0 : parseFloat(MC),
                amount: isNaN(parseFloat(amount)) ? 0 : parseFloat(amount),
              };
            } else {
              let rate_field = "";
              if (item.id_metal == 1) {
                rate_field = "gold_22ct";
              } else if (item.id_metal == 2) {
                rate_field = "silver_G";
              }
              const todaysRate = parseFloat(metalRateInfo[rate_field]);
              const closingWeight = parseFloat(item.closing_weight);
              const wastageBenefit = parseFloat(item.wastage_benefit);
              const mcBenefit = parseFloat(item.mc_benefit);

              const VA = ((totalVA * wastageBenefit) / 100).toFixed(2);
              const MC = ((totalMC * mcBenefit) / 100).toFixed(2);
              const amount = (
                (closingWeight + parseFloat(VA)) * todaysRate +
                parseFloat(MC)
              ).toFixed(2);

              return {
                ...item,
                isChecked: false,
                rate_per_gram: todaysRate,
                va: parseFloat(VA),
                mc: parseFloat(MC),
                amount: parseFloat(amount),
              };
            }
          }
          return {
            ...item,
            isChecked: false,
            rate_per_gram: 0,
            va: 0,
            mc: 0,
            amount: parseFloat(item?.closing_amount),
          };
        });

        setCustomerChitDetails((prevState) => {
          return prevState.length === 0
            ? updatedChitDetails
            : [...prevState, ...updatedChitDetails];
        });
      } catch (error) {
        console.error("Error fetching Chit Details:", error);
      }
    };

    // useEffect(() => {
    //   if (customer) {
    //     const getCustomerDeposit = async () => {
    //       try {
    //         let postData = { id_customer: customer };
    //         const depositDetails = await dispatch(
    //           getDepositDetails(postData)
    //         ).unwrap();

    //         const updatedDepositDetails = depositDetails?.data.map((item) => {
    //           return {
    //             ...item,
    //             isChecked: false,

    //             deposit_amount: parseFloat(
    //               parseFloat(item?.deposit_weight) *
    //                 parseFloat(metalRateInfo["gold_22ct"])
    //             ).toFixed(2),
    //           };
    //         });
    //         setCustomerDepositDetails(updatedDepositDetails);
    //       } catch (error) {
    //         console.error("Error fetching Deposit Details:", error);
    //       }
    //     };
    //     getCustomerDeposit(); // Call the async function inside useEffect
    //   } else {
    //     setCustomerDepositDetails([]);
    //     setDepositUtilizedDetails([]);
    //   }
    // }, [dispatch, customer]);

    useEffect(() => {
      if (customer) {
        const getCustomerDeposit = async () => {
          try {
            let postData = { id_customer: customer };
            const depositDetails = await dispatch(
              getDepositDetails(postData)
            ).unwrap();

            const updatedDepositDetails = depositDetails?.data.map((item) => {
              let depositAmount = null;

              if (item?.deposit_type === 2) {
                depositAmount = parseFloat(
                  parseFloat(item?.deposit_weight) *
                    parseFloat(metalRateInfo["gold_22ct"])
                ).toFixed(2);
              }

              if (item?.deposit_type === 1) {
                depositAmount = parseFloat(item?.deposit_amount).toFixed(2);
              }

              return {
                ...item,
                isChecked: false,
                deposit_amount: depositAmount,
              };
            });

            setCustomerDepositDetails(updatedDepositDetails);
          } catch (error) {
            console.error("Error fetching Deposit Details:", error);
          }
        };

        getCustomerDeposit();
      } else {
        setCustomerDepositDetails([]);
        setDepositUtilizedDetails([]);
      }
    }, [dispatch, customer]);

    useHotkeys(
      "f9",
      (event) => {
        event.preventDefault();
        setAdvanceTab("advance");
        setBillTypeTab("");
      },
      {
        enableOnFormTags: true, // Enable hotkeys inside input fields
        preventDefault: true, // Prevent default browser Save
      }
    );

    useHotkeys(
      "f10",
      (event) => {
        event.preventDefault();
        setAdvanceTab("deposit");
        setBillTypeTab("");
      },
      {
        enableOnFormTags: true, // Enable hotkeys inside input fields
        preventDefault: true, // Prevent default browser Save
      }
    );

    useHotkeys(
      "f11",
      (event) => {
        event.preventDefault();
        setAdvanceTab("chitAdj");
        setBillTypeTab("");
      },
      {
        enableOnFormTags: true, // Enable hotkeys inside input fields
        preventDefault: true, // Prevent default browser Save
      }
    );

    useHotkeys(
      "f12",
      (event) => {
        event.preventDefault();
        setAdvanceTab("gifts");
        setBillTypeTab("");
      },
      {
        enableOnFormTags: true, // Enable hotkeys inside input fields
        preventDefault: true, // Prevent default browser Save
      }
    );

    useHotkeys(
      "f5",
      (event) => {
        event.preventDefault();
        paymentModes?.forEach((item) => {
          if (item.short_code === "Csh") {
            setBillTypeTab(item.id_mode);
            const input = document.getElementById(
              item.short_code + "_payment_amount"
            );
            if (input) {
              input.select();
            }
            //  const input = inputRefs.current[item.short_code];
            //   if (input) {
            //     input.focus();
            //   }
          }
        });
      },
      {
        enableOnFormTags: true, // Enable hotkeys inside input fields
        preventDefault: true, // Prevent default browser Save
      }
    );
    useHotkeys(
      "f6",
      (event) => {
        event.preventDefault();
        paymentModes?.forEach((item) => {
          if (item.short_code === "CC") {
            setBillTypeTab(item.id_mode);
            const input = document.getElementById(
              item.short_code + "_payment_amount"
            );
            if (input) {
              input.select();
            }
          }
        });
      },
      {
        enableOnFormTags: true, // Enable hotkeys inside input fields
        preventDefault: true, // Prevent default browser Save
      }
    );
    useHotkeys(
      "f7",
      (event) => {
        event.preventDefault();
        paymentModes?.forEach((item) => {
          if (item.short_code === "UPI") {
            setBillTypeTab(item.id_mode);
            const input = document.getElementById(
              item.short_code + "_payment_amount"
            );
            if (input) {
              input.select();
            }
          }
        });
      },
      {
        enableOnFormTags: true, // Enable hotkeys inside input fields
        preventDefault: true, // Prevent default browser Save
      }
    );

    useHotkeys(
      "f8",
      (event) => {
        event.preventDefault();
        paymentModes?.forEach((item) => {
          if (item.short_code === "NB") {
            setBillTypeTab(item.id_mode);
            const input = document.getElementById(
              item.short_code + "_payment_amount"
            );
            if (input) {
              input.select();
            }
          }
        });
      },
      {
        enableOnFormTags: true, // Enable hotkeys inside input fields
        preventDefault: true, // Prevent default browser Save
      }
    );

    // useEffect(() => {
    //   if (props?.initialAmountReceived && initialPaymentData.length > 0) {
    //     // Find the first available payment mode and update its payment_amount
    //     const updatedPaymentData = [...initialPaymentData];
    //     updatedPaymentData[0].payment_amount = props.initialAmountReceived;

    //     setValue(
    //       `${updatedPaymentData[0].short_code}_payment_amount`,
    //       props.initialAmountReceived
    //     );
    //     handleInputChange(
    //       updatedPaymentData[0].id_mode,
    //       "payment_amount",
    //       props.initialAmountReceived
    //     );
    //   }
    // }, [props?.initialAmountReceived, initialPaymentData]);

    useEffect(() => {
      if (
        parseFloat(props?.initialAmountReceived) > 0 &&
        props?.initialAmountReceived &&
        initialPaymentData.length > 0
      ) {
        const updatedPaymentData = [...initialPaymentData];
        updatedPaymentData[0].payment_amount = props.initialAmountReceived;
        onUpdateFormData(updatedPaymentData);
        setValue(
          `${updatedPaymentData[0].short_code}_payment_amount`,
          props.initialAmountReceived
        );
      } else {
        if (
          initialPaymentData.length > 0 &&
          parseFloat(props?.initialAmountReceived) == 0
        ) {
          const updatedPaymentData = [...initialPaymentData];
          updatedPaymentData[0].payment_amount = props.initialAmountReceived;
          onUpdateFormData(updatedPaymentData);
          setValue(`${updatedPaymentData[0].short_code}_payment_amount`, 0);
        }
      }
    }, [props?.initialAmountReceived]);

    const handleVoucherSearch = async () => {
      if (gifts === "") {
        toastfunc("Please Enter the Voucher Code");
      } else {
        await dispatch(getVoucherIssueDetails({ coupon_code: gifts }));
        setGifts("");
        // if (searchVoucherInfo !== null) {
        //   // console.log(searchVoucherInfo);
        //   setVoucherDetails(prevDetails => [...prevDetails, searchVoucherInfo]);
        //   setGifts("")
        // }
      }
    };

    useEffect(() => {
      if (!searchVoucherInfo) return;

      const {
        voucher_code: code,
        conditions,
        product: voucherProducts,
        apply_on,
        status,
      } = searchVoucherInfo;

      if (!code) {
        toastfunc("Voucher missing its code – cannot add");
        return;
      }
      if (status === 2 || status === 3) {
        toastfunc("Coupon Already  Redeemed");
        return;
      }
      const minCondition = Number(conditions) || 0;
      const currentSales =
        Number(totalSalesAmount.toString().replace(/[^\d.-]/g, "")) || 0;
      setVoucherDetails((prev) => {
        if (prev.some((v) => v.voucher_code === code)) {
          toastfunc("Voucher already exists");
          return prev;
        }
        if (currentSales < minCondition) {
          toastfunc(
            `Sales amount must be at least ₹${minCondition} to apply this voucher.`
          );
          return prev;
        }
        if (apply_on === "2") {
          const isProductMatch = salesItemData?.some((item) =>
            voucherProducts.includes(item.selectedProduct)
          );
          if (!isProductMatch) {
            toastfunc("Voucher can only be applied to specific products.");
            return prev;
          }
        }
        toastsuccess("Voucher added successfully ");
        return [...prev, searchVoucherInfo];
      });
    }, [searchVoucherInfo, salesItemData?.length]);

    useEffect(() => {
      const total = VoucherDetails.reduce(
        (total, item) => total + parseFloat(item?.amount || 0),
        0
      );
      setTotalAmount(total);
    }, [VoucherDetails]);

    const handleDeleteVoucher = (voucherCode) => {
      setVoucherDetails((prevDetails) =>
        prevDetails.filter((item) => item.voucher_code !== voucherCode)
      );
      toastsuccess("Voucher removed successfully");
    };

    return (
      <Row>
        <div className="form-control-sm">
          <Nav tabs>
            {paymentModes?.map((item, idx) => {
              return (
                // <NavItem>
                //   <NavLink
                //     tag="a"
                //     href="#tab"
                //     className={billTypeTab === item.id_mode ? "active" : ""}
                //     onClick={(ev) => {
                //       ev.preventDefault();
                //       setBillTypeTab(item.id_mode);
                //       setAdvanceTab("");
                //     }}
                //   >
                //     {`${item.mode_name}(${item.shortcut})`}
                //   </NavLink>
                // </NavItem>
                <>
                  {item?.show_to_pay === true && (
                    <NavItem>
                      <NavLink
                        tag="a"
                        href="#tab"
                        className={billTypeTab === item.id_mode ? "active" : ""}
                        onClick={(ev) => {
                          ev.preventDefault();
                          setBillTypeTab(item.id_mode);
                          setAdvanceTab("");
                        }}
                      >
                        {`${item.mode_name}(${item.shortcut})`}
                      </NavLink>
                    </NavItem>
                  )}
                </>
              );
            })}
            {isAdvanceAdjustment && (
              <NavItem>
                <NavLink
                  tag="a"
                  href="#tab"
                  className={advanceTab === "advance" ? "active" : ""}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setAdvanceTab("advance");
                    setBillTypeTab("");
                  }}
                >
                  {"Advance Adj(F9)"}
                </NavLink>
              </NavItem>
            )}
            {isDepositAdjustment && (
              <NavItem>
                <NavLink
                  tag="a"
                  href="#tab"
                  className={advanceTab === "deposit" ? "active" : ""}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setAdvanceTab("deposit");
                    setBillTypeTab("");
                  }}
                >
                  {"Deposit(F10)"}
                </NavLink>
              </NavItem>
            )}
            {isChitAdjustment && (
              <NavItem>
                <NavLink
                  tag="a"
                  href="#tab"
                  className={advanceTab === "chitAdj" ? "active" : ""}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setAdvanceTab("chitAdj");
                    setBillTypeTab("");
                  }}
                >
                  {"Chit Adj(F11)"}
                </NavLink>
              </NavItem>
            )}

            {isGift && (
              <NavItem>
                <NavLink
                  tag="a"
                  href="#tab"
                  className={advanceTab === "gifts" ? "active" : ""}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setAdvanceTab("gifts");
                    setBillTypeTab("");
                  }}
                >
                  {"Gifts (F12)"}
                </NavLink>
              </NavItem>
            )}

            {isLoyalty && (
              <NavItem>
                <NavLink
                  tag="a"
                  href="#tab"
                  className={advanceTab === "loyalty" ? "active" : ""}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setAdvanceTab("loyalty");
                    setBillTypeTab("");
                  }}
                >
                  {"Loyalty"}
                </NavLink>
              </NavItem>
            )}
          </Nav>
          {paymentModes?.map((item, idx) => {
            return (
              <TabContent key={idx} activeTab={billTypeTab}>
                <TabPane tabId={item?.id_mode}>
                  <Row className="g-3">
                    <Col lg="6">
                      <Label>Amount</Label>
                      <div className="input-group">
                        <div className="input-group-append">
                          <span className="input-group-text">
                            {getCurrencySymbol(userInfo?.user?.currency_code)}
                          </span>
                        </div>
                        <input
                          id={`${item.short_code}_payment_amount`}
                          type="number"
                          className="form-control no-spinner"
                          value={item.payment_amount}
                          {...register(`${item.short_code}_payment_amount`)}
                          // ref={(el) => (inputRefs.current[item.short_code] = el)}
                          onChange={(e) => {
                            const value = e.target.value;
                            setValue(
                              `${item.short_code}_payment_amount`,
                              value
                            );
                            clearErrors(`payment_amount`);
                            handleInputChange(
                              item.id_mode,
                              "payment_amount",
                              value
                            );
                          }}
                          onWheel={(e) => e.target.blur()}
                        />
                      </div>
                    </Col>
                    {item?.card_no_mandatory && (
                      <Col lg="6">
                        <Label>Card No</Label>
                        <InputFieldWithDropdown
                          register={register}
                          placeholder="1234 5678 9012 3456"
                          id={`${item.short_code}_card_no`}
                          maxLength={19}
                          type={"number"}
                          handleKeyDownEvents={true}
                          handleDecimalDigits={true}
                          decimalValues={2}
                          setValue={setValue}
                          SetValue={(value) => {
                            setValue(`${item.short_code}_card_no`, value);
                            clearErrors("card_no");
                            handleInputChange(item.id_mode, "card_no", value);
                          }}
                          optionId={"card_type"}
                          name={"card_type"}
                          selectedOption={watch(`${item.short_code}_card_type`)}
                          options={cardTypeArr}
                          onDropDownChange={(value) => {
                            setValue(`${item.short_code}_card_type`, value);
                            handleInputChange(item.id_mode, "card_type", value);
                          }}
                          message={errors.card_no && errors.card_no.message}
                        />
                      </Col>
                    )}
                    {item?.card_name_visibility && (
                      <Col lg="6">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor={`${billTypeTab}cardName`}
                          >
                            Card Holder Name
                          </label>
                          <div className="form-control-wrap">
                            <TextInputField
                              register={register}
                              isRequired={true}
                              id={`${item.short_code}_card_holder`}
                              placeholder="Card Holder Name"
                              setValue={setValue}
                              SetValue={(value) => {
                                setValue(
                                  `${item.short_code}_card_holder`,
                                  value
                                );
                                handleInputChange(
                                  item.id_mode,
                                  "card_holder",
                                  value
                                );
                              }}
                            />
                          </div>
                        </div>
                      </Col>
                    )}
                    {item?.approval_no_visibility && (
                      <Col lg="6">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor={`${billTypeTab}cardName`}
                          >
                            Approval Number
                          </label>
                          <div className="form-control-wrap">
                            <TextInputField
                              register={register}
                              isRequired={true}
                              id={`${item.short_code}_payment_ref_number`}
                              placeholder="Approval Number"
                              setValue={setValue}
                              SetValue={(value) => {
                                setValue(
                                  `${item.short_code}_payment_ref_number`,
                                  value
                                );
                                handleInputChange(
                                  item.id_mode,
                                  "payment_ref_number",
                                  value
                                );
                              }}
                            />
                          </div>
                        </div>
                      </Col>
                    )}
                    {item?.nb_type_visibility && (
                      <Col lg="6">
                        <Label>Net Banking Type</Label>
                        <SelectDropdown
                          register={register}
                          id={`${item.short_code}_id_nb_type`}
                          data={netBankingOptions}
                          setValue={setValue}
                          clearErrors={clearErrors}
                          selectedValue={watch(`${item.short_code}_id_nb_type`)}
                          onChangeEvent={(value) => {
                            setValue(`${item.short_code}_id_nb_type`, value);
                            handleInputChange(
                              item.id_mode,
                              "id_nb_type",
                              value
                            );
                          }}
                          placeholder={"Net Banking Type"}
                          valueField={"value"}
                          labelField={"label"}
                        />
                      </Col>
                    )}
                    {item?.bank_visibility && (
                      <Col lg="6">
                        <Label>Select Bank</Label>
                        <SelectDropdown
                          register={register}
                          id={`${item.short_code}_id_bank`}
                          data={bankingOptions}
                          setValue={setValue}
                          clearErrors={clearErrors}
                          selectedValue={watch(`${item.short_code}_id_bank`)}
                          onChangeEvent={(value) => {
                            setValue(`${item.short_code}_id_bank`, value);
                            handleInputChange(item.id_mode, "id_bank", value);
                          }}
                          placeholder={"Select Bank"}
                          valueField={"value"}
                          labelField={"label"}
                        />
                      </Col>
                    )}
                    {item?.device_type_visibility && (
                      <Col lg="6">
                        <Label>Device Type</Label>
                        <SelectDropdown
                          register={register}
                          id={`${item.short_code}_id_pay_device`}
                          data={deviceOptions}
                          setValue={setValue}
                          clearErrors={clearErrors}
                          selectedValue={watch(
                            `${item.short_code}_id_pay_device`
                          )}
                          onChangeEvent={(value) => {
                            setValue(`${item.short_code}_id_pay_device`, value);
                            handleInputChange(
                              item.id_mode,
                              "id_pay_device",
                              value
                            );
                          }}
                          placeholder={"Device Type"}
                          valueField={"value"}
                          labelField={"label"}
                        />
                      </Col>
                    )}
                  </Row>
                </TabPane>
              </TabContent>
            );
          })}

          {advanceTab === "gifts" && (
            <Col md={6}>
              <div className="form-control-wrap" style={{ marginTop: "10px" }}>
                <div className="input-group">
                  <div className="input-group-append" style={{ width: "70%" }}>
                    <TextInputField
                      register={register}
                      isRequired={true}
                      id={"gifts"}
                      tabIndex={4}
                      placeholder="Voucher Code"
                      value={gifts}
                      SetValue={(value) => {
                        setGifts(value);
                      }}
                    />
                  </div>
                  <div
                    className="input-group-append"
                    style={{ height: "29px", width: "30%" }}
                  >
                    <Button
                      outline
                      color="primary"
                      className="btn-dim"
                      onClick={handleVoucherSearch}
                    >
                      <em class="icon ni ni-search"></em>
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          )}

          {VoucherDetails?.length > 0 && advanceTab === "gifts" && (
            <TabContent key={6}>
              <table
                className="table advance_adj_table"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <thead>
                  <tr>
                    <th>Voucher Name</th>
                    <th>Voucher Code</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {VoucherDetails?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.voucher_name}</td>
                      <td>{item.voucher_code}</td>
                      <td>
                        <CurrencyDisplay value={item?.amount} />
                      </td>
                      <td>
                        <Button
                          color="primary"
                          size="sm"
                          className="btn-icon btn-white btn-dim"
                          onClick={() => handleDeleteVoucher(item.voucher_code)}
                        >
                          <Icon name="trash-fill" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* <div className="total-amount">
                <strong>Total Amount: </strong>
                <CurrencyDisplay
                  value={VoucherDetails.reduce(
                    (total, item) => total + parseFloat(item?.amount || 0),
                    0
                  )}
                />
              </div> */}
            </TabContent>
          )}

           {advanceTab === "loyalty" && (
            <TabContent key={6}>
          
              <div className="total-amount">
                <strong>Total Customer Points: 500 </strong>
                
              </div>
            </TabContent>
          )}

          {isAdvanceAdjustment &&
            customerAdvanceDetails?.length > 0 &&
            advanceTab == "advance" && (
              <TabContent key={6}>
                <table
                  class="table advance_adj_table"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  <thead>
                    <tr>
                      <th>Bill No</th>
                      <th>Advance </th>
                      <th>Adjusted </th>
                      <th>Refunded </th>
                      <th>Balance </th>
                      <th>Adjust Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerAdvanceDetails?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.bill_no}</td>
                        <td>{item.advance_amount}</td>
                        <td>{item.adjusted_amount}</td>
                        <td>{item.refunded_amount}</td>
                        <td>{item.balance_amount}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control no-spinner"
                            value={inputValues[idx] || ""}
                            onChange={(e) =>
                              handleAdvanceInputChange(
                                idx,
                                e,
                                item.balance_amount,
                                item.id_issue_receipt
                              )
                            } // Update state on change
                            onWheel={(e) => e.target.blur()}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabContent>
            )}

          {isDepositAdjustment &&
            customerDepositDetails?.length > 0 &&
            advanceTab == "deposit" && (
              <TabContent key={6}>
                <table
                  class="table advance_adj_table"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  <thead>
                    <tr>
                      <th>Ref No</th>
                      <th>Deposit Code</th>
                      <th>Closing Date</th>
                      <th>Deposit Amount</th>
                      <th>Deposit Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerDepositDetails?.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="checkbox"
                            onChange={(event) => {
                              handelDepositChange(
                                idx,
                                "isChecked",
                                event.target.checked
                              );
                            }}
                          />{" "}
                          {item.ref_no}
                        </td>
                        {/* <td>{item.ref_no}</td> */}
                        <td>{item.deposit_code}</td>
                        <td>
                          {moment(item.closing_date).format("DD-MM-YYYY")}
                        </td>
                        <td>{item.deposit_amount}</td>
                        <td>{item.deposit_weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabContent>
            )}

          {isChitAdjustment && advanceTab === "chitAdj" && (
            <>
              {/* {props?.isSchemeAccountSearchReq &&
                <Col md={5}>
                  <div className="form-control-wrap" style={{ marginTop: "10px" }}>
                    <div className="input-group">
                      <TextInputField
                        register={register}
                        isRequired={true}
                        id={"sch_acnt"}
                        placeholder="Scheme Account"
                        value={sch_account}
                        SetValue={(value) => {
                          set_sch_account(value);
                        }} />
                      <div className="input-group-append" style={{ height: "29px" }}>
                        <Button outline color="primary" className="btn-dim" onClick={handleSearchSchemeAccount}>
                          <em class="icon ni ni-search"></em>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              } */}

              {customerChitDetails?.length > 0 && (
                <TabContent key={7}>
                  <table
                    className="table table-bordered chit_adj_table"
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                  >
                    <thead>
                      {userInfo?.settings?.add_chit_adj_manually == "2" && (
                        <tr>
                          <th>Account No</th>
                          <th>Closing Wt</th>
                          <th>Closing Amt</th>
                          <th>Amount</th>
                        </tr>
                      )}

                      {userInfo?.settings?.add_chit_adj_manually != "2" && (
                        <tr>
                          <th>Account No</th>
                          <th>Closing Wt</th>
                          <th>VA</th>
                          <th>MC</th>
                          <th>Amount</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {userInfo?.settings?.add_chit_adj_manually == "0" &&
                        customerChitDetails?.map((item, idx) => {
                          return (
                            <tr key={idx}>
                              <td>{item.scheme_acc_number}</td>
                              <td>{item.closing_weight}</td>
                              <td>{item?.va}</td>
                              <td>{item?.mc}</td>
                              <td>{item?.amount}</td>
                            </tr>
                          );
                        })}
                      {userInfo?.settings?.add_chit_adj_manually == "1" && (
                        <>
                          {customerChitDetails?.map((item, idx) => {
                            return (
                              <tr key={idx}>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={item?.scheme_acc_number || ""}
                                  onChange={(e) =>
                                    handleChitAdjChange(
                                      idx,
                                      "scheme_acc_number",
                                      e.target.value
                                    )
                                  }
                                />
                                <td>
                                  <input
                                    type="number"
                                    className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    value={item?.closing_weight || ""}
                                    onChange={(e) =>
                                      handleChitAdjChange(
                                        idx,
                                        "closing_weight",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    value={item?.va || ""}
                                    onChange={(e) =>
                                      handleChitAdjChange(
                                        idx,
                                        "va",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    value={item?.mc || ""}
                                    onChange={(e) =>
                                      handleChitAdjChange(
                                        idx,
                                        "mc",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td>{item?.amount}</td>
                              </tr>
                            );
                          })}
                        </>
                      )}
                      {userInfo?.settings?.add_chit_adj_manually == "2" && (
                        <>
                          {customerChitDetails?.map((item, idx) => {
                            return (
                              <tr key={idx}>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={item?.scheme_acc_number || ""}
                                  onChange={(e) =>
                                    handleChitAdjChange(
                                      idx,
                                      "scheme_acc_number",
                                      e.target.value
                                    )
                                  }
                                />
                                <td>
                                  <input
                                    type="number"
                                    className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    value={item?.closing_weight || ""}
                                    onChange={(e) => {
                                      handleChitAdjChange(
                                        idx,
                                        "closing_weight",
                                        e.target.value
                                      );
                                      handleChitAdjChange(
                                        idx,
                                        "closing_amount",
                                        0
                                      );
                                      if (parseFloat(e.target.value) > 0) {
                                        let amount =
                                          parseFloat(e.target.value) *
                                          parseFloat(item?.rate_per_gram);
                                        handleChitAdjChange(
                                          idx,
                                          "amount",
                                          parseFloat(
                                            isUndefined(amount)
                                          ).toFixed(2)
                                        );
                                      } else {
                                        handleChitAdjChange(idx, "amount", 0);
                                      }
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    readOnly={false}
                                    className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    value={item?.closing_amount || ""}
                                    onChange={(e) => {
                                      handleChitAdjChange(
                                        idx,
                                        "closing_amount",
                                        e.target.value
                                      );
                                      handleChitAdjChange(
                                        idx,
                                        "amount",
                                        e.target.value
                                      );
                                      handleChitAdjChange(
                                        idx,
                                        "closing_weight",
                                        0
                                      );
                                    }}
                                  />
                                </td>
                                {/* <td>
                                  <input
                                    type="number"
                                    className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    value={item?.mc || ""}
                                     readOnly={true}
                                    onChange={(e) =>
                                      handleChitAdjChange(
                                        idx,
                                        "mc",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td> */}
                                <td>
                                  <input
                                    type="number"
                                    className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    value={item?.amount || ""}
                                    readOnly={true}
                                    onChange={(e) => {
                                      handleChitAdjChange(
                                        idx,
                                        "amount",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </>
                      )}
                    </tbody>
                  </table>
                </TabContent>
              )}
            </>
          )}
        </div>
      </Row>
    );
  }
);

export default PaymentModeComponent;
