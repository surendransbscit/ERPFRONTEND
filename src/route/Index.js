import React, { useCallback, useEffect, useLayoutEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Homepage from "../pages/Homepage";
import Blank from "../pages/others/Blank";
import Terms from "../pages/others/Terms";
import Error404Modern from "../pages/error/404-modern";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Success from "../pages/auth/Success";
import Layout from "../layout/Index";
import LayoutNoSidebar from "../layout/Index-nosidebar";
import AuthVerify from "../pages/auth/AuthVerify";
import { ToastContainer } from "react-toastify";
import {
  ToastStyle,
  toastfunc,
} from "../components/sds-toast-style/toast-style";
import { useDispatch } from "react-redux";
import EventBus from "../common/EventBus";
import Swal from "sweetalert2";
import { useIdleTimer } from "react-idle-timer";
import { userLogout } from "../redux/thunks/authUser";
import Listing from "../pages/listing/Listing";

import ProfilePage from "../pages/masters/profile/ProfilePage";
import AreaForm from "../pages/masters/area/AreaForm";
import BankForm from "../pages/masters/bank/BankForm";
import DesignationForm from "../pages/masters/designation/DesignationForm";
import FinancialYearForm from "../pages/masters/financialYear/FinancialYearForm";
import CompanyForm from "../pages/settings/company/CompanyForm";
import SchemeForm from "../pages/schemeMaster/scheme/SchemeForm";
import MetalForm from "../pages/catalogMaster/metal/MetalForm";
import PurityForm from "../pages/catalogMaster/purity/PurityForm";
import CutForm from "../pages/catalogMaster/cut/CutForm";
import ColorForm from "../pages/catalogMaster/color/ColorForm";
import StoneForm from "../pages/catalogMaster/stone/StoneForm";
import UomForm from "../pages/masters/uom/UomForm";
import CustomerForm from "../pages/masters/customer/CustomerForm";
import CreateSchemePayment from "../pages/payments/SchemePayment/CreateSchemePayment";
import SchemeAbstract from "../pages/reports/SchemeAbstract";
import MetalRateForm from "../pages/rateMaster/metalRates/MetalRateForm";
import SchemeAccountForm from "../pages/schemeMaster/schemeAccount/SchemeAccountForm";
import LotForm from "../pages/inventory/lot/Form";
import PurchaseEntryForm from "../pages/purchase/PurchaseEntry";
import CustomerOutstanding from "../pages/reports/CustomerOutstanding";
import SchemeCloseAccount from "../pages/schemeMaster/SchemeCloseAccount/SchemeCloseAccount";
import PrintPayment from "../pages/payments/SchemePayment/PrintPayment";
import MenuForm from "../pages/settings/menu/MenuForm";
import CreateEmployee from "../pages/settings/employee/CreateEmployee";
import ProductForm from "../pages/catalogMaster/product/ProductForm";
import ReportListing from "../pages/reports/ReportListing";
import BranchForm from "../pages/settings/branch/BranchForm";
import BillingForm from "../pages/billing/BillingForm";
import EmployeeTypeForm from "../pages/masters/employeeType/EmployeeTypeForm";
import CountryForm from "../pages/masters/country/CountryForm";
import FormSchemeClassification from "../pages/schemeMaster/schemeClassification/FormSchemeClassification";
import UserProfileRegular from "../pages/pre-built/user-manage/UserProfileRegular";
import UserProfileSetting from "../pages/pre-built/user-manage/UserProfileSetting";
import UserProfileNotification from "../pages/pre-built/user-manage/UserProfileNotification";
import UserProfileActivity from "../pages/pre-built/user-manage/UserProfileActivity";
import DepartmentForm from "../pages/masters/department/DepartmentForm";
import DesignForm from "../pages/catalogMaster/design/DesignForm";
import SubDesignForm from "../pages/catalogMaster/subDesign/SubDesignForm";
import SectionForm from "../pages/catalogMaster/section/Section";
import CategoryForm from "../pages/catalogMaster/category/CategoryForm";
import DesignMappingForm from "../pages/catalogMaster/designMapping/DesignMappingForm";
import TagForm from "../pages/inventory/tagging/taggingForm";
import ShapesForm from "../pages/catalogMaster/shapes/ShapesForm";
import ClarityForm from "../pages/catalogMaster/clarity/ClarityForm";
import QualityForm from "../pages/catalogMaster/quality/QualityForm";
import SubDesignMappingForm from "../pages/catalogMaster/subDesignMapping/SubDesignMappingForm";
import EditEmployee from "../pages/settings/employee/EditEmployee";
import AdminLogs from "../pages/AdminLogs/adminlogs";
import TaxForm from "../pages/masters/Tax/TaxForm";
import PaymentHistory from "../pages/payments/SchemePayment/PaymentHistory";
import SizeForm from "../pages/catalogMaster/size/SizeForm";
import SettingForm from "../pages/settings/retsettings/SettingForm";
import EstimationForm from "../pages/estimation/Form";
import AttributeEntryForm from "../pages/masters/AttributeEntry/AttributeEntryForm";
import OtherChargesForm from "../pages/masters/OtherCharges/OtherChargesForm";
import BulkEditForm from "../pages/inventory/bulkEdit/BulkEditForm";
import OrderForm from "../pages/Order/CreateOrder/OrderForm";
import OrderAssignForm from "../pages/Order/OrderAssign/OrderAssignForm";
import JobOrderStatusForm from "../pages/Order/JobOrderStatus/JobOrderStatusForm";
import CustomerOrderStatus from "../pages/Order/CustomerOrderStatus/CustomerOrderStatus";
import OrderLinkForm from "../pages/Order/OrderLink/OrderLinkForm";
import DiamondRateMasterForm from "../pages/catalogMaster/diamondRateMaster/DiamondRateMasterForm";
import PayDeviceForm from "../pages/masters/payDevice/PayDeviceForm";
import StockIssueTypeForm from "../pages/masters/stockIssueType/StockIssueTypeForm";
import StockTransferForm from "../pages/inventory/stockTransfer/StockTransferForm";
import ReceiptForm from "../pages/billing/ReceiptForm";
import ApprovalForm from "../pages/inventory/approval/ApprovalForm";
import KarigarForm from "../pages/masters/Karigar/KarigarForm";
import CrmDashboard from "../pages/CrmDashboard";
import CashAbstract from "../pages/reports/CashAbstract";
import RetailDashboard from "../pages/RetailDashboard";
import WeightRangeForm from "../pages/masters/weightRange/WeightRangeForm";
import ReOrderSettingsForm from "../pages/catalogMaster/reOrderSettings/ReOrderSettingsForm";
import StockAuditForm from "../pages/inventory/stockAudit/StockAuditForm";
import McVaSettingsForm from "../pages/catalogMaster/mcVaSettings/McVaSettingsForm";
import SalesPrediction from "../pages/reports/SalesPrediction";
import EmployeeSettingsForm from "../pages/settings/employeeSettings/EmployeeSettingsForm";
import MonthWiseSchemeJoin from "../pages/reports/MonthWiseSchemeJoin";
import ChitCustomerReport from "../pages/reports/ChitCustomerReport";
import MonthWiseSchemeCollection from "../pages/reports/MonthWiseSchemeCollection";
import QcAndHmOIssueReceipt from "../pages/purchase/qcAndHmIssueReceipt";
import MenuAccessForm from "../pages/settings/menuAccess/MenuAccessForm";
import CashAbstractPrint from "../pages/reports/print/CashAbstractPrint";
import SchemeAbstractPrint from "../pages/reports/print/SchemeAbstractPrint";
import LotGenerate from "../pages/purchase/LotGenerate";
import PocketEntryForm from "../pages/metalProcess/pocketEntry";
import FloorForm from "../pages/masters/floor/FloorForm";
import RateCutAndMetalIssue from "../pages/purchase/RateCutAndMetalIssue";
import CounterForm from "../pages/masters/counter/CounterForm";
import MetalProcessIssueRecipt from "../pages/metalProcess/metalProcessIssueRecipt";
import RegisteredDeviceForm from "../pages/masters/registeredDevices/RegisteredDeviceForm";
import SectionWiseSalesForm from "../pages/masters/sectionWiseSales/SectionWiseSalesForm";
import CustomerImportantDateListing from "../pages/listing/CustomerImportantDateListing";
import ProfessionForm from "../pages/masters/profession/ProfessionForm";
import BankSettlementForm from "../pages/billing/bankSettlement/BankSettlementForm";
import JewelDeliverForm from "../pages/billing/JewelDeliverForm";
import DailyAbstractPrint from "../pages/reports/print/DailyAbstractPrint";
import DailyAbstractReport from "../pages/reports/DailyAbstractReport";
import PendingTransfer from "../pages/purchase/pendingTransfer";
import ContainerMasterForm from "../pages/masters/containerMaster/ContainerMasterForm";
import TaggingContainerForm from "../pages/inventory/tagging/taggingContainerLog/TaggingContainerForm";
import ApprovalEstimationForm from "../pages/estimation/ApprovalEstimationForm";
import OldMetalItemTypeForm from "../pages/masters/oldMetalItemType/OldMetalItemTypeForm";
import OtherWeightForm from "../pages/masters/OtherWeight/OtherWeightForm";
import CashOpeningBalanceForm from "../pages/masters/cashOpeningBalance/CashOpeningBalanceForm";
import AccountHeadForm from "../pages/masters/accountHead/AccountHeadForm";
import MetalIssueForm from "../pages/purchase/MetalIssueForm";
import RepairDamageMasterForm from "../pages/catalogMaster/repairDamageMaster/RepairDamageMasterForm";
import RepairOrderForm from "../pages/Order/CreateRepairOrder/RepairOrderForm";
import RepairOrderAssignForm from "../pages/Order/RepairOrderAssign/RepairOrderAssignForm";
import RepairOrderDeliveryForm from "../pages/Order/RepairOrderDelivery/RepairOrderDeliveryForm";
import SupplierPayment from "../pages/purchase/SupplierPayment";
import CashBookReport from "../pages/reports/CashBookReport";
import ServiceForm from "../pages/masters/service/ServiceForm";
import TagAuditForm from "../pages/inventory/stockAudit/TagAuditForm";
import SupplierLedgerReport from "../pages/reports/SupplierLedgerReport";
import CustomerProofForm from "../pages/masters/customerProof/CustomerProofForm";
import CommonImport from "../pages/CommonImport/CommonImport";
import TagPrint from "../pages/inventory/tagging/tagPrint";
import StateForm from "../pages/masters/state/StateForm";
import CityForm from "../pages/masters/city/CityForm";
import SupplierProductForm from "../pages/masters/supplierProduct/SupplierProductForm";
import CategoryPurityRateForm from "../pages/catalogMaster/categoryPurityRate/CategoryPurityRateForm";
import BankDepositForm from "../pages/masters/bankDeposit/BankDepositForm";
import AreaMasterCombined from "../pages/combinedMasters/areaCombinedMaster/AreaMasterCombined";
import FloorMasterCombined from "../pages/combinedMasters/floorCombinedMaster/FloorMasterCombined";
import BankStatementReport from "../pages/reports/BankStatementReport";
import DashReportList from "../pages/dashboard/retail/reports/DashReportList";
import RelationTypeForm from "../pages/masters/relationType/RelationTypeForm";
import ReorderReport from "../pages/reports/ReorderReport";
import DepositMasterForm from "../pages/masters/depositMaster/DepositMasterForm";
import CustomerDepositForm from "../pages/Order/CustomerDepositMaster/CustomerDepositForm";
import InvoicePreview from "../pages/billing/InvoicePreview";
import IncentiveForm from "../pages/incentive/incentiveMaster";
import PurchaseReturnForm from "../pages/purchase/PurchaseReturn";
import SearchCustomerSupllierHistory from "../pages/masters/searchHistory/SearchCustomerSupllierHistory";
import PurchaseTouchUpdate from "../pages/purchase/PurchaseTouchUpdate";
import ReligionMasterForm from "../pages/masters/religionMaster/ReligionMasterForm";
import DuplicateTagForm from "../pages/inventory/duplicateTag/DuplicateTagForm";
import BillDeleteForm from "../pages/billing/BillDeleteForm";
import StockAnalysisReport from "../pages/reports/StockAnalysisReport";
import EstimatePrint from "../pages/estimation/EstPrint";
import BillingPrint from "../pages/billing/BillingPrint";
import CrmDashReportList from "../pages/dashboard/crm/reports/CrmDashReportList";
import SupplierCatalogReport from "../pages/reports/SupplierCatalogReport";
import ReceiptDeleteForm from "../pages/billing/ReceiptDeleteForm";
import DailyTransactionReport from "../pages/reports/DailyTransactionReport";
import OtherInventoryCategoryForm from "../pages/otherInventory/OtherInventoryCategory/OtherInventoryCategoryForm";
import OtherInventorySizeForm from "../pages/otherInventory/OtherInventorySize/OtherInventorySizeForm";
import OtherInventoryItemForm from "../pages/otherInventory/OtherInventoryItem/OtherInventoryItemForm";
import OtherInventoryPurchaseForm from "../pages/otherInventory/OtherInventoryPurchase/OtherInventoryPurchaseForm";
import OtherInventoryItemIssueForm from "../pages/otherInventory/OtherInventoryItemIssue/OtherInventoryItemIssueForm";
import BuySellForm from "../pages/mcxBuySell/BuySellForm";
import LotDetailsIssueReceiptForm from "../pages/inventory/issueReceipt/LotForm";
import TagDetailsIssueReceiptForm from "../pages/inventory/issueReceipt/TagForm";
import CustomerApprovalForm from "../pages/masters/customer/CustomerApprovalForm";
import BuySellFormNew from "../pages/mcxBuySell/BuySellFormNew";
import JewelNotDeliverTemplate from "../pages/billing/BillingPrintTemplate/JewelNotDeliverTemplate";
import NonTagIsssue from "../pages/inventory/issueReceipt/nonTagIsssue";
import ExportDBDump from "../pages/settings/backupDB/ExportDBDump";
import BillingThermalPrint from "../pages/billing/BillThermalPrint";
import PurchaseDashboard from "../pages/PurchaseDashboard";
import WeightRangeFormEdit from "../pages/masters/weightRange/WeightRangeFormEdit";
import SystemUserEmployeeList from "../pages/settings/employee/SystemUserEmployeeList";
import PurchaseOrderForm from "../pages/Order/PurchaseOrder/PurchaseOrderForm";
import PurchaseOrderStatus from "../pages/Order/PurchaseOrder/PurchaseOrderStatus";
import BillViewReport from "../pages/reports/BillViewReport";
import DiscountForm from "../pages/promotionalManagement/Discount/DiscountForm";
import CouponForm from "../pages/promotionalManagement/Coupon/CouponForm";
import GiftVoucherForm from "../pages/promotionalManagement/GiftVoucher/GiftVoucherForm";
import VoucherIssueForm from "../pages/promotionalManagement/VoucherIssue/VoucherIssueForm";
import CustomerOrderPrint from "../pages/Order/CreateOrder/OrderPrint";
import VoucherIssueStatusForm from "../pages/promotionalManagement/VoucherIssueStatus/VoucherIssueStatusForm";
import PurchaseOrderPrint from "../pages/Order/PurchaseOrder/PurchaseOrderPrint";
import RepairOrderPrint from "../pages/Order/CreateRepairOrder/RepairOrderPrint";
import secureLocalStorage from "react-secure-storage";
import MenuAccessFormType2 from "../pages/settings/menuAccess/MenuAccessFormType2";
import VoucherIssuePrint from "../pages/promotionalManagement/VoucherIssue/VoucherIssuePrint";
import PurchasePrint from "../pages/purchase/PurchasePrint";
import BillingFormWholesale from "../pages/billing/billingWholesale/BillingFormWholesale";
import TransactionDeleteForm from "../pages/billing/TransactionDeleteForm";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import DigiGoldDashboard from "../pages/DigiGoldDashboard";
import useAuth from "../utils/hooks/useAuth";
import { useSessionContext } from "../contexts/SessionContext";
import BannerForm from "../pages/masters/banner/BannerForm";
import OrderManagementDashboard from "../pages/OrdermanagementDashboard";
import QcandIssuePrint from "../pages/purchase/QcandIssuePrint";
import NotificationForm from "../pages/masters/notification/NotificationForm";
import DailyStatusForm from "../pages/masters/dailyStatus/DailyStatusForm";
import RepairOrderStatus from "../pages/Order/RepairOrderStatus/RepairOrderStatus";
import LoyaltyTiersForm from "../pages/loyaltyMaster/loyaltyTiers/LoyaltyTiersForm";
import LoyaltySettingsForm from "../pages/loyaltyMaster/loyaltySettings/LoyaltySettingsForm";
import MasterClientForm from "../pages/admin/masters/clients/MasterClientFrom";
import SupplierPaymentPrintA4 from "../pages/purchase/purchasePrintTemplate/SupplierPaymentPrintA4";
import SupplierPaymentPrintThermal from "../pages/purchase/purchasePrintTemplate/SupllierPaymentPrintThermal";
import IssueReceiptPrint from "../pages/billing/IssueReceiptPrint";
import LotIssuePrint from "../pages/inventory/issueReceipt/LotIssuePrint";
import ModuleMasterForm from "../pages/admin/masters/moduleMaster/ModuleMasterForm";
import AdminProductMaster from "../pages/admin/masters/adminProductMaster/AdminProductMasterForm";
import ProjectsForm from "../pages/admin/projects/ProjectsForm";
import LiablityEntryForm from "../pages/billing/LiablityEntry/LiablityEntryForm";
import LiablityEntryPayment from "../pages/billing/LiablityEntry/LiablityEntryPayment";
import StockTransferPrint from "../pages/inventory/stockTransfer/StockTransferPrint";
import LiablityEntryPrint from "../pages/billing/LiablityEntry/LiablityEntryPrint";
import LiablityPaymentPrint from "../pages/billing/LiablityEntry/LiablityPaymentPrint";
import TaskForm from "../pages/admin/projects/task/TaskForm";
import SubTaskForm from "../pages/admin/projects/subTask/SubTaskForm";
import AttedanceForm from "../pages/admin/attedance/AttedanceForm";
import LotMergeForm from "../pages/inventory/lot/lotMergeForm";
import JewelNotDeliverCompanyCopy from "../pages/billing/BillingPrintTemplate/JewelNotDeliverCompanyCopy";
import PerformanceInvoiceForm from "../pages/admin/projects/PerformanceInvoice/PerformanceInvoiceFrom";

import PurchaseCartList from "../pages/Order/PurchaseCart/PurchaseCartList";
import ERPEmployeeAttendance from "../pages/admin/erpemployeeattendance/ERPEmployeeAttendance";
import RegionForm from "../pages/masters/region/RegionForm";


const Router = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  // const { isActive } = useSessionContext();
  const { authenticated, signOut, authChecking, bootComplete } = useAuth();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const logOut = useCallback(() => {
    secureLocalStorage.removeItem("pref");
        dispatch(userLogout());
        setTimeout(() => {
          window.location.reload();
        }, 100);
  }, [dispatch]);

  const onIdle = () => {
    if (location?.pathname !== "/auth/login") {
      logOut();
    }
  };
  
  // const onIdle = () => {
  //   if (isActive && location?.pathname !== "/auth/login") {
  //     signOut();
  //   }
  // };
  

  useEffect(() => {
    let mounted = true;
    // Named handler functions
    const handleServerDown = () => {
      Swal.fire({
        title: "Error!",
        text: "Oops ! Server is Down",
        icon: "error",
        confirmButtonText: "Retry",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    };

    const handleLogout = () => {
      secureLocalStorage.removeItem("pref");
      Swal.fire({
        title: "Warning!",
        text: "Your Login Expired",
        icon: "warning",
        confirmButtonText: "Login",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          logOut();
        }
      });
    };

    const handleAccExpired = () => {
      if (!mounted) return;
      if (!bootComplete) return;
      secureLocalStorage.removeItem("pref");
      Swal.fire({
        title: "Error!",
        text: "Your Account has Expired",
        icon: "error",
        confirmButtonText: "Login",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          logOut();
        }
      });
    };

    const handleError = (errdata) => {
      errdata?.forEach((item) => toastfunc(item));
    };

    const handleUnique = (errdata) => {
      toastfunc(errdata);
    };

    // Register all handlers once
    EventBus.on("server_down", handleServerDown);
    EventBus.on("logout", handleLogout);
    EventBus.on("acc_expired", handleAccExpired);
    EventBus.on("error", handleError);
    EventBus.on("unique", handleUnique);

    // Cleanup on unmount
    return () => {
      EventBus.remove("server_down", handleServerDown);
      EventBus.remove("logout", handleLogout);
      mounted = false;
      EventBus.remove("acc_expired", handleAccExpired);

      EventBus.remove("error", handleError);
      EventBus.remove("unique", handleUnique);
    };
  }, []);

  // idle timer setting
  // const idleTimer = useIdleTimer({
  //   onIdle,
  //   timeout: 1000 * 60 * 60, // 1hr idle
  //   promptTimeout: 0,
  //   events: [
  //     "mousemove",
  //     "keydown",
  //     "wheel",
  //     "DOMMouseScroll",
  //     "mousewheel",
  //     "mousedown",
  //     "touchstart",
  //     "touchmove",
  //     "MSPointerDown",
  //     "MSPointerMove",
  //     "visibilitychange",
  //   ],
  //   immediateEvents: [],
  //   debounce: 0,
  //   throttle: 0,
  //   eventsThrottle: 200,
  //   element: document,
  //   startOnMount: true,
  //   startManually: false,
  //   stopOnIdle: false,
  //   crossTab: true,
  //   name: "idle-timer",
  //   syncTimers: 0,
  //   leaderElection: false,
  // });

  const idleTimer = useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 60, // 1 hour
    promptTimeout: 0,
    events: [
      "mousemove",
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mousedown",
      "touchstart",
      "touchmove",
      "MSPointerDown",
      "MSPointerMove",
      "visibilitychange",
    ],
    debounce: 0,
    throttle: 0,
    eventsThrottle: 200,
    element: document,
    startOnMount: true,
    crossTab: false,
    stopOnIdle: false,
  });

  return (
    <>
      <Routes>
        {/* <Route path="/auth" element={<PublicRoute />}> */}
          <Route
            path={`${process.env.PUBLIC_URL}/auth`}
            element={<LayoutNoSidebar />}
          >
            {/* <Route
          path={`${process.env.PUBLIC_URL}/auth`}
          element={<LayoutNoSidebar />}
        > */}
            <Route index element={<Login />}></Route>
            <Route
              exact
              path={`${process.env.PUBLIC_URL}success`}
              element={<Success />}
            ></Route>
            <Route
              exact
              path={`${process.env.PUBLIC_URL}reset/confirm_reset/:reset_code`}
              element={<ForgotPassword />}
            ></Route>
            <Route
              exact
              path={`${process.env.PUBLIC_URL}reset`}
              element={<ForgotPassword />}
            ></Route>
            <Route
              exact
              path={`${process.env.PUBLIC_URL}login`}
              element={<Login />}
            ></Route>
            <Route
              exact
              path={`${process.env.PUBLIC_URL}verify`}
              element={<AuthVerify />}
            ></Route>
            <Route
              exact
              path={`${process.env.PUBLIC_URL}terms`}
              element={<Terms />}
            ></Route>
          </Route>
        {/* </Route> */}
        {/* <Route path="/" element={<ProtectedRoute />}> */}
          <Route path="/" element={<Navigate replace to={"/"} />} />
          <Route
            path={`${process.env.PUBLIC_URL}/master/department`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<DepartmentForm />}></Route>
            <Route path="edit" element={<DepartmentForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/relationtype`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<RelationTypeForm />}></Route>
            <Route path="edit" element={<RelationTypeForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/settings/menu`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<MenuForm />}></Route>
            <Route path="edit" element={<MenuForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/settings/employeesettings`}
            element={<Layout />}
          >
            <Route path="add" element={<EmployeeSettingsForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/settings/menuaccess`}
            element={<Layout />}
          >
            <Route path="add" element={<MenuAccessForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/admin/employee`}
            element={<Layout />}
          >
            <Route path="attedance" element={<AttedanceForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/admin/erpemployeeattendance`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<ERPEmployeeAttendance />}></Route>
            <Route path="edit" element={<ERPEmployeeAttendance />}></Route>

          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/settings/menuaccess2`}
            element={<Layout />}
          >
            <Route path="add" element={<MenuAccessFormType2 />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/settings/exportdb`}
            element={<Layout />}
          >
            <Route index element={<ExportDBDump />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/settings`}
            element={<Layout />}
          >
            <Route path="list" element={<SettingForm />}></Route>
            {/* <Route path="add" element={<SettingForm />}></Route> */}
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/area`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<AreaForm />}></Route>
            <Route path="edit" element={<AreaForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/oldmetaltype`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<OldMetalItemTypeForm />}></Route>
            <Route path="edit" element={<OldMetalItemTypeForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/cashopeningbalance`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<CashOpeningBalanceForm />}></Route>
            <Route path="edit" element={<CashOpeningBalanceForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/accounthead`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<AccountHeadForm />}></Route>
            <Route path="edit" element={<AccountHeadForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/customerproof`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<CustomerProofForm />}></Route>
            <Route path="edit" element={<CustomerProofForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/service`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<ServiceForm />}></Route>
            <Route path="edit" element={<ServiceForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/common/import`}
            element={<Layout />}
          >
            <Route path="list" element={<CommonImport />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/otherweight`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<OtherWeightForm />}></Route>
            <Route path="edit" element={<OtherWeightForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/bank`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<BankForm />}></Route>
            <Route path="edit" element={<BankForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/banner`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<BannerForm />}></Route>
            <Route path="edit" element={<BannerForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/daily_status`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<DailyStatusForm />}></Route>
            <Route path="edit" element={<DailyStatusForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/notification`}
            element={<Layout />}
          >
            {/* <Route path="list" element={<Listing />}></Route> */}
            <Route path="add" element={<NotificationForm />}></Route>
            {/* <Route path="edit" element={<NotificationForm />}></Route> */}
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/bank_deposit`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<BankDepositForm />}></Route>
            <Route path="edit" element={<BankDepositForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/branch`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<BranchForm />}></Route>
            <Route path="edit" element={<BranchForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/order/createorder`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<OrderForm />}></Route>
            <Route path="edit" element={<OrderForm />}></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/orders/order`}>
            <Route path="print" element={<CustomerOrderPrint />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/order/purchaseorder`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="sold_purchase_report" element={<Listing />}></Route>
            <Route path="add" element={<PurchaseOrderForm />}></Route>
            <Route path="edit" element={<PurchaseOrderForm />}></Route>
            <Route path="status" element={<PurchaseOrderStatus />}></Route>
            {/* <Route path="print" element={<PurchaseOrderPrint />}></Route> */}
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/orders/purchase_order`}>
            <Route path="print" element={<PurchaseOrderPrint />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/order/repair_order`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<RepairOrderForm />}></Route>
            <Route path="edit" element={<RepairOrderForm />}></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/orders/repairorder`}>
            <Route path="print" element={<RepairOrderPrint />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/order/orderassign`}
            element={<Layout />}
          >
            <Route path="list" element={<OrderAssignForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/order/repair_order_assign`}
            element={<Layout />}
          >
            <Route path="list" element={<RepairOrderAssignForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/order/repair_order_status`}
            element={<Layout />}
          >
            <Route path="list" element={<RepairOrderStatus />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/order/repair_order_delivery`}
            element={<Layout />}
          >
            <Route path="list" element={<RepairOrderDeliveryForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/order/orderlink`}
            element={<Layout />}
          >
            <Route path="list" element={<OrderLinkForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/order/orderstatus`}
            element={<Layout />}
          >
            <Route path="list" element={<JobOrderStatusForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/order/customer_order_status`}
            element={<Layout />}
          >
            <Route path="list" element={<CustomerOrderStatus />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/financialyear`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<FinancialYearForm />}></Route>
            {/* <Route path="edit" element={<FinancialYearForm />}></Route> */}
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/uom`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<UomForm />}></Route>
            <Route path="edit" element={<UomForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/tax`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<TaxForm />}></Route>
            <Route path="edit" element={<TaxForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/paydevice`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<PayDeviceForm />}></Route>
            <Route path="edit" element={<PayDeviceForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/stockissuetype`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<StockIssueTypeForm />}></Route>
            <Route path="edit" element={<StockIssueTypeForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/customer`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<CustomerForm />}></Route>
            <Route path="edit" element={<CustomerForm />}></Route>
            <Route path="approval" element={<CustomerApprovalForm />}></Route>
          </Route>
          <Route
            path={`${process.env.PUBLIC_URL}/customer/important_dates`}
            element={<Layout />}
          >
            <Route
              path="list"
              element={<CustomerImportantDateListing />}
            ></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/floor`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<FloorForm />}></Route>
            <Route path="edit" element={<FloorForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/religion`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<ReligionMasterForm />}></Route>
            <Route path="edit" element={<ReligionMasterForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/counter`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<CounterForm />}></Route>
            <Route path="edit" element={<CounterForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/profession`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<ProfessionForm />}></Route>
            <Route path="edit" element={<ProfessionForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/region`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<RegionForm />}></Route>
            <Route path="edit" element={<RegionForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/registered_devices`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<RegisteredDeviceForm />}></Route>
            <Route path="edit" element={<RegisteredDeviceForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/section_wise_sales`}
            element={<Layout />}
          >
            <Route path="add" element={<SectionWiseSalesForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/employeetype`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<EmployeeTypeForm />}></Route>
            <Route path="edit" element={<EmployeeTypeForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/metalrate`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<MetalRateForm />}></Route>
            <Route path="edit" element={<MetalRateForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/loyalty_master/loyalty_tiers`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<LoyaltyTiersForm />}></Route>
            <Route path="edit" element={<LoyaltyTiersForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/loyalty_master/loyalty_settings`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<LoyaltySettingsForm />}></Route>
            <Route path="edit" element={<LoyaltySettingsForm />}></Route>
          </Route>

         <Route
            path={`${process.env.PUBLIC_URL}/admin/master/masterclient`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<MasterClientForm />}></Route>
            <Route path="edit" element={<MasterClientForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/admin/master/module_master`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<ModuleMasterForm />}></Route>
            <Route path="edit" element={<ModuleMasterForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/admin/master/product_master`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<AdminProductMaster />}></Route>
            <Route path="edit" element={<AdminProductMaster />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/admin/master/projects`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<ProjectsForm />}></Route>
            <Route path="edit" element={<ProjectsForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/admin/master/task`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<TaskForm />}></Route>
            <Route path="edit" element={<TaskForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/admin/master/sub_task`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<SubTaskForm />}></Route>
            <Route path="edit" element={<SubTaskForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/admin/master/PerformanceInvoice`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<PerformanceInvoiceForm />}></Route>
            <Route path="edit" element={<PerformanceInvoiceForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/depositmaster`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<DepositMasterForm />}></Route>
            <Route path="edit" element={<DepositMasterForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/customer_deposit`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<CustomerDepositForm />}></Route>
            <Route path="edit" element={<CustomerDepositForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/country`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<CountryForm />}></Route>
            <Route path="edit" element={<CountryForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/state`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<StateForm />}></Route>
            <Route path="edit" element={<StateForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/city`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<CityForm />}></Route>
            <Route path="edit" element={<CityForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/settings/company`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<CompanyForm />}></Route>
            <Route path="edit" element={<CompanyForm />}></Route>
          </Route>
          <Route
            path={`${process.env.PUBLIC_URL}/adminlogs`}
            element={<Layout />}
          >
            <Route path="list" element={<AdminLogs />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/settings/employee`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<CreateEmployee />}></Route>
            <Route path="edit" element={<EditEmployee />}></Route>
            <Route
              path="system_users"
              element={<SystemUserEmployeeList />}
            ></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/schememaster/scheme`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<SchemeForm />}></Route>
            <Route path="edit" element={<SchemeForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/schememaster/schemeaccount`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<SchemeAccountForm />}></Route>
            <Route path="edit" element={<SchemeAccountForm />}></Route>
          </Route>
          <Route
            path={`${process.env.PUBLIC_URL}/schememaster/closedschemeaccount`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/schememaster/schemeaccount`}
            element={<Layout />}
          >
            <Route path="close" element={<SchemeCloseAccount />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/schememaster/schemeaccount`}
            element={<Layout />}
          >
            <Route path="history" element={<PaymentHistory />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/schememaster/schemeclassification`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<FormSchemeClassification />}></Route>
            <Route path="edit" element={<FormSchemeClassification />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/profile`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<ProfilePage />}></Route>
            <Route path="edit" element={<ProfilePage />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/payments/schemepayment`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<CreateSchemePayment />}></Route>
            <Route path="print" element={<PrintPayment />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/metal`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<MetalForm />}></Route>
            <Route path="edit" element={<MetalForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/purity`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<PurityForm />}></Route>
            <Route path="edit" element={<PurityForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/size`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<SizeForm />}></Route>
            <Route path="edit" element={<SizeForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/cut`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<CutForm />}></Route>
            <Route path="edit" element={<CutForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/color`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<ColorForm />}></Route>
            <Route path="edit" element={<ColorForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/reordersettings`}
            element={<Layout />}
          >
            <Route path="add" element={<ReOrderSettingsForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/shape`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<ShapesForm />}></Route>
            <Route path="edit" element={<ShapesForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/clarity`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<ClarityForm />}></Route>
            <Route path="edit" element={<ClarityForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/diamondratemaster`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<DiamondRateMasterForm />}></Route>
            <Route path="edit" element={<DiamondRateMasterForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/quality`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<QualityForm />}></Route>
            <Route path="edit" element={<QualityForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/stone`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<StoneForm />}></Route>
            <Route path="edit" element={<StoneForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/designation`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<DesignationForm />}></Route>
            <Route path="edit" element={<DesignationForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/container`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<ContainerMasterForm />}></Route>
            <Route path="edit" element={<ContainerMasterForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/attributeentry`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<AttributeEntryForm />}></Route>
            <Route path="edit" element={<AttributeEntryForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/othercharges`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<OtherChargesForm />}></Route>
            <Route path="edit" element={<OtherChargesForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/karigar`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<KarigarForm />}></Route>
            <Route path="edit" element={<KarigarForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/supplier/product`}
            element={<Layout />}
          >
            <Route path="add" element={<SupplierProductForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/weightrange`}
            element={<Layout />}
          >
            <Route path="add" element={<WeightRangeForm />}></Route>
            <Route path="edit" element={<WeightRangeFormEdit />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/product`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<ProductForm />}></Route>
            <Route path="edit" element={<ProductForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/category`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<CategoryForm />}></Route>
            <Route path="edit" element={<CategoryForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/category_purity_rate`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<CategoryPurityRateForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/design`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<DesignForm />}></Route>
            <Route path="edit" element={<DesignForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/design_mapping`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<DesignMappingForm />}></Route>
            <Route path="edit" element={<DesignMappingForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/sub_design`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<SubDesignForm />}></Route>
            <Route path="edit" element={<SubDesignForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/sub_design_mapping`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<SubDesignMappingForm />}></Route>
            <Route path="edit" element={<SubDesignMappingForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/damage_master`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<RepairDamageMasterForm />}></Route>
            <Route path="edit" element={<RepairDamageMasterForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/section`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<SectionForm />}></Route>
            <Route path="edit" element={<SectionForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/catalogmaster/mcvasettings`}
            element={<Layout />}
          >
            <Route path="add" element={<McVaSettingsForm />}></Route>
          </Route>


          <Route
            path={`${process.env.PUBLIC_URL}/purchase/purchase_entry/`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<PurchaseEntryForm />}></Route>
            <Route path="edit" element={<PurchaseEntryForm />}></Route>
            <Route path="edit_touch" element={<PurchaseTouchUpdate />}></Route>
            <Route path="cart" element={<PurchaseCartList />}></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/purchase/purchase_entry`}>
            <Route path="print" element={<PurchasePrint />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/purchase/purchase_return/`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<PurchaseReturnForm />}></Route>
            <Route path="edit" element={<PurchaseReturnForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/master/combined_master/`}
            element={<Layout />}
          >
            <Route path="area" element={<AreaMasterCombined />}></Route>
            <Route path="floor" element={<FloorMasterCombined />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/promotional_management/discount`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<DiscountForm />}></Route>
            <Route path="edit" element={<DiscountForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/promotional_management/coupon`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<CouponForm />}></Route>
            <Route path="edit" element={<CouponForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/promotional_management/gift_voucher`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<GiftVoucherForm />}></Route>
            <Route path="edit" element={<GiftVoucherForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/promotional_management/voucher_issue_status`}
            element={<Layout />}
          >
            <Route path="list" element={<VoucherIssueStatusForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/promotional_management/voucher_issue`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<VoucherIssueForm />}></Route>
            <Route path="edit" element={<VoucherIssueForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/promotion_management/voucher_issue`}
          >
            <Route path="print" element={<VoucherIssuePrint />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/other_inventory/category`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<OtherInventoryCategoryForm />}></Route>
            <Route path="edit" element={<OtherInventoryCategoryForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/other_inventory/size`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<OtherInventorySizeForm />}></Route>
            <Route path="edit" element={<OtherInventorySizeForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/other_inventory/item`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<OtherInventoryItemForm />}></Route>
            <Route path="edit" element={<OtherInventoryItemForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/other_inventory/purchase`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<OtherInventoryPurchaseForm />}></Route>
            <Route path="edit" element={<OtherInventoryPurchaseForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/other_inventory/item_issue`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<OtherInventoryItemIssueForm />}></Route>
            <Route
              path="edit"
              element={<OtherInventoryItemIssueForm />}
            ></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/purchase/lot_generate/`}
            element={<Layout />}
          >
            <Route path="add" element={<LotGenerate />}></Route>
          </Route>
          <Route
            path={`${process.env.PUBLIC_URL}/purchase/pending_transfer/`}
            element={<Layout />}
          >
            <Route path="add" element={<PendingTransfer />}></Route>
          </Route>
          <Route
            path={`${process.env.PUBLIC_URL}/oldmetal_process/pocket`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<PocketEntryForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/oldmetal_process/pocket_issue_receipt`}
            element={<Layout />}
          >
            {/* <Route path="list" element={<Listing />}></Route> */}
            <Route path="add" element={<MetalProcessIssueRecipt />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/purchase/qu_issue_receipt/`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<QcAndHmOIssueReceipt />}></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/purchase/qu_issue_receipt`}>
            <Route path="print" element={<QcandIssuePrint />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/sales_target`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>
          <Route
            path={`${process.env.PUBLIC_URL}/reports/bill_view_report`}
            element={<Layout />}
          >
            <Route path="list" element={<BillViewReport />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/daily_transaction`}
            element={<Layout />}
          >
            <Route path="list" element={<DailyTransactionReport />}></Route>
          </Route>


          <Route
            path={`${process.env.PUBLIC_URL}/reports/customer_jewel_not_delivered`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/area_wise_sales_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/purchase/metal_issue`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<MetalIssueForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/purchase/rate_cut_and_metal_issue/`}
            element={<Layout />}
          >
            <Route path="list" element={<RateCutAndMetalIssue />}></Route>
          </Route>
          <Route
            path={`${process.env.PUBLIC_URL}/purchase/supplier_payment/`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<SupplierPayment />}></Route>
          </Route>

          {/* <Route path={`${process.env.PUBLIC_URL}/reports/schemeabstract`} element={<Layout />}>
          <Route path="list" element={<Listing />}></Route>
        </Route> */}

          <Route
            path={`${process.env.PUBLIC_URL}/reports/month_wise_scheme_join`}
            element={<Layout />}
          >
            <Route path="list" element={<MonthWiseSchemeJoin />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/stock_analysis`}
            element={<Layout />}
          >
            <Route path="list" element={<StockAnalysisReport />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/month_wise_scheme_collection`}
            element={<Layout />}
          >
            <Route path="list" element={<MonthWiseSchemeCollection />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/chit_customer`}
            element={<Layout />}
          >
            <Route path="list" element={<ChitCustomerReport />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/stock_in_and_out`}
            element={<Layout />}
          >
            {/* <Route path="list" element={<StockInAndOutReport />}></Route> */}
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/metal_stock_in_and_out`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/other_inventory_item_log`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/other_inventory_item_purchase`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/other_inventory_item_issue`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/stock_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/above_2L_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>
          <Route
            path={`${process.env.PUBLIC_URL}/reports/employee_incentive`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/bank_statement_report`}
            element={<Layout />}
          >
            <Route path="list" element={<BankStatementReport />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/supplier_catalog`}
            element={<Layout />}
          >
            <Route path="list" element={<SupplierCatalogReport />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/sales_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/weigt_range_sales_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/payment_device_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/purchase_reports`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/purchase_return_reports`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/stock_transfer_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/unpaid_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/tag_details`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/discount_billing`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/billing/liablity_entry`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<LiablityEntryForm />}></Route>
          </Route>

           <Route path={`${process.env.PUBLIC_URL}/billing/liablity_entry`}>
            <Route path="print" element={<LiablityEntryPrint />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/billing/liablity_entry_payment`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<LiablityEntryPayment />}></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/billing/liablity_entry_payment`}>
            <Route path="print" element={<LiablityPaymentPrint />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/metal_process_profit_loss`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/purchase_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/sale_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/month_wise_sales/`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/month_wise_purchase_entry/`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/suppliers_ledger/`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/cash_abstract`}
            element={<Layout />}
          >
            <Route path="list" element={<CashAbstract />}></Route>
          </Route>
          <Route path={`${process.env.PUBLIC_URL}/reports/cash_abstract`}>
            <Route path="print" element={<CashAbstractPrint />}></Route>
          </Route>
          <Route path={`${process.env.PUBLIC_URL}/billing`}>
            <Route path="invoice_preview" element={<InvoicePreview />}></Route>
          </Route>
          <Route
            path={`${process.env.PUBLIC_URL}/reports/cash_book`}
            element={<Layout />}
          >
            <Route path="list" element={<CashBookReport />}></Route>
          </Route>
          <Route
            path={`${process.env.PUBLIC_URL}/reports/re_order_report`}
            element={<Layout />}
          >
            <Route path="list" element={<ReorderReport />}></Route>
          </Route>
          <Route
            path={`${process.env.PUBLIC_URL}/reports/supplier_ledger`}
            element={<Layout />}
          >
            <Route path="list" element={<SupplierLedgerReport />}></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/reports/scheme_abstract`}>
            <Route path="print" element={<SchemeAbstractPrint />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/scheme_abstract`}
            element={<Layout />}
          >
            <Route path="list" element={<SchemeAbstract />}></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/reports/daily_abstract`}>
            <Route path="print" element={<DailyAbstractPrint />}></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/tag`}>
            <Route path="print" element={<TagPrint />}></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/estimation`}>
            <Route path="print" element={<EstimatePrint />}></Route>
          </Route>
          <Route path={`${process.env.PUBLIC_URL}/purchase/supplier_payment`}>
            <Route path="print" element={<SupplierPaymentPrintA4 />}></Route>
            <Route
              path="print_thermal"
              element={<SupplierPaymentPrintThermal />}
            ></Route>
          </Route>
          <Route path={`${process.env.PUBLIC_URL}/billing`}>
            <Route path="print" element={<BillingPrint />}></Route>
            <Route
              path="jnd_print"
              element={<JewelNotDeliverTemplate />}
            ></Route>
            <Route
              path="jnd_print_cus"
              element={<JewelNotDeliverCompanyCopy />}
            ></Route>
            <Route
              path="thermal_print"
              element={<BillingThermalPrint />}
            ></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/metal_process`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/stock_inward_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/lot_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/lot_balance_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/daily_abstract`}
            element={<Layout />}
          >
            <Route path="list" element={<DailyAbstractReport />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/stock_audit_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/stock_audit_detail_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/b2b_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/advance_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/credit_invoice_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/credit_collection_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/sales_prediction`}
            element={<Layout />}
          >
            <Route path="list" element={<SalesPrediction />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/emp_sales_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/petty_cash_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/credit_issue_pending_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/credit_pending_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/sales_return_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/chit_adjusted_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/advance_refund_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/advance_adjusted_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/partly_sales_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/supplier_sales_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/tag_wise_profit_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/cancel_bill_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/discount_bill_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/gift_voucher_issue_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/digi_gold_reports`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/account_wise_digi_gold_reports`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/pan_bill_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/billwise_transaction_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/sales_and_return_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/credit_tobe_delivered`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/jewel_not_delivered`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/mode_wise_collection_report`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/unpaid_report`}
            element={<Layout />}
          >
            <Route path="list" element={<ReportListing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/customer_outstanding_report`}
            element={<Layout />}
          >
            <Route path="list" element={<CustomerOutstanding />}></Route>
          </Route>
          
          <Route
            path={`${process.env.PUBLIC_URL}/reports/incentive/details`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/scheme_wise_opening`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/closed_account_report`}
            element={<Layout />}
          >
            <Route path="list" element={<ReportListing />}></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}`} element={<Layout />}>
            <Route index element={<RetailDashboard />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/homepage`}
            element={<Layout />}
          >
            <Route index element={<Homepage />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/crm/dashboard`}
            element={<Layout />}
          >
            <Route index element={<CrmDashboard />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/digigold/dashboard`}
            element={<Layout />}
          >
            <Route index element={<DigiGoldDashboard />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/dashboard/PurchaseDashboard`}
            element={<Layout />}
          >
            <Route index element={<PurchaseDashboard />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/retail/dashboard`}
            element={<Layout />}
          >
            <Route index element={<RetailDashboard />}></Route>
            <Route
              path="reports/estimation"
              element={<DashReportList />}
            ></Route>
            <Route
              path="reports/customervisits"
              element={<DashReportList />}
            ></Route>
            <Route path="reports/sales" element={<DashReportList />}></Route>
            <Route
              path="reports/salesreturn"
              element={<DashReportList />}
            ></Route>
            <Route path="reports/purchase" element={<DashReportList />}></Route>
            <Route path="reports/lot" element={<DashReportList />}></Route>
            <Route
              path="reports/creditsales"
              element={<DashReportList />}
            ></Route>
            <Route
              path="reports/karigar_order"
              element={<DashReportList />}
            ></Route>
            <Route
              path="reports/customer_order"
              element={<DashReportList />}
            ></Route>
            <Route
              path="reports/stock_approval"
              element={<DashReportList />}
            ></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/crm/dashboard`}
            element={<Layout />}
          >
            <Route index element={<CrmDashboard />}></Route>
            <Route
              path="reports/activechits"
              element={<CrmDashReportList />}
            ></Route>
            <Route
              path="reports/maturedunclaimed"
              element={<CrmDashReportList />}
            ></Route>
            <Route
              path="reports/payment"
              element={<CrmDashReportList />}
            ></Route>
            <Route
              path="reports/usersjoinedthrough"
              element={<CrmDashReportList />}
            ></Route>
            <Route
              path="reports/schemewise"
              element={<CrmDashReportList />}
            ></Route>
            <Route
              path="reports/branchwise"
              element={<CrmDashReportList />}
            ></Route>
            <Route
              path="reports/registerthrough"
              element={<CrmDashReportList />}
            ></Route>
            <Route
              path="reports/customer_details"
              element={<CrmDashReportList />}
            ></Route>
            <Route
              path="reports/collection_summary"
              element={<CrmDashReportList />}
            ></Route>
            <Route
              path="reports/inactivechits"
              element={<CrmDashReportList />}
            ></Route>
            <Route
              path="reports/chitclosing"
              element={<CrmDashReportList />}
            ></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/dashboard/ordermanagement`}
            element={<Layout />}
          >
            <Route index element={<OrderManagementDashboard />}></Route>
            <Route
              path="reports/total_orders"
              element={<DashReportList />}
            ></Route>
            <Route
              path="reports/today_received"
              element={<DashReportList />}
            ></Route>
            <Route
              path="reports/today_delivery"
              element={<DashReportList />}
            ></Route>
            <Route
              path="reports/yet_to_assign"
              element={<DashReportList />}
            ></Route>
            <Route
              path="reports/total_deliverd"
              element={<DashReportList />}
            ></Route>
            <Route
              path="reports/this_week_delivery"
              element={<DashReportList />}
            ></Route>
            <Route
              path="reports/next_week_delivery"
              element={<DashReportList />}
            ></Route>
            <Route
              path="reports/over_due_order_supplier"
              element={<DashReportList />}
            ></Route>
            <Route
              path="reports/customer_over_due_order"
              element={<DashReportList />}
            ></Route>
            <Route
              path="reports/customer_total_delivery"
              element={<DashReportList />}
            ></Route>
            <Route
              path="reports/customer_total_work_progress"
              element={<DashReportList />}
            ></Route>
            <Route path="reports/customer_cart" element={<Listing />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/inventory/lot/`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<LotForm />}></Route>
            <Route path="edit" element={<LotForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/inventory/lot/issueReceipt`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<LotDetailsIssueReceiptForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/inventory/lot/lot_merge`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<LotMergeForm />}></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/inventory/lot/issue_receipt`}>
            <Route path="print" element={<LotIssuePrint />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/inventory/lot/non_tag_issue`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<NonTagIsssue />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/inventory/tag/issueReceipt`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<TagDetailsIssueReceiptForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/inventory/bulk_edit_tag/`}
            element={<Layout />}
          >
            <Route path="list" element={<BulkEditForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/inventory/stock_transfer/`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<StockTransferForm />}></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/stock_transfer/`}>
            <Route path="print" element={<StockTransferPrint />}></Route>
          </Route>
          
          <Route
            path={`${process.env.PUBLIC_URL}/inventory/approval/`}
            element={<Layout />}
          >
            <Route path="list" element={<ApprovalForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/inventory/duplicate_tag/`}
            element={<Layout />}
          >
            <Route path="list" element={<DuplicateTagForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/reports/user_history/`}
            element={<Layout />}
          >
            <Route
              path="search"
              element={<SearchCustomerSupllierHistory />}
            ></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/inventory/tag_audit/`}
            element={<Layout />}
          >
            <Route path="list" element={<StockAuditForm />}></Route>
          </Route>
          <Route
            path={`${process.env.PUBLIC_URL}/inventory/stock_audit/`}
            element={<Layout />}
          >
            <Route path="list" element={<TagAuditForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/inventory/tag/`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<TagForm />}></Route>
            <Route path="edit" element={<TagForm />}></Route>
            <Route
              path="assign_counter"
              element={<TaggingContainerForm />}
            ></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/billing`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<BillingForm />}></Route>
            <Route path="delete" element={<TransactionDeleteForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/billing_wholesale`}
            element={<Layout />}
          >
            {" "}
            <Route path="add" element={<BillingFormWholesale />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/billing/jewelnotdeliver`}
            element={<Layout />}
          >
            <Route path="add" element={<JewelDeliverForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/billing/bill_delete`}
            element={<Layout />}
          >
            <Route path="list" element={<BillDeleteForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/billing/receipt_delete`}
            element={<Layout />}
          >
            <Route path="list" element={<ReceiptDeleteForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/banksettlement`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<BankSettlementForm />}></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/billing/issue_receipt`}>
            <Route path="print" element={<IssueReceiptPrint />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/receipt`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<ReceiptForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/estimation`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<EstimationForm />}></Route>
            <Route path="edit" element={<EstimationForm />}></Route>
            <Route path="approval" element={<ApprovalEstimationForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/incentive/master`}
            element={<Layout />}
          >
            <Route path="list" element={<Listing />}></Route>
            <Route path="add" element={<IncentiveForm />}></Route>
            <Route path="edit" element={<IncentiveForm />}></Route>
          </Route>

          <Route
            path={`${process.env.PUBLIC_URL}/mcxrate/buy_sell`}
            element={<Layout />}
          >
            <Route path="add" element={<BuySellFormNew />}></Route>
            <Route path="old" element={<BuySellForm />}></Route>
            <Route path="list" element={<Listing />}></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/reports/`} element={<Layout />} >
            <Route path="stock_approval_pending/list" element={<Listing />}></Route>
            <Route path="estimate_report/list" element={<Listing />}></Route>
            <Route path="purchase_summary/list" element={<Listing />}></Route>
         
          </Route>

          <Route path={`${process.env.PUBLIC_URL}/reports/`} element={<Layout />} >
            <Route path="liablity_supplier_payment_report/list" element={<Listing />}></Route>
          </Route>



          <Route element={<Layout />}>
            <Route
              path="user-profile-notification"
              element={<UserProfileNotification />}
            ></Route>
            <Route
              path="user-profile-regular"
              element={<UserProfileRegular />}
            ></Route>
            <Route
              path="user-profile-activity"
              element={<UserProfileActivity />}
            ></Route>
            <Route
              path="user-profile-setting"
              element={<UserProfileSetting />}
            ></Route>
          </Route>

          <Route path={`${process.env.PUBLIC_URL}`} element={<Layout />}>
            <Route index element={<RetailDashboard />}></Route>
            <Route path="_blank" element={<Blank />}></Route>
          </Route>
        {/* </Route> */}
        <Route path="*" element={<Error404Modern />} />
      </Routes>

      <ToastStyle>
        <ToastContainer />
      </ToastStyle>
    </>
  );
};
export default Router;
