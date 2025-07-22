import React, { useEffect, useState, useRef } from "react";
import Head from "../../layout/head/Head";
import { toastfunc } from "../../components/sds-toast-style/toast-style";
import { useForm, FormProvider } from 'react-hook-form';
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Row, PreviewCard, SaveButton, Icon } from "../../components/Component";
import { TextInputField, NumberInputField, InputFieldWithDropdown, InputGroupField } from "../../components/form-control/InputGroup";
import Content from "../../layout/content/Content";
import "../../assets/css/sales_form.css"
import { BranchDropdown, DesignDropdown, ProductDropdown, SubDesignDropdown, SectionDropdown, SupplierDropdown } from "../../components/filters/retailFilters";
import { useActiveLot, useProducts, useDesigns, useSubDesigns, useUom, useBranches, useActiveStockIssueType, useProductSections, useEmployeeDropdown, useSupplierFilter } from "../../components/filters/filterHooks";
import { Button } from "reactstrap";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useDispatch } from "react-redux";
import { createMetalIssue } from '../../redux/thunks/purchase';
import IsRequired from "../../components/erp-required/erp-required";
import { calculatePureWeight } from "../../components/common/calculations/ErpCalculations";
import { getNonTagStock } from "../../redux/thunks/inventory";
import { Typeahead } from "react-bootstrap-typeahead";
import { searchCustomer } from "../../redux/thunks/customer";



