import React, { useEffect, useState, useRef } from "react";
import Head from "../../../layout/head/Head";
import { useForm, FormProvider } from 'react-hook-form';
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Row, PreviewCard, SaveButton } from "../../../components/Component";
import { InputFieldWithDropdown, InputGroupField, NumberInputField } from "../../../components/form-control/InputGroup";
import Content from "../../../layout/content/Content";
import "../../../assets/css/sales_form.css"
import { BranchDropdown, CategoryDropdown, DesignDropdown, ProductDropdown, PurityDropdown, SectionDropdown, SubDesignDropdown, SupplierDropdown, SizeDropdown, } from "../../../components/filters/retailFilters";
import { useCategories, usePurities, useProducts, useDesigns, useSubDesigns, useUom, useSupplierFilter, useBranches, useSections, useProductSections, useSize, useStone, useQualityCode } from "../../../components/filters/filterHooks";
import IsRequired from "../../../components/erp-required/erp-required";
import PreviewTable from "../../../components/sds-table/PreviewTable";
import { Button } from "reactstrap";
import LessWeightInputField from "../../../components/form-control/LessWeight";
import useLotFormHandling from "./useLotFormHandling";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useDispatch } from "react-redux";
import { geLotDetailById } from "../../../redux/thunks/inventory";
import DeleteModal from "../../../components/modals/DeleteModal";
import { useHotkeys } from "react-hotkeys-hook";
import { secureStorage_login_branches } from "../../../redux/configs";

