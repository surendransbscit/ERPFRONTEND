import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter, Label } from "reactstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { CancelButton, Icon, SaveButton } from "../../Component";
import { Col, Row } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import { useQualityCode, useStone } from "../../filters/filterHooks";
import { QualityDropdown, StoneDropdown } from "../../filters/retailFilters";
import { InputFieldWithDropdown, NumberInputField } from "../../form-control/InputGroup";
import { calculateStoneAmount, isUndefined } from "../calculations/ErpCalculations";
import PreviewTable from "../../sds-table/PreviewTable";
import { toastfunc } from "../../sds-toast-style/toast-style";
import { getStoneById } from "../../../redux/thunks/catalogMaster";
function StoneForm({ isOpen, toggle, onSave, uom, initialStoneDetails, stone, quality_code, ...props }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    reset,
  } = useForm();
  // const { stone } = useStone();
  // const { quality_code } = useQualityCode();
  const [formData, setFormData] = useState([]);
  const [showLessWeight, setShowLessWeight] = useState(0);
  const [selectedStone, setSelectedStone] = useState();
  const [selectedQualitycode, setSelectedQualitycode] = useState();
  const [stoneRate, setStoneRate] = useState();
  const [calcType, setCalcType] = useState(1);
  const [uomId, setUomId] = useState(1);
  const [piece, setPiece] = useState();
  const [weight, setWeight] = useState();
  const [amount, setAmount] = useState();
  const [idLotInwStnDetail, setIdLotInwStnDetail] = useState("");
  const [idTagStnDetail, setIdTagStnDetail] = useState("");
  const [estStnId, setEstStnId] = useState("");
  const [purStnId, setPurStnId] = useState("");
  const [idIssueStnDetail, setIdIssueStnDetail] = useState("");
  const { activeDiamondRateList } = useSelector((state) => state.diamondRateMasterReducer);

  const [editIndex, setEditIndex] = useState(null);
  const calc_type_options = [
    { label: "Per WT", value: 1 },
    { label: "Per Piece", value: 2 },
  ];

  const uom_options = uom?.map((val) => ({
    value: val.uom_id,
    label: val.uom_name,
    isDefault: val.is_default,
  }));

  const columns = [
    { header: "Stone Name", accessor: "stone_name", decimal_places: 0 },
    { header: "Pcs", accessor: "piece", decimal_places: 0, textAlign: "right", isTotalReq: true, isCurrency: false },
    { header: "Weight", accessor: "weight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "UOM", accessor: "uom_name", decimal_places: 0, textAlign: "left", isTotalReq: false },
    {
      header: "Rate",
      accessor: "stone_rate",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: false,
      isCurrency: true,
    },
    {
      header: "Amount",
      accessor: "stone_amount",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
    },
  ];

  useEffect(() => {
    const stone_details = stone?.find((item) => item.stone_id === selectedStone);
    if (stone_details && editIndex) {
      setShowLessWeight(stone_details.show_less_wt ? 1 : 0);
    }
  }, [selectedStone, stone]);


  const reset_form = () => {
    setWeight("");
    setPiece("");
    setStoneRate("");
    setAmount("");
    setSelectedStone("");
    setSelectedQualitycode("");
    setIdIssueStnDetail("");
    setPurStnId("");
    setUomId(1);
    setShowLessWeight(0);
    clearErrors(); // Clear all errors
    reset();
  };

  //Add items to preview and clear the form
  const addToPreview = async (data) => {
    const stone_details = stone.find((item) => item.stone_id === data.id_stone);
    const uom_details = uom.find((item) => item.uom_id === parseInt(data.uom_id));
    const newItem = {
      show_in_lwt: showLessWeight,
      stone_name: stone_details.stone_name,
      id_stone: data.id_stone,
      stone_type: stone_details.stone_type,
      id_quality_code: data.id_quality_code,
      piece: data.piece,
      stone_rate: data.stone_rate,
      weight: data.weight,
      uom_id: data.uom_id,
      uom_name: uom_details.uom_name,
      stone_amount: data.amount,
      stn_calc_type: data.calc_type,
      divided_by_value: uom_details.divided_by_value != null ? uom_details.divided_by_value : 0,
      stone_details: stone_details,
      id_lot_inw_stn_detail: idLotInwStnDetail,
      id_tag_stn_detail: data.idTagStnDetail,
      est_stn_id: data.estStnId,
      id_purchase_stn_detail: purStnId,
      id_issue_stn_detail: idIssueStnDetail,
    };
    if (editIndex !== null) {
      const updatedFormData = [...formData];
      updatedFormData[editIndex] = newItem;
      setFormData(updatedFormData);
      setEditIndex(null);
    } else {
      setFormData((prevData) => [...prevData, newItem]);
    }
    reset_form();
  };

  const handleEdit = (index) => {

    const item = formData[index];
    setSelectedStone(item.id_stone);
    setSelectedQualitycode(item.id_quality_code);
    setPiece(item.piece);
    setWeight(item.weight);
    setUomId(parseInt(item.uom_id));
    setStoneRate(item.stone_rate);
    setAmount(item.stone_amount);
    setShowLessWeight(item.show_in_lwt);
    setEditIndex(index);
    setCalcType(item.stn_calc_type);
    setValue("id_stone", item.id_stone);
    setValue("id_quality_code", item.id_quality_code);
    setValue("piece", item.piece);
    setValue("weight", item.weight);
    setValue("stone_rate", item.stone_rate);
    setValue("amount", item.stone_amount);
    setValue("setCalcType", item.stn_calc_type);
    setIdLotInwStnDetail(item?.id_lot_inw_stn_detail);
    setPurStnId(item?.id_purchase_stn_detail);
    setIdTagStnDetail(item?.id_tag_stn_detail);
    setEstStnId(item?.est_stn_id);
    setIdIssueStnDetail(item?.id_issue_stn_detail);
  };

  const handleDelete = (index) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1); // Remove item at index
    setFormData(updatedFormData); // Update state with new array
  };

  const handleSave = () => {
    let stnWeight = 0;
    let diaWeight = 0;
    let less_weight = 0;
    formData.forEach((val) => {
      const stone_details = stone.find((item) => item.stone_id === val.id_stone);
      if (val.weight > 0) {
        if (parseInt(stone_details.stone_type) === 2 || parseInt(stone_details.stone_type) === 3) {
          if (val.divided_by_value > 0) {
            stnWeight += parseFloat(val.weight / val.divided_by_value);
          } else {
            stnWeight += parseFloat(val.weight);
          }
        } else {
          if (val.divided_by_value > 0) {
            diaWeight += parseFloat(val.weight / val.divided_by_value);
          } else {
            diaWeight += parseFloat(val.weight);
          }
        }

        if (parseInt(val.show_in_lwt) == 1) {
          less_weight = parseFloat(parseFloat(stnWeight) + parseFloat(diaWeight)).toFixed(3);
        }
      }
    });
    let otherMetalWeight = isUndefined(props?.otherMetalWeight);
    let total_less_weight = parseFloat(less_weight) + parseFloat(otherMetalWeight);
    if (parseFloat(total_less_weight) > parseFloat(props?.grossWeight)) {
      toastfunc("Less weight is exceed than The Gross Weight");
    } else {
      onSave(formData);
      reset_form();
      setFormData([]);
      toggle();
    }
  };
  useEffect(() => {
    let diamondRate = activeDiamondRateList.find((item) => item.quality_code == selectedQualitycode && parseFloat(item.from_cent) <= parseFloat(weight) && parseFloat(item.to_cent) >= parseFloat(weight))
    if (diamondRate?.quality_code) {
      setStoneRate(diamondRate.rate);
    }
  }, [weight, selectedQualitycode]);

  useEffect(() => {
    const stoneCost = calculateStoneAmount({
      stone_weight: weight,
      stone_piece: piece,
      stone_rate: stoneRate,
      stone_calc_type: calcType,
    });
    setValue("amount", stoneCost);
  }, [weight, piece, stoneRate, calcType, setValue]);

  useEffect(() => {
    setValue("formData", JSON.stringify(formData));
  }, [formData, setValue]);

  useEffect(() => {
    if (isOpen && initialStoneDetails !== undefined) {
      setFormData(initialStoneDetails);
    }
  }, [isOpen, initialStoneDetails]);

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
            tabIndex={'-1'}
          >
            <Icon name="cross" />
          </button>
        }
      >
        <span style={{ fontSize: "small" }}>Stone</span>
      </ModalHeader>
      <ModalBody>
        <Row lg={12} className={"form-control-sm"}>
          <Col md={6}>
            <div className="custom-grid">
              <Row className="form-group row g-4">
                <Col md="3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                      Stone
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col md="9">
                  <StoneDropdown
                    register={register}
                    id={"id_stone"}
                    stones={stone}
                    selectedStone={selectedStone}
                    onStoneChange={(value) => {
                      setSelectedStone(value);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.id_stone && "Stone is Required"}
                    isDisabled={props?.isDisabled}
                  ></StoneDropdown>
                </Col>
              </Row>

              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="radioSize">
                      Less wt
                      {/* <IsRequired /> */}
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <ul className="custom-control-group g-3 align-center flex-wrap">
                      <li>
                        <div className="custom-control custom-control-sm custom-radio">
                          <input
                            register={register}
                            type="radio"
                            className="custom-control-input"
                            name="radioSize"
                            id="customRadioYes"
                            value={"1"}
                            onChange={(e) => {
                              setShowLessWeight(e.target.value);
                            }}
                            checked={parseInt(showLessWeight) == 1}
                          />
                          <label className="custom-control-label" htmlFor="customRadioYes">
                            Yes
                          </label>
                        </div>
                      </li>

                      <li>
                        <div className="custom-control custom-control-sm custom-radio">
                          <input
                            register={register}
                            type="radio"
                            className="custom-control-input"
                            name="radioSize"
                            id="customRadioNo"
                            value={"0"}
                            checked={parseInt(showLessWeight) === 0}
                            onChange={(e) => {
                              setShowLessWeight(e.target.value);
                            }}
                          />
                          <label className="custom-control-label" htmlFor="customRadioNo">
                            No
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>

              <Row className="form-group row g-4">
                <Col md="3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="id_quality_code">
                      Q.Code
                    </label>
                  </div>
                </Col>
                <Col md="9">
                  <QualityDropdown
                    register={register}
                    id={"id_quality_code"}
                    quality_code={quality_code}
                    selectedQualitycode={selectedQualitycode}
                    onQualityCodeChange={setSelectedQualitycode}
                    isRequired={false}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.id_quality_code && "Quality code is Required"}
                    isDisabled={props?.isDisabled}
                  ></QualityDropdown>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col md="3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                      Weight
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col md="9">
                  <InputFieldWithDropdown
                    register={register}
                    placeholder="Weight"
                    id={"weight"}
                    value={weight}
                    type={"number"}
                    isRequired={true}
                    min={0}
                    text_width={85}
                    option_width={80}
                    optionId={"uom_id"}
                    name={"uom_id"}
                    options={uom_options}
                    setValue={setValue}
                    onDropDownChange={setUomId}
                    selectedOption={uomId}
                    handleKeyDownEvents={true}
                    handleDecimalDigits={true}
                    decimalValues={3}
                    SetValue={(value) => {
                      setWeight(value);
                      clearErrors("weight");
                    }}
                    minError={"Rate Should Not Be Grater Than 0"}
                    requiredMessage={"Rate is Required"}
                  ></InputFieldWithDropdown>
                  {errors?.weight && <span className="text-danger">{errors?.weight.message}</span>}
                </Col>
              </Row>
            </div>
          </Col>
          <Col md={6}>
            <div className="custom-grid">
              <Row className="form-group row g-4">
                <Col md="3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                      Piece
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="9">
                  <NumberInputField
                    register={register}
                    placeholder={"Piece"}
                    id={"piece"}
                    value={piece}
                    min={0}
                    type={"number"}
                    isRequired={true}
                    SetValue={setPiece}
                    clearErrors={clearErrors}
                    reqValueError={"Pcs is Required"}
                    handleKeyDownEvents={true}
                    handleDot={true}
                  ></NumberInputField>
                  {errors?.piece && <span className="text-danger">{errors?.piece.message}</span>}
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col md="3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                      Rate
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="9">
                  <InputFieldWithDropdown
                    register={register}
                    placeholder="Rate"
                    id={"stone_rate"}
                    optionId={"calc_type"}
                    name={"calc_type"}
                    value={stoneRate}
                    type={"number"}
                    isRequired={true}
                    min={0}
                    text_width={110}
                    option_width={80}
                    options={calc_type_options}
                    setValue={setValue}
                    onDropDownChange={setCalcType}
                    selectedOption={calcType}
                    SetValue={(value) => {
                      setStoneRate(value);
                      clearErrors("stone_rate");
                    }}
                    handleKeyDownEvents={true}
                    handleDecimalDigits={true}
                    decimalValues={2}
                    minError={"Rate Should Not Be Grater Than 0"}
                    requiredMessage={"Rate is Required"}
                  ></InputFieldWithDropdown>
                  {errors?.stone_rate && <span className="text-danger">{errors?.stone_rate.message}</span>}
                </Col>
              </Row>
              <Row className="form-group row g-1">
                <Col md="3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                      Amount
                      <IsRequired />
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
                    clearErrors={clearErrors}
                  ></NumberInputField>
                  {errors?.amount && <span className="text-danger">{errors?.amount.message}</span>}
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <div className="form-group mt-2 offset-lg-6">
                  <SaveButton
                    size="md"
                    color="primary"
                    type="button"
                    onClick={handleSubmit((data) => addToPreview(data))}
                  >
                    Add to Preview
                  </SaveButton>
                </div>
              </Row>
            </div>
          </Col>
        </Row>
        <hr></hr>
        <Row className="form-group row g-4">
          <Col md={12}>
            <Row md={12}>
              <Label>Stone Details</Label>
            </Row>
            <Row md={12}>
              <PreviewTable
                columns={columns}
                data={formData !== undefined ? formData : []}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Row>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Row>
          <Col lg="12" className="offset-lg-2">
            <div className="form-group mt-2">
              <SaveButton size="md" color="primary" onClick={handleSave}>
                Save
              </SaveButton>

              <CancelButton size="md" color="danger" onClick={toggle}>
                Close
              </CancelButton>
            </div>
          </Col>
        </Row>
      </ModalFooter>
    </Modal>
  );
}

export default StoneForm;
