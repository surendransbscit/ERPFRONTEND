import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Head from "../../layout/head/Head";
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Row, PreviewCard } from "../../components/Component";
import { NumberInputField, TextInputField } from "../../components/form-control/InputGroup";
import LessWeightInputField from "../../components/form-control/LessWeight";
import OtherMetalWeightInputField from "../../components/form-control/otherMetalInput";
import Content from "../../layout/content/Content";
import "../../assets/css/sales_form.css"
import IsRequired from "../../components/erp-required/erp-required";
import { Button, Label } from "reactstrap";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useUom, useFinYears, useEmployeeDropdown,useSupplierFilter,useBranches, useStone, useQualityCode } from "../../components/filters/filterHooks";
import { calculateNetWeight,calculateOtherMetalAmount,calculatePureWeight,calculateStoneAmount,calculatePurchaseCost } from "../../components/common/calculations/ErpCalculations";
import { getPurchaseEntryItemDetails, createPurchaseIssueRecipt, getPurchaseIssueReciptItemDetails,updatePurchaseIssueRecipt } from '../../redux/thunks/purchase';
import { resetPurchaseItemDetails,resetPurchaseIssueReceiptDetails } from '../../redux/reducer/purchaseReducer';

import { toastfunc, toastsuccess } from "../../components/sds-toast-style/toast-style";
import { OrderNoWithFinYear } from "../../components/form-control/InputGroup";
import { ActiveEmployeeDropdown,SupplierDropdown,BranchDropdown } from "../../components/filters/retailFilters";
import { useHotkeys } from "react-hotkeys-hook";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { toast } from "react-toastify";


