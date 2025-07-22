import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import '../../../assets/css/previewTable.css'
import { Button } from 'reactstrap';
import { Icon } from '../../../components/Component';
import CurrencyDisplay from '../../../components/common/moneyFormat/moneyFormat';
import "../../../assets/css/datatable.css"
import {
  calculateNetWeight,
  calculateOtherMetalAmount,
  calculatePurchaseCost,
  calculatePureWeight,
  calculateSalesItemCost,
  calculateWastageWeight,
  getRatePerGram,
} from "../../../components/common/calculations/ErpCalculations";
import OtherMetalWeightInputField from "../../../components/form-control/otherMetalInput";
import LessWeightInputField from "../../../components/form-control/LessWeight";
import { NumberInputField, TextInputField } from "../../../components/form-control/InputGroup";

import { useForm, FormProvider } from "react-hook-form";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import { useSelector } from "react-redux";


const TaggingTable = forwardRef((props, ref) => {
  const {
    columns,
    data,
    onDelete,
    onEdit,
    isTotalReq = true,
    setData,
    mcVaSetiings,
    sections,
    uom,
    size,
    subDesigns,
    designs,
    products,
    purities,
    categories,
    taxGroup,
    metalPurityRate,
    metalRates,
    lotItemDetails,
    maxPiece,
    maxGrossWeight
  } = props;
  const {
    register,
    formState: { errors },
    clearErrors,
    reset: resetForm,
    setValue,
    trigger } = useForm();
  const methods = useForm();
  const {
    userInfo: { settings, user },
  } = useSelector((state) => state.authUserReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);


  console.log(userInfo?.settings?.show_tagging_edit);
  // Function to calculate total for numeric fields
  const calculateTotal = (field) => {
    return data.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };
  const { activeStoneList } = useSelector((state) => state.stoneReducer);
  const { activeQualityCodeList } = useSelector((state) => state.qualityCodeReducer);
  const { catPurityRateList } = useSelector((state) => state.metalPurityRateReducer);
  //const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [filteredSubDesigns, setFilteredSubDesigns] = useState([]);
  //const [filteredPurities, setFilteredPurities] = useState([]);
  const [activeEditIndex, setActiveEditIndex] = useState();
  const lessWeightRef = useRef();
  const otherMetalWeightRef = useRef();


  const getWeightValidation = (index) => {
    let total_gwt = calculateTotal('tag_gwt');
    let current_data = data[index]
    let current_item_wt = current_data.tag_gwt
    let balance_gwt = parseFloat(maxGrossWeight) - parseFloat(total_gwt) + parseFloat(current_item_wt)
    return balance_gwt
  }
  const getPcsValidation = (index) => {
    let total_pcs = calculateTotal('tag_pcs');
    let current_data = data[index]
    let current_item_pcs = current_data.tag_pcs
    console.log(maxPiece, total_pcs, current_data, current_item_pcs)
    let balance_pcs = parseFloat(maxPiece) - parseFloat(total_pcs) + parseFloat(current_item_pcs)
    return balance_pcs
  }

  useImperativeHandle(ref, () => ({
    validate: async () => {
      // Trigger validation on all fields
      const isValid = await trigger();
      return isValid;
    },
    resetForm: () => {
      resetForm();
    },
  }));
  const handelChange = (index, field, value) => {

    setData((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      let updateValue = {
        [field]: value,
      }
      if (field == "selectedProduct") {
        updateValue = {
          "selectedProduct": value,
          "selectedDesign": '',
          "selectedSubDesign": '',
          "selectedSize": '',
        }
      } else if (field == "selectedDesign") {
        updateValue = {
          "selectedDesign": value,
          "selectedSubDesign": '',
        }
      }
      else if (field == "tag_sell_rate") {

        updateValue = updateItemCost({ ...updatedObject, "tag_sell_rate": value })
        updateValue = {
          ...updateValue,
          "tag_sell_rate": value,
        }

      } else if (field == "tag_mc_value") {

        updateValue = updateItemCost({ ...updatedObject, "tag_mc_value": value })
        updateValue = {
          ...updateValue,
          "tag_mc_value": value,
        }

      }
      else if (field == "flat_mc_value") {

        updateValue = updateItemCost({ ...updatedObject, "flat_mc_value": value })
        updateValue = {
          ...updateValue,
          "flat_mc_value": value,
        }

      }
      else if (field == "tag_wastage_percentage") {
        const productDetails = products.find((prod) => prod.pro_id === updatedObject.tag_product_id);

        const calculated_weight = calculateWastageWeight({
          calculationType: productDetails.wastage_calc_type,
          grossWeight: updatedObject.tag_gwt,
          netWeight: updatedObject.tag_nwt,
          wastagePercentage: value,
        });
        updateValue = updateItemCost({ ...updatedObject, "tag_wastage_percentage": value })
        updateValue = {
          ...updateValue,
          "tag_wastage_percentage": value,
          tag_wastage_wt: calculated_weight,
        }

      }
      else if (field == "selectedSubDesign") {
        const productDetails = products.find((prod) => prod.pro_id === updatedObject.selectedProduct);
        const mc_va_setting = mcVaSetiings.find((sett) => sett.id_product === updatedObject.selectedProduct && sett.id_design === updatedObject.selectedDesign && sett.id_sub_design === value && (productDetails.has_weight_range === 1 ? sett.from_weight <= updatedObject.grossWeight && sett.to_weight >= updatedObject.grossWeight : true));
        let settMaxMc = mc_va_setting.max_mc_value
        let settMaxVa = mc_va_setting.max_wastage_percentage
        let settMcType = parseInt(mc_va_setting.mc_type)
        updateValue = {
          "selectedSubDesign": value,
          "mcType": settMcType,
          "wastagePercentage": settMaxVa,
          "mcValue": settMaxMc,
        }
      } else if (field == "tag_gwt") {

        //   setDetails({...updatedObject,"index":index});


        const net_weight = calculateNetWeight({
          gross_weight: value,
          less_weight: updatedObject.tag_lwt,
          other_metal_weight: updatedObject.tag_other_metal_wt,
        });
        if (parseFloat(net_weight) > 0) {
          updateValue = updateNetWeight({ ...updatedObject, "tag_gwt": value })
          updateValue = {
            ...updateValue,
            "tag_gwt": value,
          }
        } else {
          //updateValue = updateNetWeight({...updatedObject,"tag_gwt" : updatedObject?.tag_gwt})
          toastfunc("Invalid Validate Weight")

        }
      } else if (field == "stone_details") {
        updateValue = updateNetWeight({ ...updatedObject, "stone_details": value })
        updateValue = {
          ...updateValue,
          "stone_details": value
        }
      }
      else if (field == "other_metal_detail") {
        updateValue = updateNetWeight({ ...updatedObject, "other_metal_detail": value })
        updateValue = {
          ...updateValue,
          "other_metal_detail": value
        }

      }

      updatedValues[index] = { ...updatedObject, ...updateValue };
      console.log(updateValue)


      return updatedValues;
    });
  };

  const updateItemCost = (updatedObject) => {
    const productDetails = products.find((prod) => prod.pro_id === updatedObject.tag_product_id);
    let ratePerGram = 0;
    let otherMetalAmount = 0;
    const calculation_based_on = productDetails.calculation_based_on;
    const taxType = productDetails.tax_type;
    const tax_id = productDetails.tax_id;
    const taxPercentage = productDetails.tax_percentage;
    ratePerGram = getRatePerGram(categories, metalPurityRate, metalRates, updatedObject.selectedCategory, updatedObject.tag_purity_id, catPurityRateList)
    ratePerGram = (updatedObject?.rate_type && updatedObject?.rate_type === 2 ? (parseFloat(updatedObject.ratePerGram) > 0 ? updatedObject.ratePerGram : ratePerGram) : ratePerGram);
    if (updatedObject?.other_metal_detail?.length > 0) {
      updatedObject?.other_metal_detail?.forEach(item => {
        let otherMetalItemCost = calculateOtherMetalAmount({
          "weight": item.weight,
          "piece": item.piece,
          "rate": item.rate_per_gram,
          "wastage_weight": item.wastage_weight,
          "rate_calc_type": item.rate_calc_type,
          "mcType": item.mc_type,
          "mcValue": item.mc_value,
        });
        otherMetalAmount += parseFloat(otherMetalItemCost)
      });
    }


    const stoneAmount = [...updatedObject.stone_details].reduce((sum, item) => parseFloat(sum) + parseFloat(item.stone_amount), 0);
    let otherMetalWeight = [...updatedObject.other_metal_detail].reduce((sum, item) => parseFloat(sum) + parseFloat(item.weight), 0);
    const otherChargesAmount = [...updatedObject.charges_details].reduce((sum, item) => parseFloat(sum) + parseFloat(item.amount), 0);

    const itemCostDetails = calculateSalesItemCost({
      piece: updatedObject.tag_pcs,
      grossWeight: updatedObject.tag_gwt,
      netWeight: updatedObject.tag_nwt,
      wastageWeight: updatedObject.tag_wastage_wt,
      mcType: updatedObject.tag_mc_type,
      mcValue: updatedObject.tag_mc_value,
      flatMcValue: updatedObject.flat_mc_value,
      taxType: taxType,
      taxPercentage: taxPercentage,
      productDetails: productDetails,
      ratePerGram: ratePerGram,
      stoneAmount: stoneAmount,
      otherMetalAmount: otherMetalAmount,
      otherChargesAmount: otherChargesAmount,
      sellRate: updatedObject.tag_sell_rate,
    });

    return {
      tag_item_cost: itemCostDetails.item_cost,
      tag_tax_amount: itemCostDetails.taxAmount,
      ratePerGram: ratePerGram,
      taxableAmount: itemCostDetails.taxable_amount,
      cgst: itemCostDetails.cgst,
      sgst: itemCostDetails.sgst,
      igst: itemCostDetails.igst,
      totalMcValue: itemCostDetails.total_mc_value,
    }
  }

  const updateNetWeight = (updatedObject) => {
    const productDetails = products.find((prod) => prod.pro_id === updatedObject.tag_product_id);

    const net_weight = calculateNetWeight({
      gross_weight: updatedObject.tag_gwt,
      less_weight: updatedObject.tag_lwt,
      other_metal_weight: updatedObject.tag_other_metal_wt,
    });

    const pureWeight = calculatePureWeight({
      netWeight: net_weight,
      purchaseTouch: updatedObject.tag_purchase_touch,
      pureCalcType: updatedObject.tag_purchase_calc_ype,
      purchaseWastage: updatedObject.tag_purchase_va
    });
    const calculated_weight = calculateWastageWeight({
      calculationType: productDetails.wastage_calc_type,
      grossWeight: updatedObject.tag_gwt,
      netWeight: net_weight,
      wastagePercentage: updatedObject.tag_wastage_percentage,
    });

    const purchaseCost = calculatePurchaseCost({
      pureWeight: pureWeight,
      purchaseMcType: updatedObject.purchaseMcType,
      purchaseMc: updatedObject.tag_purchase_mc,
      purchaseRate: updatedObject.tag_purchase_rate,
      netWeight: net_weight,
      piece: updatedObject.tag_pcs,
      rateCalcType: updatedObject.tag_purchase_rate_calc_type
    });
    let ratePerGram = 0;
    let otherMetalAmount = 0;
    const calculation_based_on = productDetails.calculation_based_on;
    const taxType = productDetails.tax_type;
    const tax_id = productDetails.tax_id;
    const taxPercentage = productDetails.tax_percentage;
    ratePerGram = getRatePerGram(categories, metalPurityRate, metalRates, updatedObject.selectedCategory, updatedObject.tag_purity_id, catPurityRateList)
    ratePerGram = (updatedObject?.rate_type && updatedObject?.rate_type === 2 ? (parseFloat(updatedObject.ratePerGram) > 0 ? updatedObject.ratePerGram : ratePerGram) : ratePerGram);
    if (updatedObject?.other_metal_detail?.length > 0) {
      updatedObject?.other_metal_detail?.forEach(item => {
        let otherMetalItemCost = calculateOtherMetalAmount({
          "weight": item.weight,
          "piece": item.piece,
          "rate": item.rate_per_gram,
          "wastage_weight": item.wastage_weight,
          "rate_calc_type": item.rate_calc_type,
          "mcType": item.mc_type,
          "mcValue": item.mc_value,
        });
        otherMetalAmount += parseFloat(otherMetalItemCost)
      });
    }


    const stoneAmount = [...updatedObject.stone_details].reduce((sum, item) => parseFloat(sum) + parseFloat(item.stone_amount), 0);
    let otherMetalWeight = [...updatedObject.other_metal_detail].reduce((sum, item) => parseFloat(sum) + parseFloat(item.weight), 0);
    const otherChargesAmount = [...updatedObject.charges_details].reduce((sum, item) => parseFloat(sum) + parseFloat(item.amount), 0);

    const itemCostDetails = calculateSalesItemCost({
      grossWeight: updatedObject.tag_gwt,
      netWeight: net_weight,
      wastageWeight: calculated_weight,
      mcType: updatedObject.tag_mc_type,
      mcValue: updatedObject.tag_mc_value,
      flatMcValue: updatedObject.flat_mc_value,
      taxType: taxType,
      taxPercentage: taxPercentage,
      productDetails: productDetails,
      ratePerGram: ratePerGram,
      stoneAmount: stoneAmount,
      otherMetalAmount: otherMetalAmount,
      otherChargesAmount: otherChargesAmount,
      sellRate: updatedObject.tag_sell_rate,
    });

    return {
      tag_nwt: net_weight,
      tag_pure_wt: pureWeight,
      tag_wastage_wt: calculated_weight,
      taxPercentage: taxPercentage,
      tag_purchase_cost: purchaseCost.purchaseCost,
      tax_type: taxType,
      tax_id: tax_id,
      otherChargesAmount: otherChargesAmount,
      tag_other_metal_wt: otherMetalWeight,
      tag_calculation_type: calculation_based_on,
      tag_item_cost: itemCostDetails.item_cost,
      tag_tax_amount: itemCostDetails.taxAmount,
      ratePerGram: ratePerGram,
      taxableAmount: itemCostDetails.taxable_amount,
      cgst: itemCostDetails.cgst,
      sgst: itemCostDetails.sgst,
      igst: itemCostDetails.igst,
    }

  };

  return (
    <FormProvider {...methods}>
      <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}  >
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
              <th className="tableHeadFixed" >S.NO</th>
              {columns.map((column, index) => (
                <th className="tableHeadFixed"  key={index} style={{ "textAlign": column?.textAlign }} >{column.header}</th>
              ))}
              <th className="tableHeadFixed" >Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 && data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                <td>{rowIndex + 1}</td>
                {columns.map((column, colIndex) => {

                  if (column?.type == 'tag_pcs' && item?.isNotSaved === true) {
                    return (
                      <td key={colIndex} style={{ textAlign: column?.textAlign, }}>
                        <div style={{ width: "65px" }} >
                          <NumberInputField
                            register={register}
                            placeholder={column.header}
                            id={column.accessor + rowIndex}
                            value={item[column.accessor]}
                            isRequired={true}
                            min={"0"}
                            max={maxPiece}
                            setValue={setValue}
                            handleDot={false}
                            handleDecimalDigits={false}
                            decimalValues={0}
                            handleKeyDownEvents={false}
                            SetValue={(value) => {
                              let blc = getPcsValidation(rowIndex)
                              value = isNaN(parseFloat(value)) ? 0 : value;
                              console.log(parseFloat(value), parseFloat(blc), "asdfghjklkhjmgfds")
                              if (parseFloat(value) < parseFloat(blc)) {
                                handelChange(rowIndex, column.accessor, value);
                                clearErrors(column.accessor + rowIndex);
                              } else {
                                toastfunc("Pcs Should Lesser than or equal " + blc)
                                handelChange(rowIndex, column.accessor, blc);
                              }

                            }}
                            minError={column.header + " Should greater than or equal to 0"}
                            maxError={column.header + " Should greater than or equal to "}
                            reqValueError={column.header + " is Required"}
                            message={errors[column.accessor + rowIndex] && errors[column.accessor + rowIndex].message}
                          />
                        </div>
                      </td>
                    );
                  }
                  else if (column?.type == 'huid' && item?.isNotSaved === true) {
                    return (
                      <td key={colIndex} style={{ textAlign: column?.textAlign, }}>
                        <div style={{ width: "100px" }} >
                          <TextInputField
                            register={register}
                            placeholder={column.header}
                            id={column.accessor + rowIndex}
                            value={item[column.accessor]}
                            isRequired={(settings?.is_huid_required == 1)}
                            setValue={setValue}
                            SetValue={(value) => {
                              handelChange(rowIndex, column.accessor, value);
                              clearErrors(column.accessor + rowIndex);
                            }}
                            maxLength={6}
                            pattern={"/^[A-Za-z0-9]{6,7}$/"}
                            message={errors[column.accessor + rowIndex] && column.header + " is Required"}
                          />
                        </div>
                      </td>
                    );
                  }
                  else if (column?.type == 'huid2' && item?.isNotSaved === true) {
                    return (
                      <td key={colIndex} style={{ textAlign: column?.textAlign, }}>
                        <div style={{ width: "100px" }} >
                          <TextInputField
                            register={register}
                            placeholder={column.header}
                            id={column.accessor + rowIndex}
                            value={item[column.accessor]}
                            isRequired={false}
                            setValue={setValue}
                            SetValue={(value) => {
                              handelChange(rowIndex, column.accessor, value);
                              clearErrors(column.accessor + rowIndex);
                            }}
                            maxLength={6}
                            pattern={"/^[A-Za-z0-9]{6,7}$/"}
                          // message={errors[column.accessor + rowIndex] && column.header + " is Required"}
                          />
                        </div>
                      </td>
                    );
                  }
                  else if (column?.type == 'gross_wt' && item?.isNotSaved === true) {
                    return (
                      <td key={colIndex} style={{ textAlign: column?.textAlign, }}>
                        <div style={{ width: "100px" }} >
                          <NumberInputField
                            register={register}
                            placeholder="Gross weight"
                            id={column.accessor + rowIndex}
                            value={item[column.accessor]}
                            isRequired={true}
                            min={0}
                            max={''}
                            type={"number"}
                            setValue={setValue}
                            handleKeyDownEvents={true}
                            handleDecimalDigits={true}
                            decimalValues={3}
                            SetValue={(value) => {
                              let blc = getWeightValidation(rowIndex)
                              value = isNaN(parseFloat(value)) ? 0 : value;
                              console.log(parseFloat(value), parseFloat(blc))

                              if (parseFloat(value) < parseFloat(blc)) {
                                handelChange(rowIndex, column.accessor, value);
                                clearErrors(column.accessor + rowIndex);
                              } else {
                                toastfunc("Gross weight  Should Lesser than or equal " + blc)
                                handelChange(rowIndex, column.accessor, blc);
                              }
                            }}
                            minError={"Gross weight should less than or equal to 0"}
                            maxError={"Gross Weight greater than or equal to 0"}
                            reqValueError={"Gross weight is Required"}
                            message={errors[column.accessor + rowIndex] && errors[column.accessor + rowIndex].message}
                          />
                        </div>
                      </td>)
                  }
                  else if (column?.type == 'less_wt' && item?.isNotSaved === true) {
                    return (<td key={colIndex} style={{ textAlign: column?.textAlign, }}>
                      <div style={{ width: "85px" }} >
                        <LessWeightInputField
                          register={register}
                          placeholder="Less Weight"
                          id={column.accessor + rowIndex}
                          value={item[column.accessor]}
                          isRequired={false}
                          min={0}
                          uom={uom}
                          gross_weight={item.tag_gwt}
                          less_weight={item[column.accessor]}
                          clearErrors={clearErrors}
                          SetValue={(value) => {
                            handelChange(rowIndex, column.accessor, value)
                          }}
                          SetStnWeight={(value) => handelChange(rowIndex, 'tag_stn_wt', value)}
                          SetDiaWeight={(value) => handelChange(rowIndex, 'tag_dia_wt', value)}
                          SetStoneDetails={(value) => {
                            handelChange(rowIndex, 'stone_details', value)
                          }}
                          stone_details={item.stone_details}
                          ref={lessWeightRef}
                          message={errors[column.accessor + rowIndex] && errors[column.accessor + rowIndex].message}
                          isDisabled={false}
                          stone = {activeStoneList}
                          quality_code = {activeQualityCodeList}
                          iconfontSize="1px"
                        />
                      </div>
                    </td>)

                  } else if (column?.type == 'tag_sell_rate' && item?.isNotSaved === true) {
                    return (<td key={colIndex} style={{ textAlign: column?.textAlign, }}>
                      <div style={{ width: "100px" }} >
                        <NumberInputField
                          register={register}
                          placeholder="MRP Rate"
                          id={column.accessor + rowIndex}
                          value={item[column.accessor]}
                          isRequired={item.fixedRateCalc}
                          readOnly={!item.fixedRateCalc}
                          min={(item.fixedRateCalc ? 1 : 0)}
                          handleKeyDownEvents={true}
                          handleDecimalDigits={true}
                          decimalValues={2}
                          setValue={setValue}
                          SetValue={(value) => {
                            handelChange(rowIndex, 'tag_sell_rate', value);
                            clearErrors(column.accessor + rowIndex);
                          }}
                          minError={"MRP Rate should greater than 0"}
                          reqValueError={"MRP Rate is Required"}
                          message={errors[column.accessor + rowIndex] && errors[column.accessor + rowIndex].message}
                        />
                      </div>
                    </td>)

                  } else if (column?.type == 'tag_wastage_percentage' && item?.isNotSaved === true) {
                    return (<td key={colIndex} style={{ textAlign: column?.textAlign, }}>
                      <div style={{ width: "75px" }} >
                        <NumberInputField
                          register={register}
                          placeholder="V.A (%)"
                          id={column.accessor + rowIndex}
                          value={item.tag_wastage_percentage}
                          isRequired={true}
                          min={0}
                          max={100}
                          handleKeyDownEvents={true}
                          handleDecimalDigits={true}
                          decimalValues={2}
                          setValue={setValue}
                          SetValue={(value) => {
                            handelChange(rowIndex, "tag_wastage_percentage", value);
                            clearErrors(column.accessor + rowIndex);
                          }}
                          minError={"V.A (%) should greater than 0"}
                          maxError={"V.A (%) greater than or equal to 0"}
                          reqValueError={"V.A (%) is Required"}
                          message={errors[column.accessor + rowIndex] && errors[column.accessor + rowIndex].message}
                        />
                      </div>
                    </td>)

                  }
                  else if (column?.type == 'tag_mc_value' && item?.isNotSaved === true) {
                    return (<td key={colIndex} style={{ textAlign: column?.textAlign, }}>
                      <div style={{ width: "100px" }} >
                        <NumberInputField
                          register={register}
                          placeholder="Mc"
                          id={column.accessor + rowIndex}
                          value={item[column.accessor]}
                          isRequired={true}
                          min={0}
                          handleKeyDownEvents={true}
                          handleDecimalDigits={true}
                          decimalValues={2}
                          setValue={setValue}
                          SetValue={(value) => {
                            handelChange(rowIndex, column.accessor, value);
                            clearErrors(column.accessor + rowIndex);
                          }}
                          minError={"Mc Cannot Be Empty"}
                          reqValueError={"Mc is Required"}
                          message={errors[column.accessor + rowIndex] && errors[column.accessor + rowIndex].message}
                        />
                      </div>
                    </td>)

                  }

                  else if (column?.type == 'flat_mc_value' && item?.isNotSaved === true) {
                    return (<td key={colIndex} style={{ textAlign: column?.textAlign, }}>
                      <div style={{ width: "100px" }} >
                        <NumberInputField
                          register={register}
                          placeholder="Flat Mc"
                          id={column.accessor + rowIndex}
                          value={item[column.accessor]}
                          isRequired={true}
                          min={0}
                          handleKeyDownEvents={true}
                          handleDecimalDigits={true}
                          decimalValues={2}
                          setValue={setValue}
                          SetValue={(value) => {
                            handelChange(rowIndex, column.accessor, value);
                            clearErrors(column.accessor + rowIndex);
                          }}
                          minError={"Flat Mc Cannot Be Empty"}
                          reqValueError={"Flat Mc is Required"}
                          message={errors[column.accessor + rowIndex] && errors[column.accessor + rowIndex].message}
                        />
                      </div>
                    </td>)

                  }
                  else {
                    return (
                      <td key={colIndex} style={{ "textAlign": column?.textAlign }} >
                        {
                          column.isCurrency ? <CurrencyDisplay value={item[column.accessor]} /> : column.decimal_places ? parseFloat(item[column.accessor]).toFixed(column.decimal_places) : item[column.accessor]
                        }
                      </td>)
                  }

                })}
                <td>
                  {userInfo?.settings?.show_tagging_edit === true && (
                    <>
                      {onEdit && (
                        <Button
                          color="primary"
                          size="sm"
                          className="btn-icon btn-white btn-dim"
                          onClick={() => {
                            onEdit(rowIndex)
                          }}
                        >
                          <Icon name="edit" />
                        </Button>
                      )}
                    </>
                  )}


                  {onDelete && (
                    <Button
                      color="primary"
                      size="sm"
                      className="btn-icon btn-white btn-dim"
                      onClick={() => {
                        onDelete(rowIndex)
                      }}
                    >
                      <Icon name="trash-fill" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          {isTotalReq && (
            <tfoot style={{ position: 'sticky', bottom: 0, zIndex: 10, backgroundColor: '#fff' }}>
              <tr style={{ fontWeight: 'bold' }}>
                <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Total</td>
                {columns.map((column, index) => (
                  <td key={index} style={{ "textAlign": column?.textAlign, position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                    {column.isTotalReq ? column.isCurrency ? <CurrencyDisplay value={calculateTotal(column.accessor)} /> : (calculateTotal(column.accessor)) : ''}
                  </td>
                ))}
                <td style={{ position: 'sticky', bottom: 0, zIndex: 10, backgroundColor: '#fff' }}></td> {/* Empty cell for Action column in footer */}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </FormProvider>
  );
});

export default TaggingTable;
