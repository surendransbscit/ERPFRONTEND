import React, { useEffect, useState, useContext } from "react";
import Content from "../../../../layout/content/Content";
import Head from "../../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
  TooltipComponent,
} from "../../../../components/Component";
import moment from "moment";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getAllProject,
  createProject,
  updateProjectById,
  getProjectById,
} from "../../../../redux/thunks/adminProject";
import { toastsuccess } from "../../../../components/sds-toast-style/toast-style";
import {
  Col,
  Icon,
  NumberInputField,
  Row,
  SwitchInputField,
  TextInputField,
  DateInputField,
} from "../../../../components/Component";
import IsRequired from "../../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  useMasterClient,
  useMasterProduct,
  useModuleMaster,
} from "../../../../components/filters/filterHooks";
import {
  MasterClientDropdown,
  MasterModuleDropdown,
  MasterProductDropdown,
} from "../../../../components/filters/retailFilters";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../../contexts/WordTransformerContexts";
import EmployeeDropdownMulti from "../../../../components/common/dropdown/EmployeeDropdownMulti";
import { useEmployeeDropdown } from "../../../../components/filters/filterHooks";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "reactstrap";


const PerformanceInvoiceForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.projectReducer
  );
  const { projectInfo } = useSelector((state) => state.projectReducer);

  const [client, setClient] = useState();
  const [product, setProduct] = useState();
  const [data, setData] = useState([]);

  const { clientOptionList } = useMasterClient();

  const { masterProductOptionList } = useMasterProduct();

  const { moduleOptionList } = useModuleMaster();


  const postData = async () => {
    const adddata = {
      client_id: client,
      id_product: product
    };
    try {
      await dispatch(createProject(adddata)).unwrap();
      toastsuccess("Performance Invoice saved successfully");
      navigate(`${process.env.PUBLIC_URL}/admin/master/PerformanceInvoice/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      client_id: client,
      id_product: product
    };
    try {
      await dispatch(createProject(adddata)).unwrap();
      toastsuccess("Performance Invoice created successfully");
      setClient("");
      setProduct("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getProjectById(id));
  }, [dispatch, id]);
  console.log(projectInfo);

  useEffect(() => {
    if (projectInfo != null) {

      reset();
    }
  }, [projectInfo, reset]);

  const putData = async () => {
    const adddata = {
      client_id: newData,
      id_product: updatedData
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    console.log(reduxData);

    try {
      await dispatch(updateProjectById(reduxData)).unwrap();
      toastsuccess("Performance Invoice Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/admin/master/PerformanceInvoice/list`);
    } catch (error) {
      console.error(error);
    }
  };
const handleDelete = (index) => {
  const newData = [...data];
  newData.splice(index, 1); 
  setData(newData);   
};

  // const columns = [
  //   { header: "Module", accessor: "id_module", textAlign: "center" },
  //   { header: "Payment Amt.", accessor: "id_product", textAlign: "center" },
  // ];

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        if (id !== undefined) {
          handleSubmit(putData)();
        } else {
          handleSubmit(postData)();
        }
      }, 0);
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  return (
    <React.Fragment>
      <Head title={title ? title : "Performance Invoice"} />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
            <Col md={5}>
              <ModifiedBreadcrumb></ModifiedBreadcrumb>
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <SaveButton size="md" color="primary" onClick={() => putData()}>
                {issubmitting ? "Saving" : "Save"}
              </SaveButton>

              <SaveButton color="secondary" size="md" onClick={() => postData()}>
                Search
              </SaveButton>
            </Col>
          </Row>

          <div className="custom-grid">
            <Row className="g-3 form-control-sm align-center">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="uom_id">
                    Client
                    <IsRequired />
                  </label>

                  <MasterClientDropdown
                    register={register}
                    id={"client"}
                    masterClients={clientOptionList}
                    selectedMasterClients={client}
                    onMasterClientsChange={(val) => {
                      setClient(val);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.client && "Client is Required"}
                  />
                </div>
              </Col>

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="uom_id">
                    Master Product
                    {/* <IsRequired /> */}
                  </label>

                  <MasterProductDropdown
                    register={register}
                    id={"product"}
                    masterProducts={masterProductOptionList}
                    selectedMasterProducts={product}
                    onMasterProductsChange={(val) => {
                      setProduct(val);
                    }}
                    isRequired={false}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.product && "Product is Required"}
                  />
                </div>
              </Col>
            </Row>

            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-center border">S.No</th>
                  <th className="px-4 py-2 text-center border">Module</th>
                  <th className="px-4 py-2 text-center border">Payment Amt.</th>
                  <th className="px-4 py-2 text-center border">Action</th>
                </tr>
              </thead>
              
{data.length > 0 && (
  <tbody>
    {data.map((row, index) => (
      <tr key={index} className="border-t text-center">
        <td className="px-4 py-2 border">{index + 1}</td>

        <td className="px-4 py-2 border">
          <MasterModuleDropdown
            register={register}
            id={`module-${index}`}  
            masterModule={moduleOptionList}
            selectedMasterModule={row.id_module} 
            onMasterModuleChange={(val) => {
              const updatedData = [...data];
              updatedData[index].id_module = val;

              const selectedModule = moduleOptionList.find(
                (m) => m.id_module === val
              );
              updatedData[index].id_product = selectedModule?.payment_amount ?? "";
              setData(updatedData);
            }}
            isRequired={true}
            clearErrors={clearErrors}
            setValue={setValue}
            message={errors[`module-${index}`] && "Module is Required"}
          />
        </td>



        <td className="px-4 py-2 border">
          <input
            type="text"
            className="form-control w-full px-2 py-1 border border-gray-300 rounded"
            value={row.id_product}
            onChange={(e) => {
              const updatedData = [...data];
              updatedData[index].id_product = e.target.value;
              setData(updatedData);
            }}
          />
        </td>

        <td className="px-4 py-2 border text-center freeze-col">
          <Button
            color="primary"
            size="sm"
            className="btn-icon btn-white btn-dim"
            onClick={() => handleDelete(index)} // use `index`, not `rowIndex`
          >
            <TooltipComponent
              containerClassName="btn btn-sm btn-icon btn-trigger"
              icon="trash-fill"
              direction="top"
              id={`delete_tooltip_${index}`}
              text={"Delete"}
            />
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
)}

            </table>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default PerformanceInvoiceForm;


// const data = [
//   { id_module: "MOD001", id_product: "₹1000" },
//   { id_module: "MOD002", id_product: "₹1500" },
// ];