const QcAndHmOIssueReceipt = () => {
    const location = useLocation();
    const add = location?.state?.add;
    const id = location?.state?.id;
    const navigate = useNavigate();
    const methods = useForm();
    const { register, formState: { errors }, clearErrors, setValue, setError } = useForm();
    const {
        userInfo: { settings },
      } = useSelector((state) => state.authUserReducer);
    const [purchaseOrderNO, SetPurchaseOrderNO] = useState("");
    const [issueNo, setIssueNo] = useState("");
    const [finYear, setFinYear] = useState("");
    const [finYearName, setFinYearName] = useState("");
    const [process, setProcess] = useState("1");
    const [processType, setProcessType] = useState("1");
    const [selectedEmployee, setSelectedEmployee] = useState();
    const [selectedSupplier, setSelectedSupplier] = useState();
    const [idBranch, setIdBranch] = useState();
    const { stone } = useStone();
    const { quality_code } = useQualityCode();
    const [selectAll, setSelectAll] = useState(false);

    const { finYears } = useFinYears();
    const { supplier } = useSupplierFilter();

    const dispatch = useDispatch();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { purchaseItemDetails } = useSelector((state) => state.purchaseReducer);
    const { purchaseIssueReceiptDetails } = useSelector((state) => state.purchaseIssueReceiptReducer);
    const { branches } = useBranches();


    const lessWeightRef = useRef();
    const otherMetalWeightRef = useRef();
    const [itemDetails, setItemDetails] = useState([]);
    const { uom } = useUom();
    let UomOptions = [];
    if (uom.length > 0) {
        UomOptions = uom.map((val) => ({
            value: val.uom_id,
            label: val.uom_name,
            isDefault: val.is_default
        }));
    }
    const processRef = useRef(null);
    useEffect(() => {
        if (processRef.current) {
          processRef.current.focus();
        }
      }, []); 

    const { employees } = useEmployeeDropdown();
    const reset_data = () => {
        SetPurchaseOrderNO("");
        setSelectedEmployee("");
        setProcess("1");
        setProcessType("1");
        setItemDetails([]);
        setIssueNo("");
        setIdBranch("");
    }
    const setStoneDetails = (data) => {
        let stone_details = [];
        if (data.length > 0) {
            console.log(data);
            stone_details = data.map(item => ({
                "id_stone": item.id_stone,
                "uom_id": item.uom_id,
                "stone_pcs": parseFloat(item.piece).toFixed(0),
                "stone_wt": item.weight,
                "stone_type": item.stone_type,
                "pur_stn_cal_type": item.stn_calc_type,
                "pur_st_rate": parseFloat(item.stone_rate).toFixed(2),
                "pur_stn_cost": parseFloat(item.stone_amount).toFixed(2),
                "show_in_lwt": item.show_in_lwt,
                "purchase_stn_detail": item.id_purchase_stn_detail,
                "id_quality_code": item.id_quality_code
            }));
        }
        return stone_details;
    };

    const setOtherMetalDetails = (data) => {
        let other_metal_details = [];
        if (data.length > 0) {
          other_metal_details = data.map((item) => ({
            piece: item.piece,
            weight: item.weight,
            wastage_percentage: item.wastagePercentage,
            wastage_weight: item.wastageWeight,
            mc_type: item.mcType,
            mc_value: item.mcValue,
            other_metal_cost: item.amount,
            id_category: item.selectedCategory,
            id_purity: item.selectedPurity,
            rate_per_gram:item.ratePerGram,
            purchase_other_metal:item.id_purchase_other_metal,
          }));
        }
        return other_metal_details;
      };

      const calculateStoneDetails = (data) => {
        let stone_amount = 0;
        let stone_details = []
        if (data.length > 0) {
            console.log(data);
            data.forEach(item => {
                const stoneCost = calculateStoneAmount({
                    "stone_weight": item.weight,
                    "stone_piece": item.piece,
                    "stone_rate": item.stone_rate,
                    "stone_calc_type": item.stn_calc_type,
                  });
                  stone_details.push({...item,"pur_stn_cost":stoneCost})
                 // item['pur_stn_cost'] = stoneCost
                  stone_amount +=parseFloat(stoneCost);
            });
        }
        return {stone_amount,stone_details};
    };

    const calculateOtherMetalDetails = (data) => {
        let otherMetalAmount = 0;
        let other_metal_details = []
        if (data.length > 0) {
           data.forEach(item => {
            console.log(item)
            let wastagePercentage = item.wastagePercentage
            let wast_wt =0
            if(wastagePercentage>0)
            {
                wast_wt = parseFloat((parseFloat(item.weight)*parseFloat(wastagePercentage))/100).toFixed(3);
                
            }

            let otherMetalItemCost = calculateOtherMetalAmount({
              "weight": item.weight,
              "piece": item.piece,
              "rate": item.ratePerGram,
              "wastage_weight":wast_wt,
              "rate_calc_type": item.calc_type,
              "mcType":item.mcType,
              "mcValue":item.mcValue,
            });
            otherMetalAmount+=parseFloat(otherMetalItemCost)
            other_metal_details.push({...item,"wastageWeight" :wast_wt,"amount":otherMetalItemCost})
            // item['wastageWeight'] = wast_wt
            // item['amount'] = otherMetalItemCost

          });
        }
        return {otherMetalAmount,other_metal_details};
      };

      const updatePurchaseCostAndPureWt = (index,item,is_update_or_return=1) => {  // 1 -> Update 2-> Return
        const pureWeight = calculatePureWeight({
            netWeight: item.net_wt,
            purchaseTouch: item.purchase_touch,
            pureCalcType: item.pure_wt_cal_type,
            purchaseWastage:item.purchase_va
          });
     //   handleFormChange(index, 'pure_wt', pureWeight);

        const {stone_amount,stone_details }= calculateStoneDetails(item.stone_details);

        const {otherMetalAmount,other_metal_details } = calculateOtherMetalDetails(item.other_metal_details);

        const itemCostDetails = calculatePurchaseCost({
            pureWeight: pureWeight,
            purchaseMcType: item.purchase_mc_type,
            purchaseMc: item.purchase_mc,
            purchaseRate:item.purchase_rate,
            netWeight: item.net_wt,
            piece:item.pieces,
            rateCalcType:item.purchase_rate_type,
            taxType: item.tax_type,
            taxPercentage: item.tax_percentage,
            otherMetalAmount: otherMetalAmount,
            stoneAmount: stone_amount,
          });
          let updatedFormData = {}
          updatedFormData.pure_wt = pureWeight
          updatedFormData.purchase_cost = itemCostDetails.purchaseCost;
          updatedFormData.tax_amount = itemCostDetails.taxAmount;
          updatedFormData.cgst = itemCostDetails.cgst;
          updatedFormData.sgst = itemCostDetails.sgst;
          updatedFormData.igst = itemCostDetails.igst;

          if(is_update_or_return===1){
            setItemDetails((prevValues) => {
                const updatedValues = [...prevValues];
                const updatedObject = { ...updatedValues[index],...updatedFormData };
                updatedValues[index] = updatedObject;
                return updatedValues;
            });
          }else{
            item.stone_details = stone_details
            item.other_metal_details = other_metal_details
            item.pure_wt = pureWeight
            item.purchase_cost = itemCostDetails.purchaseCost;
            item.tax_amount = itemCostDetails.taxAmount;
            item.cgst = itemCostDetails.cgst;
            item.sgst = itemCostDetails.sgst;
            item.igst = itemCostDetails.igst;

          }


      };

    const setUpdateStoneDetails = (data) => {
        let stone_details = [];
        if (data.length > 0) {
            console.log(data);
            stone_details = data.map(item => ({
                "recd_pcs": parseFloat(item.piece).toFixed(0),
                "recd_wt": item.weight,
                "id_issue_stn_detail": item.id_issue_stn_detail,
            }));
        }
        return stone_details;
    };

    const setUpdateOtherMetalDetails = (data) => {
        let other_metal_details = [];
        if (data.length > 0) {
            console.log(data);
            other_metal_details = data.map(item => ({
                "recd_pcs": parseFloat(item.piece).toFixed(0),
                "recd_wt": item.weight,
                "id_issue_other_metal": item.id_issue_other_metal,
            }));
        }
        return other_metal_details;
    };

      useEffect(() => {
        if (add === undefined && id === undefined) {
          navigate(`/purchase/qu_issue_receipt/list`);
        }
      }, [add, id, navigate]);

    const getOrderDetails = () => {
        if (processType == "1") {
            if (purchaseOrderNO == '' || !purchaseOrderNO || !idBranch ) {
                if(!purchaseOrderNO ){
                    toastfunc("Enter Po No " + purchaseOrderNO)
                }else{
                    toastfunc("Select Branch !!")
                }
            } else {
                dispatch(getPurchaseEntryItemDetails({ "issue_type": process,"id_branch": idBranch, "po_no": purchaseOrderNO, "fin_id": finYear, }));

            }
        } else {
            if (issueNo == '' || !issueNo) {
                toastfunc("Enter Issue No " + issueNo)
            } else {
                dispatch(getPurchaseIssueReciptItemDetails({ "issueNo": issueNo, "issue_type": process, }));

            }
        }


    }

    const handleSave = async () => {
        if (processType === "1") {
            let checkedItems = itemDetails.filter(item => item.isChecked === true);

            if(process==='1' && !selectedEmployee){
                toastfunc("Select Employee !!");

            }else if(process==='2' && !selectedSupplier){
                toastfunc("Select Supplier  !!");
            }
            else if(!idBranch){
                toastfunc("Select Branch  !!");
            }
            else if(checkedItems.length===0){
                toastfunc("Please Select the Item!!");
            }
            else
            {
                checkedItems = checkedItems.map(item => ({
                    ...item,
                    "stone_details": setStoneDetails(item.stone_details),
                    "other_metal_details": setOtherMetalDetails(item.other_metal_details),
                }));
                let postData = {
                    "issue_type": process,
                    "issue_to_emp": selectedEmployee,
                    "issue_to_supplier": selectedSupplier,
                    "id_branch": idBranch,
                    "item_details": checkedItems,
                }
                submitForm(postData);
                reset_data();
            }
        } else {

           let checkedItems = itemDetails.map(item => ({
                ...item,
                "stone_details": setUpdateStoneDetails(item.stone_details),
                "other_metal_details": setUpdateOtherMetalDetails(item.other_metal_details),

            }));
            let postData = {
                "issue_type": process,
                "issue_to_emp": selectedEmployee,
                "item_details": checkedItems,
                "id_branch": idBranch,
                "id":purchaseIssueReceiptDetails.id_issue_receipt,
            }
            try {
                let response = "";
                response = await dispatch(updatePurchaseIssueRecipt(postData)).unwrap();
                dispatch(resetPurchaseIssueReceiptDetails());
                navigate(`${process.env.PUBLIC_URL}/purchase/qu_issue_receipt/list`);
            } catch (error) {
              setIsSubmitted(false);
            }
            dispatch(updatePurchaseIssueRecipt(postData));
            reset_data();
        }

    }
    
    const submitForm = async (postData) => {
        try {
          setIsSubmitted(true);
      
          let response;
      
          if (id && id !== "" && id !== undefined) {
            response = await dispatch(updatePurchaseIssueRecipt(postData)).unwrap();
            toastsuccess(response.message || "Record updated successfully");
      
          } else {
            response = await dispatch(createPurchaseIssueRecipt(postData)).unwrap();
            toastsuccess(response.message || "Record created successfully");
          }
          const printData = {
            settings: settings,
            itemDetails: response.print_data,            
          };
          console.log(response.print_data);
          secureLocalStorage.setItem("pageState", JSON.stringify(printData));
          window.open(`/purchase/qu_issue_receipt/print`, "_blank");
          dispatch(resetPurchaseItemDetails());
          navigate(`/purchase/qu_issue_receipt/list`);
      
        } catch (error) {
          console.error("Submission error:", error);
          toast.error(error.message || "An error occurred during submission");
          setIsSubmitted(false);
        }
      };

      const downloadPDF = async (printPageURL, id) => {
        try {
          const { data } = await axios.get(
            `${process.env.REACT_APP_API_ENDPOINT}/${printPageURL}/${id}/`,
            {
              headers: {
                Authorization: `Token ${secureLocalStorage.getItem("pref")?.token}`,
              },
            }
          );
      
          if (data?.pdf_url) {
            const response = await axios.get(data.pdf_url, {
              responseType: "blob",
            });
      
            const pdfBlob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(pdfBlob);
      
            const tempLink = document.createElement("a");
            tempLink.href = url;
            tempLink.target = "_blank";
            tempLink.setAttribute("download", "invoice.pdf");
      
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(url);
          }
        } catch (error) {
          console.error("Error downloading PDF:", error);
          toast.error("Failed to download PDF");
        }
      };

    const handleFormChange = (index, field, value) => {
        setItemDetails((prevValues) => {
            const updatedValues = [...prevValues];
            const updatedObject = { ...updatedValues[index] };
            updatedObject[field] = value;
            updatedValues[index] = updatedObject;

            return updatedValues;
        });

    };
    useEffect(() => {
        if (processType == '1') {
            let itemDet = purchaseItemDetails.map(item => ({ ...item }));
            itemDet.forEach((item, index) => {
                updatePurchaseCostAndPureWt(index,item,2)
              });
            setItemDetails(itemDet);
            console.log(itemDet,'Itesa zm,x');
        }
    }, [purchaseItemDetails]);

    useEffect(() => {
        if (processType == '2') {
            let itemDet = purchaseIssueReceiptDetails.item_details.map(item => ({ ...item }));
            itemDet.forEach((item, index) => {
                updatePurchaseCostAndPureWt(index,item,2)
              });
            setItemDetails(itemDet);
            console.log(itemDet,'Itesa zm,x');
        }
    }, [purchaseIssueReceiptDetails]);

    const selectAllCol = (value) => {
        itemDetails?.map((item, rowIndex) => {
            handleFormChange(rowIndex, 'isChecked', value)
        })
    
      }

      useHotkeys("ctrl+s", (event) => {
        event.preventDefault();
        handleSave();
      },{
        enableOnFormTags: true, 
        preventDefault: true,
      });
    
      // Reload Shortcut (Ctrl+R)
      useHotkeys("ctrl+r", (event) => {
        event.preventDefault();
        window.location.reload();
      });

    return (
        <React.Fragment>
            <Head title="QC Issue and Receipt" />
            <Content>
                <PreviewCard className="h-100">

                    <FormProvider {...methods}>
                        <Row lg={12} className={"form-control-sm"} style={{ marginTop: '10px' }}>
                            <Col md={9}>
                                <ModifiedBreadcrumb></ModifiedBreadcrumb>
                            </Col>

                            <Col md={3} className="text-right" >
                            <Button
                                disabled={isSubmitted}
                                color="danger"
                                size="md"
                                onClick={() => navigate(`/purchase/qu_issue_receipt/list`)}
                                >
                                Cancel
                                </Button>{" "}
                                <Button
                                    color="primary"
                                    disabled={isSubmitted}
                                    size="md"
                                    onClick={handleSave}
                                >
                                    {isSubmitted ? "Saving" : "Save[ctrl+s]"}
                                </Button>{" "}
                               
                            </Col>
                        </Row>

                        <Row md={12} className={"custom-grid form-control-sm"}>

                            <Row md={12}>
                                <Col md={2}>
                                    <Label>Process</Label>
                                    <div className="form-group">
                                        <ul className="custom-control-group g-3 align-center flex-wrap">
                                            <li>
                                                <div className="custom-control custom-control-sm custom-radio">
                                                    <input
                                                        {...register("process", { required: true })}
                                                        id="qc"
                                                        type="radio"
                                                        name={"process"}
                                                        value={"1"}
                                                        className="custom-control-input"
                                                        checked={process == "1"}
                                                        onChange={(e) => {
                                                            setProcess(e.target.value);
                                                            setItemDetails([])

                                                        }}
                                                        tabIndex={1}
                                                    />
                                                    <label className="custom-control-label" htmlFor="qc">
                                                        QC
                                                    </label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom-control custom-control-sm  custom-radio">
                                                    <input
                                                        {...register("process", { required: true })}
                                                        id="halmarking"
                                                        type="radio"
                                                        value={"2"}
                                                        name={"process"}
                                                        className="custom-control-input "
                                                        checked={process == "2"}
                                                        onChange={(e) => {
                                                            setProcess(e.target.value);
                                                            setItemDetails([])

                                                        }}
                                                        tabIndex={2}
                                                    />
                                                    <label className="custom-control-label" htmlFor="halmarking">
                                                        Halmarking
                                                    </label>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <Label>Type</Label>
                                    <div className="form-group">
                                        <ul className="custom-control-group g-3 align-center flex-wrap">
                                            <li>
                                                <div className="custom-control custom-control-sm custom-radio">
                                                    <input
                                                        {...register("processType", { required: true })}
                                                        id="issue"
                                                        type="radio"
                                                        name={"processType"}
                                                        value={"1"}
                                                        className="custom-control-input"
                                                        checked={processType == "1"}
                                                        onChange={(e) => {
                                                            setItemDetails([])
                                                            setProcessType(e.target.value);
                                                        }}
                                                        tabIndex={3}
                                                    />
                                                    <label className="custom-control-label" htmlFor="issue">
                                                        Issue
                                                    </label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom-control custom-control-sm  custom-radio">
                                                    <input
                                                        {...register("processType", { required: true })}
                                                        id="receipt"
                                                        type="radio"
                                                        value={"2"}
                                                        name={"processType"}
                                                        className="custom-control-input "
                                                        checked={processType == "2"}
                                                        onChange={(e) => {
                                                            setItemDetails([])

                                                            setProcessType(e.target.value);
                                                        }}
                                                        tabIndex={4}
                                                    />
                                                    <label className="custom-control-label" htmlFor="receipt">
                                                        Receipt
                                                    </label>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                {processType === "1" && (
                                <Col md={2}> 
                                    <div className="form-group">
                                    <label className="form-label" htmlFor="selectedDesign" style={{ marginBottom: "0px" }}>
                                               Branch
                                                <IsRequired />
                                            </label>
                                        <BranchDropdown
                                            register={register}
                                            ref={processRef}
                                            id={"idBranch"}
                                            branches={branches}
                                            selectedBranch={idBranch}
                                            isRequired={true}
                                            onBranchChange={setIdBranch}
                                            clearErrors={clearErrors}
                                            setValue={setValue}
                                            message={errors.idBranch && "Branch is Required"}
                                            tabIndex={5}
                                        ></BranchDropdown>
                                    </div> 
                                </Col>
                                 )}
                                {processType === "1" && (
                                    <Col md={2} >
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="selectedDesign" style={{ marginBottom: "0px" }}>
                                                Po No
                                                <IsRequired />
                                            </label>
                                            <OrderNoWithFinYear
                                                register={register}
                                                placeholder="Po No"
                                                id={"purchaseOrderNO"}
                                                value={purchaseOrderNO}
                                                isRequired={true}
                                                readOnly={false}
                                                type={"text"}
                                                setValue={setValue}
                                                SetValue={(value) => {
                                                    SetPurchaseOrderNO(value);
                                                }}
                                                optionId={"finYear"}
                                                name={"finYear"}
                                                options={finYears}
                                                onDropDownChange={(value) => {
                                                    setFinYear(value);
                                                }}
                                                selectedOption={finYear}
                                                message={errors.purchaseOrderNO && errors.purchaseOrderNO.message}
                                                tabIndex={6}
                                            />
                                        </div>
                                    </Col>
                                )}

                                {processType === "2" && (
                                    <Col md={3} >
                                        <div className="form-control-wrap">
                                            <label className="form-label" htmlFor="selectedDesign" style={{ marginBottom: "0px" }}>
                                                Issue no
                                                <IsRequired />
                                            </label>
                                            <TextInputField
                                                register={register}
                                                isRequired={true}
                                                id={"issueNo"}
                                                placeholder="Issue No"
                                                value={issueNo}
                                                SetValue={(value) => {
                                                    setIssueNo(value);
                                                }}
                                            />
                                        </div>
                                    </Col>
                                )}
                                <Col md={2} >
                                <br></br>
                                    <Button
                                        color="warning"
                                        disabled={isSubmitted}
                                        size="md"
                                        onClick={getOrderDetails}
                                        tabIndex={7}
                                    >
                                        {isSubmitted ? "Searching" : "Search"}
                                    </Button>
                                </Col>
                                 {(process === "1" && processType === "1" )&& (
                                <Col md={2}>
                                    <label className="form-label" htmlFor="selectedDesign" style={{ marginBottom: "0px" }}>
                                        Employee
                                        <IsRequired />
                                    </label>
                                    <ActiveEmployeeDropdown
                                        register={register}
                                        id={"employee"}
                                        selectedEmployee={selectedEmployee}
                                        onEmployeeChange={setSelectedEmployee}
                                        isRequired={true}
                                        options={employees}
                                        clearErrors={clearErrors}
                                        setValue={setValue}
                                        message={errors.employee && "Employee is Required"}
                                        tabIndex={7}
                                    />
                                </Col>
                                 )}
                                  {(process === "2" && processType === "1" ) && (
                                <Col md={2}>
                                    <label className="form-label" htmlFor="selectedDesign" style={{ marginBottom: "0px" }}>
                                        Supplier
                                        <IsRequired />
                                    </label>
                                    <SupplierDropdown
                                                register={register}
                                                id={"idSupplier"}
                                                supplier={supplier}
                                                selectedSupplier={selectedSupplier}
                                                onSupplierChange={(value) => {
                                                    setSelectedSupplier(value);
                                                }}
                                                isRequired={false}
                                                clearErrors={clearErrors}
                                                setValue={setValue}
                                                message={errors.idSupplier && "Supplier is Required"}
                                                tabIndex={7}
                                            />
                                </Col>
                                 )}
                            </Row>
                            <Row className="row g-1" md={12}>
                                <div></div>
                                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>


                                <table className="table table-bordered">
                                <thead>
                                <tr
                                    style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                    }}
                                >
                                                <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                                                    <input
                                                        type="checkbox"
                                                        onChange={(event) => {
                                                             selectAllCol(event.target.checked);
                                                             setSelectAll(event.target.checked);
                                                        }}
                                                        checked={selectAll} />
                                                </th>
                                                <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Product</th>
                                                <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Design</th>
                                                {((settings?.is_sub_design_req == 1) && (<th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>S.Design</th>))}
                                                <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Piece</th>
                                                <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Gwt</th>
                                                <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Lwt</th>
                                                <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>OtherWt</th>
                                                <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Nwt</th>
                                                <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Stn Wt</th>
                                                <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Dia Wt</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {itemDetails?.length > 0 ? (
                                                <>
                                                    {itemDetails.map((item, rowIndex) => (
                                                        <tr key ={rowIndex}>
                                                            <td>
                                                                <input type="checkbox"
                                                                    onChange={(event) => {
                                                                        handleFormChange(rowIndex, 'isChecked', event.target.checked)
                                                                    }}
                                                                    checked={item.isChecked} />
                                                            </td>
                                                            <td>{item.product_name}</td>
                                                            <td>{item.design_name}</td>
                                                            {((settings?.is_sub_design_req == 1) && ( <td>{item.sub_design_name}</td>))}
                                                            <td>
                                                                <div className="">
                                                                    <NumberInputField
                                                                        register={register}
                                                                        placeholder="Piece"
                                                                        id={"piece_" + rowIndex}
                                                                        value={item.pieces}
                                                                        isRequired={true}
                                                                        min={0}
                                                                        max={(item.avail_piece !== '' ? item.avail_piece : '')}
                                                                        setValue={setValue}
                                                                        SetValue={(value) => {
                                                                            handleFormChange(rowIndex, 'pieces', value);
                                                                            clearErrors("piece");
                                                                            const pureWeight = calculatePureWeight({
                                                                                netWeight: item.net_wt,
                                                                                purchaseTouch: item.purchase_touch,
                                                                                pureCalcType: item.pure_wt_cal_type,
                                                                                purchaseWastage:item.purchase_va
                                                                              });
                                                                            handleFormChange(rowIndex, 'pure_wt', pureWeight);
                                                                            
                                                                        }}
                                                                        handleKeyDownEvents={true}
                                                                        handleDot={true}
                                                                        minError={"Pieces Should greater than or equal to 0"}
                                                                        reqValueError={"Pieces is Required"}
                                                                        message={errors.piece && errors.piece.message}
                                                                        tabIndex={8}
                                                                    ></NumberInputField>
                                                                    {item.avail_piece !== '' ? <span>Avail Piece : {item.avail_piece}</span> : ""}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="">
                                                                    <NumberInputField
                                                                        register={register}
                                                                        placeholder="Gross weight"
                                                                        id={"UpdateGwt_" + rowIndex}
                                                                        value={item.gross_wt}
                                                                        isRequired={true}
                                                                        min={0}
                                                                        max={(item.avail_gross_wt)}
                                                                        type={"number"}
                                                                        setValue={setValue}
                                                                        handleKeyDownEvents={true}
                                                                        handleDecimalDigits={true}
                                                                        decimalValues={3}
                                                                        SetValue={(value) => {

                                                                            let net_wt = calculateNetWeight({ 'gross_weight': value, 'less_weight': item.less_wt, 'other_metal_weight': item.other_metal_wt })

                                                                            if (net_wt > 0) {
                                                                                handleFormChange(rowIndex, 'gross_wt', value);
                                                                                handleFormChange(rowIndex, 'net_wt', net_wt)
                                                                                clearErrors("UpdateGwt_" + rowIndex);
                                                                            } else {

                                                                                setError("UpdateGwt_" + rowIndex, {
                                                                                    type: "manual",
                                                                                    message: "InValid Gross weight"
                                                                                });

                                                                                handleFormChange(rowIndex, 'gross_wt', value);

                                                                            }
                                                                            updatePurchaseCostAndPureWt(rowIndex,{...item,"net_wt":net_wt})


                                                                        }}
                                                                        minError={"Gross weight should less than or equal to 0"}
                                                                        maxError={"Gross Weight greater than or equal to 0"}
                                                                        reqValueError={"Gross weight is Required"}
                                                                        message={errors["UpdateGwt_" + rowIndex] && errors["UpdateGwt_" + rowIndex].message}
                                                                        tabIndex={9}
                                                                    />
                                                                    {item.avail_gross_wt !== '' ? <span>Avail Gwt : {item.avail_gross_wt}</span> : ""}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="" style={{ width: "100px" }}>

                                                                    <LessWeightInputField
                                                                        register={register}
                                                                        placeholder="Less Weight"
                                                                        id={"UpdateLwt_" + rowIndex}
                                                                        value={item.less_wt}
                                                                        isRequired={false}
                                                                        min={0}
                                                                        uom={uom}
                                                                        gross_weight={item.gross_wt}
                                                                        less_weight={item.less_wt}
                                                                        clearErrors={clearErrors}
                                                                        SetValue={(value) => {
                                                                            handleFormChange(rowIndex, 'less_wt', value)
                                                                            let net_wt = calculateNetWeight({ 'gross_weight': item.gross_wt, 'less_weight': value, 'other_metal_weight': item.other_metal_wt })
                                                                            handleFormChange(rowIndex, 'net_wt', net_wt)
                                                                        }}
                                                                        SetStnWeight={(value) => handleFormChange(rowIndex, 'stone_wt', value)}
                                                                        SetDiaWeight={(value) => handleFormChange(rowIndex, 'dia_wt', value)}
                                                                        SetStoneDetails={(value) => {
                                                                            if (parseFloat(item.avail_less_wt) >= parseFloat(item.less_wt) && parseFloat(item.dia_wt) <= parseFloat(item.avail_dia_wt) && parseFloat(item.stone_wt) <= parseFloat(item.avail_stone_wt)) {
                                                                                handleFormChange(rowIndex, 'stone_details', value)
                                                                                updatePurchaseCostAndPureWt(rowIndex,{...item,"stone_details":value})

                                                                            } else {
                                                                                setError("UpdateLwt_" + rowIndex, {
                                                                                    type: "manual",
                                                                                    message: "InValid StoneDetail Resetted"
                                                                                });
                                                                                toastfunc("InValid StoneDetail Resetted !!")
                                                                                handleFormChange(rowIndex, 'less_wt', item.avail_less_wt)
                                                                                let net_wt = calculateNetWeight({ 'gross_weight': item.gross_wt, 'less_weight': item.avail_less_wt, 'other_metal_weight': item.other_metal_wt })
                                                                                handleFormChange(rowIndex, 'net_wt', net_wt)
                                                                                handleFormChange(rowIndex, 'stone_details', item.avail_stone_details)
                                                                                handleFormChange(rowIndex, 'dia_wt', item.avail_dia_wt)
                                                                                handleFormChange(rowIndex, 'stone_wt', item.avail_stone_wt)
                                                                                updatePurchaseCostAndPureWt(rowIndex,{...item,"net_wt":net_wt,"stone_details":item.avail_stone_details})


                                                                            }
                                                                        }}
                                                                        stone_details={item.stone_details}
                                                                        ref={lessWeightRef}
                                                                        stone={stone}
                                                                        quality_code={quality_code}
                                                                        message={errors["UpdateLwt_" + rowIndex] && errors["UpdateLwt_" + rowIndex].message}
                                                                        tabIndex={10}

                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="" style={{ width: "100px" }}>
                                                                    <OtherMetalWeightInputField
                                                                        register={register}
                                                                        placeholder="Other Metal Weight"
                                                                        id={"other_metal_wt" + rowIndex}
                                                                        value={item.other_metal_wt}
                                                                        isRequired={false}
                                                                        min={0}
                                                                        uom={uom}
                                                                        setValue={setValue}
                                                                        clearErrors={clearErrors}
                                                                        gross_weight={item.gross_wt}
                                                                        less_weight={item.less_wt}
                                                                        SetValue={(value) => {
                                                                            console.log("Other Metal Details:" + value)
                                                                            handleFormChange(rowIndex, 'other_metal_wt', value)
                                                                            let net_wt = calculateNetWeight({ 'gross_weight': item.gross_wt, 'less_weight': item.less_wt, 'other_metal_weight': value })
                                                                            handleFormChange(rowIndex, 'net_wt', net_wt)
                                                                            console.log("Other Metal Details:" + net_wt)
                                                                        }}
                                                                        SetOtherMetalDetails={(value) => {
                                                                            let net_wt = 0
                                                                            if (parseFloat(item.other_metal_wt) <= parseFloat(item.avail_other_metal_wt)) {
                                                                                handleFormChange(rowIndex, 'other_metal_details', value)
                                                                                updatePurchaseCostAndPureWt(rowIndex,{...item,"net_wt":net_wt,"other_metal_details":value})

                                                                            } else {
                                                                                setError("other_metal_wt" + rowIndex, {
                                                                                    type: "manual",
                                                                                    message: "InValid Other Metal Details Resetted"
                                                                                });
                                                                                toastfunc("InValid Other Metal Details Resetted !!")
                                                                                handleFormChange(rowIndex, 'other_metal_details', item.avail_other_metal_details)
                                                                                handleFormChange(rowIndex, 'other_metal_wt', item.avail_other_metal_wt)
                                                                                 net_wt = calculateNetWeight({ 'gross_weight': item.gross_wt, 'less_weight': item.less_wt, 'other_metal_weight': item.avail_other_metal_wt })
                                                                                handleFormChange(rowIndex, 'net_wt', net_wt)
                                                                                updatePurchaseCostAndPureWt(rowIndex,{...item,"net_wt":net_wt,"other_metal_details": item.avail_other_metal_details})

                                                                            }
                                                                            console.log(item)


                                                                        }}
                                                                        otherMetalDetails={item.other_metal_details}
                                                                        ref={otherMetalWeightRef}
                                                                        readOnly={false}
                                                                        isDisabled={false}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="">
                                                                    <input
                                                                        className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                                                        type="number"
                                                                        placeholder={"Net Wt"}
                                                                        style={{ width: "100px" }}
                                                                        value={item.net_wt}
                                                                        readOnly={true}
                                                                        tabIndex={12}

                                                                    >
                                                                    </input>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="">
                                                                    <input
                                                                        className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                                                        type="number"
                                                                        placeholder={"Stone Wt"}
                                                                        style={{ width: "100px" }}
                                                                        value={item.stone_wt}
                                                                        readOnly={true}
                                                                        tabIndex={13}

                                                                    >
                                                                    </input>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="">
                                                                    <input
                                                                        className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                                                        type="number"
                                                                        placeholder={"Dia Wt"}
                                                                        style={{ width: "100px" }}
                                                                        value={item.dia_wt}
                                                                        readOnly={true}
                                                                        tabIndex={14}
                                                                    >
                                                                    </input>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                    ))}
                                                </>) : (
                                                <tr>
                                                    
                                                    <td colSpan="12" className="text-center">
                                                        <h4 style={{ marginTop: "10px", marginBottom: "10px" }}>No record found</h4>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>


                                </div>
                            </Row>
                        </Row>


                    </FormProvider>
                </PreviewCard>
            </Content>

        </React.Fragment>
    )
}

export default QcAndHmOIssueReceipt