import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  CancelButton,
  PreviewCard,
  SaveButton,
  Icon,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createProfile,
  getProfileById,
  updateProfileById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import classnames from "classnames";
import {
  Badge,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import YesNoRadio from "../../../components/input/customRadio/YesNoRadio";
import { getUserInfo } from "../../../redux/thunks/authUser";
import secureLocalStorage from "react-secure-storage";

const ProfilePage = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    reset,
  } = useForm();
  const navigate = useNavigate();

  const { transformWord } = useContext(WordTransformerContext);

  const dispatch = useDispatch();
  const { isLoading: issubmitting } = useSelector(
    (state) => state.profileReducer
  );
  const { profileInfo } = useSelector((state) => state.profileReducer);
  const [profileName, setProfileName] = useState();
  const [isActive, setActive] = useState(true);
  const [promotionalBilling, setPromotionalBilling] = useState("0");
  const [retailerBilling, setRetailerBilling] = useState("0");
  const [allowDeviceWiseLogin, setAllowDeviceWiseLogin] = useState("0");
  const [estBillConvert, setEstBillConvert] = useState("0");
  const [estBillApproval, setEstBillApproval] = useState("0");
  const [billingPurchaseEdit, setBillingPurchaseEdit] = useState("0");
  const [isOptReqForLogin, setIsOptReqForLogin] = useState("0");
  const [isOptReqForBillCancel, setIsOptReqForBillCancel] = useState("0");
  const [isOptReqForDuplicateBill, setIsOptReqForDuplicateBill] = useState("0");
  const [isOptReqForPaymentCancel, setIsOptReqForPaymentCancel] = useState("0");
  const [isOptReqForAccountClosing, setIOptReqForAccountClosing] =
    useState("0");
  const [isNotifyForEstApprove, setIsNotifyForEstApprove] = useState("0");
  const [salesReturnLimit, setSalesReturnLimit] = useState("0");
  const [salesReturnLimitDays, setSalesReturnLimitDays] = useState("0");
  const [showTaggingEdit, setShowTaggingEdit] = useState("0");
  const [canEditTagVa, setCanEditTagVa] = useState(0);
  const [canEditTagMc, setCanEditTagMc] = useState(0);
  const [canEditTagGwt, setCanEditTagGwt] = useState(0);
  const [canEditTagPcs, setCanEditTagPcs] = useState(0);
  const [canEditTagPurity, setCanEditTagPurity] = useState(0);
  const [canEditTagMrp, setCanEditTagMrp] = useState(0);
  const [canEditTagHuid, setCanEditTagHuid] = useState(0);
  const [canEditTagAttr, setCanEditTagAttr] = useState(0);
  const [canEditTagPurCost, setCanEditTagPurCost] = useState(0);
  const [canEditTagDesgnSubDesgn, setCanEditTagDesgnSubDesgn] = useState(0);
  const [canEditTagImg, setCanEditTagImg] = useState(0);
  const [canPrintTag, setCanPrintTag] = useState(0);
  const [canEditAccJoinDate, setCanEditAccJoinDate] = useState(0);
  const [allowMinSalesAmount, setAllowMinSalesAmount] = useState(0);
  const [showUnscannedDetails, setShowUnscannedDetails] = useState(0);
  const [showAllApprovalEstimations, setShowAllApprovalEstimations] =
    useState(0);
  const [showSuperAdmin, setShowSuperAdmin] = useState(0);
  const [isOptReqForBillDelete, setIsOtpReqForBillDelete] = useState(0);

  // const [showIssuePettyCashOption, setShowIssuePettyCashOption] = useState(0);
  // const [showIssueCreditOption, setShowIssueCreditOption] = useState(0);
  // const [showIssueRefundOption, setShowIssueRefundOption] = useState(0);
  // const [showIssueBankDepositOption, setShowIssueBankDepositOption] = useState(0);

  // const [showRecieptGenAdvncOption, setShowRecieptGenAdvncOption] = useState(0);
  // const [showRecieptOrdAdvncOption, setShowRecieptOrdAdvncOption] = useState(0);
  // const [showRecieptCredCollOption, setShowRecieptCredCollOption] = useState(0);
  // const [showRecieptRepOrdDelOption, setShowRecieptRepOrdDelOption] = useState(0);
  // const [showRecieptOpenBalOption, setShowRecieptOpenBalOption] = useState(0);
  // const [showRecieptChitDepositOption, setShowRecieptChitDepositOption] = useState(0);

  const [changeStatus, setChangeStauts] = useState(0);
  const [showTransCodeSearchInBilling, setShowTransCodeSearchInBilling] =
    useState(0);
  const [showCustomerType, setShowCustomerType] = useState(0);
  const [showMinSalesAmount, setShowMinSalesAmount] = useState(0);
  const [showUnscannedTags, setShowUnscannedTags] = useState(0);

  //retail dashboard
  const [showEstDetails, setShowEstDetails] = useState("0");
  const [showCusVisits, setShowCusVisits] = useState("0");
  const [showSales, setShowSales] = useState("0");
  const [showKarigarOrder, setShowKarigarOrder] = useState("0");
  const [showCusOrders, setShowCusOrders] = useState("0");
  const [showSalesReturns, setShowSalesReturns] = useState("0");
  const [showCreditSales, setShowCreditSales] = useState("0");
  const [showOldMetalPurchase, setShowOldMetalPurchase] = useState("0");
  const [showApprovals, setShowApprovals] = useState("0");
  const [showLots, setShowLots] = useState("0");
  const [showCashAbstract, setShowCashAbstract] = useState("0");
  const [showStatistics, setShowStatistics] = useState("0");
  const [showTopProducts, setShowTopProducts] = useState("0");

  //crm dashboard
  const [showActiveChits, setShowActiveChits] = useState("0");
  const [showMaturedUnclaimed, setShowMaturedUnclaimed] = useState("0");
  const [showPayment, setShowPayment] = useState("0");
  const [showUsersJoinedThrough, setShowUsersJoinedThrough] = useState("0");
  const [showSchemeWise, setShowSchemeWise] = useState("0");
  const [showBranchWise, setShowBranchWise] = useState("0");
  const [showCollectionSummary, setShowCollectionSummary] = useState("0");
  const [showInActiveChits, setShowInActiveChits] = useState("0");
  const [showChitClosingDetails, setShowChitClosingDetails] = useState("0");
  const [showRegisterThroughDetails, setShowRegisterThroughDetails] =
    useState("0");
  const [showCustomerDetails, setShowCustomerDetails] = useState("0");
  const [showCustomerPersonalLandmark, setShowCustomerPersonalLandmark] =
    useState("0");
  const [showBranchWiseCollectionDetails, setShowBranchWiseCollectionDetails] =
    useState("0");

  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const issueRecieptOptionsConfig = [
    { key: "showIssuePettyCashOption", label: "Show Issue Petty Cash" },
    { key: "showIssueCreditOption", label: "Show Issue Credit" },
    { key: "showIssueRefundOption", label: "Show Issue Refund" },
    { key: "showIssueBankDepositOption", label: "Show Issue Bank Deposit" },
    { key: "showRecieptGenAdvncOption", label: "Show Receipt Gen Advance" },
    { key: "showRecieptOrdAdvncOption", label: "Show Receipt Ord Advance" },
    {
      key: "showRecieptCredCollOption",
      label: "Show Receipt Credit Collection",
    },
    {
      key: "showRecieptRepOrdDelOption",
      label: "Show Receipt Rep Ord Delivery",
    },
    { key: "showRecieptOpenBalOption", label: "Show Receipt Open Balance" },
    { key: "showRecieptChitDepositOption", label: "Show Receipt Chit Deposit" },
  ];

  const [issueRecieptOptionsState, setIssueRecieptOptionsState] = useState(
    Object.fromEntries(issueRecieptOptionsConfig?.map(({ key }) => [key, 1]))
  );

  const handleIssueRecieptOptionChange = (key, value) => {
    setIssueRecieptOptionsState((prev) => ({ ...prev, [key]: value }));
  };

  const issueRecieptptionsFieldMap = {
    showIssuePettyCashOption: "show_issue_pettycash_option",
    showIssueCreditOption: "show_issue_credit_option",
    showIssueRefundOption: "show_issue_refund_option",
    showIssueBankDepositOption: "show_issue_bankdeposit_option",
    showRecieptGenAdvncOption: "show_reciept_genadvnc_option",
    showRecieptOrdAdvncOption: "show_reciept_ordadvnc_option",
    showRecieptCredCollOption: "show_reciept_credcoll_option",
    showRecieptRepOrdDelOption: "show_reciept_repord_delivery_option",
    showRecieptOpenBalOption: "show_reciept_openbal_option",
    showRecieptChitDepositOption: "show_reciept_chitdepo_option",
  };

  const issueRecieptMappedOptionData = Object.fromEntries(
    Object.entries(issueRecieptOptionsState)?.map(([key, value]) => [
      issueRecieptptionsFieldMap[key],
      Boolean(value),
    ])
  );

  const onClickSave = async (data, type) => {
    const addData = {
      profile_name: profileName,
      is_active: isActive,
      promotional_billing: promotionalBilling,
      purchase_edit_billing: billingPurchaseEdit,
      retailer_billing: retailerBilling,
      device_wise_login: allowDeviceWiseLogin,
      isOTP_req_for_login: isOptReqForLogin,
      isOTP_req_for_bill_cancel: isOptReqForBillCancel,
      isOTP_req_for_duplicate_bill: isOptReqForDuplicateBill,
      isOTP_req_for_payment_cancel: isOptReqForPaymentCancel,
      isOTP_req_for_account_closing: isOptReqForAccountClosing,
      is_notify_for_est_approve: isNotifyForEstApprove,
      est_bill_approval: estBillApproval,
      est_bill_convert: estBillConvert,
      sales_return_limit: salesReturnLimit,
      sales_return_limit_days: salesReturnLimitDays,
      show_tagging_edit: showTaggingEdit,
      can_edit_tag_va: canEditTagVa,
      can_edit_tag_mc: canEditTagMc,
      can_edit_tag_gwt: canEditTagGwt,
      can_edit_tag_pcs: canEditTagPcs,
      can_edit_tag_purity: canEditTagPurity,
      can_edit_tag_mrp: canEditTagMrp,
      can_edit_tag_huid: canEditTagHuid,
      can_edit_tag_attr: canEditTagAttr,
      can_edit_tag_pur_cost: canEditTagPurCost,
      can_edit_tag_dsgn_sub_desgn: canEditTagDesgnSubDesgn,
      can_edit_tag_img: canEditTagImg,
      can_print_tag: canPrintTag,
      can_edit_account_join_date: canEditAccJoinDate,
      allow_min_sales_amount: allowMinSalesAmount,
      allow_status_update: changeStatus,
      customer_type_show: showCustomerType,
      show_trans_code_search_in_billing: showTransCodeSearchInBilling,
      is_show_min_sales_amount: showMinSalesAmount,
      is_otp_req_for_bill_delete: isOptReqForBillDelete,
      show_super_user_and_admin: showSuperAdmin,

      show_unscanned_details: showUnscannedDetails,
      show_all_approval_estimations: showAllApprovalEstimations,
      show_est_details: showEstDetails,
      show_cus_visits: showCusVisits,
      show_sales: showSales,
      show_karigar_order: showKarigarOrder,
      show_cus_orders: showCusOrders,
      show_sales_returns: showSalesReturns,
      show_credit_sales: showCreditSales,
      show_old_metal_purchase: showOldMetalPurchase,
      show_approvals: showApprovals,
      show_lots: showLots,
      show_cash_abstract: showCashAbstract,
      show_statistics: showStatistics,
      show_top_products: showTopProducts,
      ...issueRecieptMappedOptionData,
      show_active_chits: showActiveChits,
      show_matured_claimed: showMaturedUnclaimed,
      show_payment: showPayment,
      show_users_joined_through: showUsersJoinedThrough,
      show_scheme_wise: showSchemeWise,
      show_branch_wise: showBranchWise,
      show_collection_summary: showCollectionSummary,
      show_inactive_chits: showInActiveChits,
      show_chit_closing_details: showChitClosingDetails,
      show_register_through_details: showRegisterThroughDetails,
      show_customer_details: showCustomerDetails,
      show_customer_personal_landmark: showCustomerPersonalLandmark,
      show_branch_wise_collection_details: showBranchWiseCollectionDetails,
    };
    try {
      let response = "";
      console.log(id);
      if (id === undefined) {
        response = await dispatch(createProfile(addData)).unwrap();
        toastsuccess(profileName + " Added successfully");
        if (type === "saveAndClose") {
          navigate(`${process.env.PUBLIC_URL}/master/profile/list`);
        } else if (type === "saveAndNew") {
          setProfileName("");
          setActive(true);
          setPromotionalBilling("0");
          setBillingPurchaseEdit("0");
          setRetailerBilling("0");
          setAllowDeviceWiseLogin("0");
          setIsOptReqForLogin("0");
          setIsOptReqForBillCancel("0");
          setIsOptReqForDuplicateBill("0");
          setIsOptReqForPaymentCancel("0");
          setIOptReqForAccountClosing("0");
          setIsNotifyForEstApprove("0");
          setEstBillApproval("0");
          setEstBillConvert("0");
          setSalesReturnLimit("0");
          setSalesReturnLimitDays();
          setShowTaggingEdit("0");
          setCanEditTagVa(0);
          setCanEditTagMc(0);
          setCanEditTagGwt(0);
          setCanEditTagPcs(0);
          setCanEditTagPurity(0);
          setCanEditTagMrp(0);
          setCanEditTagHuid(0);
          setCanEditTagAttr(0);
          setCanEditTagPurCost(0);
          setCanEditTagDesgnSubDesgn(0);
          setCanEditTagImg(0);
          setCanPrintTag(0);
          setCanEditAccJoinDate(0);
          setAllowMinSalesAmount(0);
          setChangeStauts(0);
          setShowTransCodeSearchInBilling(0);
          setShowCustomerType(0);
          setShowMinSalesAmount(0);
          setShowUnscannedDetails(0);
          setShowAllApprovalEstimations(0);
          setIssueRecieptOptionsState({
            showIssuePettyCashOption: 0,
            showIssueCreditOption: 0,
            showIssueRefundOption: 0,
            showIssueBankDepositOption: 0,
            showRecieptGenAdvncOption: 0,
            showRecieptOrdAdvncOption: 0,
            showRecieptCredCollOption: 0,
            showRecieptRepOrdDelOption: 0,
            showRecieptOpenBalOption: 0,
            showRecieptChitDepositOption: 0,
          });
          setShowSuperAdmin(0);
          setIsOtpReqForBillDelete(0);

          setShowEstDetails("");
          setShowCusVisits("");
          setShowSales("");
          setShowKarigarOrder("");
          setShowCusOrders("");
          setShowSalesReturns("");
          setShowCreditSales("");
          setShowOldMetalPurchase("");
          setShowApprovals("");
          setShowLots("");
          setShowCashAbstract("");
          setShowStatistics("");
          setShowTopProducts("");

          setShowActiveChits("");
          setShowMaturedUnclaimed("");
          setShowPayment("");
          setShowUsersJoinedThrough("");
          setShowSchemeWise("");
          setShowBranchWise("");
          setShowCollectionSummary("");
          setShowInActiveChits("");
          setShowChitClosingDetails("");
          setShowRegisterThroughDetails("");
          setShowCustomerDetails("");
          setShowCustomerPersonalLandmark("");
          setShowBranchWiseCollectionDetails("");
        }
      } else {
        const reduxData = { id: id, putData: addData };
        response = await dispatch(updateProfileById(reduxData)).unwrap();
        toastsuccess("Profile Edited successfully");
        const loginpref = secureLocalStorage.getItem("pref")?.pref;
        dispatch(getUserInfo(loginpref));
        navigate(`${process.env.PUBLIC_URL}/master/profile/list`);
      }
    } catch (error) {}
  };

  useEffect(() => {
    id !== undefined && dispatch(getProfileById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (id !== undefined) {
      setProfileName(profileInfo?.profile_name);
      setActive(profileInfo?.is_active);
      setPromotionalBilling(profileInfo?.promotional_billing);
      setBillingPurchaseEdit(profileInfo?.purchase_edit_billing);
      setRetailerBilling(profileInfo?.retailer_billing);
      setAllowDeviceWiseLogin(profileInfo?.device_wise_login);
      setEstBillApproval(profileInfo?.est_bill_approval);
      setEstBillConvert(profileInfo?.est_bill_convert);
      setIsOptReqForLogin(profileInfo?.isOTP_req_for_login);
      setIsOptReqForBillCancel(profileInfo?.isOTP_req_for_bill_cancel);
      setIsOptReqForDuplicateBill(profileInfo?.isOTP_req_for_duplicate_bill);
      setIsOptReqForPaymentCancel(profileInfo?.isOTP_req_for_payment_cancel);
      setIOptReqForAccountClosing(profileInfo?.isOTP_req_for_account_closing);
      setIsNotifyForEstApprove(profileInfo?.is_notify_for_est_approve);
      setSalesReturnLimit(profileInfo?.sales_return_limit);
      setSalesReturnLimitDays(profileInfo?.sales_return_limit_days);
      setShowTaggingEdit(profileInfo?.show_tagging_edit);
      setCanEditTagVa(profileInfo?.can_edit_tag_va);
      setCanEditTagMc(profileInfo?.can_edit_tag_mc);
      setCanEditTagGwt(profileInfo?.can_edit_tag_gwt);
      setCanEditTagPcs(profileInfo?.can_edit_tag_pcs);
      setCanEditTagPurity(profileInfo?.can_edit_tag_purity);
      setCanEditTagMrp(profileInfo?.can_edit_tag_mrp);
      setCanEditTagHuid(profileInfo?.can_edit_tag_huid);
      setCanEditTagAttr(profileInfo?.can_edit_tag_attr);
      setCanEditTagPurCost(profileInfo?.can_edit_tag_pur_cost);
      setCanEditTagDesgnSubDesgn(profileInfo?.can_edit_tag_dsgn_sub_desgn);
      setCanEditTagImg(profileInfo?.can_edit_tag_img);
      setCanPrintTag(profileInfo?.can_print_tag);
      setCanEditAccJoinDate(profileInfo?.can_edit_account_join_date);
      setAllowMinSalesAmount(profileInfo?.allow_min_sales_amount);
      setChangeStauts(profileInfo?.allow_status_update);
      setShowTransCodeSearchInBilling(
        profileInfo?.show_trans_code_search_in_billing
      );
      setShowUnscannedDetails(profileInfo?.show_unscanned_details);
      setShowAllApprovalEstimations(profileInfo?.show_all_approval_estimations);
      setShowCustomerType(profileInfo?.customer_type_show);
      setShowMinSalesAmount(profileInfo?.is_show_min_sales_amount);
      setIsOtpReqForBillDelete(profileInfo?.is_otp_req_for_bill_delete);
      setShowSuperAdmin(profileInfo?.show_super_user_and_admin);



      setIssueRecieptOptionsState({
        showIssuePettyCashOption: profileInfo?.show_issue_pettycash_option
          ? 1
          : 0,
        showIssueCreditOption: profileInfo?.show_issue_credit_option ? 1 : 0,
        showIssueRefundOption: profileInfo?.show_issue_refund_option ? 1 : 0,
        showIssueBankDepositOption: profileInfo?.show_issue_bankdeposit_option
          ? 1
          : 0,
        showRecieptGenAdvncOption: profileInfo?.show_reciept_genadvnc_option
          ? 1
          : 0,
        showRecieptOrdAdvncOption: profileInfo?.show_reciept_ordadvnc_option
          ? 1
          : 0,
        showRecieptCredCollOption: profileInfo?.show_reciept_credcoll_option
          ? 1
          : 0,
        showRecieptRepOrdDelOption:
          profileInfo?.show_reciept_repord_delivery_option ? 1 : 0,
        showRecieptOpenBalOption: profileInfo?.show_reciept_openbal_option
          ? 1
          : 0,
        showRecieptChitDepositOption: profileInfo?.show_reciept_chitdepo_option
          ? 1
          : 0,
      });

      setShowEstDetails(profileInfo?.show_est_details);
      setShowCusVisits(profileInfo?.show_cus_visits);
      setShowSales(profileInfo?.show_sales);
      setShowKarigarOrder(profileInfo?.show_karigar_order);
      setShowCusOrders(profileInfo?.show_cus_orders);
      setShowSalesReturns(profileInfo?.show_sales_returns);
      setShowCreditSales(profileInfo?.show_credit_sales);
      setShowOldMetalPurchase(profileInfo?.show_old_metal_purchase);
      setShowApprovals(profileInfo?.show_approvals);
      setShowLots(profileInfo?.show_lots);
      setShowCashAbstract(profileInfo?.show_cash_abstract);
      setShowStatistics(profileInfo?.show_statistics);
      setShowTopProducts(profileInfo?.show_top_products);

      setShowActiveChits(profileInfo?.show_active_chits);
      setShowMaturedUnclaimed(profileInfo?.show_matured_claimed);
      setShowPayment(profileInfo?.show_payment);
      setShowUsersJoinedThrough(profileInfo?.show_users_joined_through);
      setShowSchemeWise(profileInfo?.show_scheme_wise);
      setShowBranchWise(profileInfo?.show_branch_wise);
      setShowCollectionSummary(profileInfo?.show_collection_summary);
      setShowInActiveChits(profileInfo?.show_inactive_chits);
      setShowChitClosingDetails(profileInfo?.show_chit_closing_details);
      setShowRegisterThroughDetails(profileInfo?.show_register_through_details);
      setShowCustomerDetails(profileInfo?.show_customer_details);
      setShowUnscannedTags(profileInfo?.show_unscanned_tags ? 1 : 0);
      setShowCustomerPersonalLandmark(
        profileInfo?.show_customer_personal_landmark
      );
      setShowBranchWiseCollectionDetails(
        profileInfo?.show_branch_wise_collection_details
      );

      reset();
    }
  }, [id, profileInfo, reset]);

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/profile/list`);
    }
  }, [add, id, navigate]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      if (id !== undefined) {
        handleSubmit(onClickSave)();
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  return (
    <React.Fragment>
      <Head title={title ? title : "Profile"} />
      <Content>
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
                    onClickSave(data, "saveAndNew")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton>

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    onClickSave(data, "saveAndClose")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & Close"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/master/profile/list`)
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
                  onClick={handleSubmit((data) =>
                    onClickSave(data, "saveAndClose")
                  )}
                >
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/master/profile/list`)
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <div className="custom-grid">
            <div style={{ marginTop: "0px" }}>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    tag="a"
                    href="#tab"
                    className={classnames({ active: activeTab === "1" })}
                    onClick={(ev) => {
                      ev.preventDefault();
                      toggle("1");
                    }}
                  >
                    <Icon name="grid-alt-fill" /> <span>Basic Settings</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag="a"
                    href="#tab"
                    className={classnames({ active: activeTab === "2" })}
                    onClick={(ev) => {
                      ev.preventDefault();
                      toggle("2");
                    }}
                  >
                    <Icon name="grid-alt-fill" />{" "}
                    <span>Dashboard Settings</span>
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Row md={12} className="form-group row g-4">
                    <Col lg="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="profileName">
                          Profile Name <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="3">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"profileName"}
                          placeholder="Profile Name"
                          value={profileName}
                          SetValue={(value) => {
                            setProfileName(transformWord(value));
                            clearErrors("profileName");
                          }}
                          setValue={setValue}
                          message={
                            errors.profileName && " Profile name is required"
                          }
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="is_retailer">
                          Allow Promotional Billing
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="promotional_billing_yes"
                                type="radio"
                                name={"promotional_billing"}
                                value={"1"}
                                className="custom-control-input"
                                checked={promotionalBilling == "1"}
                                onChange={(e) => {
                                  setPromotionalBilling(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="promotional_billing_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="promotional_billing_no"
                                type="radio"
                                value={"0"}
                                name={"promotional_billing"}
                                className="custom-control-input "
                                checked={promotionalBilling == "0"}
                                onChange={(e) => {
                                  setPromotionalBilling(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="promotional_billing_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="purchase_edit_billing"
                        >
                          Allow Billing Purchase Edit
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="purchase_edit_billing_yes"
                                type="radio"
                                name={"purchase_edit_billing"}
                                value={"1"}
                                className="custom-control-input"
                                checked={billingPurchaseEdit == "1"}
                                onChange={(e) => {
                                  setBillingPurchaseEdit(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="purchase_edit_billing_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="purchase_edit_billing_no"
                                type="radio"
                                value={"0"}
                                name={"purchase_edit_billing"}
                                className="custom-control-input "
                                checked={billingPurchaseEdit == "0"}
                                onChange={(e) => {
                                  setBillingPurchaseEdit(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="purchase_edit_billing_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="is_retailer">
                          Allow Retailer Billing
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="yes"
                                type="radio"
                                name={"retailer_billing"}
                                value={"1"}
                                className="custom-control-input"
                                checked={retailerBilling == "1"}
                                onChange={(e) => {
                                  setRetailerBilling(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="no"
                                type="radio"
                                value={"0"}
                                name={"retailer_billing"}
                                className="custom-control-input"
                                checked={retailerBilling == "0"}
                                onChange={(e) => {
                                  setRetailerBilling(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="is_retailer">
                          Allow Device Wise Login
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="device_wise_login_yes"
                                type="radio"
                                name={"device_wise_login"}
                                value={"1"}
                                className="custom-control-input"
                                checked={allowDeviceWiseLogin == "1"}
                                onChange={(e) => {
                                  setAllowDeviceWiseLogin(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="device_wise_login_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="device_wise_login_no"
                                type="radio"
                                value={"0"}
                                name={"device_wise_login"}
                                className="custom-control-input"
                                checked={allowDeviceWiseLogin == "0"}
                                onChange={(e) => {
                                  setAllowDeviceWiseLogin(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="device_wise_login_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="is_retailer">
                          Allow Estimation Approval
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="est_bill_approval_yes"
                                type="radio"
                                name={"est_bill_approval"}
                                value={"1"}
                                className="custom-control-input"
                                checked={estBillApproval == "1"}
                                onChange={(e) => {
                                  setEstBillApproval(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="est_bill_approval_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="est_bill_approval_no"
                                type="radio"
                                value={"0"}
                                name={"est_bill_approval"}
                                className="custom-control-input"
                                checked={estBillApproval == "0"}
                                onChange={(e) => {
                                  setEstBillApproval(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="est_bill_approval_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="is_retailer">
                          Allow Estimation Bill Convert
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="est_bill_convert_yes"
                                type="radio"
                                name={"est_bill_convert"}
                                value={"1"}
                                className="custom-control-input"
                                checked={estBillConvert == "1"}
                                onChange={(e) => {
                                  setEstBillConvert(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="est_bill_convert_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="est_bill_convert_no"
                                type="radio"
                                value={"0"}
                                name={"est_bill_convert"}
                                className="custom-control-input"
                                checked={estBillConvert == "0"}
                                onChange={(e) => {
                                  setEstBillConvert(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="est_bill_convert_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="is_retailer">
                          OTP Req for Login
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="otp_req_for_login_yes"
                                type="radio"
                                name={"otp_req_for_login_yes"}
                                value={"1"}
                                className="custom-control-input"
                                checked={isOptReqForLogin == "1"}
                                onChange={(e) => {
                                  setIsOptReqForLogin(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="otp_req_for_login_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="otp_req_for_login_no"
                                type="radio"
                                value={"0"}
                                name={"otp_req_for_login_no"}
                                className="custom-control-input"
                                checked={isOptReqForLogin == "0"}
                                onChange={(e) => {
                                  setIsOptReqForLogin(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="otp_req_for_login_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="isOptReqForBillCancel"
                        >
                          OTP Req for Bill Cancel
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="otp_req_for_bill_cancel_yes"
                                type="radio"
                                name={"otp_req_for_bill_cancel_yes"}
                                value={"1"}
                                className="custom-control-input"
                                checked={isOptReqForBillCancel == "1"}
                                onChange={(e) => {
                                  setIsOptReqForBillCancel(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="otp_req_for_bill_cancel_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="otp_req_for_bill_cancel_no"
                                type="radio"
                                value={"0"}
                                name={"otp_req_for_bill_cancel_no"}
                                className="custom-control-input"
                                checked={isOptReqForBillCancel == "0"}
                                onChange={(e) => {
                                  setIsOptReqForBillCancel(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="otp_req_for_bill_cancel_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="isOptReqForDuplicateBill"
                        >
                          OTP Req for Duplicate Bill
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="otp_req_for_duplicate_bill_yes"
                                type="radio"
                                name={"otp_req_for_duplicate_bill_yes"}
                                value={"1"}
                                className="custom-control-input"
                                checked={isOptReqForDuplicateBill == "1"}
                                onChange={(e) => {
                                  setIsOptReqForDuplicateBill(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="otp_req_for_duplicate_bill_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="otp_req_for_duplicate_bill_no"
                                type="radio"
                                value={"0"}
                                name={"otp_req_for_duplicate_bill_no"}
                                className="custom-control-input"
                                checked={isOptReqForDuplicateBill == "0"}
                                onChange={(e) => {
                                  setIsOptReqForDuplicateBill(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="otp_req_for_duplicate_bill_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="isOptReqForPaymentCancel"
                        >
                          OTP Req for Payment Cancel
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="otp_req_for_payment_cancel_yes"
                                type="radio"
                                name={"otp_req_for_payment_cancel_yes"}
                                value={"1"}
                                className="custom-control-input"
                                checked={isOptReqForPaymentCancel == "1"}
                                onChange={(e) => {
                                  setIsOptReqForPaymentCancel(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="otp_req_for_payment_cancel_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="otp_req_for_payment_cancel_no"
                                type="radio"
                                value={"0"}
                                name={"otp_req_for_payment_cancel_no"}
                                className="custom-control-input"
                                checked={isOptReqForPaymentCancel == "0"}
                                onChange={(e) => {
                                  setIsOptReqForPaymentCancel(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="otp_req_for_payment_cancel_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="isOptReqForAccountClosing"
                        >
                          OTP Req for Account Closing
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="otp_req_for_accounnt_closing_yes"
                                type="radio"
                                name={"otp_req_for_accounnt_closing_yes"}
                                value={"1"}
                                className="custom-control-input"
                                checked={isOptReqForAccountClosing == "1"}
                                onChange={(e) => {
                                  setIOptReqForAccountClosing(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="otp_req_for_accounnt_closing_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="otp_req_for_accounnt_closing_no"
                                type="radio"
                                value={"0"}
                                name={"otp_req_for_accounnt_closing_no"}
                                className="custom-control-input"
                                checked={isOptReqForAccountClosing == "0"}
                                onChange={(e) => {
                                  setIOptReqForAccountClosing(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="otp_req_for_accounnt_closing_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="isNotifyForEstApprove"
                        >
                          Notify for Estimation Approve
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="is_notify_for_est_approve_yes"
                                type="radio"
                                name={"is_notify_for_est_approve_yes"}
                                value={"1"}
                                className="custom-control-input"
                                checked={isNotifyForEstApprove == "1"}
                                onChange={(e) => {
                                  setIsNotifyForEstApprove(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="is_notify_for_est_approve_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="is_notify_for_est_approve_no"
                                type="radio"
                                value={"0"}
                                name={"is_notify_for_est_approve_no"}
                                className="custom-control-input"
                                checked={isNotifyForEstApprove == "0"}
                                onChange={(e) => {
                                  setIsNotifyForEstApprove(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="is_notify_for_est_approve_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="isNotifyForEstApprove"
                        >
                          Sales Return Limit
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="sales_return_limit_yes"
                                type="radio"
                                name={"sales_return_limit_yes"}
                                value={"1"}
                                className="custom-control-input"
                                checked={salesReturnLimit == "1"}
                                onChange={(e) => {
                                  setSalesReturnLimit(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="sales_return_limit_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="sales_return_limit_no"
                                type="radio"
                                value={"0"}
                                name={"sales_return_limit_no"}
                                className="custom-control-input"
                                checked={salesReturnLimit == "0"}
                                onChange={(e) => {
                                  setSalesReturnLimit(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="sales_return_limit_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col lg="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="salesReturnLimitDays"
                        >
                          Sales Return limit Days <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="3">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"salesReturnLimitDays"}
                          placeholder="Sales return limit days"
                          value={salesReturnLimitDays}
                          SetValue={(value) => {
                            setSalesReturnLimitDays(value);
                            clearErrors("salesReturnLimitDays");
                          }}
                          setValue={setValue}
                          message={
                            errors.salesReturnLimitDays &&
                            "Sales return limit days is required"
                          }
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="showTaggingEdit">
                          Show Tagging Edit
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="show_tagging_edit_yes"
                                type="radio"
                                name={"show_tagging_edit_yes"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showTaggingEdit == "1"}
                                onChange={(e) => {
                                  setShowTaggingEdit(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="show_tagging_edit_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="show_tagging_edit_no"
                                type="radio"
                                value={"0"}
                                name={"show_tagging_edit_no"}
                                className="custom-control-input"
                                checked={showTaggingEdit == "0"}
                                onChange={(e) => {
                                  setShowTaggingEdit(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="show_tagging_edit_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="canEditTagVa">
                          Can Edit Tag VA
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="canEditTagVa_yes"
                                type="radio"
                                name={"canEditTagVa"}
                                value={1}
                                className="custom-control-input"
                                checked={canEditTagVa == 1}
                                onChange={(e) => {
                                  setCanEditTagVa(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagVa_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="canEditTagVa_no"
                                type="radio"
                                value={0}
                                name={"canEditTagVa"}
                                className="custom-control-input"
                                checked={canEditTagVa == 0}
                                onChange={(e) => {
                                  setCanEditTagVa(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagVa_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="canEditTagMc">
                          Can Edit Tag MC
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="canEditTagMc_yes"
                                type="radio"
                                name={"canEditTagMc"}
                                value={1}
                                className="custom-control-input"
                                checked={canEditTagMc == 1}
                                onChange={(e) => {
                                  setCanEditTagMc(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagMc_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="canEditTagMc_no"
                                type="radio"
                                value={0}
                                name={"canEditTagMc"}
                                className="custom-control-input"
                                checked={canEditTagMc == 0}
                                onChange={(e) => {
                                  setCanEditTagMc(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagMc"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="canEditTagGwt">
                          Can Edit Tag GWT
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="canEditTagGwt_yes"
                                type="radio"
                                name={"canEditTagGwt"}
                                value={1}
                                className="custom-control-input"
                                checked={canEditTagGwt == 1}
                                onChange={(e) => {
                                  setCanEditTagGwt(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagGwt_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="canEditTagGwt_no"
                                type="radio"
                                value={0}
                                name={"canEditTagGwt"}
                                className="custom-control-input"
                                checked={canEditTagGwt == 0}
                                onChange={(e) => {
                                  setCanEditTagGwt(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagGwt_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="canEditTagPcs">
                          Can Edit Tag PCS
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="canEditTagPcs_yes"
                                type="radio"
                                name={"canEditTagPcs"}
                                value={1}
                                className="custom-control-input"
                                checked={canEditTagPcs == 1}
                                onChange={(e) => {
                                  setCanEditTagPcs(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagPcs_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="canEditTagPcs_no"
                                type="radio"
                                value={0}
                                name={"canEditTagPcs"}
                                className="custom-control-input"
                                checked={canEditTagPcs == 0}
                                onChange={(e) => {
                                  setCanEditTagPcs(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagPcs_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="canEditTagPurity"
                        >
                          Can Edit Tag Purity
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="canEditTagPurity_yes"
                                type="radio"
                                name={"canEditTagPurity"}
                                value={1}
                                className="custom-control-input"
                                checked={canEditTagPurity == 1}
                                onChange={(e) => {
                                  setCanEditTagPurity(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagPurity_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="canEditTagPurity_no"
                                type="radio"
                                value={0}
                                name={"canEditTagPurity"}
                                className="custom-control-input"
                                checked={canEditTagPurity == 0}
                                onChange={(e) => {
                                  setCanEditTagPurity(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagPurity_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="canEditTagMrp">
                          Can Edit Tag MRP
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="canEditTagMrp_yes"
                                type="radio"
                                name={"canEditTagMrp"}
                                value={1}
                                className="custom-control-input"
                                checked={canEditTagMrp == 1}
                                onChange={(e) => {
                                  setCanEditTagMrp(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagMrp_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="canEditTagMrp_no"
                                type="radio"
                                value={0}
                                name={"canEditTagMrp"}
                                className="custom-control-input"
                                checked={canEditTagMrp == 0}
                                onChange={(e) => {
                                  setCanEditTagMrp(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagMrp_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="canEditTagHuid">
                          Can Edit Tag HUID
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="canEditTagHuid_yes"
                                type="radio"
                                name={"canEditTagHuid"}
                                value={1}
                                className="custom-control-input"
                                checked={canEditTagHuid == 1}
                                onChange={(e) => {
                                  setCanEditTagHuid(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagHuid_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="canEditTagHuid_no"
                                type="radio"
                                value={0}
                                name={"canEditTagHuid"}
                                className="custom-control-input"
                                checked={canEditTagHuid == 0}
                                onChange={(e) => {
                                  setCanEditTagHuid(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagHuid_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="canEditTagAttr">
                          Can Edit Tag Attr
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="canEditTagAttr_yes"
                                type="radio"
                                name={"canEditTagAttr"}
                                value={1}
                                className="custom-control-input"
                                checked={canEditTagAttr == 1}
                                onChange={(e) => {
                                  setCanEditTagAttr(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagAttr_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="canEditTagAttr_no"
                                type="radio"
                                value={0}
                                name={"canEditTagAttr"}
                                className="custom-control-input"
                                checked={canEditTagAttr == 0}
                                onChange={(e) => {
                                  setCanEditTagAttr(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagAttr_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="canEditTagPurCost"
                        >
                          Can Edit Tag Cost
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="canEditTagPurCost_yes"
                                type="radio"
                                name={"canEditTagPurCost"}
                                value={1}
                                className="custom-control-input"
                                checked={canEditTagPurCost == 1}
                                onChange={(e) => {
                                  setCanEditTagPurCost(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagPurCost_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="canEditTagPurCost_no"
                                type="radio"
                                value={0}
                                name={"canEditTagPurCost"}
                                className="custom-control-input"
                                checked={canEditTagPurCost == 0}
                                onChange={(e) => {
                                  setCanEditTagPurCost(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagPurCost_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="canEditTagDesgnSubDesgn"
                        >
                          Can Edit Tag Design & Sub Design
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="canEditTagDesgnSubDesgn_yes"
                                type="radio"
                                name={"canEditTagDesgnSubDesgn"}
                                value={1}
                                className="custom-control-input"
                                checked={canEditTagDesgnSubDesgn == 1}
                                onChange={(e) => {
                                  setCanEditTagDesgnSubDesgn(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagDesgnSubDesgn_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="canEditTagDesgnSubDesgn_no"
                                type="radio"
                                value={0}
                                name={"canEditTagDesgnSubDesgn"}
                                className="custom-control-input"
                                checked={canEditTagDesgnSubDesgn == 0}
                                onChange={(e) => {
                                  setCanEditTagDesgnSubDesgn(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagDesgnSubDesgn_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="canEditTagImg">
                          Can Edit Tag Image
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="canEditTagImg_yes"
                                type="radio"
                                name={"canEditTagImg"}
                                value={1}
                                className="custom-control-input"
                                checked={canEditTagImg == 1}
                                onChange={(e) => {
                                  setCanEditTagImg(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagImg_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="canEditTagImg_no"
                                type="radio"
                                value={0}
                                name={"canEditTagImg"}
                                className="custom-control-input"
                                checked={canEditTagImg == 0}
                                onChange={(e) => {
                                  setCanEditTagImg(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditTagImg_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="canPrintTag">
                          Can Print Tag
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="canPrintTag_yes"
                                type="radio"
                                name={"canPrintTag"}
                                value={1}
                                className="custom-control-input"
                                checked={canPrintTag == 1}
                                onChange={(e) => {
                                  setCanPrintTag(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canPrintTag_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="canPrintTag_no"
                                type="radio"
                                value={0}
                                name={"canPrintTag"}
                                className="custom-control-input"
                                checked={canPrintTag == 0}
                                onChange={(e) => {
                                  setCanPrintTag(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canPrintTag_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="canPrintTag">
                          Can Edit Join Date
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="canEditAccJoinDate_yes"
                                type="radio"
                                name={"canEditAccJoinDate"}
                                value={1}
                                className="custom-control-input"
                                checked={canEditAccJoinDate == 1}
                                onChange={(e) => {
                                  setCanEditAccJoinDate(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditAccJoinDate_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="canEditAccJoinDate_no"
                                type="radio"
                                value={0}
                                name={"canEditAccJoinDate"}
                                className="custom-control-input"
                                checked={canEditAccJoinDate == 0}
                                onChange={(e) => {
                                  setCanEditAccJoinDate(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="canEditAccJoinDate_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="allowMinSalesAmount"
                        >
                          Allow Minimun Sales Amount
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="allowMinSalesAmount_yes"
                                type="radio"
                                name={"all"}
                                value={1}
                                className="custom-control-input"
                                checked={allowMinSalesAmount == 1}
                                onChange={(e) => {
                                  setAllowMinSalesAmount(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="allowMinSalesAmount_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="allowMinSalesAmount_no"
                                type="radio"
                                value={0}
                                name={"allowMinSalesAmount"}
                                className="custom-control-input"
                                checked={allowMinSalesAmount == 0}
                                onChange={(e) => {
                                  setAllowMinSalesAmount(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="allowMinSalesAmount_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="allowMinSalesAmount"
                        >
                          Allow Status Update
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="helloStatusChnage_yes"
                                type="radio"
                                name={"changeStatus"}
                                value={1}
                                className="custom-control-input"
                                checked={changeStatus == 1}
                                onChange={(e) => {
                                  setChangeStauts(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="helloStatusChnage_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="helloStatusChnage_no"
                                type="radio"
                                value={0}
                                name={"changeStatus"}
                                className="custom-control-input"
                                checked={changeStatus == 0}
                                onChange={(e) => {
                                  setChangeStauts(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="helloStatusChnage_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  {/* issue reciept settings */}
                  {issueRecieptOptionsConfig?.map(({ key, label }) => (
                    <YesNoRadio
                      key={key}
                      label={label}
                      id={key}
                      name={key}
                      value={issueRecieptOptionsState[key]}
                      onChange={(value) =>
                        handleIssueRecieptOptionChange(key, value)
                      }
                    />
                  ))}

                  {/* issue reciept settings */}

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="showTransCode">
                          Show Trans Code Search In Billing <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showTransCode_yes"
                                type="radio"
                                name={"showTransCode"}
                                value={1}
                                className="custom-control-input"
                                checked={showTransCodeSearchInBilling == 1}
                                onChange={(e) => {
                                  setShowTransCodeSearchInBilling(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showTransCode_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showTransCode_no"
                                type="radio"
                                value={0}
                                name={"showTransCode"}
                                className="custom-control-input"
                                checked={showTransCodeSearchInBilling == 0}
                                onChange={(e) => {
                                  setShowTransCodeSearchInBilling(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showTransCode_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showCustomerType"
                        >
                          Show Customer Type <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showCustomerType_yes"
                                type="radio"
                                name={"showCustomerType"}
                                value={1}
                                className="custom-control-input"
                                checked={showCustomerType == 1}
                                onChange={(e) => {
                                  setShowCustomerType(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCustomerType_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showCustomerType_no"
                                type="radio"
                                value={0}
                                name={"showCustomerType"}
                                className="custom-control-input"
                                checked={showCustomerType == 0}
                                onChange={(e) => {
                                  setShowCustomerType(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCustomerType_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showMinSalesAmount"
                        >
                          Show Minimun Sales Amount <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showMinSalesAmount_yes"
                                type="radio"
                                name={"showMinSalesAmount"}
                                value={1}
                                className="custom-control-input"
                                checked={showMinSalesAmount == 1}
                                onChange={(e) => {
                                  setShowMinSalesAmount(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showMinSalesAmount_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showMinSalesAmount_no"
                                type="radio"
                                value={0}
                                name={"showMinSalesAmount"}
                                className="custom-control-input"
                                checked={showMinSalesAmount == 0}
                                onChange={(e) => {
                                  setShowMinSalesAmount(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showMinSalesAmount_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showUnscannedDetails"
                        >
                          Show UnScanned Details <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showUnScannedDetails_yes"
                                type="radio"
                                name={"showUnscannedDetails"}
                                value={1}
                                className="custom-control-input"
                                checked={showUnscannedDetails == 1}
                                onChange={(e) => {
                                  setShowUnscannedDetails(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showUnScannedDetails_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showUnScannedDetails_no"
                                type="radio"
                                value={0}
                                name={"showUnscannedDetails"}
                                className="custom-control-input"
                                checked={showUnscannedDetails == 0}
                                onChange={(e) => {
                                  setShowUnscannedDetails(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showUnScannedDetails_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showAllApprovalEstimations"
                        >
                          Show All App. Estimations <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showAllApprovalEstimations_yes"
                                type="radio"
                                name={"showAllApprovalEstimations"}
                                value={1}
                                className="custom-control-input"
                                checked={showAllApprovalEstimations == 1}
                                onChange={(e) => {
                                  setShowAllApprovalEstimations(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showAllApprovalEstimations_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showAllApprovalEstimations_no"
                                type="radio"
                                value={0}
                                name={"showAllApprovalEstimations"}
                                className="custom-control-input"
                                checked={showAllApprovalEstimations == 0}
                                onChange={(e) => {
                                  setShowAllApprovalEstimations(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showAllApprovalEstimations_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="isOptReqForBillDelete"
                        >
                          OTP Req for Bill Delete
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="isOptReqForBillDelete_yes"
                                type="radio"
                                name={"isOptReqForBillDelete_yes"}
                                value={"1"}
                                className="custom-control-input"
                                checked={isOptReqForBillDelete == "1"}
                                onChange={(e) => {
                                  setIsOtpReqForBillDelete(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="isOptReqForBillDelete_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="isOptReqForBillDelete_no"
                                type="radio"
                                value={"0"}
                                name={"isOptReqForBillDelete_no"}
                                className="custom-control-input"
                                checked={isOptReqForBillDelete == "0"}
                                onChange={(e) => {
                                  setIsOtpReqForBillDelete(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="isOptReqForBillDelete_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="showSuperAdmin">
                          Show Super Admin
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showSuperAdmin_yes"
                                type="radio"
                                name={"showSuperAdmin_yes"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showSuperAdmin == "1"}
                                onChange={(e) => {
                                  setShowSuperAdmin(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showSuperAdmin_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showSuperAdmin_no"
                                type="radio"
                                value={"0"}
                                name={"showSuperAdmin_no"}
                                className="custom-control-input"
                                checked={showSuperAdmin == "0"}
                                onChange={(e) => {
                                  setShowSuperAdmin(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showSuperAdmin_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col lg="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="isActive">
                          Active
                        </label>
                      </div>
                    </Col>
                    <Col lg="3">
                      <SwitchInputField
                        register={register}
                        id={"isActive"}
                        checked={isActive}
                        SetValue={setActive}
                        name={"isActive"}
                      />
                    </Col>
                  </Row>
                </TabPane>

                <TabPane tabId="2">
                  {/* retail dashboard */}
                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="is_retailer">
                          Show Estimation Details
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showEstDetails_yes"
                                type="radio"
                                name={"showEstDetails"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showEstDetails == "1"}
                                onChange={(e) => {
                                  setShowEstDetails(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showEstDetails_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showEstDetails_no"
                                type="radio"
                                value={"0"}
                                name={"showEstDetails"}
                                className="custom-control-input "
                                checked={showEstDetails == "0"}
                                onChange={(e) => {
                                  setShowEstDetails(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showEstDetails_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="showCusVisits">
                          Show Customer Visits
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showCusVisits_yes"
                                type="radio"
                                name={"showCusVisits"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showCusVisits == "1"}
                                onChange={(e) => {
                                  setShowCusVisits(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCusVisits_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showCusVisits_no"
                                type="radio"
                                value={"0"}
                                name={"showCusVisits"}
                                className="custom-control-input "
                                checked={showCusVisits == "0"}
                                onChange={(e) => {
                                  setShowCusVisits(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCusVisits_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="showSales">
                          Show Sales
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showSales_yes"
                                type="radio"
                                name={"showSales"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showSales == "1"}
                                onChange={(e) => {
                                  setShowSales(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showSales_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showSales_no"
                                type="radio"
                                value={"0"}
                                name={"showSales"}
                                className="custom-control-input "
                                checked={showSales == "0"}
                                onChange={(e) => {
                                  setShowSales(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showSales_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showKarigarOrder"
                        >
                          Show Karigar Order
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showKarigarOrder_yes"
                                type="radio"
                                name={"showKarigarOrder"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showKarigarOrder == "1"}
                                onChange={(e) => {
                                  setShowKarigarOrder(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showKarigarOrder_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showKarigarOrder_no"
                                type="radio"
                                value={"0"}
                                name={"showKarigarOrder"}
                                className="custom-control-input "
                                checked={showKarigarOrder == "0"}
                                onChange={(e) => {
                                  setShowKarigarOrder(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showKarigarOrder_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showCusOrders_yes"
                        >
                          Show Customer Order
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showCusOrders_yes"
                                type="radio"
                                name={"showCusOrders"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showCusOrders == "1"}
                                onChange={(e) => {
                                  setShowCusOrders(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCusOrders_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showCusOrders_no"
                                type="radio"
                                value={"0"}
                                name={"showCusOrders"}
                                className="custom-control-input "
                                checked={showCusOrders == "0"}
                                onChange={(e) => {
                                  setShowCusOrders(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCusOrders_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showSalesReturns"
                        >
                          Show Sales Returns
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showSalesReturns_yes"
                                type="radio"
                                name={"showSalesReturns"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showSalesReturns == "1"}
                                onChange={(e) => {
                                  setShowSalesReturns(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showSalesReturns_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showSalesReturns_no"
                                type="radio"
                                value={"0"}
                                name={"showSalesReturns"}
                                className="custom-control-input "
                                checked={showSalesReturns == "0"}
                                onChange={(e) => {
                                  setShowSalesReturns(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showSalesReturns_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="showCreditSales">
                          Show Credit Sales
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showCreditSales_yes"
                                type="radio"
                                name={"showCreditSales"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showCreditSales == "1"}
                                onChange={(e) => {
                                  setShowCreditSales(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCreditSales_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showCreditSales_no"
                                type="radio"
                                value={"0"}
                                name={"showCreditSales"}
                                className="custom-control-input "
                                checked={showCreditSales == "0"}
                                onChange={(e) => {
                                  setShowCreditSales(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCreditSales_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showOldMetalPurchase"
                        >
                          Show Old Metal Purchase
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showOldMetalPurchase_yes"
                                type="radio"
                                name={"showOldMetalPurchase"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showOldMetalPurchase == "1"}
                                onChange={(e) => {
                                  setShowOldMetalPurchase(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showOldMetalPurchase_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showOldMetalPurchase_no"
                                type="radio"
                                value={"0"}
                                name={"showOldMetalPurchase"}
                                className="custom-control-input "
                                checked={showOldMetalPurchase == "0"}
                                onChange={(e) => {
                                  setShowOldMetalPurchase(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showOldMetalPurchase_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="showApprovals">
                          Show Approvals
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showApprovals_yes"
                                type="radio"
                                name={"showApprovals"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showApprovals == "1"}
                                onChange={(e) => {
                                  setShowApprovals(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showApprovals_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showApprovals_no"
                                type="radio"
                                value={"0"}
                                name={"showApprovals"}
                                className="custom-control-input "
                                checked={showApprovals == "0"}
                                onChange={(e) => {
                                  setShowApprovals(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showApprovals_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="showLots">
                          Show Lots
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showLots_yes"
                                type="radio"
                                name={"showLots"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showLots == "1"}
                                onChange={(e) => {
                                  setShowLots(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showLots_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showLots_no"
                                type="radio"
                                value={"0"}
                                name={"showLots"}
                                className="custom-control-input "
                                checked={showLots == "0"}
                                onChange={(e) => {
                                  setShowLots(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showLots_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showCashAbstract"
                        >
                          Show Cash Abstract
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showCashAbstract_yes"
                                type="radio"
                                name={"showCashAbstract"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showCashAbstract == "1"}
                                onChange={(e) => {
                                  setShowCashAbstract(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCashAbstract_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showCashAbstract_no"
                                type="radio"
                                value={"0"}
                                name={"showCashAbstract"}
                                className="custom-control-input "
                                checked={showCashAbstract == "0"}
                                onChange={(e) => {
                                  setShowCashAbstract(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCashAbstract_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="showStatistics">
                          Show Statistics
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showStatistics_yes"
                                type="radio"
                                name={"showStatistics"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showStatistics == "1"}
                                onChange={(e) => {
                                  setShowStatistics(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showStatistics_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showStatistics_no"
                                type="radio"
                                value={"0"}
                                name={"showStatistics"}
                                className="custom-control-input "
                                checked={showStatistics == "0"}
                                onChange={(e) => {
                                  setShowStatistics(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showStatistics_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="showTopProducts">
                          Show Top Products
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showTopProducts_yes"
                                type="radio"
                                name={"showTopProducts"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showTopProducts == "1"}
                                onChange={(e) => {
                                  setShowTopProducts(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showTopProducts_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showTopProducts_no"
                                type="radio"
                                value={"0"}
                                name={"showTopProducts"}
                                className="custom-control-input "
                                checked={showTopProducts == "0"}
                                onChange={(e) => {
                                  setShowTopProducts(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showTopProducts_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  {/* CRM Dashboard */}

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="showActiveChits">
                          Show Active Chits
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showActiveChits_yes"
                                type="radio"
                                name={"showActiveChits"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showActiveChits == "1"}
                                onChange={(e) => {
                                  setShowActiveChits(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showActiveChits_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showActiveChits_no"
                                type="radio"
                                value={"0"}
                                name={"showActiveChits"}
                                className="custom-control-input "
                                checked={showActiveChits == "0"}
                                onChange={(e) => {
                                  setShowActiveChits(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showActiveChits_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showMaturedUnclaimed"
                        >
                          Show Matured & Unclaimed
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showMaturedUnclaimed_yes"
                                type="radio"
                                name={"showMaturedUnclaimed"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showMaturedUnclaimed == "1"}
                                onChange={(e) => {
                                  setShowMaturedUnclaimed(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showMaturedUnclaimed_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showMaturedUnclaimed_no"
                                type="radio"
                                value={"0"}
                                name={"showMaturedUnclaimed"}
                                className="custom-control-input "
                                checked={showMaturedUnclaimed == "0"}
                                onChange={(e) => {
                                  setShowMaturedUnclaimed(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showMaturedUnclaimed_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="showPayment">
                          Show Payment
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showPayment_yes"
                                type="radio"
                                name={"showPayment"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showPayment == "1"}
                                onChange={(e) => {
                                  setShowPayment(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showPayment_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showPayment_no"
                                type="radio"
                                value={"0"}
                                name={"showPayment"}
                                className="custom-control-input "
                                checked={showPayment == "0"}
                                onChange={(e) => {
                                  setShowPayment(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showPayment_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showUsersJoinedThrough"
                        >
                          Show Users Joined Through
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showUsersJoinedThrough_yes"
                                type="radio"
                                name={"showUsersJoinedThrough"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showUsersJoinedThrough == "1"}
                                onChange={(e) => {
                                  setShowUsersJoinedThrough(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showUsersJoinedThrough_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showUsersJoinedThrough_no"
                                type="radio"
                                value={"0"}
                                name={"showUsersJoinedThrough"}
                                className="custom-control-input "
                                checked={showUsersJoinedThrough == "0"}
                                onChange={(e) => {
                                  setShowUsersJoinedThrough(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showUsersJoinedThrough_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="showSchemeWise">
                          Show Scheme Wise
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showSchemeWise_yes"
                                type="radio"
                                name={"showSchemeWise"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showSchemeWise == "1"}
                                onChange={(e) => {
                                  setShowSchemeWise(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showSchemeWise_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showSchemeWise_no"
                                type="radio"
                                value={"0"}
                                name={"showSchemeWise"}
                                className="custom-control-input "
                                checked={showSchemeWise == "0"}
                                onChange={(e) => {
                                  setShowSchemeWise(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showSchemeWise_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="showBranchWise">
                          Show Branch Wise
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showBranchWise_yes"
                                type="radio"
                                name={"showBranchWise"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showBranchWise == "1"}
                                onChange={(e) => {
                                  setShowBranchWise(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showBranchWise_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showBranchWise_no"
                                type="radio"
                                value={"0"}
                                name={"showBranchWise"}
                                className="custom-control-input "
                                checked={showBranchWise == "0"}
                                onChange={(e) => {
                                  setShowBranchWise(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showBranchWise_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showCollectionSummary"
                        >
                          Show Collection Summary
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showCollectionSummary_yes"
                                type="radio"
                                name={"showCollectionSummary"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showCollectionSummary == "1"}
                                onChange={(e) => {
                                  setShowCollectionSummary(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCollectionSummary_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showCollectionSummary_no"
                                type="radio"
                                value={"0"}
                                name={"showCollectionSummary"}
                                className="custom-control-input "
                                checked={showCollectionSummary == "0"}
                                onChange={(e) => {
                                  setShowCollectionSummary(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCollectionSummary_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showInActiveChits"
                        >
                          Show In Active Chits
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showInActiveChits_yes"
                                type="radio"
                                name={"showInActiveChits"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showInActiveChits == "1"}
                                onChange={(e) => {
                                  setShowInActiveChits(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showInActiveChits_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showInActiveChits_no"
                                type="radio"
                                value={"0"}
                                name={"showInActiveChits"}
                                className="custom-control-input "
                                checked={showInActiveChits == "0"}
                                onChange={(e) => {
                                  setShowInActiveChits(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showInActiveChits_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showChitClosingDetails"
                        >
                          Show Chit Closing Details
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showChitClosingDetails_yes"
                                type="radio"
                                name={"showChitClosingDetails"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showChitClosingDetails == "1"}
                                onChange={(e) => {
                                  setShowChitClosingDetails(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showChitClosingDetails_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showChitClosingDetails_no"
                                type="radio"
                                value={"0"}
                                name={"showChitClosingDetails"}
                                className="custom-control-input "
                                checked={showChitClosingDetails == "0"}
                                onChange={(e) => {
                                  setShowChitClosingDetails(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showChitClosingDetails_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showRegisterThroughDetails"
                        >
                          Show Register Through Details
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showRegisterThroughDetails_yes"
                                type="radio"
                                name={"showRegisterThroughDetails"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showRegisterThroughDetails == "1"}
                                onChange={(e) => {
                                  setShowRegisterThroughDetails(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showRegisterThroughDetails_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showRegisterThroughDetails_no"
                                type="radio"
                                value={"0"}
                                name={"showRegisterThroughDetails"}
                                className="custom-control-input "
                                checked={showRegisterThroughDetails == "0"}
                                onChange={(e) => {
                                  setShowRegisterThroughDetails(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showRegisterThroughDetails_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showCustomerDetails"
                        >
                          Show Customer Details
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showCustomerDetails_yes"
                                type="radio"
                                name={"showCustomerDetails"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showCustomerDetails == "1"}
                                onChange={(e) => {
                                  setShowCustomerDetails(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCustomerDetails_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showCustomerDetails_no"
                                type="radio"
                                value={"0"}
                                name={"showCustomerDetails"}
                                className="custom-control-input "
                                checked={showCustomerDetails == "0"}
                                onChange={(e) => {
                                  setShowCustomerDetails(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCustomerDetails_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showCustomerPersonalLandmark"
                        >
                          Show Customer Personal Landmark
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showCustomerPersonalLandmark_yes"
                                type="radio"
                                name={"showCustomerPersonalLandmark"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showCustomerPersonalLandmark == "1"}
                                onChange={(e) => {
                                  setShowCustomerPersonalLandmark(
                                    e.target.value
                                  );
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCustomerPersonalLandmark_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showCustomerPersonalLandmark_no"
                                type="radio"
                                value={"0"}
                                name={"showCustomerPersonalLandmark"}
                                className="custom-control-input "
                                checked={showCustomerPersonalLandmark == "0"}
                                onChange={(e) => {
                                  setShowCustomerPersonalLandmark(
                                    e.target.value
                                  );
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showCustomerPersonalLandmark_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="2">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="showBranchWiseCollectionDetails"
                        >
                          Show Branch Wise Collection Details
                        </label>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="showBranchWiseCollectionDetails_yes"
                                type="radio"
                                name={"showBranchWiseCollectionDetails"}
                                value={"1"}
                                className="custom-control-input"
                                checked={showBranchWiseCollectionDetails == "1"}
                                onChange={(e) => {
                                  setShowBranchWiseCollectionDetails(
                                    e.target.value
                                  );
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showBranchWiseCollectionDetails_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="showBranchWiseCollectionDetails_no"
                                type="radio"
                                value={"0"}
                                name={"showBranchWiseCollectionDetails"}
                                className="custom-control-input "
                                checked={showBranchWiseCollectionDetails == "0"}
                                onChange={(e) => {
                                  setShowBranchWiseCollectionDetails(
                                    e.target.value
                                  );
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="showBranchWiseCollectionDetails_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </div>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default ProfilePage;
