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
import { useUom, useFinYears, useEmployeeDropdown,useBranches, useStone, useQualityCode } from "../../components/filters/filterHooks";
import { calculateNetWeight } from "../../components/common/calculations/ErpCalculations";
import { getPurchaseDetails,generateLotWithPo} from '../../redux/thunks/purchase';
import { toastfunc } from "../../components/sds-toast-style/toast-style";
import { OrderNoWithFinYear } from "../../components/form-control/InputGroup";
import { BranchDropdown } from "../../components/filters/retailFilters";
import { getPagePermission } from "../../redux/thunks/coreComponent";


const LotGenerate = () => {
    const location = useLocation();
    const add = location?.state?.add;
    const id = location?.state?.id;
    const navigate = useNavigate();
    const methods = useForm();
    const { register, handleSubmit, formState: { errors }, clearErrors, setValue, reset, setError } = useForm();
    const {userInfo: { settings },} = useSelector((state) => state.authUserReducer);
    const [purchaseOrderNO, SetPurchaseOrderNO] = useState("");
    const [finYear, setFinYear] = useState("");
    const [idBranch, setIdBranch] = useState();

    const { finYears } = useFinYears();
    const { branches } = useBranches();
    const { stone } = useStone();
    const { quality_code } = useQualityCode();
    const dispatch = useDispatch();
    const { purchaseDetails } = useSelector((state) => state.purchaseReducer);
    const [selectAll, setSelectAll] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const pathName = location?.pathname;
    const { pagePermission } = useSelector((state) => state.coreCompReducer);

    useEffect(() => {
      dispatch(getPagePermission({ path: pathName }));
    }, [pathName, dispatch]);

    useEffect(() => {
      if (
        pagePermission?.view === false ||
        pagePermission === undefined ||
        pagePermission === null
      ) {
        navigate(`${process.env.PUBLIC_URL}/`);
      }
    }, [pagePermission, navigate]);


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
    const { employees } = useEmployeeDropdown();
    const reset_data = () => {
        SetPurchaseOrderNO("");
        setIdBranch("");
        setItemDetails([]);
        setIsSubmitted(false)
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


    //   useEffect(() => {
    //     if (add === undefined && id === undefined) {
    //       navigate(`${process.env.PUBLIC_URL}/inventory/lot/list`);
    //     }
    //   }, [add, id, navigate]);

    const getOrderDetails = () => {

            if (purchaseOrderNO == '' || !purchaseOrderNO || !idBranch) {
                if(!idBranch){
                    toastfunc("Select Branch !!")

                }else{
                    toastfunc("Enter Po No " + purchaseOrderNO)

                }
            } else {
                dispatch(getPurchaseDetails({"id_branch":idBranch,"po_no": purchaseOrderNO, "fin_id": finYear, }));

            }
    }

    const handleSave = () => {
        let checkedItems = itemDetails.filter(item => item.isChecked === true);
        if (checkedItems.length) {
            checkedItems = checkedItems.map(item => ({
                ...item,
                "stone_details": setStoneDetails(item.stone_details),
                "other_metal_details": setOtherMetalDetails(item.other_metal_details),
            }));
            let postData = {
                "id_supplier": purchaseDetails.id_supplier,
                "id_branch": purchaseDetails.id_branch,
                "item_details": checkedItems,
            }
            setIsSubmitted(true)
            dispatch(generateLotWithPo(postData));
            reset_data();

        }
        else {
            toastfunc("Select Item To Issue");
        }
        
    }

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
       
        setItemDetails(purchaseDetails.item_details);
        
    }, [purchaseDetails]);

    const selectAllCol = (value) => {
        itemDetails?.map((item, rowIndex) => {
            handleFormChange(rowIndex, 'isChecked', value)
        })
    
      }


    return (
        <React.Fragment>
            <Head title="Lot Add" />
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
                                    onClick={() => navigate(`${process.env.PUBLIC_URL}/inventory/lot/list`)}
                                >
                                    Cancel
                                </Button>{" "}
                                <Button
                                    color="primary"
                                    disabled={isSubmitted || !pagePermission?.add}
                                    size="md"
                                    onClick={handleSave}
                                >
                                    {isSubmitted ? "Saving" : "Save"}
                                </Button>{" "}

                            </Col>
                        </Row>

                        <Row md={12} className={"custom-grid form-control-sm"}>

                            <Row md={12}>
                                <Col md={2}> 
                                    <div className="form-group">
                                    <label className="form-label" htmlFor="selectedDesign" style={{ marginBottom: "0px" }}>
                                               Branch
                                                <IsRequired />
                                            </label>
                                        <BranchDropdown
                                            register={register}
                                            id={"idBranch"}
                                            branches={branches}
                                            selectedBranch={idBranch}
                                            isRequired={true}
                                            onBranchChange={setIdBranch}
                                            clearErrors={clearErrors}
                                            setValue={setValue}
                                            message={errors.idBranch && "Branch is Required"}
                                            tabIndex={1}
                                        ></BranchDropdown>
                                    </div> 
                                </Col>
                                <Col md={3} >
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="selectedDesign" style={{ marginBottom: "0px" }}>
                                            Po no
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
                                        />
                                    </div>
                                </Col>
                                <Col md={3} >
                                    <div className="form-group" style={{ marginTop: "20px" }}>
                                        <Button
                                        color="warning"
                                        disabled={isSubmitted}
                                        size="md"
                                        onClick={getOrderDetails}
                                    >
                                        {isSubmitted ? "Searching" : "Search"}
                                    </Button>
                                    </div>
                                </Col>
                                
                           
                                
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
                                                        <tr>
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
                                                                        }}
                                                                        handleKeyDownEvents={true}
                                                                        handleDot={true}
                                                                        minError={"Pieces Should greater than or equal to 0"}
                                                                        reqValueError={"Pieces is Required"}
                                                                        message={errors.piece && errors.piece.message}
                                                                        tabIndex={9}
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
                                                                        }}
                                                                        minError={"Gross weight should less than or equal to 0"}
                                                                        maxError={"Gross Weight greater than or equal to 0"}
                                                                        reqValueError={"Gross weight is Required"}
                                                                        message={errors["UpdateGwt_" + rowIndex] && errors["UpdateGwt_" + rowIndex].message}
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

                                                                            }
                                                                        }}
                                                                        stone_details={item.stone_details}
                                                                        ref={lessWeightRef}
                                                                        stone={stone}
                                                                        quality_code={quality_code}
                                                                        message={errors["UpdateLwt_" + rowIndex] && errors["UpdateLwt_" + rowIndex].message}

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
                                                                            if (parseFloat(item.other_metal_wt) <= parseFloat(item.avail_other_metal_wt)) {
                                                                                handleFormChange(rowIndex, 'other_metal_details', value)
                                                                            } else {
                                                                                setError("other_metal_wt" + rowIndex, {
                                                                                    type: "manual",
                                                                                    message: "InValid Other Metal Details Resetted"
                                                                                });
                                                                                toastfunc("InValid Other Metal Details Resetted !!")
                                                                                handleFormChange(rowIndex, 'other_metal_details', item.avail_other_metal_details)
                                                                                handleFormChange(rowIndex, 'other_metal_wt', item.avail_other_metal_wt)
                                                                                let net_wt = calculateNetWeight({ 'gross_weight': item.gross_wt, 'less_weight': item.less_wt, 'other_metal_weight': item.avail_other_metal_wt })
                                                                                handleFormChange(rowIndex, 'net_wt', net_wt)
                                                                            }

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

export default LotGenerate