const LotForm = () => {
    const location = useLocation();
    const add = location?.state?.add;
    const id = location?.state?.id;
    const { register, handleSubmit, formState: { errors }, clearErrors, setValue, reset } = useForm();
    const navigate = useNavigate();
    const { isLoading: issubmitting, isError } = useSelector((state) => state.metalReducer);
    const { userInfo: { settings } } = useSelector((state) => state.authUserReducer);
    const methods = useForm();
    const { categories } = useCategories();
    const { purities } = usePurities();
    const { products } = useProducts();
    const { designs } = useDesigns();
    const { subDesigns } = useSubDesigns();
    const { sections } = useProductSections();
    const { uom } = useUom();
    const { supplier } = useSupplierFilter();
    const { branches } = useBranches();
    const { stone } = useStone();
    const { quality_code } = useQualityCode();
    const dispatch = useDispatch();
    const [idBranch, setIdBranch] = useState("");
    const [idSupplier, setIdSupplier] = useState("");
    const [lotType, setLotType] = useState(1);
    const { size } = useSize();
    const [isSinglePurity, setIsSinglePurity] = useState(false);
    const branchRef = useRef(null);
    const supplierRef = useRef(null);
    let UomOptions = [];
    let lotTypeOptions = [
    {
      label: "Normal",
      value: 1,
    },
    {
      label: "Sales Return",
      value: 2,
    },
    {
      label: "Partly Sale",
      value: 3,
    },
    {
      label: "Old Metal",
      value: 4,
    },
  ];
    if (uom.length > 0) {
        UomOptions = uom.map((val) => ({
            value: val.uom_id,
            label: val.uom_name,
            isDefault: val.is_default
        }));
    }
    console.log(errors);
    const {
        selectedBranchId,
        selectedSupplierID,
        formValues,
        formData,
        lessWeightRef,
        handleInputChange,
        handleSetStoneDetails,
        addToPreview,
        handleEdit,
        handleDelete,
        resetPurity,
        resetProduct,
        resetDesign,
        resetSubDesign,
        resetSection,
        numericFields,
        columns,
        calcTypeOptions,
        PureCalcTypeOptions,
        onClickSave,
        isSubmitted,
        deleteModal,
        toggle,
        deleteItem,
        isSectionRequired,
        isMrpItem,
        fixedRateCalc,
        productRef,
        isSizeRequired,
    } = useLotFormHandling(products, designs, subDesigns, id, idBranch, idSupplier , lotType);

    useEffect(() => {
        setIdSupplier(selectedSupplierID);
        setIdBranch(selectedBranchId);
        reset();
    }, [setIdSupplier, setIdBranch, selectedBranchId, selectedSupplierID, reset]);

    useEffect(() => {
        setValue('id_lot_inward_detail', formValues.id_lot_inward_detail);
    });

    useEffect(() => {
        if (add === undefined && id === undefined) {
            navigate(`${process.env.PUBLIC_URL}/inventory/lot/list`);
        }
    }, [add, id, navigate]);


    useHotkeys("ctrl+s", (event) => {
        event.preventDefault();
        onClickSave();
    },
        {
            enableOnFormTags: true, // Enable hotkeys inside input fields
            preventDefault: true, // Prevent default browser Save
        }
    );

    useEffect(() => {

        if (secureStorage_login_branches?.length <= 1) {
            if (supplierRef.current) {
                supplierRef.current.focus()
              }
        }else {
            if (branchRef.current) {
                branchRef.current.focus()
              }
        }

    }, [dispatch]);


    return (
        <React.Fragment>
            <Head title="Lot Add" />
            <Content>
                <PreviewCard className="h-100">

                    <FormProvider {...methods}>
                        <Row lg={12} className={"form-control-sm"} style={{ marginTop: '10px' }}>
                            <Col md={3}>
                                <ModifiedBreadcrumb></ModifiedBreadcrumb>
                            </Col>
                            <Col md={2}>
                                <div className="form-group">
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
                                        ref={branchRef}
                                    ></BranchDropdown>
                                </div>
                            </Col>
                            <Col md={2}>
                                <SupplierDropdown
                                    register={register}
                                    id={"idSupplier"}
                                    supplier={supplier}
                                    isRequired={true}
                                    selectedSupplier={idSupplier}
                                    onSupplierChange={setIdSupplier}
                                    clearErrors={clearErrors}
                                    setValue={setValue}
                                    message={errors.idSupplier && "Supplier is Required"}
                                    tabIndex={2}
                                    ref={supplierRef}
                                ></SupplierDropdown>
                            </Col>
                            <Col md={2}>
                                    <div className="form-group">
                                        <div className="form-control-wrap">
                                        <div className="form-control-select">
                                            <select
                                            className="form-control form-select"
                                            id="lotType"
                                            {...register("lotType", {
                                                required: true,
                                            })}
                                            value={lotType}
                                            onChange={(e) => {
                                                setLotType(e.target.value);
                                            }}
                                            placeholder="Type"
                                            >
                                            <option
                                                label="Select Type"
                                                value=""
                                            ></option>
                                            {lotTypeOptions?.map((item, index) => (
                                                <option key={index} value={item?.value}>
                                                {item.label}
                                                </option>
                                            ))}
                                            </select>
                                        </div>
                                        </div>
                                    </div>
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
                                    disabled={isSubmitted}
                                    size="md"
                                    onClick={onClickSave}
                                >
                                    {isSubmitted ? "Saving" : "Save[Ctrl+s]"}
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
                                                    Category<IsRequired />
                                                </label>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <CategoryDropdown
                                                register={register}
                                                id="selectedCategory"
                                                categories={categories}
                                                selectedCategory={formValues.selectedCategory}
                                                onCategoryChange={(value) => {
                                                    handleInputChange('selectedCategory', value);

                                                    if (value) {
                                                        const category = categories?.find((cat) => cat.id_category === value);
                                                        if (category) {
                                                            console.log(category.id_purity.length, "category");
                                                            if (category.id_purity.length === 1) {
                                                                setIsSinglePurity(true);
                                                                handleInputChange('selectedPurity', category.id_purity[0]);
                                                                setValue("selectedPurity", category.id_purity[0]);
                                                                clearErrors("selectedPurity");
                                                            } else {
                                                                setIsSinglePurity(false);
                                                                resetPurity();
                                                            }
                                                        } else {
                                                            resetPurity();
                                                        }

                                                    } else {
                                                        resetPurity();
                                                    }

                                                    resetProduct();
                                                    resetDesign();
                                                    resetSubDesign();
                                                    resetSection();
                                                }}
                                                isRequired={true}
                                                clearErrors={clearErrors}
                                                setValue={setValue}
                                                message={errors.selectedCategory && "Category is Required"}
                                                tabIndex={3}
                                                ref={productRef}
                                            />
                                        </Col>
                                    </Row>
                                    {!isSinglePurity && (
                                        <Row className="form-group row g-4">
                                            <Col md="4">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        Purity<IsRequired />
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="8">
                                                <PurityDropdown
                                                    register={register}
                                                    id={"selectedPurity"}
                                                    purities={purities}
                                                    categories={categories}
                                                    selectedCategory={formValues.selectedCategory}
                                                    onPurityChange={(value) => {
                                                        handleInputChange('selectedPurity', value);
                                                    }}
                                                    selectedPurity={formValues.selectedPurity}
                                                    isRequired={true}
                                                    clearErrors={clearErrors}
                                                    setValue={setValue}
                                                    message={errors.selectedPurity && "Purity is Required"}
                                                    tabIndex={4}
                                                ></PurityDropdown>
                                            </Col>
                                        </Row>
                                    )}
                                    <Row className="form-group row g-4">
                                        <Col md="4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="site-name">
                                                    Product<IsRequired />
                                                </label>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <ProductDropdown
                                                register={register}
                                                id={"selectedProduct"}
                                                products={products}
                                                categories={categories}
                                                selectedCategory={formValues.selectedCategory}
                                                selectedPurity={formValues.selectedPurity}
                                                selectedProduct={formValues.selectedProduct}
                                                selectedSection={formValues.selectedSection}
                                                onProductChange={(value) => {
                                                    handleInputChange('selectedProduct', value);
                                                    resetDesign();
                                                    resetSubDesign();
                                                    resetSection();
                                                }}
                                                isRequired={true}
                                                clearErrors={clearErrors}
                                                setValue={setValue}
                                                message={errors.selectedProduct && "Product is Required"}
                                                tabIndex={5}
                                            ></ProductDropdown>
                                            <input type="hidden" id={"id_lot_inward_detail"} value={formValues.id_lot_inward_detail} {...register("id_lot_inward_detail")} />

                                        </Col>
                                    </Row>
                                    {/* {!isSingleProduct && ( */}
                                    {isSizeRequired && (
                                    <Row className="form-group row g-4">
                                    <Col md="4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="site-name">
                                                    Size
                                                </label>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <SizeDropdown
                                                register={register}
                                                id={"selectedSize"}
                                                size={size}
                                                categories={categories}
                                                selectedProduct={formValues.selectedProduct}
                                                selectedSize={formValues.selectedSize}
                                                selectedSection={formValues.selectedSection}
                                                products={products}
                                                onSizeChange={(value) => {
                                                    handleInputChange('selectedSize', value);
                                                }}
                                                isRequired={false}
                                                clearErrors={clearErrors}
                                                setValue={setValue}
                                                message={errors.selectedSize && "Size is Required"}
                                                tabIndex={5}
                                            ></SizeDropdown>
                                            <input type="hidden" id={"id_lot_inward_detail"} value={formValues.id_lot_inward_detail} {...register("id_lot_inward_detail")} />

                                        </Col>
                                    </Row>
                                    )}
                                 {/* )} */}

                                
                                    <Row className="form-group row g-4">
                                        <Col md="4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="site-name">
                                                    Design
                                                </label>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <DesignDropdown
                                                register={register}
                                                id={"selectedDesign"}
                                                designs={designs}
                                                products={products}
                                                selectedProduct={formValues.selectedProduct}
                                                selectedDesign={formValues.selectedDesign}
                                                onDesignChange={(value) => {
                                                    handleInputChange('selectedDesign', value);
                                                    resetSubDesign();
                                                }}
                                                isRequired={false}
                                                clearErrors={clearErrors}
                                                setValue={setValue}
                                                message={errors.selectedDesign && "Design is Required"}
                                                tabIndex={6}
                                            ></DesignDropdown>
                                        </Col>
                                    </Row>
                                   
                                    {settings?.is_design_and_pur_req_in_lot == 1 &&
                                        <Row className="form-group row g-4">
                                            <Col md="4">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        Sub Design<IsRequired />
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="8">
                                                <SubDesignDropdown
                                                    register={register}
                                                    id={"selectedSubDesign"}
                                                    subDesigns={subDesigns}
                                                    products={products}
                                                    designs={designs}
                                                    selectedProduct={formValues.selectedProduct}
                                                    selectedDesign={formValues.selectedDesign}
                                                    selectedSubDesign={formValues.selectedSubDesign}
                                                    onSubDesignChange={(value) => {
                                                        handleInputChange('selectedSubDesign', value);
                                                    }}
                                                    isRequired={true}
                                                    clearErrors={clearErrors}
                                                    setValue={setValue}
                                                    message={errors.selectedSubDesign && "Sub Design is Required"}
                                                    tabIndex={7}
                                                ></SubDesignDropdown>
                                            </Col>
                                        </Row>
                                    }
                                    {settings?.is_section_required === '1' &&
                                        <Row className="form-group row g-4">
                                            <Col md="4">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        Section{isSectionRequired && <IsRequired />}
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="8">
                                                <SectionDropdown
                                                    isMulti={false}
                                                    register={register}
                                                    isRequired={isSectionRequired}
                                                    id={"selectedSection"}
                                                    placeholder="Section"
                                                    selectedSection={formValues.selectedSection}
                                                    selectedProduct={formValues.selectedProduct}
                                                    optionLabel="Select Section"
                                                    sectionOptions={sections}
                                                    clearErrors={clearErrors}
                                                    setValue={setValue}
                                                    value={formValues.selectedSection}
                                                    onSectionChange={(value) => {
                                                        handleInputChange("selectedSection", value);
                                                    }}
                                                    message={errors.selectedSection && "Section is Required"}
                                                    tabIndex={8}
                                                />
                                            </Col>
                                        </Row>
                                    }


                                </div><br></br>
                            </Col>
                            <Col md={4}>
                                <div className="custom-grid">
                                    <Row className="form-group row g-4">
                                        <Col md="4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="site-name">
                                                    Piece<IsRequired />
                                                </label>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <NumberInputField
                                                register={register}
                                                placeholder="Piece"
                                                id={"piece"}
                                                value={formValues.piece}
                                                isRequired={true}
                                                min={0}
                                                setValue={setValue}
                                                SetValue={(value) => {
                                                    handleInputChange('piece', value);
                                                    clearErrors("piece");
                                                }}
                                                handleKeyDownEvents={true}
                                                handleDot={true}
                                                minError={"Pieces Should greater than or equal to 0"}
                                                reqValueError={"Pieces is Required"}
                                                message={errors.piece && errors.piece.message}
                                                tabIndex={9}
                                            ></NumberInputField>
                                        </Col>
                                    </Row>
                                    <Row className="form-group row g-4">
                                        <Col md="4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="site-name">
                                                    Gross Wt{!isMrpItem && <IsRequired />}
                                                </label>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <InputFieldWithDropdown
                                                register={register}
                                                placeholder="Gross weight"
                                                id={"grossWeight"}
                                                value={formValues.grossWeight}
                                                isRequired={!isMrpItem}
                                                readOnly={isMrpItem}
                                                min={(!isMrpItem ? 0.001 : 0)}
                                                type={"number"}
                                                optionId={"uomId"}
                                                name={"uomId"}
                                                options={UomOptions}
                                                setValue={setValue}
                                                handleKeyDownEvents={true}
                                                handleDecimalDigits={true}
                                                decimalValues={3}
                                                onDropDownChange={(value) => {
                                                    handleInputChange('uomId', value);
                                                }}
                                                selectedOption={formValues.uomId}
                                                SetValue={(value) => {
                                                    handleInputChange('grossWeight', value);
                                                    clearErrors("grossWeight");
                                                }}
                                                minError={"Gross weight Greater than or equal 1"}
                                                maxError={""}
                                                requiredMessage={"Gross weight is Required"}
                                                message={errors.grossWeight && errors.grossWeight.message}
                                                tabIndex={10}
                                            ></InputFieldWithDropdown>
                                        </Col>
                                    </Row>
                                    <Row className="form-group row g-4">
                                        <Col md="4">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="site-name">
                                                    Less Wt
                                                </label>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <LessWeightInputField
                                                register={register}
                                                placeholder="Less Weight"
                                                id={"lessWeight"}
                                                value={formValues.lessWeight}
                                                isRequired={false}
                                                min={0}
                                                uom={uom}
                                                gross_weight={formValues.grossWeight}
                                                less_weight={formValues.lessWeight}
                                                SetValue={(value) => handleInputChange('lessWeight', value)}
                                                SetStnWeight={(value) => handleInputChange('stnWeight', value)}
                                                SetDiaWeight={(value) => handleInputChange('diaWeight', value)}
                                                SetStoneDetails={handleSetStoneDetails}
                                                stone_details={formValues.stoneDetails}
                                                ref={lessWeightRef}
                                                stone={stone}
                                                quality_code={quality_code}
                                                tabIndex={11}
                                            ></LessWeightInputField>
                                        </Col>
                                    </Row>
                                    {settings?.is_design_and_pur_req_in_lot == 1 && (<>
                                        <Row className="form-group row g-4">
                                            <Col md="4">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        Stn Wt
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="8">

                                                <InputGroupField
                                                    register={register}
                                                    placeholder1="Stone"
                                                    inputId1="stnWeight"
                                                    value1={parseFloat(formValues.stnWeight).toFixed(3)}
                                                    isRequiredInput1={false}
                                                    minInput1={0}
                                                    maxInput1={100}
                                                    minErrorInput1={"Stone weight Should greater than 0"}
                                                    messageInput1={errors.stnWeight && errors.stnWeight.message}
                                                    setValue={setValue}
                                                    SetInputValue1={(value) => {
                                                        handleInputChange('stnWeight', value);
                                                        clearErrors("stnWeight");
                                                    }}

                                                    placeholder2="Dia"
                                                    inputId2="diaWeight"
                                                    isRequiredInput2={false}
                                                    value2={parseFloat(formValues.diaWeight).toFixed(3)}
                                                    minInput2={0}
                                                    minErrorInput2={"Dia Weight should be greater than or equal to 0"}
                                                    maxErrorInput2={"Dia Weight should be less than or equal to 100"}
                                                    reqValueErrorInput2={"Weight is required"}
                                                    messageInput2={errors.diaWeight && errors.diaWeight.message}
                                                    SetInputValue2={(value) => {
                                                        handleInputChange('diaWeight', value);
                                                        clearErrors("diaWeight");
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="form-group row g-4">
                                            <Col md="4">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        Net Wt
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="8">
                                                <NumberInputField
                                                    register={register}
                                                    id="netWeight"
                                                    placeholder="Net Weight"
                                                    value={formValues.netWeight}
                                                    isRequired={false}
                                                    readOnly
                                                    min={0}
                                                    minError="Net weight must be greater than 0"
                                                    reqValueError="Net weight is Required"
                                                    message={errors.netWeight && errors.netWeight.message}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="form-group row g-4">
                                            <Col md="4">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        MRP Rate
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="8">
                                                <NumberInputField
                                                    register={register}
                                                    placeholder="MRP Rate"
                                                    id={"sellRate"}
                                                    value={formValues.sellRate}
                                                    isRequired={false}
                                                    readOnly={!fixedRateCalc}
                                                    min={0}
                                                    handleKeyDownEvents={true}
                                                    handleDecimalDigits={true}
                                                    decimalValues={2}
                                                    setValue={setValue}
                                                    SetValue={(value) => handleInputChange('sellRate', value)}
                                                    minError={"Sell Should greater than 0"}
                                                    reqValueError={"Sell weight is Required"}
                                                    message={errors.sellRate && errors.sellRate.message}
                                                    tabIndex={12}
                                                ></NumberInputField>
                                            </Col>
                                        </Row>
                                    </>)}
                                </div><br></br>
                            </Col>
                            <Col md={4}>
                                <div className="custom-grid">
                                    {settings?.is_design_and_pur_req_in_lot == 1 && (<>
                                        <Row className="form-group row g-4">
                                            <Col md="3">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        Touch
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="9">
                                                <NumberInputField
                                                    register={register}
                                                    placeholder="Purchase Touch"
                                                    id="purchaseTouch"
                                                    value={formValues.purchaseTouch}
                                                    isRequired={false}
                                                    min={0}
                                                    max={100}
                                                    setValue={setValue}
                                                    handleKeyDownEvents={true}
                                                    handleDecimalDigits={true}
                                                    decimalValues={3}
                                                    SetValue={(value) => {
                                                        handleInputChange('purchaseTouch', value);
                                                        clearErrors("purchaseTouch");
                                                    }}
                                                    minError={"Purchase Touch should be greater than or equal to 0"}
                                                    maxError={"Purchase Touch should be less than or equal to 100"}
                                                    reqValueError={"Purchase Touch is required"}
                                                    message={errors.purchaseTouch && errors.purchaseTouch.message}
                                                    tabIndex={13}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="form-group row g-4">
                                            <Col md="3">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        Pur VA
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="9">
                                                <NumberInputField
                                                    register={register}
                                                    placeholder="Purchase Va"
                                                    id={"purchaseWastage"}
                                                    value={formValues.purchaseWastage}
                                                    isRequired={false}
                                                    min={0}
                                                    max={100}
                                                    handleKeyDownEvents={true}
                                                    handleDecimalDigits={true}
                                                    decimalValues={2}
                                                    setValue={setValue}
                                                    SetValue={(value) => {
                                                        handleInputChange('purchaseWastage', value);
                                                        clearErrors("purchase_wastage");
                                                    }}
                                                    minError={"VA should less than or equal to 0"}
                                                    maxError={"VA should greater than or equal to 0"}
                                                    reqValueError={"Purchase VA is Required"}
                                                    message={errors.purchaseWastage && errors.purchaseWastage.message}
                                                    tabIndex={14}
                                                ></NumberInputField>
                                            </Col>
                                        </Row>
                                        <Row className="form-group row g-4">
                                            <Col md="3">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        Pure Wt
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="9">
                                                <InputFieldWithDropdown
                                                    register={register}
                                                    placeholder="Pure Weight"
                                                    id={"pureWeight"}
                                                    value={formValues.pureWeight}
                                                    isRequired={false}
                                                    min={0}
                                                    type={"number"}
                                                    readOnly={true}
                                                    optionId={"pureCalcType"}
                                                    name={"pureCalcType"}
                                                    options={PureCalcTypeOptions}
                                                    setValue={setValue}
                                                    onDropDownChange={(value) => {
                                                        handleInputChange('pureCalcType', value);
                                                    }}
                                                    selectedOption={formValues.pureCalcType}
                                                    SetValue={(value) => {
                                                        handleInputChange('purchaseRate', value);
                                                        clearErrors("purchaseRate");
                                                    }}
                                                    minError={"Rate should less than or equal to 0"}
                                                    maxError={"Rate should greater than or equal to 0"}
                                                    reqValueError={"Purchase Rate is Required"}
                                                    message={errors.pureWeight && errors.pureWeight.message}
                                                ></InputFieldWithDropdown>
                                            </Col>
                                        </Row>
                                        <Row className="form-group row g-4">
                                            <Col md="3">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        MC
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="9">
                                                <InputFieldWithDropdown
                                                    register={register}
                                                    placeholder="Purchase MC"
                                                    id={"purchaseMc"}
                                                    value={formValues.purchaseMc}
                                                    isRequired={false}
                                                    min={0}
                                                    type={"number"}
                                                    handleKeyDownEvents={true}
                                                    handleDecimalDigits={true}
                                                    decimalValues={2}
                                                    tabIndex={15}
                                                    SetValue={(value) => {
                                                        handleInputChange('purchaseMc', value);
                                                        clearErrors("purchaseMc");
                                                    }}
                                                    optionId={"purchaseMcType"}
                                                    name={"purchaseMcType"}
                                                    options={calcTypeOptions}
                                                    setValue={setValue}
                                                    onDropDownChange={(value) => {
                                                        handleInputChange('purchaseMcType', value);
                                                    }}
                                                    selectedOption={formValues.purchaseMcType}

                                                    minError={"MC should less than or equal to 0"}
                                                    maxError={"MC should greater than or equal to 0"}
                                                    reqValueError={"Purchase MC is Required"}
                                                    message={errors.pureWeight && errors.pureWeight.message}
                                                ></InputFieldWithDropdown>
                                            </Col>
                                        </Row>
                                        <Row className="form-group row g-4">
                                            <Col md="3">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        Rate
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="9">
                                                <InputFieldWithDropdown
                                                    register={register}
                                                    placeholder="Purchase Rate"
                                                    id={"purchaseRate"}
                                                    value={formValues.purchaseRate}
                                                    isRequired={false}
                                                    min={0}
                                                    type={"number"}
                                                    optionId={"rateCalcType"}
                                                    name={"rateCalcType"}
                                                    options={calcTypeOptions}
                                                    setValue={setValue}
                                                    handleKeyDownEvents={true}
                                                    handleDecimalDigits={true}
                                                    decimalValues={2}
                                                    onDropDownChange={(value) => {
                                                        handleInputChange('purchaseRateType', value);
                                                    }}
                                                    selectedOption={formValues.purchaseRateType}
                                                    SetValue={(value) => {
                                                        handleInputChange('purchaseRate', value);
                                                        clearErrors("purchaseRate");
                                                    }}
                                                    minError={"Rate should less than or equal to 0"}
                                                    maxError={"Rate should greater than or equal to 0"}
                                                    reqValueError={"Purchase MC is Required"}
                                                    message={errors.purchaseRate && errors.purchaseRate.message}
                                                    tabIndex={16}
                                                ></InputFieldWithDropdown>
                                            </Col>
                                        </Row>
                                        <Row className="form-group row g-4">
                                            <Col md="3">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        Pur Cost
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="9">
                                                <NumberInputField
                                                    register={register}
                                                    placeholder="Purchase Cost"
                                                    id={"purchaseCost"}
                                                    value={formValues.purchaseCost}
                                                    isRequired={false}
                                                    min={0}
                                                    readOnly
                                                    setValue={setValue}
                                                    SetValue={(value) => handleInputChange('purchaseCost', value)}
                                                    minError={"Purchase Cost Should greater than 0"}
                                                    message={errors.purchaseCost && errors.purchaseCost.message}
                                                ></NumberInputField>
                                            </Col>
                                        </Row>
                                    </>
                                    )}

                                    {settings?.is_design_and_pur_req_in_lot == 0 && (<>
                                        <Row className="form-group row g-4">
                                            <Col md="4">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        Stn Wt
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="8">

                                                <InputGroupField
                                                    register={register}
                                                    placeholder1="Stone"
                                                    inputId1="stnWeight"
                                                    value1={parseFloat(formValues.stnWeight).toFixed(3)}
                                                    isRequiredInput1={false}
                                                    minInput1={0}
                                                    maxInput1={100}
                                                    minErrorInput1={"Stone weight Should greater than 0"}
                                                    messageInput1={errors.stnWeight && errors.stnWeight.message}
                                                    setValue={setValue}
                                                    SetInputValue1={(value) => {
                                                        handleInputChange('stnWeight', value);
                                                        clearErrors("stnWeight");
                                                    }}

                                                    placeholder2="Dia"
                                                    inputId2="diaWeight"
                                                    isRequiredInput2={false}
                                                    value2={parseFloat(formValues.diaWeight).toFixed(3)}
                                                    minInput2={0}
                                                    minErrorInput2={"Dia Weight should be greater than or equal to 0"}
                                                    maxErrorInput2={"Dia Weight should be less than or equal to 100"}
                                                    reqValueErrorInput2={"Weight is required"}
                                                    messageInput2={errors.diaWeight && errors.diaWeight.message}
                                                    SetInputValue2={(value) => {
                                                        handleInputChange('diaWeight', value);
                                                        clearErrors("diaWeight");
                                                    }}
                                                />
                                            </Col>
                                        </Row>

                                        <Row className="form-group row g-4">
                                            <Col md="4">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        Net Wt
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="8">
                                                <NumberInputField
                                                    register={register}
                                                    id="netWeight"
                                                    placeholder="Net Weight"
                                                    value={formValues.netWeight}
                                                    isRequired={false}
                                                    readOnly
                                                    min={0}
                                                    minError="Net weight must be greater than 0"
                                                    reqValueError="Net weight is Required"
                                                    message={errors.netWeight && errors.netWeight.message}
                                                />
                                            </Col>
                                        </Row>

                                        <Row className="form-group row g-4">
                                            <Col md="4">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="site-name">
                                                        MRP Rate
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col lg="8">
                                                <NumberInputField
                                                    register={register}
                                                    placeholder="MRP Rate"
                                                    id={"sellRate"}
                                                    value={formValues.sellRate}
                                                    isRequired={false}
                                                    readOnly={!fixedRateCalc}
                                                    min={0}
                                                    handleKeyDownEvents={true}
                                                    handleDecimalDigits={true}
                                                    decimalValues={2}
                                                    setValue={setValue}
                                                    SetValue={(value) => handleInputChange('sellRate', value)}
                                                    minError={"Sell Should greater than 0"}
                                                    reqValueError={"Sell weight is Required"}
                                                    message={errors.sellRate && errors.sellRate.message}
                                                    tabIndex={12}
                                                ></NumberInputField>
                                            </Col>
                                        </Row>
                                    </>
                                    )}

                                </div>
                            </Col>
                        </Row>
                        <Row className="g-3">
                            <Col>
                                <div style={{ "float": "right" }}>
                                    <SaveButton
                                        disabled={issubmitting}
                                        size="md"
                                        color="primary"
                                        tabIndex={17}
                                        onClick={handleSubmit((data) =>
                                            addToPreview(data)
                                        )}
                                    >Add to Preview
                                    </SaveButton>
                                </div>
                            </Col>
                        </Row>
                        <Row className="form-group row g-4">
                            <Col md={12}>
                                <Row md={12}>

                                </Row>
                                <Row md={12}>
                                    <PreviewTable columns={columns} data={formData} numericFields={numericFields} onDelete={handleDelete} onEdit={handleEdit} tabIndex={100} />
                                </Row>
                            </Col>
                        </Row>

                    </FormProvider>
                </PreviewCard>
            </Content>
            <DeleteModal
                actionName={"Delete"}
                modal={deleteModal}
                toggle={toggle}
                name={"Item"}
                title={"Lot"}
                clickAction={deleteItem}
            />
        </React.Fragment>
    )
}

export default LotForm