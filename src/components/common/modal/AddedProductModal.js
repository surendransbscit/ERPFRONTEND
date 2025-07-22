import React, { useEffect, useState } from "react";
import {Modal,ModalBody,ModalHeader,ModalFooter } from "reactstrap";
import { useForm } from 'react-hook-form';
import { Col, Row,CancelButton, Icon, SaveButton } from "../../Component";
import IsRequired from "../../../components/erp-required/erp-required";
import { useProducts } from "../../filters/filterHooks";
import { ProductDropdown} from "../../filters/retailFilters";
import { NumberInputField } from "../../form-control/InputGroup";
import { calculateOtherMetalAmount, isUndefined } from "../calculations/ErpCalculations";
import PreviewTable from "../../sds-table/PreviewTable";
import { toastfunc } from "../../sds-toast-style/toast-style";
function AddedProductForm({ isOpen, toggle,onSave,initialItemDetails,...props}) {
    
  const { register,handleSubmit, formState: { errors },clearErrors,setValue,reset} = useForm();
  const { products } = useProducts();
  const [formData, setFormData] = useState([]);
  const itemDetailsInitialState = {
    "id_product":"",
    "product_name":"",
    "pieces":"0",
    "weight":"0.000"
  }
  const [ itemDetails, setItemDetails] = useState(itemDetailsInitialState);
  const [editIndex, setEditIndex] = useState(null);

  const columns = [
    { header: 'Product Name', accessor: 'product_name'},
    { header: 'Pcs', accessor: 'pieces',decimal_places:0,"textAlign":"right","isTotalReq":true,"isCurrency":false},
    { header: 'Weight', accessor: 'weight',decimal_places:3 ,"textAlign":"right","isTotalReq":true},
  ];

  const reset_form = ()=>{
    setItemDetails(itemDetailsInitialState);
    clearErrors(); // Clear all errors
    reset();
  };

  const handelChange = (field, value) => {
    setItemDetails((prevValues) => ({ ...prevValues, [field]: value }));
    // setLastTabIndex(lastTabIndex+1);
  };

  
  //Add items to preview and clear the form
  const addToPreview = async (data) => {
    const productDetails = products.find((pro) => pro.pro_id === data.id_product);
    const newItem = {
      'product_name': productDetails?.product_name,
      'pieces': isUndefined(data.pieces),
      'weight': isUndefined(data.weight),
      'id_product': data.id_product,
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
    setItemDetails(item)
  };

  const handleDelete = (index) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
  };

  const handleSave = () => {
    let totalWeight = 0;
    formData.forEach((val) => {
      totalWeight += parseFloat(val.weight);
    });
    if(parseFloat(totalWeight)>parseFloat(props.totalWeight))
    {
        toastfunc("Metal weight is exceed than The Tested Weight");
    }else{
        onSave(formData,props?.selectedItem,totalWeight);
        reset_form();
        setFormData([]);
        toggle();
    }
  };

  useEffect(() => {
    setValue('formData', JSON.stringify(formData));
  }, [formData, setValue]);

  useEffect(() => {
    if (isOpen) {
        if(initialItemDetails!==undefined){
            setFormData(initialItemDetails);
        }
    }
  }, [isOpen, initialItemDetails]);


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
          <span style={{ fontSize: "small" }}>Product Details</span>
        </ModalHeader>
        <ModalBody>
        <Row lg={12} className={"form-control-sm"}>
          <Col md={12}>
            <div className="custom-grid">
             
              <Row className="form-group row g-4">
                <Col md="3">
                      <div className="form-group">
                      <label className="form-label" htmlFor="site-name">
                          Product<IsRequired/>
                      </label>
                      </div>
                  </Col>
                  <Col md="9">
                  <ProductDropdown
                        register={register}
                        id={"id_product"}
                        products={products}
                        selectedProduct={itemDetails.id_product}
                        onProductChange={(value) => {
                          handelChange('id_product', value)
                        }}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors["id_product"] && "Product is Required"}
                      />
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
                          placeholder={"Pieces"}
                          id={"pieces"}
                          value={itemDetails.pieces}
                          minValue={0}
                          type={"number"}
                          isRequired={true}
                          SetValue={(value)=>{
                            handelChange('pieces', value)
                          }}
                          setValue={setValue}
                          clearErrors={clearErrors}
                          reqValueError={"Pcs is Required"}
                          handleKeyDownEvents={true}
                          handleDot={true}
                        ></NumberInputField>  
                        {errors?.pieces && (<span className="text-danger">{errors?.pieces.message}</span>)}
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
                        value={itemDetails.weight}
                        type={"number"}
                        isRequired={true} 
                        min={0}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={3}
                        SetValue={(value) => {
                           handelChange('weight', value)

                            clearErrors("weight");
                        }}
                        minError={"Weight Should Be Grater Than 0"}
                        requiredMessage={"Weight is Required"}
                    />
                    {errors?.weight && (<span className="text-danger">{errors?.weight.message}</span>)}
                </Col>
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

export default AddedProductForm