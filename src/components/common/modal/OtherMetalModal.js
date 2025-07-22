import React, { useEffect, useState } from "react";
import {Modal,ModalBody,ModalHeader,ModalFooter } from "reactstrap";
import { useForm } from 'react-hook-form';
import { useSelector} from "react-redux";
import { Col, Row,CancelButton, Icon, SaveButton } from "../../Component";
import IsRequired from "../../../components/erp-required/erp-required";
import { useCategories, usePurities } from "../../filters/filterHooks";
import { CategoryDropdown, PurityDropdown } from "../../filters/retailFilters";
import { InputFieldWithDropdown, InputGroupField, NumberInputField } from "../../form-control/InputGroup";
import { calculateOtherMetalAmount, isUndefined } from "../calculations/ErpCalculations";
import PreviewTable from "../../sds-table/PreviewTable";
import { toastfunc } from "../../sds-toast-style/toast-style";
function OtherMetalForm({ isOpen, toggle,onSave,uom,initialOtherMetalDetails,...props}) {
    
  const { register,handleSubmit, formState: { errors },clearErrors,setValue,reset} = useForm();
  const { metalPurityRateList } = useSelector((state) => state.metalPurityRateReducer);
  const { metalRateInfo } = useSelector((state) => state.metalRateReducer);
  const { categories } = useCategories();
  const { purities } = usePurities();
  const [formData, setFormData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedPurity, setSelectedPurity] = useState();
  const [ratePerGram, setRatePerGram] = useState();
  const [calcType, setCalcType] = useState(1);
  const [piece, setPiece] = useState();
  const [weight, setWeight] = useState();
  const [amount, setAmount] = useState();
  const [wastagePercentage, setWastagePercentage] = useState();
  const [wastageWeight, setWastageWeight] = useState();
  const [mcValue, setMcValue] = useState();
  const [mcType, setMcType] = useState(1);
  const [editIndex, setEditIndex] = useState(null);
  const [idTagOtherMetal, setIdTagOtherMetal] = useState('');
  const [idEstOtherMetal, setIdEstOtherMetal] = useState('');
  const [idPurchaseOtherMetal, setIdPurchaseOtherMetal] = useState('');
  const [idIssueOtherMetal, setIdIssueOtherMetal] = useState('');


  const calc_type_options = [{'label':'Per Gram','value':1,isDefault: true},{'label':'Per Piece','value':2}];

  const columns = [
    { header: 'Category', accessor: 'cat_name' ,decimal_places:0},
    { header: 'Pcs', accessor: 'piece',decimal_places:0,"textAlign":"right","isTotalReq":true,"isCurrency":false},
    { header: 'Weight', accessor: 'weight',decimal_places:3 ,"textAlign":"right","isTotalReq":true},
    { header: 'V.A(%)', accessor: 'wastagePercentage',decimal_places:2 ,"textAlign":"right","isTotalReq":false},
    { header: 'VA', accessor: 'wastageWeight',decimal_places:3 ,"textAlign":"right","isTotalReq":true},
    { header: 'Rate', accessor: 'ratePerGram' ,decimal_places:2,"textAlign":"right","isTotalReq":false,"isCurrency":true},
    { header: 'Amount', accessor: 'amount' ,decimal_places:2,"textAlign":"right","isTotalReq":true,"isCurrency":true},
  ];

  const mcTypeOptions = [
    { label: "Per Gram", value: 1, isDefault: true },
    { label: "Per Piece", value: 2 },
  ];

  const reset_form = ()=>{
    setSelectedCategory('');
    setSelectedPurity('');
    setWeight(0.0000);
    setPiece('');
    setAmount('');
    setIdPurchaseOtherMetal('');
    setMcType(1);
    setCalcType(1);
    setMcValue(0.00);
    setWastagePercentage(0.00);
    setWastageWeight(0.000);
    setRatePerGram(0.00);
    setIdIssueOtherMetal('');
    clearErrors(); // Clear all errors
    reset();
  };
  
  //Add items to preview and clear the form
  const addToPreview = async (data) => {
    const categoryDetails = categories.find((cat) => cat.id_category === data.selectedCategory);
    const newItem = {
      'cat_name': categoryDetails.cat_name,
      'selectedCategory': data.selectedCategory,
      'selectedPurity': data.selectedPurity,
      'piece': isUndefined(data.piece),
      'ratePerGram': isUndefined(data.ratePerGram),
      'weight': isUndefined(data.weight),
      'uom_id': data.uom_id,
      'amount': isUndefined(data.amount),
      'calc_type':data.calc_type,
      'wastagePercentage':isUndefined(data.wastagePercentage),
      'wastageWeight':isUndefined(data.wastageWeight),
      'mcValue':isUndefined(data.mcValue),
      'mcType':data.mcType,
      'id_tag_other_metal':idTagOtherMetal,
      'id_est_other_metal':idEstOtherMetal,
      'id_purchase_other_metal':idPurchaseOtherMetal,
      'id_issue_other_metal':idIssueOtherMetal,

    };
    if (editIndex !== null) {
      const updatedFormData = [...formData];
      updatedFormData[editIndex] = newItem;
      setFormData(updatedFormData);
      setEditIndex(null);
    } else {
      setFormData(prevData => [...prevData, newItem]);
    }
    reset_form();
  };

  const handleEdit = (index) => {
    const item = formData[index];
    setSelectedCategory(item.selectedCategory);
    setSelectedPurity(item.selectedPurity);
    setPiece(item.piece);
    setWeight(item.weight);
    setWastagePercentage(item.wastagePercentage);
    setWastageWeight(item.wastageWeight);
    setMcValue(item.mcValue);
    setAmount(item.amount);
    setEditIndex(index);
    setIdTagOtherMetal(item?.id_tag_other_metal);
    setIdEstOtherMetal(item?.id_est_other_metal);
    setIdPurchaseOtherMetal(item?.id_purchase_other_metal);
    setIdIssueOtherMetal(item?.id_issue_other_metal);

  };

  const handleDelete = (index) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
  };

  const handleSave = () => {
    let totalOtherMetalWeight = 0;
    formData.forEach((val) => {
        totalOtherMetalWeight += parseFloat(val.weight);
    });
    let totalLessWeight = parseFloat(totalOtherMetalWeight)+parseFloat(props?.lessWeight)
    if(parseFloat(totalLessWeight)>parseFloat(props?.grossWeight))
    {
        toastfunc("Other Metal weight is exceed than The Gross Weight");
    }else{
        onSave(formData);
        reset_form();
        setFormData([]);
        toggle();
    }
  };

  useEffect(() => {
    let currentRate = 0;
    if(metalPurityRateList?.length>0 && categories?.length >0 && selectedCategory!==''  && selectedCategory){
        const categoryDetails = categories.find((cat) => cat.id_category === selectedCategory);
        const rateDetails = metalPurityRateList.find((val) => val.id_metal === categoryDetails.id_metal && val.id_purity === selectedPurity);
        let rate_field = rateDetails?.rate_field;
        if (rate_field) {
            currentRate = metalRateInfo[rate_field];
        }
    }
    if(wastagePercentage>0)
    {
        let wast_wt = parseFloat((parseFloat(weight)*parseFloat(wastagePercentage))/100).toFixed(3);
        setWastageWeight(wast_wt);
    }
    const itemCost = calculateOtherMetalAmount({
      "weight": weight,
      "piece": piece,
      "rate": currentRate,
      "wastage_weight":wastageWeight,
      "rate_calc_type": calcType,
      "mcType":mcType,
      "mcValue":mcValue,
    });
    setRatePerGram(currentRate);
    setAmount(itemCost);
  }, [formData,selectedCategory,selectedPurity,weight, piece,wastageWeight,wastagePercentage,mcValue,mcType,ratePerGram, calcType, setValue]);

  useEffect(() => {
    setValue('formData', JSON.stringify(formData));
  }, [formData, setValue]);

  useEffect(() => {
    if (isOpen) {
        if(initialOtherMetalDetails!==undefined){
            setFormData(initialOtherMetalDetails);
        }
    }
  }, [isOpen, initialOtherMetalDetails]);


    return (
      <Modal className="modal-dialog modal-dialog-top modal-lg" isOpen={isOpen} toggle={toggle}>
        <ModalHeader
          tag="h6"
          className=""
          toggle={toggle}
          close={
            <button
              className="close"
              style={{
                position: "absolute",
                right: "1rem",
              }}
              onClick={toggle}
            >
              <Icon name="cross" />
            </button>
          }
        >
          <span style={{ fontSize: "small" }}>Other Metal</span>
        </ModalHeader>
        <ModalBody>
        <Row lg={12} className={"form-control-sm"}>
          <Col md={6}>
            <div className="custom-grid">
             
              <Row className="form-group row g-4">
                <Col md="3">
                      <div className="form-group">
                      <label className="form-label" htmlFor="site-name">
                          Category<IsRequired/>
                      </label>
                      </div>
                  </Col>
                  <Col md="9">
                    <CategoryDropdown
                        register={register}
                        id="selectedCategory"
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.selectedCategory && "Category is Required"}
                        readOnly={props?.isDisabled}
                    />
                  </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col md="3">
                      <div className="form-group">
                      <label className="form-label" htmlFor="site-name">
                          Purity<IsRequired/>
                      </label>
                      </div>
                  </Col>
                  <Col md="9">
                    <PurityDropdown
                    register={register}
                    id={"selectedPurity"}
                    purities={purities}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onPurityChange={setSelectedPurity}
                    selectedPurity={selectedPurity}
                    value={selectedPurity}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectedPurity && "Purity is Required"}
                    readOnly={props?.isDisabled}
                    ></PurityDropdown>
                  </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col md="3">
                      <div className="form-group">
                      <label className="form-label" htmlFor="site-name">
                          Weight<IsRequired/>
                      </label>
                      </div>
                  </Col>
                  <Col md="9">
                    <NumberInputField
                        register={register} 
                        placeholder="Weight"
                        id={"weight"}
                        value={weight}
                        type={"number"}
                        isRequired={true} 
                        min={0}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={3}
                        SetValue={(value) => {
                            setWeight(value);
                            clearErrors("weight");
                        }}
                        minError={"Weight Should Be Grater Than 0"}
                        requiredMessage={"Weight is Required"}
                    />
                    {errors?.weight && (<span className="text-danger">{errors?.weight.message}</span>)}
                </Col>
              </Row>
              <Row className="form-group row g-4">
                    <Col md="3">
                          <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                              Piece<IsRequired/>
                          </label>
                          </div>
                      </Col>
                      <Col lg="9">
                        <NumberInputField
                          register={register}
                          placeholder={"Piece"}
                          id={"piece"}
                          value={piece}
                          minValue={0}
                          type={"number"}
                          isRequired={true}
                          SetValue={setPiece}
                          setValue={setValue}
                          clearErrors={clearErrors}
                          reqValueError={"Pcs is Required"}
                          handleKeyDownEvents={true}
                          handleDot={true}
                        ></NumberInputField>  
                        {errors?.piece && (<span className="text-danger">{errors?.piece.message}</span>)}
                      </Col>
                </Row>
            </div>
          </Col>
          <Col md={6}>
            <div class="custom-grid">
                <Row className="form-group row g-4">
                    <Col md="3">
                        <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                            Wastage
                        </label>
                        </div>
                    </Col>
                    <Col lg="9">
                        <InputGroupField
                        register={register}
                        placeholder1="%"
                        inputId1="wastagePercentage"
                        value1={wastagePercentage}
                        isRequiredInput1={false}
                        minInput1={0} 
                        maxInput1={100}
                        maxLength1={999}

                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={2}
                        minErrorInput1={"VA should be greater than or equal to 0"}
                        maxErrorInput1={"VA Touch should be less than or equal to 100"}
                        reqValueErrorInput1={"VA is required"}
                        messageInput1={errors.wastagePercentage && errors.wastagePercentage.message}
                        setValue1={setValue}
                        SetInputValue1={setWastagePercentage}
                        placeholder2="Weight"
                        inputId2="wastageWeight"
                        isRequiredInput2={false}
                        value2={wastageWeight}
                        minInput2={0}
                        setValue2={setValue}
                        minErrorInput2={"Weight should be greater than or equal to 0"}
                        maxErrorInput2={"Weight should be less than or equal to 100"}
                        reqValueErrorInput2={"Weight is required"}
                        messageInput2={errors.wastageWeight && errors.wastageWeight.message}
                        SetInputValue2={setWastageWeight}
                        />
                        {errors.wastagePercentage ? <span className="text-danger">{errors.wastagePercentage.message}</span> : ""}
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
                        placeholder="MC"
                        id={"mcValue"}
                        value={mcValue}
                        isRequired={false}
                        min={0}
                        type={"number"}
                        SetValue={setMcValue}
                        optionId={"mcType"}
                        name={"mcType"}
                        options={mcTypeOptions}
                        setValue={setValue}
                        onDropDownChange={setMcType}
                        selectedOption={mcType}
                        minError={"MC should less than or equal to 0"}
                        maxError={"MC should greater than or equal to 0"}
                        reqValueError={"MC is Required"}
                        message={errors.mcValue && errors.mcValue.message}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={2}
                        clearErrors={clearErrors}
                        ></InputFieldWithDropdown>
                    </Col>
                </Row>
                <Row className="form-group row g-4">
                    <Col md="3">
                          <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                              Rate<IsRequired/>
                          </label>
                          </div>
                      </Col>
                      <Col lg="9">
                            <InputFieldWithDropdown
                                register={register} 
                                placeholder="Rate"
                                id={"ratePerGram"}
                                optionId={"calc_type"}
                                name={"calc_type"}
                                value={ratePerGram}
                                type={"number"}
                                readOnly={true}
                                isRequired={true}
                                min={0}
                                text_width={110}
                                option_width={80}
                                options={calc_type_options}
                                setValue={setValue}
                                onDropDownChange={setCalcType}
                                selectedOption={calcType}
                                SetValue={setRatePerGram}
                                handleKeyDownEvents={true}
                                handleDecimalDigits={true}
                                decimalValues={2}
                                minError={"Rate Should Not Be Grater Than 0"}
                                requiredMessage={"Rate is Required"}
                            ></InputFieldWithDropdown>
                            {errors?.stone_rate && (<span className="text-danger">{errors?.stone_rate.message}</span>)}
                      </Col>
                </Row>
                <Row className="form-group row g-1">
                    <Col md="3">
                          <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                              Amount<IsRequired/>
                          </label>
                          </div>
                      </Col>
                      <Col lg="9">
                        <NumberInputField
                          register={register}
                          placeholder={"amount"}
                          id={"amount"}
                          name={"amount"}
                          value={amount}
                          minValue={0}
                          isRequired={false}
                          readOnly={true}
                          SetValue={setAmount}
                          setValue={setValue}
                          clearErrors={clearErrors}
                        ></NumberInputField>  
                        {errors?.amount && (<span className="text-danger">{errors?.amount.message}</span>)}
                      </Col>
                </Row>
                <Row className="form-group row g-4">
                  <div className="form-group mt-2 offset-lg-6">
                    <SaveButton
                        size="md"
                        color="primary"
                        onClick={handleSubmit((data) =>
                          addToPreview(data, "saveAndNew")
                        )}
                        >
                          Add to Preview
                    </SaveButton>
                  </div>
                </Row>
            </div>
          </Col>
        </Row><hr></hr>
        <Row md={12} className="form-group row g-4">
              <PreviewTable columns={columns} data={formData!==undefined ? formData:[]} onEdit = {handleEdit} onDelete={handleDelete}  />
        </Row>
        </ModalBody>
        <ModalFooter>
            <Row>
              <Col lg="12" className="offset-lg-2">
                <div className="form-group mt-2">
                  <SaveButton
                    size="md"
                    color="primary"
                    onClick={handleSave}
                  >Save
                  </SaveButton>

                  <CancelButton
                    size="md"
                    color="danger"
                    onClick={toggle}
                  >Close
                  </CancelButton>

                </div>
              </Col>
            </Row>
        </ModalFooter>
      </Modal>
    );
  }

export default OtherMetalForm