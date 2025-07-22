import React, { useEffect, forwardRef, useImperativeHandle,useState } from "react";
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledButtonDropdown } from "reactstrap";
import { useForm, FormProvider } from "react-hook-form";
import { TextInputField } from "../../form-control/InputGroup";
import { useSelector,useDispatch} from "react-redux";
import { toastfunc } from "../../sds-toast-style/toast-style";
import { getReturnDetails } from "../../../redux/thunks/billing";
import PreviewTable from "../../sds-table/PreviewTable";
import DeleteModal from "../../modals/DeleteModal";
import { Icon } from "../../Component";
import { getAllFinancialYear } from "../../../redux/thunks/retailMaster";


// The forwardRef function takes a render function as an argument.
// This render function receives the props and ref as arguments.

const ReturnForm = forwardRef((props,ref) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billNo,setBillNo] = useState("");
  const [finYear,setFinYear] = useState("");
  const [finYearName,setFinYearName] = useState("");
  const [returnData,setReturnData] = useState([]);
  const [returnAmount,setReturnAmount] = useState(0);
  const [dueAmount,setDueAmount] = useState(0);
  const [delId, SetDelId] = useState();
  const [deleteModal, SetDeleteModal] = useState(false);
  const [modalActionName, SetModalActionName] = useState("");
  const toggle = () => SetDeleteModal(!deleteModal);
  const { financialYearList } = useSelector((state) => state.financialYearReducer);
  const {userInfo} = useSelector((state) => state.authUserReducer);
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const methods = useForm();

  const columns = [
    { 'header': 'Product', 'accessor': 'product_name','textAlign':'center'},
    { 'header': 'Piece', 'accessor': 'pieces' ,decimal_places:0,'textAlign':'right',isTotalReq: true},
    { 'header': 'Gwt', 'accessor': 'gross_wt' ,decimal_places:3,'textAlign':'right',isTotalReq: true},
    { 'header': 'Lwt', 'accessor': 'less_wt' ,decimal_places:3,'textAlign':'right',isTotalReq: true},
    { 'header': 'Nwt', 'accessor': 'net_wt' ,decimal_places:3,'textAlign':'right',isTotalReq: true},
    { 'header': 'VA', 'accessor': 'wastage_weight' ,decimal_places:3,'textAlign':'right',isTotalReq: true},
    { 'header': 'MC', 'accessor': 'mc_value' ,decimal_places:2,'textAlign':'right',isTotalReq: true,"isCurrency":true},
    { 'header': 'Taxable', 'accessor': 'taxable_amount' ,decimal_places:2,'textAlign':'right',isTotalReq: true,"isCurrency":true},
    { 'header': 'Tax(%)', 'accessor': 'tax_percentage' ,decimal_places:2,'textAlign':'right'},
    { 'header': 'Item Cost', 'accessor': 'item_cost' ,decimal_places:2,'textAlign':'right',isTotalReq: true,"isCurrency":true},
  ];
 
  useImperativeHandle(ref, () => ({
    submit: handleSubmit((data) => {
      
      
    }),
    resetForm: () => {
      
    },
  }));

  useEffect(()=>{
    setFinYear(props?.finYear);
    setFinYearName(props?.finYearName);
  },[props?.finYear,props?.finYearName])



  const handleBillSearch = () =>{
    if(props?.idBranch==='' || props?.idBranch===null){
        toastfunc("Please Select the Branch..");
    }
    else if(props?.customer==='' || props?.customer===null)
    {
        toastfunc("Please Select the Customer..");
    }
    else if(billNo===''){
        toastfunc("Please enter the Bill No..");
    }
    else{
        getTagDetails();
    }
  }

  const getTagDetails = async(tagCode) => {
    try {
        let requestData = {"fin_year_id":finYear,"bill_no":billNo,"id_branch":props?.idBranch,"id_customer":props?.customer};
        const response = await dispatch(getReturnDetails(requestData)).unwrap();
        const salesDetails = response.data.sales_details;
        const invoice_data = response.data.invoice_data;
        let allowSalesReturn = true;
        if(userInfo.settings?.sales_return_limit){
            if(parseInt(userInfo.settings?.sales_return_limit_days) < parseInt(invoice_data.days_difference)){
               allowSalesReturn = false;
                toastfunc("Unable to Do Sales return for this bill.Maximum sales return days is "+userInfo.settings?.sales_return_limit);
            }
        }
        if(allowSalesReturn){
          let due_amount = invoice_data.due_amount;
          setDueAmount(due_amount);
          salesDetails.forEach(response => {
              const estItemDetails = returnData?.filter((result) => result.invoice_sale_item_id===response.invoice_sale_item_id);
              let itemExists = false;
              if(estItemDetails.length > 0)
              {
                  itemExists = true;
                  toastfunc("Item already Exists");
              } 
              if(!itemExists)
              {
                  setReturnData(prevData => [...prevData, response]);
              }
          });
      }
        
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{
    if(returnData.length===0){
        setDueAmount(0);
    }
    const itemCost = returnData.reduce((sum, item) => sum + parseFloat(item.item_cost || 0), 0);
    let returnAmount = parseFloat(parseFloat(dueAmount)-parseFloat(itemCost)).toFixed(2);
    if(parseFloat(returnAmount)<0){
        returnAmount = parseFloat(returnAmount*-1);
    }
    setReturnAmount(returnAmount);
  },[dueAmount,returnData])

  const handlesDelete = (index) => {
    SetModalActionName("delete");
    SetDeleteModal(true);
    SetDelId(index);
  };

  const deleteSaleItem = (index)=>{
    const updatedFormData = [...returnData];
    updatedFormData.splice(index, 1);
    setReturnData(updatedFormData);
    toggle();
  }

  useEffect(() => {
    //if(returnData.length > 0){
      props?.onUpdateReturnItemData(returnData);
      props?.handleReturnItemCost(returnAmount)
    //}
    
  }, [props,returnData,returnAmount]);



  const handleOptionSelectChange = (value,fin_year_name) => {
    setFinYear(value);
    setFinYearName(fin_year_name);
  };





 

  return (
    <React.Fragment>
        <FormProvider {...methods}>
        <Row md={12} className={"form-control-sm"}>
            <Col md={4} className="form-control-sm">
                <div className="form-control-wrap">
                    <div className="input-group">

                    <UncontrolledButtonDropdown className="input-group-append">
                      <DropdownToggle tag="button" className="btn btn-outline-primary btn-dim dropdown-toggle">
                        <span>{finYearName}</span>
                        <Icon name="chevron-down" className="mx-n1"></Icon>
                      </DropdownToggle>
                      <DropdownMenu>
                        <ul className="link-list-opt no-bdr">
                          {financialYearList.rows?.map((option) => (
                            <li key={option.fin_id}>
                              <DropdownItem key={option.fin_id} onClick={() => handleOptionSelectChange(option.fin_id,option.fin_year_name)}>
                                {option.fin_year_name}
                              </DropdownItem>
                            </li>
                          ))}
                        </ul>
                      </DropdownMenu>
                    </UncontrolledButtonDropdown>

                        <TextInputField
                            register={register}
                            isRequired={true}
                            id={"billNo"}
                            placeholder="Bill No"
                            value={billNo}
                            SetValue={(value) => {
                                setBillNo(value);
                            }}
                        />
                        <div className="input-group-append">
                            <Button outline color="primary" className="btn-dim"  onClick={handleBillSearch}>
                                Search
                            </Button>
                        </div>
                    </div>
                </div> 
            </Col>
        </Row>
        <Row md={12}>
            <PreviewTable columns={columns}  data={returnData}  onDelete={handlesDelete} onEdit = {""}  />
        </Row>
        </FormProvider>
     <DeleteModal
     actionName={"Delete"}
     modal={deleteModal}
     toggle={toggle}
     name={"Item"}
     title={"Billing"}
     clickAction={deleteSaleItem}
     />
     </React.Fragment>
  );
});

export default ReturnForm;
