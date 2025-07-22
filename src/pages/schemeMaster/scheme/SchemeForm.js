import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import IsRequired from "../../../components/erp-required/erp-required";
import {
  createScheme,
  getAllPaymentFormula,
  getSchemeById,
  updateSchemeById,
} from "../../../redux/thunks/scheme";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import {
  Block,
  BlockTitle,
  CancelButton,
  Col,
  Icon,
  PreviewCard,
  Row,
  SaveButton,
  TextInputField,
} from "../../../components/Component";
import {
  Button,
  FormGroup,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Label,
} from "reactstrap";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import classnames from "classnames";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  MetalDropdown,
  OtherInventoryItemDropdown,
  PurityDropdown,
  SchemeClassificationDropdown,
  TaxMasterDropdown,
} from "../../../components/filters/retailFilters";
import {
  useMetals,
  usePurities,
  useActiveSchemeClassification,
  useTaxMaster,
  useOtherInventoryItem,
} from "../../../components/filters/filterHooks";
import DeleteModal from "../../../components/modals/DeleteModal";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { v4 as uuid } from "uuid";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

import { useHotkeys } from "react-hotkeys-hook";

const SchemeForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
    watch,
  } = useForm();

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
    reset: reset1,
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
  } = useForm();

  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
    reset: reset3,
    setValue: setValue3,
    clearErrors: clearErrors3,
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const title = location?.state?.title;
  const id = location?.state?.id;
  const add = location?.state?.add;

  const { paymentFormulaList } = useSelector(
    (state) => state.paymentFormulaReducer
  );
  const {
    isLoading: isSubmitting,
    isError,
    schemeInfo,
  } = useSelector((state) => state.schemesReducer);
  const [modal, setModal] = useState(false);
  const [delItemId, SetDelItemId] = useState();
  const toggle = () => setModal(!modal);
  const { otherInventoryItems } = useOtherInventoryItem();

  const [scheme_classification, setscheme_classification] = useState("");
  const [scheme_name, setscheme_name] = useState("");
  const [scheme_code, setscheme_code] = useState("");
  const [scheme_type, setscheme_type] = useState(0);
  // const [closingDays, setClosingDays] = useState(0);
  const [digiPaymentChances, setDigiPaymentChances] = useState(0);
  const [digiMinAmount, setDigiMinAmount] = useState();
  const [maturityDays, setMaturityDays] = useState(0);

  const [tax_type, settax_type] = useState(3);
  const [taxid, settaxid] = useState(null);
  const [sch_total_instalment, setsch_total_instalment] = useState();
  const [allow_advance, setallow_advance] = useState(false);
  const [number_of_advance, setnumber_of_advance] = useState();
  const [allow_pending_due, setallow_pending_due] = useState(false);
  const [number_of_due, setnumber_of_dues] = useState();
  const [sch_instalment_type, setsch_instalment_type] = useState("");
  const [kyc_required, setkyc_required] = useState(false);
  const [when_kyc_required, setwhen_kyc_required] = useState(1);
  const [metal, setmetal] = useState("");
  const [purity, setpurity] = useState("");
  const [scheme_status, setscheme_status] = useState(true);
  const [scheme_visibility, setscheme_visibility] = useState(1);
  const [allow_join, setallow_join] = useState(true);
  const [allow_join_multi_acc, setallow_join_multi_acc] = useState(true);
  const [show_target, setshow_target] = useState(true);
  const [restrict_payment, setrestrict_payment] = useState(1);
  const [sch_payable_type, setsch_payable_type] = useState(1);
  const [allow_unpaid, setallow_unpaid] = useState(false);
  const [allow_due, setallow_due] = useState(true);
  const [particular_amount, setparticular_amount] = useState();
  const [scheme_description, setscheme_description] = useState("");
  const [convert_to_weight, setconvert_to_weight] = useState(false);
  const defalultDigiInterest = {
    from_days: "",
    to_days: "",
    interest_percentage: "",
  };
  const [digiInterestDetails, setDigiInterestDetails] = useState([]);
  const [has_free_installment, sethas_free_installment] = useState(false);
  const [free_installment, setfree_installment] = useState();
  const [pre_close_charges, setpre_close_charges] = useState(0);

  const addNewInterestRow = () => {
    //   console.log(validateAllDigiInterestDetails(),"")
    if (validateAllDigiInterestDetails()) {
      setDigiInterestDetails([...digiInterestDetails, defalultDigiInterest]);
    }
  };

  const handleIntrestChange = (index, field, value) => {
    setDigiInterestDetails((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };
  const { purities } = usePurities();
  const { schemesclass } = useActiveSchemeClassification();
  const { metals } = useMetals();
  const { taxMaster } = useTaxMaster();
  const { transformWord } = useContext(WordTransformerContext);

  const [activeIconTab, setActiveIconTab] = useState("1");

  const [closing_settings, setclosing_settings] = useState([]);

  const [giftSettings, setGiftSettings] = useState([]);

  useEffect(() => {
    if (giftSettings?.length == 0) {
      addGiftSettings();
    }
  }, [giftSettings]);

  const addGiftSettings = () => {
    setGiftSettings([
      ...giftSettings,
      {
        item: "",
        pcs: "",
        id_gift_settings: uuid(),
      },
    ]);
  };

  const editGiftSettings = ({ name, val, ids, ...params }) => {
    setGiftSettings((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id_gift_settings == ids) {
          setValue(`${name + obj.id_gift_settings}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const deleteGiftSettings = (ids) => {
    setGiftSettings((prevState) =>
      prevState?.filter((obj) => obj.id_gift_settings != ids)
    );
  };

  const toggleIconTab = (icontab) => {
    if (activeIconTab !== icontab) setActiveIconTab(icontab);
  };

  const condition = [
    { value: "1", label: "N/A" },
    { value: "2", label: "Avg < Y1 ins payable means set Y1 as payable" },
  ];

  const limit_by_arr = [
    { value: "1", label: "Amount" },
    { value: "2", label: "Weight" },
  ];

  const denom_type_arr = [
    { value: "1", label: "Multiples" },
    { value: "2", label: "Master" },
    { value: "3", label: "N/A" },
    { value: "4", label: "Grouping" },
  ];

  const discount_type_arr = [
    { value: "1", label: "Percent" },
    { value: "2", label: "Amount" },
  ];

  const payment_chnc_type_arr = [
    { value: "1", label: "Daily" },
    { value: "2", label: "Monthly" },
  ];

  const validateDigiInterestDetails = (value, index) => {
    let is_error = false;
    if (value == "") {
      toastfunc("Value Cannot be Empty");
      return true;
    } else if (!isNaN(value)) {
      digiInterestDetails?.forEach((item, rowIndex) => {
        if (is_error) return; // Exit early if an error has already been detected
        if (
          rowIndex !== index &&
          (parseFloat(item.from_days) >= parseFloat(value) ||
            parseFloat(item.to_days) <= parseFloat(value))
        ) {
          is_error = true;
          toastfunc("Invalid Value");
        }
      });
    }
    return is_error;
  };
  const validateAllDigiInterestDetails = () => {
    let is_error = false;
    digiInterestDetails?.forEach((data, index) => {
      if (
        !isNaN(parseFloat(data.to_days)) &&
        !isNaN(parseFloat(data.from_days)) &&
        !isNaN(parseFloat(data.interest_percentage)) &&
        parseFloat(data.interest_percentage) <= 100 &&
        !is_error &&
        parseFloat(data.from_days) < parseFloat(data.to_days)
      ) {
        console.log("comes in ............", data);
        digiInterestDetails?.forEach((item, rowIndex) => {
          console.log(
            parseFloat(item.from_days) >= parseFloat(data.from_days),
            parseFloat(item.to_days) <= parseFloat(data.from_days),
            parseFloat(item.from_days) >= parseFloat(data.to_days),
            parseFloat(item.to_days) <= parseFloat(data.to_days)
          );
          console.log("error ............", item, data);
          if (
            rowIndex != index &&
            ((parseFloat(item.from_days) <= parseFloat(data.from_days) &&
              parseFloat(item.to_days) >= parseFloat(data.from_days)) ||
              (parseFloat(item.from_days) <= parseFloat(data.to_days) &&
                parseFloat(item.to_days) >= parseFloat(data.to_days)))
          ) {
            is_error = true;
            toastfunc(" Range Value cannot be inside another range");
            return;
          }
        });
      } else if (parseFloat(data.interest_percentage) > 100) {
        toastfunc("Intrest Cannot be Greater than 100");
        is_error = true;
        return;
      } else if (!(parseFloat(data.from_days) < parseFloat(data.to_days))) {
        toastfunc("Invaid From and To days Range");
        is_error = true;
        return;
      } else if (is_error) {
        return;
      } else {
        console.log(!is_error);
        toastfunc("Invalid Value");
        is_error = true;
        return;
      }
    });

    return !is_error;
  };
  useEffect(() => {
    if (closing_settings?.length == 0) {
      addClosingSettings();
    }
  }, [closing_settings]);

  const addClosingSettings = () => {
    setclosing_settings([
      ...closing_settings,
      {
        installment_from: "",
        installment_to: "",
        wastage_benefit: "",
        mc_benefit: "",
        id: uuid(),
      },
    ]);
    // setids((prevState) => prevState - 1);
  };

  const editClosingSettings = ({ name, val, ids, ...params }) => {
    setclosing_settings((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id == ids) {
          setValue(`${name + obj.id}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const deleteClosingSettings = (ids) => {
    setclosing_settings((prevState) =>
      prevState?.filter((obj) => obj.id != ids)
    );
  };

  const [addformdata, setaddformdata] = useState({
    id: 1,
    installment_from: "",
    installment_to: "",
    min_formula: "1",
    min_formula_value: "Any",
    min_condition: "1",
    min_condition_value: "N/A",
    min_condition_param: "",
    min_parameter: "",
    max_formula: "1",
    max_formula_value: "Any",
    max_condition: "1",
    max_condition_value: "N/A",
    max_condition_param: "",
    max_parameter: "",
    // payment_type: null,
    limit_by: "1",
    limit_by_value: "Amount",
    // payment_min: null,
    // payment_max: null,
    discount_type: "1",
    discount_type_value: "Percent",
    discount_value: 0,
    payment_chance_type: "1",
    payment_chance_type_value: "Daily",
    payment_chance_value: "",
    denom_type: "1",
    denom_type_value: "Multiples",
    denom_value: "",
  });

  const [formMode, setformMode] = useState("0");
  const [prevData, setprevData] = useState([]);

  const resetfunc = (increment) => {
    if (increment) {
      setaddformdata({
        ...addformdata,
        id: addformdata.id + 1,
        installment_from: "",
        installment_to: "",
        min_formula: "1",
        min_formula_value: "Any",
        min_condition: "1",
        min_condition_value: "N/A",
        min_condition_param: "",
        min_parameter: "",
        max_formula: "1",
        max_formula_value: "Any",
        max_condition: "1",
        max_condition_value: "N/A",
        max_condition_param: "",
        max_parameter: "",
        // payment_type: null,
        limit_by: "1",
        limit_by_value: "Amount",
        // payment_min: null,
        // payment_max: null,
        discount_type: "1",
        discount_type_value: "Percent",
        discount_value: 0,
        payment_chance_type: "1",
        payment_chance_type_value: "Daily",
        payment_chance_value: "",
        denom_type: "1",
        denom_type_value: "Multiples",
        denom_value: "",
      });
    } else {
      setaddformdata({
        ...addformdata,
        installment_from: "",
        installment_to: "",
        min_formula: "1",
        min_formula_value: "Any",
        min_condition: "1",
        min_condition_value: "N/A",
        min_condition_param: "",
        min_parameter: "",
        max_formula: "1",
        max_formula_value: "Any",
        max_condition: "1",
        max_condition_value: "N/A",
        max_condition_param: "",
        max_parameter: "",
        // payment_type: null,
        limit_by: "1",
        limit_by_value: "Amount",
        // payment_min: null,
        // payment_max: null,
        discount_type: "1",
        discount_type_value: "Percent",
        discount_value: 0,
        payment_chance_type: "1",
        payment_chance_type_value: "Daily",
        payment_chance_value: "",
        denom_type: "1",
        denom_type_value: "Multiples",
        denom_value: "",
      });
    }
    setValue("installment_from", "");
    setValue("installment_to", "");
    setValue("min_formula", null);
    setValue("min_condition", null);
    setValue("min_condition_param", null);
    setValue("min_parameter", null);
    setValue("max_formula", null);
    setValue("max_condition", null);
    setValue("max_condition_param", null);
    setValue("max_parameter", null);
    setValue("limit_by", null);
    setValue("discount_type", null);
    setValue("discount_value", 0);
    setValue("payment_chance_type", null);
    setValue("payment_chance_value", null);
    setValue("denom_type", null);
    setValue("denom_value", null);
  };

  const additem = () => {
    setprevData([addformdata, ...prevData]);
    resetfunc(true);
  };

  const edititem = async () => {
    console.log("Edit Item");
    await setprevData((prevState) =>
      prevState?.filter((obj) => obj.id !== addformdata?.id)
    );

    setformMode("0");
    resetfunc();
  };

  const toeditform = (obj) => {
    setaddformdata({
      ...addformdata,
      id: obj?.id,
      installment_from: obj.installment_from,
      installment_to: obj.installment_to,
      min_formula: obj.min_formula,
      min_formula_value: obj.min_formula_value,
      min_condition: obj.min_condition,
      min_condition_value: obj.min_condition_value,
      min_condition_param: obj.min_condition_param,
      min_parameter: obj.min_parameter,
      max_formula: obj.max_formula,
      max_formula_value: obj.max_formula_value,
      max_condition: obj.max_condition,
      max_condition_value: obj.max_condition_value,
      max_condition_param: obj.max_condition_param,
      max_parameter: obj.max_parameter,
      limit_by: obj.limit_by,
      limit_by_value: obj.limit_by_value,
      discount_type: obj.discount_type,
      discount_type_value: obj.discount_type_value,
      discount_value: obj.discount_value,
      payment_chance_type: obj.payment_chance_type,
      payment_chance_type_value: obj.payment_chance_type_value,
      payment_chance_value: obj.payment_chance_value,
      denom_type: obj.denom_type,
      denom_type_value: obj.denom_type_value,
      denom_value: obj.denom_value,
    });
    reset1();
    setformMode("1");
  };

  const deleteItem = (id) => {
    setprevData((prevState) => prevState?.filter((obj) => obj?.id != id));
  };

  const deleteSettingItem = () => {
    deleteItem(delItemId);
    toggle();
  };

  useEffect(() => {
    if (formMode == "1") {
      Array.isArray(prevData) &&
        prevData.includes(addformdata) == false &&
        setprevData([addformdata, ...prevData]);
    }
  }, [prevData]);

  const handleRemove = (indexToRemove) => {
    setDigiInterestDetails((prevArray) =>
      prevArray.filter((_, index) => index !== indexToRemove)
    );
  };

  const gotoNextTab = () => {
    if (scheme_type === 2) {
      toggleIconTab("5");
    } else {
      toggleIconTab("2");
    }
  };
  const gotoNextTabNew = () => {
    toggleIconTab("3");
  };
  const goToFirstTab = () => {
    toggleIconTab("1");
  };

  const goToFourTab = () => {
    toggleIconTab("4");
  };

  const postData = async () => {
    let digiInterest = [];
    if (scheme_type == 2) {
      if (validateAllDigiInterestDetails()) {
        digiInterest = digiInterestDetails;
      } else {
        return false;
      }
    }
    const payment_settings = prevData?.map((obj) => {
      const container = {};
      container.installment_from = obj?.installment_from;
      container.installment_to = obj?.installment_to;
      container.min_formula = obj?.min_formula;
      container.min_condition = obj?.min_condition;
      container.min_condition_param = obj?.min_condition_param;
      container.min_parameter = obj?.min_parameter;
      container.max_formula = obj?.max_formula;
      container.max_condition = obj?.max_condition;
      container.max_condition_param = obj?.max_condition_param;
      container.max_parameter = obj?.max_parameter;
      container.limit_by = obj?.limit_by;
      container.discount_type = obj?.discount_type;
      container.discount_value = obj?.discount_value;
      container.payment_chance_type = obj?.payment_chance_type;
      container.payment_chance_value = obj?.payment_chance_value;
      container.denom_type = obj?.denom_type;
      container.denom_value = obj?.denom_value;
      container.payment_type = null;
      container.payment_max = null;
      container.payment_min = null;
      return container;
    });
    // const scheme_benefit_settings = closing_settings?.map((obj) => {
    //   const container = {};
    //   container.installment_from = obj?.installment_from;
    //   container.installment_to = obj?.installment_to;
    //   container.wastage_benefit = obj?.wastage_benefit;
    //   container.mc_benefit = obj?.mc_benefit;
    //   return container;
    // });
    const scheme_benefit_settings = closing_settings
      ?.filter((obj) => {
        const from = obj?.installment_from;
        const to = obj?.installment_to;
        return (
          (from !== undefined &&
            from !== null &&
            from !== "" &&
            Number.isInteger(Number(from))) ||
          (to !== undefined &&
            to !== null &&
            to !== "" &&
            Number.isInteger(Number(to)))
        );
      })
      ?.map((obj) => ({
        installment_from: Number(obj?.installment_from),
        installment_to: Number(obj?.installment_to),
        wastage_benefit: obj?.wastage_benefit,
        mc_benefit: obj?.mc_benefit,
      }));
    const gift_settings = giftSettings?.map((obj) => {
      const container = {};
      container.item = obj?.item;
      container.pcs = obj?.pcs;
      return container;
    });
    const adddata = {
      sch_classification: scheme_classification,
      scheme_name,
      scheme_code,
      scheme_type,
      tax_type: tax_type,
      tax_id: tax_type != 3 ? taxid : null,
      total_instalment: sch_total_instalment ? sch_total_instalment : null,
      allow_advance,
      allow_pending_due: allow_pending_due,
      number_of_pending_due: number_of_due ? number_of_due : null,
      kyc_req: kyc_required,
      when_kyc_required,
      number_of_advance: number_of_advance ? number_of_advance : null,
      sch_id_metal: metal,
      sch_id_purity: purity,
      status: scheme_status,
      scheme_vis: scheme_visibility,
      allow_join,
      allow_join_multi_acc: allow_join_multi_acc,
      show_target: show_target,
      payment_restrict: restrict_payment,
      payable_type: sch_payable_type,
      unpaid_as_def: allow_unpaid,
      allow_due,
      scheme_description,
      payment_settings,
      particular_amount:
        kyc_required == false && when_kyc_required != 3 && particular_amount
          ? particular_amount
          : null,
      convert_to_weight : scheme_type == 0 ? false : convert_to_weight,
      scheme_benefit_settings,
      digi_maturity_days: maturityDays > 0 ? maturityDays : null,
      digi_payment_chances: digiPaymentChances > 0 ? digiPaymentChances : null,
      digi_min_amount: digiMinAmount > 0 ? digiMinAmount : null,
      digi_interest: digiInterest,
      has_free_installment,
      free_installment: has_free_installment == true ? free_installment : 0,
      pre_close_charges,
      gift_settings: gift_settings ? gift_settings : null,
    };
    try {
      await dispatch(createScheme(adddata)).unwrap();
      toastsuccess("Scheme Added successfully");
      navigate(`${process.env.PUBLIC_URL}/schememaster/scheme/list`);
    } catch (error) {
      console.error(error);
    }
    // await dispatch(createScheme(adddata));
    // if (isError == false) {
    //   toastsuccess("Scheme Added successfully");
    //   navigate(`${process.env.PUBLIC_URL}/schememaster/scheme/list`);
    // }
  };

  const putData = async () => {
    let digiInterest = [];
    if (scheme_type == 2) {
      if (validateAllDigiInterestDetails()) {
        digiInterest = digiInterestDetails;
      } else {
        return false;
      }
    }
    const payment_settings = prevData?.map((obj) => {
      const container = {};
      container.pay_id = obj?.id;
      container.installment_from = obj?.installment_from;
      container.installment_to = obj?.installment_to;
      container.min_formula = obj?.min_formula;
      container.min_condition = obj?.min_condition;
      container.min_condition_param = obj?.min_condition_param;
      container.min_parameter = obj?.min_parameter;
      container.max_formula = obj?.max_formula;
      container.max_condition = obj?.max_condition;
      container.max_condition_param = obj?.max_condition_param;
      container.max_parameter = obj?.max_parameter;
      container.limit_by = obj?.limit_by;
      container.discount_type = obj?.discount_type;
      container.discount_value = obj?.discount_value;
      container.payment_chance_type = obj?.payment_chance_type;
      container.payment_chance_value = obj?.payment_chance_value;
      container.denom_type = obj?.denom_type;
      container.denom_value = obj?.denom_value;
      container.payment_type = null;
      container.payment_max = null;
      container.payment_min = null;
      return container;
    });
    // const scheme_benefit_settings = closing_settings?.map((obj) => {
    //   const container = {};
    //   container.installment_from = obj?.installment_from;
    //   container.installment_to = obj?.installment_to;
    //   container.wastage_benefit = obj?.wastage_benefit;
    //   container.mc_benefit = obj?.mc_benefit;
    //   return container;
    // });
    const scheme_benefit_settings = closing_settings
      ?.filter((obj) => {
        const from = obj?.installment_from;
        const to = obj?.installment_to;
        return (
          (from !== undefined &&
            from !== null &&
            from !== "" &&
            Number.isInteger(Number(from))) ||
          (to !== undefined &&
            to !== null &&
            to !== "" &&
            Number.isInteger(Number(to)))
        );
      })
      ?.map((obj) => ({
        installment_from: Number(obj?.installment_from),
        installment_to: Number(obj?.installment_to),
        wastage_benefit: obj?.wastage_benefit,
        mc_benefit: obj?.mc_benefit,
      }));
    const gift_settings = giftSettings?.map((obj) => {
      const container = {};
      container.item = obj?.item;
      container.pcs = obj?.pcs;
      return container;
    });
    const adddata = {
      sch_classification: scheme_classification,
      scheme_name,
      scheme_code,
      scheme_type,
      tax_type: tax_type,
      tax_id: tax_type != 3 ? taxid : null,
      total_instalment: sch_total_instalment ? sch_total_instalment : null,
      allow_advance,
      allow_pending_due: allow_pending_due,
      number_of_pending_due: number_of_due ? number_of_due : null,
      kyc_req: kyc_required,
      when_kyc_required,
      number_of_advance: number_of_advance ? number_of_advance : null,
      sch_id_metal: metal,
      sch_id_purity: purity,
      status: scheme_status,
      scheme_vis: scheme_visibility,
      allow_join,
      allow_join_multi_acc: allow_join_multi_acc,
      show_target: show_target,
      payment_restrict: restrict_payment,
      payable_type: sch_payable_type,
      unpaid_as_def: allow_unpaid,
      allow_due,
      scheme_description,
      payment_settings,
      particular_amount:
        kyc_required == false && when_kyc_required != 3 && particular_amount
          ? particular_amount
          : null,
      convert_to_weight : scheme_type == 0 ? false : convert_to_weight,
      scheme_benefit_settings,
      digi_maturity_days: maturityDays > 0 ? maturityDays : null,
      digi_payment_chances: digiPaymentChances > 0 ? digiPaymentChances : null,
      digi_min_amount: digiMinAmount > 0 ? digiMinAmount : null,
      digi_interest: digiInterest,
      has_free_installment,
      free_installment: has_free_installment == true ? free_installment : 0,
      pre_close_charges,
      gift_settings: gift_settings ? gift_settings : null,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateSchemeById(reduxData)).unwrap();
      toastsuccess("Scheme Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/schememaster/scheme/list`);
    } catch (error) {
      console.error(error);
    }
    // await dispatch(updateSchemeById(reduxData));
    // if (isError === false) {
    //   toastsuccess("Scheme Edited successfully");
    //   navigate(`${process.env.PUBLIC_URL}/schememaster/scheme/list`);
    // }
  };

  useEffect(() => {
    dispatch(getAllPaymentFormula());
  }, [dispatch]);

  useEffect(() => {
    id !== undefined && dispatch(getSchemeById(id));
  }, [dispatch, id]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    schemeInfo != null &&
      (setconvert_to_weight(schemeInfo?.convert_to_weight),
      setparticular_amount(schemeInfo?.particular_amount),
      setnumber_of_advance(schemeInfo?.number_of_advance),
      setscheme_classification(schemeInfo?.sch_classification),
      setscheme_name(schemeInfo?.scheme_name),
      setscheme_code(schemeInfo?.scheme_code),
      setscheme_type(schemeInfo?.scheme_type),
      setsch_total_instalment(schemeInfo?.total_instalment),
      setallow_advance(schemeInfo?.allow_advance),
      setsch_instalment_type(schemeInfo?.payment_chances),
      setkyc_required(schemeInfo?.kyc_req),
      setwhen_kyc_required(schemeInfo?.when_kyc_required),
      setmetal(schemeInfo?.sch_id_metal),
      setpurity(schemeInfo?.sch_id_purity),
      setscheme_status(schemeInfo?.status),
      setscheme_visibility(schemeInfo?.scheme_vis),
      setallow_join(schemeInfo?.allow_join),
      setallow_join_multi_acc(schemeInfo?.allow_join_multi_acc),
      setrestrict_payment(schemeInfo?.payment_restrict),
      setsch_payable_type(schemeInfo?.payable_type),
      setallow_unpaid(schemeInfo?.unpaid_as_def),
      setallow_due(schemeInfo?.allow_due),
      setscheme_description(schemeInfo?.scheme_description),
      setprevData(schemeInfo?.payment_settings),
      setallow_pending_due(schemeInfo?.allow_pending_due),
      setnumber_of_dues(schemeInfo?.number_of_pending_due),
      settax_type(schemeInfo?.tax_type),
      settaxid(schemeInfo?.tax_id),
      setclosing_settings(schemeInfo?.scheme_benefit_settings),
      sethas_free_installment(schemeInfo?.has_free_installment),
      setfree_installment(schemeInfo?.free_installment),
      setpre_close_charges(schemeInfo?.pre_close_charges),
      setGiftSettings(schemeInfo?.gift_settings),
      setDigiInterestDetails(schemeInfo?.digi_interest),
      setDigiMinAmount(schemeInfo?.digi_min_amount),
      setMaturityDays(schemeInfo?.digi_maturity_days),
      setDigiPaymentChances(schemeInfo?.digi_payment_chances),
      setshow_target(schemeInfo?.show_target),
      reset(),
      reset1());
  }, [schemeInfo, reset, reset1]);

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/schememaster/scheme/list`);
    }
  }, [add, id, navigate]);

  const handleChange = (value) => {
    setscheme_description(value);
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

  return (
    <>
      <React.Fragment>
        <Head title={title ? title : "Scheme"} />
        <Content>
          <Block size="lg">
            <PreviewCard>
              <Col md={4}>
                <ModifiedBreadcrumb></ModifiedBreadcrumb>
              </Col>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    tag="a"
                    href="#tab"
                    className={classnames({ active: activeIconTab == "1" })}
                    onClick={(ev) => {
                      ev.preventDefault();
                      toggleIconTab("1");
                    }}
                  >
                    <Icon name="grid-alt-fill" /> <span>General</span>
                  </NavLink>
                </NavItem>
                {scheme_type !== 2 && (
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({ active: activeIconTab == "2" })}
                      onClick={(ev) => {
                        ev.preventDefault();
                      }}
                    >
                      <Icon name="money" /> <span>Payment Settings</span>
                    </NavLink>
                  </NavItem>
                )}

                {scheme_type == 2 && (
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({ active: activeIconTab == "5" })}
                      onClick={(ev) => {
                        ev.preventDefault();
                      }}
                    >
                      <Icon name="money" /> <span>Digi Intrest Settings</span>
                    </NavLink>
                  </NavItem>
                )}

                <NavItem>
                  <NavLink
                    tag="a"
                    href="#tab"
                    className={classnames({ active: activeIconTab == "3" })}
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                  >
                    <Icon name="setting-question" />{" "}
                    <span>Closing Settings</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag="a"
                    href="#tab"
                    className={classnames({ active: activeIconTab == "4" })}
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                  >
                    <Icon name="gift" /> <span>Gift Items</span>
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeIconTab}>
                <TabPane tabId="1">
                  <Row lg={12} className={"form-control-sm"}>
                    <Col md={4}>
                      <div className="custom-grid">
                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="site-name">
                                Classification
                                <IsRequired />
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <SchemeClassificationDropdown
                              register={register}
                              id={"scheme_classification"}
                              schemesclass={schemesclass}
                              selectedSchemeClass={scheme_classification}
                              onSchemeClassChange={setscheme_classification}
                              isRequired={true}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={
                                errors.scheme_classification &&
                                "Scheme is Required"
                              }
                            ></SchemeClassificationDropdown>
                          </Col>
                        </Row>

                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="site-name">
                                Scheme
                                <IsRequired />
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <input
                              {...register("scheme_name", {
                                required: "Scheme Name is required",
                              })}
                              name="scheme_name"
                              value={scheme_name}
                              onChange={(e) =>
                                setscheme_name(transformWord(e.target.value))
                              }
                              className=" form-control"
                              placeholder="Enter Scheme name"
                              type="text"
                            />
                            {errors.scheme_name && (
                              <span className="invalid">
                                This field is required
                              </span>
                            )}
                          </Col>
                        </Row>

                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="site-name">
                                Code
                                <IsRequired />
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <input
                              {...register("scheme_code", {
                                required: "Scheme Code is required",
                              })}
                              name="scheme_code"
                              value={scheme_code}
                              onChange={(e) => setscheme_code(e.target.value)}
                              className=" form-control"
                              placeholder="Enter Scheme Code"
                              type="text"
                            />
                            {errors.scheme_code && (
                              <span className="invalid">
                                This field is required
                              </span>
                            )}
                          </Col>
                        </Row>

                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="site-name">
                                Type
                                <IsRequired />
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <ul className="custom-control-group g-3 align-center flex-wrap">
                              <li>
                                <div className="custom-control custom-control-sm custom-radio">
                                  <input
                                    id="weight_sch"
                                    type="radio"
                                    name={"scheme_type"}
                                    value={1}
                                    className="custom-control-input"
                                    checked={scheme_type == 1 ? true : false}
                                    onChange={(e) => {
                                      setscheme_type(e.target.value);
                                    }}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="weight_sch"
                                  >
                                    Weight
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div className="custom-control custom-control-sm  custom-radio">
                                  <input
                                    id="amount_sch"
                                    type="radio"
                                    value={0}
                                    name={"scheme_type"}
                                    className="custom-control-input "
                                    checked={scheme_type == 0 ? true : false}
                                    onChange={(e) => {
                                      setscheme_type(e.target.value);
                                    }}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="amount_sch"
                                  >
                                    Amount
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div className="custom-control custom-control-sm  custom-radio">
                                  <input
                                    id="digi_gold_sch"
                                    type="radio"
                                    value={2}
                                    name={"digi_gold_sch"}
                                    className="custom-control-input "
                                    checked={scheme_type == 2 ? true : false}
                                    onChange={(e) => {
                                      setscheme_type(2);
                                    }}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="digi_gold_sch"
                                  >
                                    Digi
                                  </label>
                                </div>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                        {scheme_type == 2 && (
                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Maturity Days
                                  <IsRequired />
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <input
                                {...register("maturity_days", {
                                  required: "Maturity Days is required",
                                })}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Maturity Days"
                                type="number"
                                name="maturity_days"
                                value={maturityDays}
                                onChange={(e) =>
                                  setMaturityDays(e.target.value)
                                }
                                min={1}
                              />
                              {errors.maturity_days && (
                                <span className="invalid">
                                  Maturity Days is required
                                </span>
                              )}
                            </Col>
                          </Row>
                        )}
                        {scheme_type == 2 && (
                          <>
                            <Row className="form-group row g-4">
                              <Col md="4">
                                <div className="form-group">
                                  <label
                                    className="form-label"
                                    htmlFor="site-name"
                                  >
                                    Payment Chances
                                    <IsRequired />
                                  </label>
                                </div>
                              </Col>
                              <Col lg="8">
                                <input
                                  {...register("digiPaymentChances", {
                                    required: "Closing Days is required",
                                  })}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Digi Payment Chances"
                                  type="number"
                                  name="digiPaymentChances"
                                  value={digiPaymentChances}
                                  onChange={(e) =>
                                    setDigiPaymentChances(e.target.value)
                                  }
                                  max={maturityDays - 1}
                                />
                                {errors.digiPaymentChances && (
                                  <span className="invalid">
                                    Payment Chances is required
                                  </span>
                                )}
                              </Col>
                            </Row>
                            <Row className="form-group row g-4">
                              <Col md="4">
                                <div className="form-group">
                                  <label
                                    className="form-label"
                                    htmlFor="site-name"
                                  >
                                    Digi Min Amount
                                    <IsRequired />
                                  </label>
                                </div>
                              </Col>
                              <Col lg="8">
                                <input
                                  {...register("digiMinAmount", {
                                    required: "Min Amount is required",
                                  })}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Min Amount"
                                  type="number"
                                  name="digiMinAmount"
                                  value={digiMinAmount}
                                  onChange={(e) =>
                                    setDigiMinAmount(e.target.value)
                                  }
                                  max={maturityDays - 1}
                                />
                                {errors.digiMinAmount && (
                                  <span className="invalid">
                                    Min Amount is required
                                  </span>
                                )}
                              </Col>
                            </Row>
                          </>
                        )}
                        {scheme_type != 2 && (
                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Installment
                                  {scheme_type != 2 && <IsRequired />}
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <input
                                {...register("sch_total_instalment", {
                                  // required: "Total installment is required",
                                  required: {
                                    value: scheme_type != 2 ? true : false,
                                    message: "Total installment is required",
                                  },
                                })}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Total Installment"
                                type="number"
                                name="sch_total_instalment"
                                value={sch_total_instalment}
                                onChange={(e) =>
                                  setsch_total_instalment(e.target.value)
                                }
                              />
                              {errors.sch_total_instalment && (
                                <span className="invalid">
                                  {errors.sch_total_instalment?.message}
                                </span>
                              )}
                            </Col>
                          </Row>
                        )}
                        {scheme_type != 0 && (
                          <>
                            <Row className="form-group row g-4">
                              <Col md="4">
                                <div className="form-group">
                                  <label
                                    className="form-label"
                                    htmlFor="site-name"
                                  >
                                    Metal
                                    <IsRequired />
                                  </label>
                                </div>
                              </Col>
                              <Col lg="8">
                                <MetalDropdown
                                  register={register}
                                  id={"metal"}
                                  metals={metals}
                                  selectedMetal={metal}
                                  onMetalChange={setmetal}
                                  isRequired={scheme_type == 0 ? false : true}
                                  clearErrors={clearErrors}
                                  setValue={setValue}
                                />
                              </Col>
                            </Row>

                            <Row className="form-group row g-4">
                              <Col md="4">
                                <div className="form-group">
                                  <label
                                    className="form-label"
                                    htmlFor="site-name"
                                  >
                                    Purity
                                    <IsRequired />
                                  </label>
                                </div>
                              </Col>
                              <Col lg="8">
                                <PurityDropdown
                                  register={register}
                                  id={"purity"}
                                  purities={purities}
                                  selectedPurity={purity}
                                  onPurityChange={setpurity}
                                  isRequired={scheme_type == 0 ? false : true}
                                  clearErrors={clearErrors}
                                  setValue={setValue}
                                  message={
                                    errors.purity && "Purity is Required"
                                  }
                                />
                              </Col>
                            </Row>
                          </>
                        )}
                      </div>
                    </Col>
                    <Col md={4}>
                      <Row className="form-group row g-4">
                        <div className="custom-grid">
                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Tax Type
                                  <IsRequired />
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <ul className="custom-control-group g-3 align-center flex-wrap">
                                <li>
                                  <div className="custom-control custom-control-sm custom-radio">
                                    <input
                                      id="inclusive_tax"
                                      type="radio"
                                      name={"tax_type"}
                                      value={1}
                                      className="custom-control-input"
                                      checked={tax_type == 1 ? true : false}
                                      onChange={(e) => {
                                        settax_type(e.target.value);
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="inclusive_tax"
                                    >
                                      Incl.
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div className="custom-control custom-control-sm  custom-radio">
                                    <input
                                      id="exclusive_tax"
                                      type="radio"
                                      value={2}
                                      name={"tax_type"}
                                      className="custom-control-input "
                                      checked={tax_type == 2 ? true : false}
                                      onChange={(e) => {
                                        settax_type(e.target.value);
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="exclusive_tax"
                                    >
                                      Excl.
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div className="custom-control custom-control-sm  custom-radio">
                                    <input
                                      id="na"
                                      type="radio"
                                      value={3}
                                      name={"tax_type"}
                                      className="custom-control-input "
                                      checked={tax_type == 3 ? true : false}
                                      onChange={(e) => {
                                        settax_type(e.target.value);
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="na"
                                    >
                                      N/A
                                    </label>
                                  </div>
                                </li>
                              </ul>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Tax
                                  <IsRequired />
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <TaxMasterDropdown
                                isDisabled={tax_type == 3}
                                register={register}
                                id={"taxid"}
                                taxMaster={taxMaster}
                                selectedTaxMaster={taxid}
                                onTaxMasterChange={settaxid}
                                clearErrors={clearErrors}
                                setValue={setValue}
                              />
                            </Col>
                          </Row>

                          <Row className="form-group row g-4">
                            <Col md="4">
                              <ul className="custom-control-group g-3 align-center">
                                <li>
                                  <div className="custom-control custom-control-sm custom-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={allow_advance}
                                      onChange={(e) =>
                                        setallow_advance(e.target.checked)
                                      }
                                      className="custom-control-input"
                                      id="allow_advance"
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="allow_advance"
                                    >
                                      {"Advance"}
                                    </label>
                                  </div>
                                </li>
                              </ul>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="form-control-wrap">
                                  <input
                                    {...register("number_of_advance", {
                                      required: {
                                        value: allow_advance,
                                        message: "No. of advance is required",
                                      },
                                    })}
                                    disabled={!allow_advance}
                                    name="number_of_advance"
                                    value={number_of_advance}
                                    onChange={(e) =>
                                      setnumber_of_advance(e.target.value)
                                    }
                                    className=" form-control"
                                    placeholder="Number of Advances"
                                    type="text"
                                  />
                                  {errors.number_of_advance && (
                                    <span className="invalid">
                                      {errors.number_of_advance.message}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <Row className="form-group row g-4">
                            <Col md="4">
                              <ul className="custom-control-group g-3 align-center">
                                <li>
                                  <div className="custom-control custom-control-sm custom-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={allow_pending_due}
                                      onChange={(e) =>
                                        setallow_pending_due(e.target.checked)
                                      }
                                      className="custom-control-input"
                                      id="allow_pending_due"
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="allow_pending_due"
                                    >
                                      {"Allow dues"}
                                    </label>
                                  </div>
                                </li>
                              </ul>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="form-control-wrap">
                                  <input
                                    {...register("number_of_due", {
                                      required: {
                                        value: allow_pending_due,
                                        message: "No. of dues is required",
                                      },
                                    })}
                                    disabled={!allow_pending_due}
                                    name="number_of_due"
                                    value={number_of_due}
                                    onChange={(e) =>
                                      setnumber_of_dues(e.target.value)
                                    }
                                    className=" form-control"
                                    placeholder="Number of Dues"
                                    type="text"
                                  />
                                  {errors.number_of_due && (
                                    <span className="invalid">
                                      {errors.number_of_due.message}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Row>
                      <Row className="form-group row g-4">
                        <div className="custom-grid">
                          <Row className="form-group row g-4">
                            <Col md="12">
                              <ul className="custom-control-group g-3 align-center">
                                <li>
                                  <div className="custom-control custom-control-sm custom-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={kyc_required}
                                      onChange={(e) =>
                                        setkyc_required(e.target.checked)
                                      }
                                      className="custom-control-input"
                                      id="kyc_required"
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="kyc_required"
                                    >
                                      {"Enable KYC For Scheme"}
                                    </label>
                                  </div>
                                </li>
                              </ul>
                            </Col>
                          </Row>

                          <Row className="form-group row g-4">
                            <Col lg="12">
                              <div className="form-group">
                                <ul className="custom-control-group g-3 align-center flex-wrap">
                                  {kyc_required && (
                                    <li>
                                      <span>When ?</span>
                                    </li>
                                  )}
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="join_kyc"
                                        type="radio"
                                        disabled={!kyc_required}
                                        name={"when_kyc_required"}
                                        value={1}
                                        className="custom-control-input"
                                        checked={
                                          when_kyc_required == 1 ? true : false
                                        }
                                        onChange={(e) => {
                                          setwhen_kyc_required(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="join_kyc"
                                      >
                                        Joining
                                      </label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="close_kyc"
                                        type="radio"
                                        value={2}
                                        disabled={!kyc_required}
                                        name={"when_kyc_required"}
                                        className="custom-control-input "
                                        checked={
                                          when_kyc_required == 2 ? true : false
                                        }
                                        onChange={(e) => {
                                          setwhen_kyc_required(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="close_kyc"
                                      >
                                        Closing
                                      </label>
                                    </div>
                                  </li>

                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="amount_kyc"
                                        type="radio"
                                        value={3}
                                        disabled={!kyc_required}
                                        name={"when_kyc_required"}
                                        className="custom-control-input "
                                        checked={
                                          when_kyc_required == 3 ? true : false
                                        }
                                        onChange={(e) => {
                                          setwhen_kyc_required(
                                            parseInt(e.target.value)
                                          );
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="amount_kyc"
                                      >
                                        Amount
                                      </label>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </Col>
                          </Row>

                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Amount
                                  <IsRequired />
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="form-control-wrap">
                                  <input
                                    {...register("particular_amount", {
                                      required: {
                                        value: parseInt(when_kyc_required) == 3,
                                        message: "Amount is required",
                                      },
                                    })}
                                    disabled={
                                      kyc_required == true &&
                                      parseInt(when_kyc_required) == 3
                                        ? false
                                        : true
                                    }
                                    name="particular_amount"
                                    value={particular_amount}
                                    onChange={(e) =>
                                      setparticular_amount(e.target.value)
                                    }
                                    className=" form-control"
                                    placeholder="Amount"
                                    type="text"
                                  />
                                  {errors.particular_amount && (
                                    <span className="invalid">
                                      {errors.particular_amount.message}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="has_free_installment"
                                >
                                  Has Free Installment
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="custom-control custom-control-sm custom-switch">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    name="has_free_installment"
                                    id="has_free_installment"
                                    checked={has_free_installment}
                                    onChange={(e) =>
                                      sethas_free_installment(e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="has_free_installment"
                                  >
                                    {has_free_installment ? "Yes" : "No"}
                                  </label>
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Free Installment
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="form-control-wrap">
                                  <input
                                    {...register("free_installment")}
                                    name="free_installment"
                                    value={free_installment}
                                    onChange={(e) =>
                                      setfree_installment(e.target.value)
                                    }
                                    className=" form-control"
                                    placeholder="Free Installment"
                                    type="text"
                                    readOnly={has_free_installment == false}
                                    disabled={has_free_installment == false}
                                  />
                                  {/* {errors.free_installment && (
                                    <span className="invalid">{errors.free_installment.message}</span>
                                  )} */}
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="pre_close_charges"
                                >
                                  Pre Close Charges
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <TextInputField
                                register={register}
                                isRequired={false}
                                id={"pre_close_charges"}
                                placeholder="Pre Close Charges"
                                value={pre_close_charges}
                                SetValue={setpre_close_charges}
                              />
                              {errors?.pre_close_charges && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {"This field is required"}
                                </span>
                              )}
                            </Col>
                          </Row>
                        </div>
                      </Row>
                    </Col>
                    <Col md={4}>
                      <Row className="form-group row g-4">
                        <div className="custom-grid">
                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Status
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="custom-control custom-control-sm custom-switch">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    name="scheme_status"
                                    id="scheme_status"
                                    checked={scheme_status}
                                    onChange={(e) =>
                                      setscheme_status(e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="scheme_status"
                                  >
                                    {scheme_status ? "Active" : "Inactive"}
                                  </label>
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Allow Join
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="custom-control custom-control-sm custom-switch">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    name="allow_join"
                                    id="allow_join"
                                    checked={allow_join}
                                    onChange={(e) =>
                                      setallow_join(e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="allow_join"
                                  >
                                    {allow_join ? "Yes" : "No"}
                                  </label>
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Allow Join Multi Acc
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="custom-control custom-control-sm custom-switch">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    name="allow_join_multi_acc"
                                    id="allow_join_multi_acc"
                                    checked={allow_join_multi_acc}
                                    onChange={(e) =>
                                      setallow_join_multi_acc(e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="allow_join_multi_acc"
                                  >
                                    {allow_join_multi_acc ? "Yes" : "No"}
                                  </label>
                                </div>
                              </div>
                            </Col>
                          </Row>
                          {scheme_type == 2 && (
                            <Row className="form-group row g-4">
                              <Col md="4">
                                <div className="form-group">
                                  <label
                                    className="form-label"
                                    htmlFor="site-name"
                                  >
                                    Show Target
                                  </label>
                                </div>
                              </Col>
                              <Col lg="8">
                                <div className="form-group">
                                  <div className="custom-control custom-control-sm custom-switch">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      name="show_target"
                                      id="show_target"
                                      checked={show_target}
                                      onChange={(e) =>
                                        setshow_target(e.target.checked)
                                      }
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="show_target"
                                    >
                                      {show_target ? "Yes" : "No"}
                                    </label>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          )}
                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Weight Convert
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="custom-control custom-control-sm custom-switch">
                                  <input
                                    disabled={scheme_type == 0}
                                    // disabled={!(scheme_type == 0)}
                                    type="checkbox"
                                    className="custom-control-input"
                                    name="convert_to_weight"
                                    id="convert_to_weight"
                                    checked={convert_to_weight}
                                    onChange={(e) =>
                                      setconvert_to_weight(e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="convert_to_weight"
                                  >
                                    {convert_to_weight ? "Yes" : "No"}
                                  </label>
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col md="12">
                              <Label>Restrict payment to</Label>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col lg="12">
                              <div className="form-group">
                                <ul className="custom-control-group g-3 align-center flex-wrap">
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="res_none"
                                        type="radio"
                                        name={"restrict_payment"}
                                        value={1}
                                        className="custom-control-input"
                                        checked={
                                          restrict_payment == 1 ? true : false
                                        }
                                        onChange={(e) => {
                                          setrestrict_payment(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="res_none"
                                      >
                                        None
                                      </label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="res_all"
                                        type="radio"
                                        value={2}
                                        name={"restrict_payment"}
                                        className="custom-control-input "
                                        checked={
                                          restrict_payment == 2 ? true : false
                                        }
                                        onChange={(e) => {
                                          setrestrict_payment(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="res_all"
                                      >
                                        All
                                      </label>
                                    </div>
                                  </li>

                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="res_admin"
                                        type="radio"
                                        value={3}
                                        name={"restrict_payment"}
                                        className="custom-control-input "
                                        checked={
                                          restrict_payment == 3 ? true : false
                                        }
                                        onChange={(e) => {
                                          setrestrict_payment(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="res_admin"
                                      >
                                        Admin
                                      </label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="res__m_app"
                                        type="radio"
                                        value={4}
                                        name={"restrict_payment"}
                                        className="custom-control-input "
                                        checked={
                                          restrict_payment == 4 ? true : false
                                        }
                                        onChange={(e) => {
                                          setrestrict_payment(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="res__m_app"
                                      >
                                        M App
                                      </label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="res_c_app"
                                        type="radio"
                                        value={5}
                                        name={"restrict_payment"}
                                        className="custom-control-input "
                                        checked={
                                          restrict_payment == 5 ? true : false
                                        }
                                        onChange={(e) => {
                                          setrestrict_payment(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="res_c_app"
                                      >
                                        Coll. App
                                      </label>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col md="12">
                              <Label>Scheme Visible</Label>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col lg="12">
                              <div className="form-group">
                                <ul className="custom-control-group g-3 align-center flex-wrap">
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="vis_all"
                                        type="radio"
                                        name={"scheme_visibility"}
                                        value={1}
                                        className="custom-control-input"
                                        checked={
                                          scheme_visibility == 1 ? true : false
                                        }
                                        onChange={(e) => {
                                          setscheme_visibility(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="vis_all"
                                      >
                                        All
                                      </label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="vis_admin_app"
                                        type="radio"
                                        value={2}
                                        name={"scheme_visibility"}
                                        className="custom-control-input "
                                        checked={
                                          scheme_visibility == 2 ? true : false
                                        }
                                        onChange={(e) => {
                                          setscheme_visibility(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="vis_admin_app"
                                      >
                                        Admin App
                                      </label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="vis_m_app"
                                        type="radio"
                                        value={3}
                                        name={"scheme_visibility"}
                                        className="custom-control-input "
                                        checked={
                                          scheme_visibility == 3 ? true : false
                                        }
                                        onChange={(e) => {
                                          setscheme_visibility(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="vis_m_app"
                                      >
                                        M App
                                      </label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="vis_c_app"
                                        type="radio"
                                        value={4}
                                        name={"scheme_visibility"}
                                        className="custom-control-input "
                                        checked={
                                          scheme_visibility == 4 ? true : false
                                        }
                                        onChange={(e) => {
                                          setscheme_visibility(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="vis_c_app"
                                      >
                                        Coll. App
                                      </label>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col md="12">
                              <Label>Payable Type</Label>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col lg="12">
                              <div className="form-group">
                                <ul className="custom-control-group g-3 align-center flex-wrap">
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="pay_fix"
                                        type="radio"
                                        name={"sch_payable_type"}
                                        value={1}
                                        className="custom-control-input"
                                        checked={
                                          sch_payable_type == 1 ? true : false
                                        }
                                        onChange={(e) => {
                                          setsch_payable_type(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="pay_fix"
                                      >
                                        Fixed
                                      </label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="pay_flex"
                                        type="radio"
                                        value={2}
                                        name={"sch_payable_type"}
                                        className="custom-control-input "
                                        checked={
                                          sch_payable_type == 2 ? true : false
                                        }
                                        onChange={(e) => {
                                          setsch_payable_type(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="pay_flex"
                                      >
                                        Flexible
                                      </label>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Row>
                    </Col>
                  </Row>
                  <div className="gy-3">
                    <Row className="g-3 align-center mt-2">
                      <Col lg="8">
                        <h6>Scheme Description</h6>
                        <ReactQuill
                          value={scheme_description}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>

                    <Row className="g-3">
                      <Col lg="7" className="offset-lg-5">
                        <div className="form-group mt-2">
                          <CancelButton
                            disabled={isSubmitting}
                            color="danger"
                            size="md"
                            onClick={() =>
                              navigate(
                                `${process.env.PUBLIC_URL}/schememaster/scheme/list`
                              )
                            }
                          >
                            Cancel
                          </CancelButton>

                          <Button
                            color="primary"
                            size="md"
                            onClick={handleSubmit(gotoNextTab)}
                            // onClick={() => {
                            //   if (validateAllDigiInterestDetails()) {
                            //     handleSubmit(gotoNextTab)();
                            //   } else {
                            //     console.log("errrrror ......");
                            //   }
                            // }}
                          >
                            Next
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </TabPane>

                <TabPane tabId="2">
                  <div className="gy-3">
                    <Row className="g-3 align-center">
                      <Col lg="1">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                            From
                          </label>
                        </div>
                      </Col>
                      <Col lg="2">
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <input
                              {...register1("installment_from", {
                                required: "From is required",
                              })}
                              name="installment_from"
                              value={addformdata?.installment_from}
                              onChange={(e) =>
                                setaddformdata({
                                  ...addformdata,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              className=" form-control"
                              placeholder="From Installment"
                              type="text"
                            />
                            {errors1.installment_from && (
                              <span className="invalid">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                      </Col>
                      <Col lg="1"></Col>
                      <Col lg="1">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                            To
                          </label>
                        </div>
                      </Col>
                      <Col lg="2">
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <input
                              {...register1("installment_to", {
                                required: "To is required",
                              })}
                              name="installment_to"
                              value={addformdata.installment_to}
                              onChange={(e) =>
                                setaddformdata({
                                  ...addformdata,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              className=" form-control"
                              placeholder="To Installment"
                              type="text"
                            />
                            {errors1.installment_to && (
                              <span className="invalid">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                      </Col>
                      <Col lg="1"></Col>
                      <Col lg="1">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                            Limit by
                          </label>
                        </div>
                      </Col>
                      <Col lg="2">
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <div className="form-control-select">
                              <select
                                className="form-control form-select"
                                id="limit_by"
                                name="limit_by"
                                {...register1("limit_by", {
                                  required: true,
                                })}
                                value={addformdata.limit_by}
                                onChange={(e) =>
                                  setaddformdata({
                                    ...addformdata,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              >
                                <option
                                  label="Select limit by"
                                  value=""
                                ></option>
                                {limit_by_arr?.map((item, index) => (
                                  <option
                                    onClick={() => {
                                      addformdata.limit_by_value = item.label;
                                    }}
                                    key={index}
                                    value={item?.value}
                                  >
                                    {item?.label}
                                  </option>
                                ))}
                              </select>
                              {errors1.limit_by && (
                                <span className="invalid">
                                  This field is required
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row className="g-3 align-center">
                      <Col lg="1">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                            Payment type
                          </label>
                        </div>
                      </Col>
                      <Col lg="2">
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <div className="form-control-select">
                              <select
                                className="form-control form-select"
                                id="payment_chance_type"
                                name="payment_chance_type"
                                {...register1("payment_chance_type", {
                                  required: true,
                                })}
                                value={addformdata.payment_chance_type}
                                onChange={(e) =>
                                  setaddformdata({
                                    ...addformdata,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              >
                                <option
                                  label="Select payment type"
                                  value=""
                                ></option>
                                {payment_chnc_type_arr?.map((item, index) => (
                                  <option
                                    onClick={() => {
                                      addformdata.payment_chance_type_value =
                                        item.label;
                                    }}
                                    key={index}
                                    value={item?.value}
                                  >
                                    {item?.label}
                                  </option>
                                ))}
                              </select>
                              {errors1.payment_chance_type && (
                                <span className="invalid">
                                  This field is required
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col lg="1"></Col>
                      <Col lg="1">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                            Payment Chances
                          </label>
                        </div>
                      </Col>
                      <Col lg="2">
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <input
                              {...register1("payment_chance_value", {
                                required: "Chances is required",
                              })}
                              name="payment_chance_value"
                              value={addformdata.payment_chance_value}
                              onChange={(e) =>
                                setaddformdata({
                                  ...addformdata,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              className=" form-control"
                              placeholder="Enter Chances"
                              type="text"
                            />
                            {errors1.payment_chance_value && (
                              <span className="invalid">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                      </Col>
                      <Col lg="1"></Col>
                    </Row>

                    <Row lg={12} className={"form-control-sm"}>
                      <Col md={4}>
                        <div className="custom-grid">
                          <Row className="form-group row g-4">
                            <Col md="12">
                              <h6>
                                {" "}
                                <u>Minimum</u>
                              </h6>
                            </Col>
                          </Row>

                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Formula
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
                                      id="min_formula"
                                      name="min_formula"
                                      {...register1("min_formula", {
                                        required: true,
                                      })}
                                      value={addformdata.min_formula}
                                      onChange={(e) =>
                                      {
                                        // console.log(e?.target?.selectedOptions[0]?.label)
                                        
                                        setaddformdata({
                                          ...addformdata,
                                          [e.target.name]: e.target.value,
                                          min_formula_value: e?.target?.selectedOptions[0]?.label,
                                        })
                                      }
                                      }
                                    >
                                      {paymentFormulaList?.map(
                                        (item, index) => (
                                          <option
                                        //     onClick={() => {
                                        //       setaddformdata({
                                        //   ...addformdata,
                                        //   min_formula_value: item.name,
                                        // })
                                        //       // addformdata.min_formula_value =
                                        //       //   item.name;
                                        //     }}
                                            key={index}
                                            value={item?.id}
                                          >
                                            {item?.name}
                                          </option>
                                        )
                                      )}
                                    </select>
                                    {errors1.min_formula && (
                                      <span className="invalid">
                                        This field is required
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Parameter
                                  <IsRequired />
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="form-control-wrap">
                                  <input
                                    {...register1("min_parameter", {
                                      required: "Min Parameter is required",
                                    })}
                                    name="min_parameter"
                                    value={addformdata.min_parameter}
                                    onChange={(e) =>
                                      setaddformdata({
                                        ...addformdata,
                                        [e.target.name]: e.target.value,
                                      })
                                    }
                                    className=" form-control"
                                    placeholder="Enter Min Paramete"
                                    type="text"
                                  />
                                  {errors1.min_parameter && (
                                    <span className="invalid">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Condition
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
                                      id="min_condition"
                                      name="min_condition"
                                      {...register1("min_condition", {
                                        required: true,
                                      })}
                                      value={addformdata.min_condition}
                                      onChange={(e) =>
                                        setaddformdata({
                                          ...addformdata,
                                          [e.target.name]: e.target.value,
                                          min_condition_value : e?.target?.selectedOptions[0]?.label
                                        })
                                      }
                                    >
                                      {condition?.map((item, index) => (
                                        <option
                                          // onClick={() => {
                                          //   addformdata.min_condition_value =
                                          //     item.label;
                                          // }}
                                          key={index}
                                          value={item?.value}
                                        >
                                          {item?.label}
                                        </option>
                                      ))}
                                    </select>
                                    {errors1.min_condition && (
                                      <span className="invalid">
                                        This field is required
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Condition Parameter
                                  <IsRequired />
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="form-control-wrap">
                                  <input
                                    {...register1("min_condition_param", {
                                      required:
                                        "Min Condition Parameter is required",
                                    })}
                                    name="min_condition_param"
                                    value={addformdata.min_condition_param}
                                    onChange={(e) =>
                                      setaddformdata({
                                        ...addformdata,
                                        [e.target.name]: e.target.value,
                                      })
                                    }
                                    className=" form-control"
                                    placeholder="Enter Min Condition Parameter"
                                    type="text"
                                  />
                                  {errors1.min_condition_param && (
                                    <span className="invalid">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>

                      <Col md={4}>
                        <div className="custom-grid">
                          <Row className="form-group row g-4">
                            <Col md="12">
                              <h6>
                                {" "}
                                <u>Maximum</u>
                              </h6>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Formula
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
                                      id="max_formula"
                                      name="max_formula"
                                      {...register1("max_formula", {
                                        required: true,
                                      })}
                                      value={addformdata.max_formula}
                                      onChange={(e) =>
                                        setaddformdata({
                                          ...addformdata,
                                          [e.target.name]: e.target.value,
                                          max_formula_value: e?.target?.selectedOptions[0]?.label,
                                        })
                                      }
                                    >
                                      {paymentFormulaList?.map(
                                        (item, index) => (
                                          <option
                                        //     onClick={() => {
                                        //       console.log(item);
                                              
                                        //       setaddformdata({
                                        //   ...addformdata,
                                        //   max_formula_value: item.name,
                                        // })
                                        //       // addformdata.max_formula_value =
                                        //       //   item.name;
                                        //     }}
                                            key={index}
                                            value={item?.id}
                                          >
                                            {item?.name}
                                          </option>
                                        )
                                      )}
                                    </select>
                                    {errors1.max_formula && (
                                      <span className="invalid">
                                        This field is required
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Parameter
                                  <IsRequired />
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="form-control-wrap">
                                  <input
                                    {...register1("max_parameter", {
                                      required: "Max Parameter is required",
                                    })}
                                    name="max_parameter"
                                    value={addformdata.max_parameter}
                                    onChange={(e) =>
                                      setaddformdata({
                                        ...addformdata,
                                        [e.target.name]: e.target.value,
                                      })
                                    }
                                    className=" form-control"
                                    placeholder="Enter Max Paramete"
                                    type="text"
                                  />
                                  {errors1.max_parameter && (
                                    <span className="invalid">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Condition
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
                                      id="max_condition"
                                      name="max_condition"
                                      {...register1("max_condition", {
                                        required: true,
                                      })}
                                      value={addformdata.max_condition}
                                      onChange={(e) =>
                                        setaddformdata({
                                          ...addformdata,
                                          [e.target.name]: e.target.value,
                                          max_condition_value : e?.target?.selectedOptions[0]?.label
                                        })
                                      }
                                    >
                                      {condition?.map((item, index) => (
                                        <option
                                          // onClick={() => {
                                          //   addformdata.max_condition_value =
                                          //     item.label;
                                          // }}
                                          key={index}
                                          value={item?.value}
                                        >
                                          {item?.label}
                                        </option>
                                      ))}
                                    </select>
                                    {errors1.max_condition && (
                                      <span className="invalid">
                                        This field is required
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="site-name"
                                >
                                  Condition Parameter
                                  <IsRequired />
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="form-control-wrap">
                                  <input
                                    {...register1("max_condition_param", {
                                      required:
                                        "Max Condition Parameter is required",
                                    })}
                                    name="max_condition_param"
                                    value={addformdata.max_condition_param}
                                    onChange={(e) =>
                                      setaddformdata({
                                        ...addformdata,
                                        [e.target.name]: e.target.value,
                                      })
                                    }
                                    className=" form-control"
                                    placeholder="Enter Max Condition Parameter"
                                    type="text"
                                  />
                                  {errors1.max_condition_param && (
                                    <span className="invalid">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>

                      <Col md={4}>
                        <Row className="form-group row g-4">
                          <div className="custom-grid">
                            <Row className="form-group row g-4">
                              <Col md="12">
                                <h6>
                                  {" "}
                                  <u>Denomination</u>
                                </h6>
                              </Col>
                            </Row>
                            <Row className="form-group row g-4">
                              <Col md="4">
                                <div className="form-group">
                                  <label
                                    className="form-label"
                                    htmlFor="site-name"
                                  >
                                    Denom type
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
                                        id="denom_type"
                                        name="denom_type"
                                        {...register1("denom_type", {
                                          required: true,
                                        })}
                                        value={addformdata.denom_type}
                                        onChange={(e) =>
                                          setaddformdata({
                                            ...addformdata,
                                            [e.target.name]: e.target.value,
                                            denom_type_value : e?.target?.selectedOptions[0]?.label
                                          })
                                        }
                                      >
                                        <option
                                          label="Select denom type"
                                          value=""
                                        ></option>
                                        {denom_type_arr?.map((item, index) => (
                                          <option
                                            // onClick={() => {
                                            //   addformdata.denom_type_value =
                                            //     item.label;
                                            // }}
                                            key={index}
                                            value={item?.value}
                                          >
                                            {item?.label}
                                          </option>
                                        ))}
                                      </select>
                                      {errors1.denom_type && (
                                        <span className="invalid">
                                          This field is required
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            <Row className="form-group row g-4">
                              <Col md="4">
                                <div className="form-group">
                                  <label
                                    className="form-label"
                                    htmlFor="site-name"
                                  >
                                    Denom value
                                    <IsRequired />
                                  </label>
                                </div>
                              </Col>
                              <Col lg="8">
                                <div className="form-group">
                                  <div className="form-control-wrap">
                                    <input
                                      {...register1("denom_value", {
                                        required: "Denom is required",
                                      })}
                                      name="denom_value"
                                      value={addformdata.denom_value}
                                      onChange={(e) =>
                                        setaddformdata({
                                          ...addformdata,
                                          [e.target.name]: e.target.value,
                                        })
                                      }
                                      className=" form-control"
                                      placeholder="Denomination value"
                                      type="text"
                                    />
                                    {errors1.denom_value && (
                                      <span className="invalid">
                                        This field is required
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Row>

                        <Row className="form-group row g-4">
                          <div className="custom-grid">
                            <Row className="form-group row g-4">
                              <Col md="12">
                                <h6>
                                  {" "}
                                  <u>Discount</u>
                                </h6>
                              </Col>
                            </Row>
                            <Row className="form-group row g-4">
                              <Col md="4">
                                <div className="form-group">
                                  <label
                                    className="form-label"
                                    htmlFor="site-name"
                                  >
                                    Discount type
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
                                        id="discount_type"
                                        name="discount_type"
                                        {...register1("discount_type", {
                                          required: true,
                                        })}
                                        value={addformdata.discount_type}
                                        onChange={(e) =>
                                          setaddformdata({
                                            ...addformdata,
                                            [e.target.name]: e.target.value,
                                            discount_type_value : e?.target?.selectedOptions[0]?.label
                                          })
                                        }
                                      >
                                        <option
                                          label="Select Discount type"
                                          value=""
                                        ></option>
                                        {discount_type_arr?.map(
                                          (item, index) => (
                                            <option
                                              // onClick={() => {
                                              //   addformdata.discount_type_value =
                                              //     item.label;
                                              // }}
                                              key={index}
                                              value={item?.value}
                                            >
                                              {item?.label}
                                            </option>
                                          )
                                        )}
                                      </select>
                                      {errors1.discount_type && (
                                        <span className="invalid">
                                          This field is required
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            <Row className="form-group row g-4">
                              <Col md="4">
                                <div className="form-group">
                                  <label
                                    className="form-label"
                                    htmlFor="site-name"
                                  >
                                    Discount value
                                    <IsRequired />
                                  </label>
                                </div>
                              </Col>
                              <Col lg="8">
                                <div className="form-group">
                                  <div className="form-control-wrap">
                                    <input
                                      {...register1("discount_value", {
                                        required: "Denom is required",
                                      })}
                                      name="discount_value"
                                      value={addformdata.discount_value}
                                      onChange={(e) =>
                                        setaddformdata({
                                          ...addformdata,
                                          [e.target.name]: e.target.value,
                                        })
                                      }
                                      className=" form-control"
                                      placeholder="Discount value"
                                      type="text"
                                    />
                                    {errors1.discount_value && (
                                      <span className="invalid">
                                        This field is required
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Row>
                      </Col>
                    </Row>

                    <Row className="g-3">
                      <Col lg="7" className="offset-lg-5">
                        <div className="form-group">
                          <Button
                            color="primary"
                            size="md"
                            onClick={
                              formMode == "0"
                                ? handleSubmit1(additem)
                                : handleSubmit1(edititem)
                            }
                          >
                            {formMode == "0" ? " Add " : "Edit"}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <Row lg={12} className={"form-control-sm"}>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>Values</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prevData?.map((obj, idx) => {
                          return (
                            <tr key={obj.id}>
                              <td className="flex">
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                  }}
                                >
                                  <Button
                                    color="primary"
                                    onClick={() => {
                                      setModal(true);
                                      SetDelItemId(obj?.id);
                                    }}
                                    size="sm"
                                  >
                                    <Icon name="trash-fill"></Icon>
                                  </Button>

                                  <Button
                                    color="primary"
                                    onClick={() => toeditform(obj)}
                                    size="sm"
                                  >
                                    <Icon name="edit-fill"></Icon>
                                  </Button>
                                </div>
                              </td>
                              <td>
                                <div class="">
                                  <Row className="form-group row">
                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          From Installment
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.installment_from != "" ||
                                          undefined ||
                                          null
                                            ? obj?.installment_from
                                            : "-"}{" "}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          To Installment
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.installment_to != "" ||
                                          undefined ||
                                          null
                                            ? obj?.installment_to
                                            : "-"}{" "}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          Min Formula
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.min_formula_value != "" ||
                                          undefined ||
                                          null
                                            ? obj?.min_formula_value
                                            : "-"}{" "}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          Max Formula
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.max_formula_value != "" ||
                                          undefined ||
                                          null
                                            ? obj?.max_formula_value
                                            : "-"}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          Minimum Amount
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.min_parameter != "" ||
                                          undefined ||
                                          null
                                            ? obj?.min_parameter
                                            : "-"}{" "}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          Maximum Amount
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.max_parameter != "" ||
                                          undefined ||
                                          null
                                            ? obj?.max_parameter
                                            : "-"}{" "}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          Minimum Condition
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.min_condition_value != "" ||
                                          undefined ||
                                          null
                                            ? obj?.min_condition_value
                                            : "-"}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          Maximum Condition
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.max_condition_value != "" ||
                                          undefined ||
                                          null
                                            ? obj?.max_condition_value
                                            : "-"}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          Minimum Condition Parameter
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.min_condition_param != "" ||
                                          undefined ||
                                          null
                                            ? obj?.min_condition_param
                                            : "-"}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          Maximum Condition Parameter
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.max_condition_param != "" ||
                                          undefined ||
                                          null
                                            ? obj?.max_condition_param
                                            : "-"}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          Discount Type
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.discount_type_value != "" ||
                                          undefined ||
                                          null
                                            ? obj?.discount_type_value
                                            : "-"}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          Discount Value
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.discount_value != "" ||
                                          undefined ||
                                          null ||
                                          obj?.discount_value != 0
                                            ? obj?.discount_value
                                            : "-"}{" "}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          Denom Type
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.denom_type_value != "" ||
                                          undefined ||
                                          null
                                            ? obj?.denom_type_value
                                            : "-"}{" "}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          Denom Value
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.denom_value != "" ||
                                          undefined ||
                                          null
                                            ? obj?.denom_value
                                            : "-"}{" "}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          Payment chance Type
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.payment_chance_type_value !=
                                            "" ||
                                          undefined ||
                                          null
                                            ? obj?.payment_chance_type_value
                                            : "-"}{" "}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg="3">
                                      <div className="form-group">
                                        <label className="form-label font-weight-bolder ">
                                          Payment chances
                                        </label>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <div className="form-control-wrap">
                                        <div>
                                          {obj?.payment_chance_value != "" ||
                                          undefined ||
                                          null
                                            ? obj?.payment_chance_value
                                            : "-"}{" "}
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </Row>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <FormGroup className="mt-2 form-group">
                      <CancelButton
                        disabled={isSubmitting}
                        color="danger"
                        size="md"
                        onClick={() =>
                          navigate(
                            `${process.env.PUBLIC_URL}/schememaster/scheme/list`
                          )
                        }
                      >
                        Cancel
                      </CancelButton>

                      <Button
                        color="primary"
                        size="md"
                        onClick={handleSubmit(gotoNextTabNew)}
                      >
                        Next
                      </Button>
                    </FormGroup>

                    {/* {add !== undefined && (
                      <FormGroup className="mt-2 form-group">
                        <SaveButton
                          disabled={prevData?.length == 0 || isSubmitting}
                          size="md"
                          color="primary"
                          onClick={() => postData()}
                        >
                          {isSubmitting ? "Saving" : "Save"}
                        </SaveButton>
                      </FormGroup>
                    )}
                    {id !== undefined && (
                      <FormGroup className="mt-2 form-group">
                        <SaveButton
                          disabled={prevData?.length == 0 || isSubmitting}
                          size="md"
                          color="primary"
                          onClick={() => putData()}
                        >
                          {isSubmitting ? "Saving" : "Save"}
                        </SaveButton>
                      </FormGroup>
                    )} */}
                  </div>
                </TabPane>

                <TabPane tabId="3">
                  <div className="gy-3">
                    <Row md={12} className="form-group row g-4">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>S.NO</th>
                              <th>Installment From</th>
                              <th>Installment To</th>
                              <th>V.A</th>
                              <th>M.C</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {closing_settings?.map((obj, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <input
                                      {...register2(
                                        `installment_from${obj.id}`,
                                        {
                                          required: "Required",
                                          validate: (val) => {
                                            if (parseFloat(val) >= 1000000000) {
                                              return "Max Value is 999999999.999";
                                            }
                                            const numStr = String(val);
                                            if (
                                              numStr.includes(".") &&
                                              numStr.split(".")[1].length > 3
                                            ) {
                                              return "Max 3 decimal places allowed ";
                                            }
                                          },
                                        }
                                      )}
                                      min={0}
                                      step={0.001}
                                      name="installment_from"
                                      onKeyDown={(evt) =>
                                        ["e", "E", "+", "-"].includes(
                                          evt.key
                                        ) && evt.preventDefault()
                                      }
                                      className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                      type="number"
                                      value={obj?.installment_from}
                                      onChange={(e) =>
                                        editClosingSettings({
                                          ids: obj?.id,
                                          name: e.target.name,
                                          val: e.target.value,
                                        })
                                      }
                                    />
                                    {errors2?.[
                                      `installment_from` + `${String(obj.id)}`
                                    ] && (
                                      <span className="text-danger">
                                        <Icon
                                          className={"sm"}
                                          name="alert-circle"
                                        />
                                        {
                                          errors2?.[
                                            `installment_from` +
                                              `${String(obj.id)}`
                                          ].message
                                        }
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <input
                                      {...register2(`installment_to${obj.id}`, {
                                        required: "Required",
                                        validate: (val) => {
                                          if (parseFloat(val) >= 1000000000) {
                                            return "Max Value is 999999999.999";
                                          }
                                          const numStr = String(val);
                                          if (
                                            numStr.includes(".") &&
                                            numStr.split(".")[1].length > 3
                                          ) {
                                            return "Max 3 decimal places allowed ";
                                          }

                                          if (
                                            parseFloat(
                                              watch(
                                                `installment_to` +
                                                  `${String(obj.id)}`
                                              )
                                            ) > val
                                          ) {
                                            return "From Weight can't be greater than To cent";
                                          }
                                        },
                                      })}
                                      name="installment_to"
                                      min={0}
                                      step={0.001}
                                      onKeyDown={(evt) =>
                                        ["e", "E", "+", "-"].includes(
                                          evt.key
                                        ) && evt.preventDefault()
                                      }
                                      className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                      type="number"
                                      value={obj?.installment_to}
                                      onChange={(e) =>
                                        editClosingSettings({
                                          ids: obj?.id,
                                          name: e.target.name,
                                          val: e.target.value,
                                        })
                                      }
                                    />
                                    {errors2?.[
                                      `installment_to` + `${String(obj.id)}`
                                    ] && (
                                      <span className="text-danger">
                                        <Icon
                                          className={"sm"}
                                          name="alert-circle"
                                        />
                                        {
                                          errors2?.[
                                            `installment_to` +
                                              `${String(obj.id)}`
                                          ].message
                                        }
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <input
                                      {...register2(
                                        `wastage_benefit${obj.id}`,
                                        {
                                          required: "Required",
                                          validate: (val) => {
                                            if (parseFloat(val) > 100) {
                                              return "Max Value is 100";
                                            }
                                          },
                                        }
                                      )}
                                      name="wastage_benefit"
                                      min={0}
                                      max={100} // Set max to 100
                                      step={0.001}
                                      onKeyDown={(evt) => {
                                        if (
                                          ["e", "E", "+", "-"].includes(
                                            evt.key
                                          ) ||
                                          evt.key === "ArrowUp" ||
                                          evt.key === "ArrowDown"
                                        ) {
                                          evt.preventDefault(); // Prevent entering scientific notation and increment/decrement with arrow keys
                                        }
                                      }}
                                      onInput={(e) => {
                                        const value = parseFloat(
                                          e.target.value
                                        );
                                        if (value > 100) {
                                          e.target.value = 100; // If value exceeds 100, set it back to 100
                                        }
                                      }}
                                      className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                      type="number"
                                      value={obj?.wastage_benefit}
                                      onChange={(e) =>
                                        editClosingSettings({
                                          ids: obj?.id,
                                          name: e.target.name,
                                          val: e.target.value,
                                        })
                                      }
                                    />
                                    {errors2?.[
                                      `wastage_benefit` + `${String(obj.id)}`
                                    ] && (
                                      <span className="text-danger">
                                        <Icon
                                          className={"sm"}
                                          name="alert-circle"
                                        />
                                        {
                                          errors2?.[
                                            `wastage_benefit` +
                                              `${String(obj.id)}`
                                          ].message
                                        }
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <input
                                      {...register2(`mc_benefit${obj.id}`, {
                                        required: "Required",
                                        validate: (val) => {
                                          if (parseFloat(val) > 100) {
                                            return "Max Value is 100";
                                          }
                                        },
                                      })}
                                      name="mc_benefit"
                                      min={0}
                                      max={100} // Set max to 100
                                      step={0.001}
                                      onKeyDown={(evt) => {
                                        if (
                                          ["e", "E", "+", "-"].includes(
                                            evt.key
                                          ) ||
                                          evt.key === "ArrowUp" ||
                                          evt.key === "ArrowDown"
                                        ) {
                                          evt.preventDefault(); // Prevent entering scientific notation and increment/decrement with arrow keys
                                        }
                                      }}
                                      onInput={(e) => {
                                        const value = parseFloat(
                                          e.target.value
                                        );
                                        if (value > 100) {
                                          e.target.value = 100; // If value exceeds 100, set it back to 100
                                        }
                                      }}
                                      className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                      type="number"
                                      value={obj?.mc_benefit}
                                      onChange={(e) =>
                                        editClosingSettings({
                                          ids: obj?.id,
                                          name: e.target.name,
                                          val: e.target.value,
                                        })
                                      }
                                    />
                                    {errors2?.[
                                      `mc_benefit${String(obj.id)}`
                                    ] && (
                                      <span className="text-danger">
                                        <Icon
                                          className={"sm"}
                                          name="alert-circle"
                                        />
                                        {
                                          errors2?.[
                                            `mc_benefit${String(obj.id)}`
                                          ].message
                                        }
                                      </span>
                                    )}
                                  </td>

                                  <td>
                                    {index == closing_settings?.length - 1 && (
                                      <Button
                                        color="primary"
                                        size="sm"
                                        className="btn-icon btn-white btn-dim"
                                       
                                        onClick={() => {
                                          handleSubmit(() => addClosingSettings())();
                                        }} 
                                      >
                                        <Icon name="plus" />
                                      </Button>
                                    )}
                                    <Button
                                      color="primary"
                                      size="sm"
                                      className="btn-icon btn-white btn-dim"
                                      onClick={() =>
                                        deleteClosingSettings(obj?.id)
                                      }
                                    >
                                      <Icon name="trash-fill" />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </Row>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <FormGroup className="mt-2 form-group">
                      <CancelButton
                        disabled={isSubmitting}
                        color="danger"
                        size="md"
                        onClick={() =>
                          navigate(
                            `${process.env.PUBLIC_URL}/schememaster/scheme/list`
                          )
                        }
                      >
                        Cancel
                      </CancelButton>

                      <Button
                        color="primary"
                        size="md"
                        onClick={handleSubmit(goToFourTab)}
                      >
                        Next
                      </Button>

                      {/* <Button className="m-1" color="primary" size="md" onClick={() => goToFirstTab()}>
                        Back
                      </Button> */}

                      {/* <CancelButton
                        disabled={isSubmitting}
                        color="danger"
                        size="md"
                        onClick={() => navigate(`${process.env.PUBLIC_URL}/schememaster/scheme/list`)}
                      >
                        Cancel
                      </CancelButton> */}
                    </FormGroup>

                    {/* {add !== undefined && (
                      <FormGroup className="mt-2 form-group">
                        <SaveButton
                          disabled={prevData?.length == 0 || isSubmitting}
                          size="md"
                          color="primary"
                          onClick={() => postData()}
                        >
                          {isSubmitting ? "Saving" : "Save"}
                        </SaveButton>
                      </FormGroup>
                    )}
                    {id !== undefined && (
                      <FormGroup className="mt-2 form-group">
                        <SaveButton
                          disabled={prevData?.length == 0 || isSubmitting}
                          size="md"
                          color="primary"
                          onClick={() => putData()}
                        >
                          {isSubmitting ? "Saving" : "Save"}
                        </SaveButton>
                      </FormGroup>
                    )} */}
                  </div>
                </TabPane>

                <TabPane tabId="4">
                  <div className="gy-3">
                    <Row md={12} className="form-group row g-4">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>S.NO</th>
                              <th>Items</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {giftSettings?.map((obj, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <OtherInventoryItemDropdown
                                      showOnlyChitGiftOptions={true}
                                      register={register3}
                                      id={`item${obj.id_gift_settings}`}
                                      name="item"
                                      otherInventoryItems={otherInventoryItems}
                                      selectedOtherInventoryItem={obj?.item}
                                      onOtherInventoryItemChange={(value) =>
                                        editGiftSettings({
                                          ids: obj?.id_gift_settings,
                                          name: "item",
                                          val: value,
                                        })
                                      }
                                      isRequired={true}
                                      clearErrors={clearErrors3}
                                      setValue={setValue3}
                                      message={
                                        errors3?.[
                                          `item` +
                                            `${String(obj.id_gift_settings)}`
                                        ] && "Item is Required"
                                      }
                                    />
                                  </td>
                                  <td>
                                    {index == giftSettings?.length - 1 && (
                                      <Button
                                        color="primary"
                                        size="sm"
                                        className="btn-icon btn-white btn-dim"
                                        onClick={() => addGiftSettings()}
                                      >
                                        <Icon name="plus" />
                                      </Button>
                                    )}
                                    <Button
                                      color="primary"
                                      size="sm"
                                      className="btn-icon btn-white btn-dim"
                                      onClick={() =>
                                        deleteGiftSettings(
                                          obj?.id_gift_settings
                                        )
                                      }
                                    >
                                      <Icon name="trash-fill" />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </Row>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <FormGroup className="mt-2 form-group">
                      <CancelButton
                        disabled={isSubmitting}
                        color="danger"
                        size="md"
                        onClick={() =>
                          navigate(
                            `${process.env.PUBLIC_URL}/schememaster/scheme/list`
                          )
                        }
                      >
                        Cancel
                      </CancelButton>

                      <Button
                        className="m-1"
                        color="primary"
                        size="md"
                        onClick={() => gotoNextTabNew()}
                      >
                        Back
                      </Button>
                    </FormGroup>

                    {add !== undefined && (
                      <FormGroup className="mt-2 form-group">
                        <SaveButton
                          disabled={
                            (scheme_type !== 2 && prevData?.length == 0) ||
                            isSubmitting
                          }
                          size="md"
                          color="primary"
                          onClick={() => postData()}
                        >
                          {isSubmitting ? "Saving" : "Save"}
                        </SaveButton>
                      </FormGroup>
                    )}
                    {id !== undefined && (
                      <FormGroup className="mt-2 form-group">
                        <SaveButton
                          disabled={
                            (scheme_type !== 2 && prevData?.length == 0) ||
                            isSubmitting
                          }
                          size="md"
                          color="primary"
                          onClick={() => putData()}
                        >
                          {isSubmitting ? "Saving" : "Save"}
                        </SaveButton>
                      </FormGroup>
                    )}
                  </div>
                </TabPane>

                <TabPane tabId="5">
                  <div className="gy-3">
                    <Row>
                      <div className="row">
                        <div
                          className="col-md-9"
                          style={{ paddingRight: "0px" }}
                        >
                          <h6>
                            Payment Digi Interest{" "}
                            {digiInterestDetails?.length == 0 && (
                              <span onClick={() => addNewInterestRow()}>
                                {" "}
                                (<Icon name="plus"></Icon>){" "}
                              </span>
                            )}
                          </h6>{" "}
                        </div>

                        <div
                          className="col-md-3"
                          style={{
                            paddingRight: "0px",
                            paddingLeft: "0px",
                          }}
                        >
                          {/* <input type="text" style={{textAlign: "right" }} className="form-control form-control-sm" readOnly placeholder=" Pure Wt (g)"  /> */}
                        </div>
                      </div>
                      <div className="mt-1 table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>SNo</th>
                              <th>From Day</th>
                              <th>To Day</th>
                              <th>Interest</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {digiInterestDetails?.length > 0 &&
                              digiInterestDetails?.map((item, rowIndex) => (
                                <tr key={rowIndex}>
                                  <td>{rowIndex + 1}</td>
                                  <td>
                                    <input
                                      {...register("from_days_" + rowIndex, {})}
                                      className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                      placeholder="From Days"
                                      type="number"
                                      name="fromDays"
                                      value={item.from_days}
                                      // style={{ textAlign: "right" }}
                                      onChange={(e) => {
                                        handleIntrestChange(
                                          rowIndex,
                                          "from_days",
                                          e.target.value
                                        );
                                        setValue(
                                          "from_days_" + rowIndex,
                                          e.target.value
                                        );
                                        clearErrors("from_days_" + rowIndex);
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      {...register("to_days_" + rowIndex, {})}
                                      className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                      placeholder="To Days"
                                      type="number"
                                      name="toDays"
                                      value={item.to_days}
                                      // style={{ textAlign: "right" }}
                                      onChange={(e) => {
                                        handleIntrestChange(
                                          rowIndex,
                                          "to_days",
                                          e.target.value
                                        );
                                        setValue(
                                          "to_days_" + rowIndex,
                                          e.target.value
                                        );
                                        clearErrors("to_days_" + rowIndex);
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      {...register("intrest_" + rowIndex, {})}
                                      className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                      placeholder="Intrest"
                                      type="number"
                                      name="intrest"
                                      value={item.interest_percentage}
                                      // style={{ textAlign: "right" }}
                                      onChange={(e) => {
                                        handleIntrestChange(
                                          rowIndex,
                                          "interest_percentage",
                                          e.target.value
                                        );
                                        setValue(
                                          "intrest_" + rowIndex,
                                          e.target.value
                                        );
                                        clearErrors("intrest_" + rowIndex);
                                      }}
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {" "}
                                    {
                                      digiInterestDetails?.length > 0 && (
                                        <Button
                                          color="primary"
                                          size="sm"
                                          className="btn-icon btn-white btn-dim"
                                          onClick={() => addNewInterestRow()}
                                        >
                                          <Icon name="plus" />
                                        </Button>
                                      )
                                      // <Icon
                                      //   name={"plus"}
                                      //   onClick={() =>
                                      //     addNewInterestRow()
                                      //   }
                                      // ></Icon>
                                    }
                                    {/* <Icon
                                              name={"trash-fill"}
                                              onClick={() =>
                                                handleRemove(rowIndex)
                                              }
                                            ></Icon> */}
                                    <Button
                                      color="primary"
                                      size="sm"
                                      className="btn-icon btn-white btn-dim"
                                      onClick={() => handleRemove(rowIndex)}
                                    >
                                      <Icon name="trash-fill" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            {digiInterestDetails?.length == 0 && (
                              <tr>
                                <td colSpan={5} style={{ textAlign: "center" }}>
                                  {" "}
                                  No Data
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Row>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <FormGroup className="mt-2 form-group">
                      <CancelButton
                        disabled={isSubmitting}
                        color="danger"
                        size="md"
                        onClick={() =>
                          navigate(
                            `${process.env.PUBLIC_URL}/schememaster/scheme/list`
                          )
                        }
                      >
                        Cancel
                      </CancelButton>

                      <Button
                        color="primary"
                        size="md"
                        // onClick={handleSubmit(gotoNextTabNew)}
                        onClick={() => {
                          if (validateAllDigiInterestDetails()) {
                            handleSubmit(gotoNextTabNew)();
                          } else {
                            console.log("errrrror ......");
                          }
                        }}
                      >
                        Next
                      </Button>
                    </FormGroup>

                    {/* {add !== undefined && (
                      <FormGroup className="mt-2 form-group">
                        <SaveButton
                          disabled={prevData?.length == 0 || isSubmitting}
                          size="md"
                          color="primary"
                          onClick={() => postData()}
                        >
                          {isSubmitting ? "Saving" : "Save"}
                        </SaveButton>
                      </FormGroup>
                    )}
                    {id !== undefined && (
                      <FormGroup className="mt-2 form-group">
                        <SaveButton
                          disabled={prevData?.length == 0 || isSubmitting}
                          size="md"
                          color="primary"
                          onClick={() => putData()}
                        >
                          {isSubmitting ? "Saving" : "Save"}
                        </SaveButton>
                      </FormGroup>
                    )} */}
                  </div>
                </TabPane>
              </TabContent>
            </PreviewCard>
          </Block>
        </Content>
      </React.Fragment>
      <DeleteModal
        modal={modal}
        toggle={toggle}
        name={"Payment Setting"}
        title={"Scheme Master"}
        clickAction={deleteSettingItem}
      />
    </>
  );
};

export default SchemeForm;