const MetalIssueForm = () => {
    const location = useLocation();
    const add = location?.state?.add;
    const id = location?.state?.id;
    const { register, handleSubmit, formState: { errors }, clearErrors, setValue, reset, setError } = useForm();
    const navigate = useNavigate();
    const { userInfo: { settings } } = useSelector((state) => state.authUserReducer);
    const { nonTagStock } = useSelector((state) => state.lotReducer);
    const methods = useForm();
    const { products } = useProducts();
    const { branches } = useBranches();
    const { supplier } = useSupplierFilter();
    const { uom } = useUom();

    const dispatch = useDispatch();
    const filterValuesDefalut = {
        "selectedProduct": '',
        "selectSupplier": '',
        "selectBranch": '',
        "remarks": '',
    }
    const [filterValues, setFilterValues] = useState(filterValuesDefalut);
    const [prevData, setPrevData] = useState([]);
    const [maxGrossWeight, setMaxGrossWeight] = useState('');
    const [maxPiece, setMaxPiece] = useState('');
    const [isStoneRestrict, setIsStoneRestrict] = useState(false);
    const [isOtherMetalRestrict, setIsOtherMetalRestrict] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const initialAddFormData = {
        id: 1,
        selectedProduct: "",
        selectedDesign: "",
        selectedSubDesign: "",
        piece: 1,
        grossWeight: 0.000,
        lessWeight: 0.000,
        netWeight: 0.000,
        diaWeight: 0.000,
        pureWt: 0.000,
        touch: 0,
        productName: '',
        designName: '',
        subDesignName: '',
        stoneDetails: [],
    }
    const [addFormData, setAddFormData] = useState(initialAddFormData);

    let UomOptions = [];
    if (uom.length > 0) {
        UomOptions = uom.map((val) => ({
            value: val.uom_id,
            label: val.uom_name,
            isDefault: val.is_default,
            divided_by_value: val.divided_by_value,
        }));
    }



    const onClickSave = () => {
        console.log(filterValues);
        if (filterValues?.selectBranch === "" || filterValues?.selectBranch === null) {
            toastfunc("Please Select From Branch");
        }
        else if (prevData.length === 0) {
            toastfunc("Please Add the Stock Details");
        }
        else if (filterValues?.supplier === "" || filterValues?.supplier === null) {
            toastfunc("Select Stock Issue Type !!");
        }
        else {
            let stock_details = stock_update_details(prevData)
            if (stock_details.length) {
                try {
                    dispatch(createMetalIssue({
                        'stock_details': stock_details,
                        'id_supplier': filterValues?.selectSupplier,
                        'id_branch': filterValues?.selectBranch,
                        'type': 2,
                    }))
                    reset_form();
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }


    const handleFilterChange = (field, value) => {
        setFilterValues((prevValues) => ({ ...prevValues, [field]: value }));
    };

    const stock_update_details = (data) => {
        let updateData = [];
        data.map((item, rowIndex) => {
            updateData.push({
                transfer_from: filterValues?.selectBranch,
                transfer_to: null,
                id_product: item?.selectedProduct,
                pieces: item?.piece,
                issue_weight: item?.grossWeight,
                gross_wt: item?.grossWeight,
                net_wt: item?.grossWeight,
                pure_wt: item?.pureWt,
                stone_wt: 0,
                dia_wt: 0,
                less_wt: 0,
                touch: item?.touch,
                stone_details: item?.stoneDetails,
            })
        })
        return updateData;
    }

    useEffect(() => {
        if (filterValues?.selectBranch) {
            const getNonTagAvailableStockDetails = async () => {
                try {
                    await dispatch(getNonTagStock(filterValues?.selectBranch)).unwrap();
                } catch (error) {
                    console.error(error);
                }
            };
            getNonTagAvailableStockDetails();
        }
    }, [dispatch, filterValues?.selectBranch]);

    useEffect(() => {
        setMaxGrossWeight('');
        setMaxPiece('');
        setIsStoneRestrict(false);
        setIsOtherMetalRestrict(false);
        const salesItemData = prevData ? prevData : [];

        const totalSales = [...salesItemData]
            .filter(item =>
                item.selectedProduct === addFormData.selectedProduct &&
                item.selectedDesign === addFormData.selectedDesign &&
                item.selectedSubDesign === addFormData.selectedSubDesign &&
                (settings?.is_section_required === '1'
                    ? item.selectedSection === addFormData.selectedSection
                    : true)
            )
            .reduce((sum, val) => {
                return {
                    totalGrossWeight: parseFloat(sum.totalGrossWeight) + parseFloat(val.grossWeight),
                    totalPieces: parseFloat(sum.totalPieces) + parseFloat(val.piece)
                };
            }, { totalGrossWeight: 0, totalPieces: 0 });

        let nonTagStockItems = nonTagStock.find(
            (val) =>
                val.id_product_id === addFormData.selectedProduct
        );
        if (nonTagStockItems) {
            let actualStockWeight = parseFloat(parseFloat(nonTagStockItems?.gross_wt) - parseFloat(totalSales.totalGrossWeight)).toFixed(3);
            let actualStockPcs = parseFloat(parseFloat(nonTagStockItems?.pieces) - parseFloat(totalSales.totalPieces));
            setMaxGrossWeight(actualStockWeight);
            setMaxPiece(actualStockPcs);
        } else {
            setMaxGrossWeight(0);
            setMaxPiece(0);
            addFormData.piece = 0;
        }

    }, [
        addFormData,
        nonTagStock,
        prevData
    ]);

    const handleDeleteNonTag = (index) => {
        const updatedFormData = [...prevData];
        updatedFormData.splice(index, 1);
        setPrevData(updatedFormData);
    };

    const reset_form = async () => {
        reset("");
        setPrevData([]);
        setAddFormData(initialAddFormData);
        setFilterValues(filterValuesDefalut)

    };


    const resetDesign = () => {
        setFilterValues((prevValues) => ({ ...prevValues, selectedDesign: '' }));
    }

    const resetSubDesign = () => {
        setFilterValues((prevValues) => ({ ...prevValues, selectedSubDesign: '' }));
    }



    useEffect(() => {
        const pureWeight = calculatePureWeight({
            netWeight: addFormData.grossWeight,
            purchaseTouch: addFormData.touch,
            pureCalcType: 1,
            purchaseWastage: 0,
        });
        if (parseFloat(pureWeight) > 0) {
            setAddFormData((prevData) => ({ ...prevData, pureWt: pureWeight }));
            setValue("pureWt", pureWeight);
        }
        if (parseFloat(pureWeight) < 0) {
            toastfunc("Pure Wt Should be less than 0");
        }
    }, [setValue, addFormData.grossWeight, addFormData?.touch]);


    const handleSetStoneDetails = (data) => {
        console.log('Stone', data);
        data.forEach(element => {
            element.stone_pcs = element.piece
            element.stone_wt = element.weight
            element.stn_rate = element.stone_rate
            element.stn_cost = element.stone_amount
        });
        handleInputChange("StoneDetails", data);

    };


    const handleAddPreview = () => {

        if (filterValues?.selectBranch === "" || filterValues?.selectBranch === null) {
            toastfunc("Please Select From Branch");
        }
        else if (filterValues?.idBranchTo === "" || filterValues?.idBranchTo === null) {
            toastfunc("Please Select To Branch");
        }
        else if (addFormData?.selectedProduct === "" || addFormData?.selectedProduct === null) {
            toastfunc("Please Select Product");
        }
        else if (addFormData?.piece === "" || addFormData?.piece === null) {
            toastfunc("Please Enter Piece");
        }
        else if ((addFormData?.grossWeight === "" || addFormData?.grossWeight === null || addFormData?.grossWeight <= 0)) {
            toastfunc("Please Enter Gross Weight");
        }
        else if (addFormData?.netWeight === "" || addFormData?.netWeight === null) {
            toastfunc("Please Enter Net Weight");
        }
        else {
            const product = products.find((val) => val.pro_id === addFormData.selectedProduct);
            let newitem = {
                ...addFormData,
                productName: product.product_name,
            }

            console.log(newitem);

            setPrevData([newitem, ...prevData]);

            setAddFormData(initialAddFormData);

        }

    };

    const handleInputChange = (field, value) => {
        setAddFormData((prevData) => ({ ...prevData, [field]: value }));
    };

    var totalNonTagPiece = prevData?.reduce(
        (sum, obj) => sum + (obj?.piece != null || undefined ? parseFloat(obj?.piece) : 0),
        0
    );

    var totalNonTagGrsWt = prevData?.reduce(
        (sum, obj) => sum + (obj?.grossWeight != null || undefined ? parseFloat(obj?.grossWeight) : 0),
        0
    );
    var totalNonTagLessWt = prevData?.reduce(
        (sum, obj) => sum + (obj?.touch != null || undefined ? parseFloat(obj?.touch) : 0),
        0
    );
    var totalNonTagNetWt = prevData?.reduce(
        (sum, obj) => sum + (obj?.pureWt != null || undefined ? parseFloat(obj?.pureWt) : 0),
        0
    );

    useEffect(() => {
        if (add === undefined && id === undefined) {
            navigate(`${process.env.PUBLIC_URL}/purchase/metal_issue/list`);
        }
    }, [add, id, navigate]);



    return (
        <React.Fragment>
            <Head title="Stock Transfer " />
            <Content>
                <PreviewCard className="h-100">

                    <FormProvider {...methods}>
                        <Row lg={12} className={"form-control-sm"} style={{ marginTop: '10px' }}>
                            <Col md={9}>
                                <ModifiedBreadcrumb></ModifiedBreadcrumb>
                            </Col>

                            <Col md={3} className="text-right" >
                                <Button

                                    color="danger"
                                    size="md"
                                    onClick={() => navigate(`${process.env.PUBLIC_URL}/inventory/stock_transfer/list`)}
                                >
                                    Cancel
                                </Button>{" "}
                                <Button
                                    color="primary"

                                    size="md"
                                    onClick={onClickSave}
                                >
                                    Save
                                </Button>
                            </Col>
                        </Row>

                        <Row lg={12} className={"form-control-sm"}>

                            <Col md={4}>
                                <div className="custom-grid">
                                    <Row className="form-group row g-4" >
                                        <Col md="4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="site-name">
                                                    Branch
                                                </label>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <BranchDropdown
                                                register={register}
                                                id={"idBranch"}
                                                branches={branches}
                                                selectedBranch={filterValues?.selectBranch}
                                                onBranchChange={(value) => {
                                                    handleFilterChange('selectBranch', value);
                                                }}
                                                isRequired={false}
                                                clearErrors={clearErrors}
                                                setValue={setValue}
                                                message={errors.branch && "Branch is Required"}
                                            />
                                        </Col>

                                    </Row>

                                    <Row className="form-group row g-4" >
                                        <Col md="4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="site-name">
                                                    Supplier
                                                </label>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <SupplierDropdown
                                                register={register}
                                                id={"selectSupplier"}
                                                supplier={supplier}
                                                selectedSupplier={filterValues?.selectSupplier}
                                                onSupplierChange={(value) => {
                                                    handleFilterChange('selectSupplier', value);
                                                }}
                                                isRequired={false}
                                                clearErrors={clearErrors}
                                                setValue={setValue}
                                                message={errors.selectSupplier && "Supplier is Required"}
                                            />
                                        </Col>

                                    </Row>


                                    <Row className="form-group row g-4">
                                        <Col md="4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="site-name">
                                                    Product
                                                </label>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <ProductDropdown
                                                register={register}
                                                products={products}
                                                id="selectedProduct"
                                                selectedProduct={addFormData?.selectedProduct}
                                                onProductChange={(e) => {
                                                    handleInputChange('selectedProduct', e);
                                                    resetDesign();
                                                    resetSubDesign();
                                                }}
                                                isRequired={false}
                                                clearErrors={clearErrors}
                                                setValue={setValue}
                                                message={errors.selectedProduct && "Product is Required"}
                                            ></ProductDropdown>

                                        </Col>
                                    </Row>

                                    <Row className="form-group row g-4">
                                        <Col md="4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="site-name">
                                                    Piece
                                                </label>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <NumberInputField
                                                register={register}
                                                placeholder="Pcs"
                                                id={"piece"}
                                                value={addFormData?.piece}
                                                isRequired={true}
                                                min={1}
                                                max={(maxPiece !== '' ? maxPiece : '')}
                                                setValue={setValue}
                                                handleDot={true}
                                                handleKeyDownEvents={true}
                                                SetValue={(value) => {
                                                    handleInputChange("piece", value);
                                                    clearErrors("piece");
                                                }}
                                                minError={"Pieces Should greater than or equal to 0"}
                                                maxError={"Pieces Should greater than or equal to "}
                                                reqValueError={"Pieces is Required"}
                                                message={errors.piece && "Pieces is Required"}
                                            ></NumberInputField>
                                            {maxPiece !== '' ? <span>Available Piece :{maxPiece}</span> : ""}
                                        </Col>
                                    </Row>
                                    <Row className="form-group row g-4">
                                        <Col md="4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="site-name">
                                                    Gross Wt
                                                </label>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <InputFieldWithDropdown
                                                register={register}
                                                placeholder="Gross weight"
                                                id={"grossWeight"}
                                                min={0}
                                                max={maxGrossWeight ? (maxGrossWeight) : ''}
                                                value={addFormData?.grossWeight}
                                                type={"number"}
                                                handleKeyDownEvents={true}
                                                handleDecimalDigits={true}
                                                decimalValues={3}
                                                setValue={setValue}
                                                SetValue={(value) => {
                                                    handleInputChange("grossWeight", value);
                                                    clearErrors("grossWeight");
                                                }}
                                                optionId={"uomId"}
                                                name={"uomId"}
                                                options={UomOptions}
                                                onDropDownChange={(value) => {
                                                    handleInputChange("uomId", value);
                                                }}
                                                selectedOption={addFormData.uomId}
                                                minError={"Gross weight should Greater than or equal to 0"}
                                                maxError={"Gross Weight Less than or equal to "}
                                                requiredMessage={"Gross weight is Required"}
                                                message={errors.grossWeight && "Gross Weight is Required"}
                                            ></InputFieldWithDropdown>
                                            {maxGrossWeight !== '' ? <span>Available Gwt : {maxGrossWeight}</span> : ""}
                                        </Col>
                                    </Row>
                                    <Row className="form-group row g-4">
                                        <Col md="4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="site-name">
                                                    Touch / Pure Wt
                                                </label>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <InputGroupField
                                                register={register}
                                                placeholder1="Touch"
                                                inputId1="touch"
                                                value1={addFormData.touch}
                                                isRequiredInput1={false}
                                                //minInput1={formValues.settingsMinVa}
                                                minInput1={''}
                                                maxInput1={100}
                                                maxLength1={999}
                                                handleKeyDownEvents1={true}
                                                handleDecimalDigits={true}
                                                decimalValues={2}
                                                minErrorInput1={"Touch should be greater than or equal to " + addFormData.touch}
                                                maxErrorInput1={"Touch should be less than or equal to 100"}
                                                reqValueErrorInput1={"Touch is required"}
                                                messageInput1={errors.touch && errors.touch.message}
                                                setValue1={setValue}
                                                SetInputValue1={(value) => {
                                                    handleInputChange("touch", value);
                                                    clearErrors("touch");
                                                }}
                                                placeholder2="Pure Wt"
                                                inputId2="pureWt"
                                                isRequiredInput2={false}
                                                value2={addFormData.pureWt}
                                                setValue2={setValue}
                                                minErrorInput2={"Pure Wt should be greater than or equal to 0"}
                                                maxErrorInput2={"Pure Wt should be less than or equal to 100"}
                                                reqValueErrorInput2={"Pure Wt is required"}
                                                messageInput2={errors.pureWt && errors.pureWt.message}
                                                SetInputValue2={(value) => {
                                                    handleInputChange("pureWt", value);
                                                    clearErrors("pureWt");
                                                }}
                                                readOnly2 = {true}
                                            />

                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md="4"></Col>
                                        <Col md="8">
                                            <div className="form-group action_button " style={{ display: "flex" }}>
                                                &nbsp;
                                                <SaveButton
                                                    size="md"
                                                    color="primary"
                                                    tabIndex={17}
                                                    onClick={handleAddPreview}
                                                >
                                                    Add to Preview
                                                </SaveButton>
                                            </div>
                                        </Col>
                                    </Row>


                                </div>
                            </Col>

                            <Col md={8}>
                                <div className="custom-grid">

                                    <Row md={12}>
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead>


                                                    <tr>
                                                        <th>S.NO</th>
                                                        <th>Product</th>
                                                        <th>Piece</th>
                                                        <th>Gwt</th>
                                                        <th>Touch</th>
                                                        <th>PureWt</th>
                                                        <th>Action</th>



                                                    </tr>

                                                </thead>
                                                <tbody>
                                                    {
                                                        prevData?.map((item, rowIndex) => (
                                                            <tr key={rowIndex}>
                                                                <td >{rowIndex + 1} </td>
                                                                <td>{item?.productName}</td>
                                                                <td style={{ textAlign: "right" }}>  {item.piece}</td>
                                                                <td style={{ textAlign: "right" }}>{parseFloat(item.grossWeight).toFixed(3)}</td>
                                                                <td style={{ textAlign: "right" }}>{parseFloat(item.touch).toFixed(2)}</td>
                                                                <td style={{ textAlign: "right" }}>{parseFloat(item.pureWt).toFixed(3)}</td>
                                                                <td>
                                                                    <Button
                                                                        color="primary"
                                                                        size="sm"
                                                                        className="btn-icon btn-white btn-dim"
                                                                        onClick={() => handleDeleteNonTag()}
                                                                    >
                                                                        <Icon name="trash-fill" />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                                <tfoot>


                                                    <tr style={{ fontWeight: 'bold' }}>
                                                        <td>Total</td>
                                                        <td></td>
                                                        <td style={{ textAlign: "right" }}>
                                                            {totalNonTagPiece}
                                                        </td>
                                                        <td style={{ textAlign: "right" }}>
                                                            {parseFloat(totalNonTagGrsWt).toFixed(2)}
                                                        </td>
                                                        <td style={{ textAlign: "right" }}>
                                                            {parseFloat(totalNonTagLessWt).toFixed(2)}
                                                        </td>
                                                        <td style={{ textAlign: "right" }}>
                                                            {parseFloat(totalNonTagNetWt).toFixed(2)}
                                                        </td>
                                                        <td></td>
                                                    </tr>


                                                </tfoot>
                                            </table>
                                        </div>
                                    </Row>

                                </div>
                            </Col>

                        </Row>


                    </FormProvider>
                </PreviewCard>
            </Content>
        </React.Fragment>
    )
}

export default MetalIssueForm