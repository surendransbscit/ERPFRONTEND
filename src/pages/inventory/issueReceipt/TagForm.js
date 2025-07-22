import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import CurrencyDisplay from '../../../components/common/moneyFormat/moneyFormat';
import {
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import {
  Col,
  Row,
  Icon,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Label } from "reactstrap";
import IsRequired from "../../../components/erp-required/erp-required";
import { ActiveEmployeeDropdown, BranchDropdown,SectionDropdown } from "../../../components/filters/retailFilters";
import { useBranches,useAllLot, useEmployeeDropdown,useSections } from "../../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { NumberInputField, TextInputField } from "../../../components/form-control/InputGroup";
import { createTagIssueReceiptForm, getTagStockList } from "../../../redux/thunks/inventory";
import { employee_id } from "../../../redux/configs";



const TagDetailsIssueReceiptForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    reset,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading: issubmitting,
    tagStockList
  } = useSelector((state) => state.tagReducer);
  const { branches } = useBranches();
  const { lot } = useAllLot();
  const { employees } = useEmployeeDropdown();
  const { sections } = useSections();
  const [branch, setBranch] = useState();
  const [stockList, setStockList] = useState([]);
  const [filterCode, setFilterCode] = useState();
  const [Type, setType] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [lotId, setLotId] = useState();
  const [employee, setEmployee] = useState();
  const [sectionId, setSectionId] = useState();

  const { userInfo: { settings } } = useSelector((state) => state.authUserReducer);


  useEffect(()=>{
   if(tagStockList){
    setStockList(tagStockList);
   }
  },[tagStockList])

  useEffect(() => {
    if (employee_id !== undefined) {
      setEmployee(employee_id)
    }
  }, [employee_id])

  const getStockDetails = () => {
    let filter = ''
    if (branch) {
      const filters = {
        "section": sectionId,
        "status": Type,
        "code": filterCode,
        "branch": branch,
      }
      if(Type == 2 && filterCode ==""){
        toastfunc("Ref No Required !!");
        return;
      }else if (Type == 1 && !sectionId){
        toastfunc("Section Required !!");
        return;
      }
      if(Type == 2){
        filter = `code=${filterCode}&status=${Type}&branch=${branch}`
      }else{
        filter = `section=${sectionId}&branch=${branch}&status=${Type}`
      }
      dispatch(getTagStockList(filter));
    } else if (!branch) {
      toastfunc("Branch Required !!");
    }
    


  }
  const form_submit = async (data, actionType) => {
    if(Type == 1){
      let assignData = []
      console.log(assignData);
      stockList?.map((item, rowIndex) => {
        if (item.isChecked) {
          assignData.push({
            "tag": item.tag_id
          })
        }
      })
      if(!employee){
        toastfunc("Select a Employee !!");
      }
      if (assignData.length) {
  
        let data = {
          "id_branch": branch,
          "type":Type,
          "issue_employee":employee,
          "issue_details": assignData,
        }
        createStockApproval(data);
      } else {
        toastfunc(" Select Stock to approval")
      }
    }else{
      let assignData = []
      let id;
      console.log(assignData);
      stockList?.map((item, rowIndex) => {
        if (item.isChecked) {
          id = item.id;
          assignData.push({
            "id_detail":item.id_detail,
            "status":2,
          })
        }
      })
      if(!employee){
        toastfunc("Select a Employee !!");
      }
      if (assignData.length) {
  
        let data = {
          "id":id,
          "id_branch": branch,
          "type":Type,
          "receipt_employee":employee,
          "issue_details": assignData,
        }
        createStockApproval(data);
      } else {
        toastfunc(" Select Stock to approval")
      }

    }


  };

  const createStockApproval = async (data) => {
    try {
      let response = await dispatch(createTagIssueReceiptForm(data)).unwrap();
      console.log(response)
      reset_form();
    } catch (error) {
      let message = error?.response?.data?.message;
      toastfunc(message);
    }
  };

  const calculateTotal = (field) => {
    return stockList?.list?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };



  const handleDelete = (index) => {
    const updatedFormData = [...stockList];
    updatedFormData.splice(index, 1);
    setStockList(updatedFormData);
  };

  const selectAllCol = (value) => {
    stockList?.map((item, rowIndex) => {
      handelChange(rowIndex, 'isChecked', value)
    })

  }

  const handelChange = (index, field, value) => {
    setStockList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

  const reset_form = async () => {
    reset("");
    setStockList([]);
    setFilterCode("");
    setSectionId("");
  };


  const columns = [
    { header: "Tag Code", accessor: "tag_code", textAlign: "center" },
    { header: "Product", accessor: "product_name", textAlign: "center", customised: true },
    { header: "Pcs", accessor: "pieces", textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "gross_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Lwt", accessor: "less_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Nwt", accessor: "net_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    // { header: "Dia Wt", accessor: "dia_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    // { header: "Stone Wt", accessor: "stn_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },

  ];

  const setTagCode = (value, index) => {

    handelChange(index, 'tag_code', value);

  }

  const handleTagSearch = (index, value) => {

    let approval_data = assignStockList[index]

    let postData = {
      "tag_code": approval_data.tag_code,
      "id_stock_transfer": approval_data.id_stock_transfer,
    }

    let data = {
      "type": Type,
      'approval_data': [postData]
    }

    createStockApproval(data)
      .then(response => {
        console.log('Response:', response);
        let tag_details = response?.data

        let stock_downloded = response?.stock_downloded

        if (stock_downloded) {
          handelChange(index, 'stock_downloded', stock_downloded);
        }

        if (tag_details) {
          setTagCode('', index)
          setDownloadedStockList([...downloadedStockList, ...[tag_details]])
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });


  }




  return (
    <React.Fragment>
      <Head title="Approval" />
      <Content>
        <PreviewCard className="h-100">

          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb></ModifiedBreadcrumb>
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">

             

            <Button
                  color="primary"
                  size="md"
                  disabled={issubmitting}
                  onClick={()=>{
                    form_submit()
                  }}
                >
                Save[crtl+s]
                </Button>

             



              <SaveButton disabled={issubmitting} color="secondary" size="md"
                onClick={() => getStockDetails()}  >
                Search
              </SaveButton>

            </Col>
          </Row>


          <div className="custom-grid">
            <Row className="g-3 align-center form-control-sm">
              <Col lg="2">
                <Label>Type</Label>
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="approval"
                          type="radio"
                          name={"Type"}
                          value={"1"}
                          className="custom-control-input"
                          checked={Type == "1"}
                          onChange={(e) => {
                            setStockList([]);
                            setType(e.target.value);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="approval">
                          Issue
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="reciept"
                          type="radio"
                          value={"2"}
                          name={"Type"}
                          className="custom-control-input "
                          checked={Type == "2"}
                          onChange={(e) => {
                            setType(e.target.value);
                            setStockList([]);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="reciept">
                          Reciept
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Branch
                    <IsRequired />
                  </label>
                  <BranchDropdown
                    register={register}
                    id={"filterBranch"}
                    branches={branches}
                    selectedBranch={branch}
                    onBranchChange={(value) => {
                      setBranch(value);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.filterBranch && "Branch is Required"}
                  />
                </div>
              </Col>
              { Type == 1 && (
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Section
                    <IsRequired />
                  </label>
                  <SectionDropdown
                    register={register}
                    id={"sectionId"}
                    sectionOptions={sections}
                    selectedSection={sectionId}
                    onSectionChange={(value) => {
                      setSectionId(value);
                    }}
                    isRequired={false}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.lotId && "Section is Required"}
                />
                </div>
              </Col>
              )}
              { Type == 2 && (
                <Col lg="2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="selectedDesign">
                      Code
                    </label>
                    <TextInputField
                      register={register}
                      placeholder="Code"
                      id={"filterCode"}
                      value={filterCode}
                      isRequired={false}
                      type={"text"}
                      setValue={setValue}
                      SetValue={(value) => {
                        setFilterCode(value);
                        clearErrors("filterCode");
                      }}
                      message={errors.filterCode && errors.filterCode.message}
                    />
                  </div>
                </Col>
              )}

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    { Type == 2 ? "Receipt By":"Issue To"}
                    <IsRequired />
                  </label>
                  <ActiveEmployeeDropdown
                    register={register}
                    id={"employeeId"}
                    options={employees}
                    selectedEmployee={employee}
                    onEmployeeChange={(value) => {
                        setEmployee(value);
                    }}
                    isRequired={false}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.employeeId && "Employee is Required"}
                />
                </div>
              </Col>

            </Row>


            <Row className="mt-2" md={12}>
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>S.NO  <input type="checkbox" onChange={(event) => {
                        selectAllCol(event.target.checked);
                        setSelectAll(event.target.checked);
                      }} checked={selectAll} /> </th>
                      {columns.map((column, index) => {
                       
                          return (
                            <th key={index} style={{ "textAlign": column?.textAlign }} >
                              {column.header}</th>
                          )

                      })}
                      <th>Action</th>

                    </tr>
                  </thead>
                  <tbody>
                    {stockList?.length > 0 && stockList?.map((item, rowIndex) => (
                      <tr key={rowIndex} >
                        <td>{rowIndex + 1} <input type="checkbox" onChange={(event) => { handelChange(rowIndex, 'isChecked', event.target.checked); }} checked={item.isChecked} /> </td>
                        {columns?.map((column, colIndex) => {

                            return (
                              <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                                {
                                  column.isCurrency
                                    ? <CurrencyDisplay value={item[column.accessor]} />
                                    : column.decimal_places
                                      ? parseFloat(item[column.accessor]).toFixed(column.decimal_places)
                                      : item[column.accessor]
                                }
                              </td>
                            );
                          

                          // Return null if no conditions are met (optional)
                        })}

                        <td>
                          <Button
                            color="primary"
                            size="sm"
                            className="btn-icon btn-white btn-dim"
                            onClick={() => handleDelete()}
                          >
                            <Icon name="trash-fill" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr style={{ fontWeight: 'bold' }}>
                      <td>Total</td>
                      {columns.map((column, index) => {

                            return (<td key={index} style={{ "textAlign": column?.textAlign }}>
                              {column.isTotalReq ? column.isCurrency ? <CurrencyDisplay value={calculateTotal(column.accessor)} /> : (calculateTotal(column.accessor)) : ''}
                            </td>)
                      
                        }
                      )}

                    </tr>
                  </tfoot>

                </table>
              </div>
            </Row>

          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default TagDetailsIssueReceiptForm;
