import React, { useEffect, useState } from "react";
import { Button, Col, Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import { NumberInputField, Row } from "../Component";
import { DesignDropdown,ProductDropdown, SupplierDropdown } from "../filters/retailFilters";
import { useForm } from "react-hook-form";
import { toastfunc } from "../sds-toast-style/toast-style";
import { useSelector,useDispatch } from "react-redux";
import { getTagSearchDetails } from "../../redux/thunks/inventory";

const TagSearchModal = ({ idBranch,isOpen,modal, toggle, onSave,initialFormData,metal,selectedItemDetails}) => {
 const dispatch = useDispatch();
 const { activeProductList } = useSelector((state) => state.productReducer);
 const { activeDesignMappingList } = useSelector((state) => state.designReducer);
 const { activeKarigarList } = useSelector((state) => state.karigarReducer);
 const {userInfo: { settings }} = useSelector((state) => state.authUserReducer);
 const {
     register,
     formState: { errors },
     setValue,
     clearErrors,
   } = useForm();

const [selectedProduct,setSelectedProduct] = useState("");
const [selectedDesign,setSelectedDesign] = useState("");
const [selectSupplier,setSelectSupplier] = useState("");
const [fromWeight,setFromWeight] = useState("");
const [toWeight,setToWeight] = useState("");
const [tagDetails,setTagDetails] = useState([]);

const handelTagSearch = () =>{
    if(selectedProduct=='' || selectedProduct==null){
        toastfunc("Please Select The Product");
    }
    if(idBranch=='' || idBranch==null){
        toastfunc("Please Select The Branch");
    }
    else{
        getTagDetails();
    }

}

const getTagDetails = async () => {
    try {
      let tagDetails = [];
        let requestData = { 
            branch : idBranch,
            selectedProduct: selectedProduct, 
            selectedDesign: selectedDesign,
            selectSupplier : selectSupplier,
            fromWeight : fromWeight,
            toWeight : toWeight
        };
        let response = {};
        response = await dispatch(getTagSearchDetails(requestData)).unwrap();
        setTagDetails(response.data.length > 0 ? response.data : []);
        
        
    }
    catch (error) {
      console.error(error);
      setTagDetails([]); 
    }
  };

  const handelChange = (index, field, value) => {
    setTagDetails((prevValues) => {
        const updatedValues = [...prevValues];
        const updatedObject = { ...updatedValues[index] };
        let updateValue = {[field]: value}
        updatedValues[index] = { ...updatedObject, ...updateValue };
        console.log(updateValue)
        return updatedValues;
      });
  }

  const selectAll = (value) => {
    const updatedData = tagDetails.map(item => ({
      ...item,
      isChecked: value
    }));
    setTagDetails(updatedData);
  }

  const updateTagSearchDetails = () =>{
    let selectedTagDetails = tagDetails.filter((item) => item.isChecked);
    let tagSelectedDetails = [];
    let allowAdd = true;
    selectedTagDetails.forEach(response => {
        if(settings?.is_metal_wise_billing == '1'){
                let product = activeProductList.find((item)=> item.pro_id == response.tag_product_id);
                if(metal == product.id_metal )
                {
                    allowAdd = true;
                }
        
        }
        if (allowAdd){
            let tagResult = {
              ...response,
              id_product: response.tag_product_id,
              id_design: response.tag_design_id,
              id_purity: response.tag_purity_id,
              id_sub_design: response.tag_sub_design_id,
              id_section: response.tag_section_id,
              pieces:response.tag_pcs,
              gross_wt:response.tag_gwt,
              net_wt:response.tag_nwt,
              less_wt:response.tag_lwt,
              stone_wt:response.tag_stn_wt,
              dia_wt:response.tag_dia_wt,
              other_metal_wt:response.tag_other_metal_wt,
              wastage_weight:response.tag_wastage_wt,
              wastage_percentage:response.tag_wastage_percentage,
              mc_value:response.tag_mc_value,
              mc_type:response.tag_mc_type,
              sell_rate:response.tag_sell_rate, 
            }
            
            tagSelectedDetails.push(tagResult);
          }
    });
    selectedItemDetails(tagSelectedDetails);
    setTagDetails([]);
    toggle();
  }

  return (
    <Modal
      isOpen={modal}
      className="modal-dialog-centered text-center"
      size="xl"
      style={{ width: "80%" }}
    >
      <ModalBody className="text-center ">
        <div className="form-group">
            <Row md={12} className={"form-group row"} >
                <Col md={3} className="form-control-sm">
                    <div className="col-md-2">
                    <Label>Product</Label>
                    </div>
                    <ProductDropdown
                        register={register}
                        id={"selectedProduct"}
                        products={activeProductList}
                        selectedProduct={selectedProduct}
                        onProductChange={(value) => {
                            setSelectedProduct(value);
                            setSelectedDesign("");
                        }}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                    ></ProductDropdown>
                </Col>
                <Col md={2} className="form-control-sm">
                    <div className="col-md-2">
                    <Label>Design</Label>
                    </div>
                    <DesignDropdown
                        register={register}
                        id={"selectedDesign"}
                        designs={activeDesignMappingList}
                        selectedProduct={selectedProduct}
                        selectedDesign={selectedDesign}
                        onDesignChange={(value) => {
                            setSelectedDesign(value);
                        }}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                    ></DesignDropdown>
                    
                </Col>
                <Col md={2} className="form-control-sm">
                    <div className="col-md-2">
                    <Label>Supplier</Label>
                    </div>
                    <SupplierDropdown
                        register={register}
                        isRequired={true}
                        id={"supplier"}
                        selectedSupplier={selectSupplier}
                        supplier={activeKarigarList}
                        setValue={setValue}
                        onSupplierChange={(value) => {
                          setSelectSupplier(value);
                        }}
                        clearErrors={clearErrors}
                        placeholder={"Supplier"}
                    ></SupplierDropdown>
                    
                </Col>
                <Col md={2} className="form-control-sm">
                    <div className="col-md-8">
                        <Label>From Weight</Label>
                    </div>
                    <NumberInputField
                        placeholder="From Weight"
                        id={"fromWeight"}
                        value={fromWeight}
                        isRequired={false}
                        min={0}
                        type={"number"}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={0}
                        SetValue={(value) => {
                            setFromWeight(value);
                        }}
                        register={register}
                        />
                </Col>
                <Col md={2} className="form-control-sm">
                    <div className="col-md-8">
                        <Label>To Weight</Label>
                    </div>
                    <NumberInputField
                        placeholder="To Weight"
                        id={"toWeight"}
                        value={toWeight}
                        isRequired={false}
                        min={0}
                        type={"number"}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={0}
                        SetValue={(value) => {
                            setToWeight(value);
                        }}
                        register={register}
                        />
                </Col>
                <Col md={1}>
                <br></br>
                <Button
                    size="md"
                    color="secondary"
                    onClick={handelTagSearch}
                    >
                    Filter
                    </Button>
                </Col>
            </Row>
        </div>
        
        <Row md={12}>
            <div className="table-responsive" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <table className="table table-bordered" style={{ marginBottom: 0 }}>
                    <thead className="thead-light" style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                    <tr>
                        <th style={{ backgroundColor: '#f8f9fa' ,textAlign: 'left'}}>
                           
                            <input
                                type="checkbox"
                                onChange={(event) => {
                                selectAll(event.target.checked);
                                }}
                            />  Tag No
                        </th>
                        <th style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>Product</th>
                        <th style={{ backgroundColor: '#f8f9fa', textAlign: 'left'  }}>Design</th>
                        <th style={{ backgroundColor: '#f8f9fa', textAlign: 'right' }}>Gwt</th>
                        <th style={{ backgroundColor: '#f8f9fa', textAlign: 'right' }}>Nwt</th>
                        <th style={{ backgroundColor: '#f8f9fa', textAlign: 'right'}}>V.A(%)</th>
                        <th style={{ backgroundColor: '#f8f9fa', textAlign: 'left'}}>Supplier</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tagDetails.length > 0 &&
                        tagDetails.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                            <td style={{ textAlign: 'left' }}>
                            <input
                                type="checkbox"
                                checked={item['isChecked']}
                                onChange={(e) => handelChange(rowIndex, 'isChecked', e.target.checked)}
                            />{" "}
                            {item?.tag_code}
                            </td>
                            <td style={{ textAlign: 'left' }}>{item?.product_name}</td>
                            <td style={{ textAlign: 'left' }}>{item?.design_name}</td>
                            <td style={{ textAlign: 'right' }}>{item?.tag_gwt}</td>
                            <td style={{ textAlign: 'right' }}>{item?.tag_nwt}</td>
                            <td style={{ textAlign: 'right' }}>{item?.tag_wastage_percentage}</td>
                            <td style={{ textAlign: 'left' }}>{item?.supplier_name}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </Row>
      </ModalBody>
        <ModalFooter>
            <Button
            size="md"
            color="primary"
            onClick={updateTagSearchDetails}
            >
            Save
            </Button> 
            <Button
            size="md"
            color="danger"
            onClick={toggle}
            >
            Cancel
            </Button>
        </ModalFooter>
    </Modal>
  );
};

export default TagSearchModal;
