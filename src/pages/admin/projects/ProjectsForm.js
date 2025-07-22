import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import moment from "moment";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getAllProject,
  createProject,
  updateProjectById,
  getProjectById,
} from "../../../redux/thunks/adminProject";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Icon,
  NumberInputField,
  Row,
  SwitchInputField,
  TextInputField,
  DateInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  useMasterClient,
  useMasterProduct,
} from "../../../components/filters/filterHooks";
import {
  MasterClientDropdown,
  MasterProductDropdown,
} from "../../../components/filters/retailFilters";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import EmployeeDropdownMulti from "../../../components/common/dropdown/EmployeeDropdownMulti";
import { useEmployeeDropdown } from "../../../components/filters/filterHooks";


const ProjectsForm = () => {
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
  const [name, setName] = useState();
  const [code, setCode] = useState();
  const [start_date, setStart_date] = useState(new Date());
  const [approx_end_date, setapprox_end_date] = useState(new Date());
  const [final_cost, setFinal_cost] = useState();
  const [closed_date, setClosed_date] = useState(new Date());
  const [team_members, setTeam_members] = useState([]);
  const { employees } = useEmployeeDropdown();


  const { clientOptionList } = useMasterClient();

  const { masterProductOptionList } = useMasterProduct();

  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      project_name: name,
      client_id: client,
      id_product: product,
      project_code: code,
      final_cost: final_cost,
      start_date: moment(start_date).format("YYYY-MM-DD"),
      approx_end_date: moment(approx_end_date).format("YYYY-MM-DD"),
      closed_date: moment(closed_date).format("YYYY-MM-DD"),
      team_members: team_members,
    };
    try {
      await dispatch(createProject(adddata)).unwrap();
      toastsuccess("Projects added successfully");
      navigate(`${process.env.PUBLIC_URL}/admin/master/projects/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      project_name: name,
      client_id: client,
      id_product: product,
      project_code: code,
      final_cost: final_cost,
      start_date: moment(start_date).format("YYYY-MM-DD"),
      approx_end_date: moment(approx_end_date).format("YYYY-MM-DD"),
      closed_date: moment(closed_date).format("YYYY-MM-DD"),
      team_members: team_members,
    };
    try {
      await dispatch(createProject(adddata)).unwrap();
      toastsuccess("Projects added successfully");
      setName("");
      setClient("");
      setProduct("");
      setCode("");
      setFinal_cost("");
      setStart_date(new Date());
      setapprox_end_date(new Date());
      setClosed_date(new Date());
      setTeam_members();
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
      setName(projectInfo?.project_name);
      setClient(projectInfo?.client_id);
      setProduct(projectInfo?.id_product);
      setCode(projectInfo?.project_code);
      setFinal_cost(projectInfo?.final_cost);
      setStart_date(moment(projectInfo?.start_date).toDate()),
        setapprox_end_date(moment(projectInfo?.approx_end_date).toDate()),
        setClosed_date(moment(projectInfo?.closed_date).toDate()),
        setTeam_members(projectInfo?.team_members);
      reset();
    }
  }, [projectInfo, reset]);

  const putData = async () => {
    const adddata = {
      project_name: name,
      client_id: client,
      id_product: product,
      project_code: code,
      final_cost: final_cost,
      start_date: moment(start_date).format("YYYY-MM-DD"),
      approx_end_date: moment(approx_end_date).format("YYYY-MM-DD"),
      closed_date: moment(closed_date).format("YYYY-MM-DD"),
      team_members: team_members,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    console.log(reduxData);

    try {
      await dispatch(updateProjectById(reduxData)).unwrap();
      toastsuccess("Projects Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/admin/master/projects/list`);
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
      if (add === undefined && id === undefined) {
        navigate(`${process.env.PUBLIC_URL}/admin/master/projects/list`);
      }
    }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Projects"} />
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
            {add !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postAndCreateNew(data, "saveAndNew")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton>

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) => postData(data, "saveAndClose"))}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/admin/master/projects/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(putData)}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/admin/master/projects/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Project Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"name"}
                    placeholder="Project Name"
                    value={name}
                    SetValue={(value) => {
                      setName(transformWord(value));
                      clearErrors("Name");
                    }}
                    message={errors.name && " Project name is required"}
                  />
                </div>
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="code">
                    Project Code
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    id={"code"}
                    placeholder="Project Code"
                    value={code}
                    SetValue={(value) => {
                      setCode(transformWord(value));
                      clearErrors("code");
                    }}
                    message={errors.code && " Project code is required"}
                  />
                </div>
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="final_cost">
                    Final Cost
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <NumberInputField
                    register={register}
                    isRequired={false}
                    id={"final_cost"}
                    placeholder="Final Cost"
                    value={final_cost}
                    min={0}
                    max={""}
                    maxLength={8}
                    setValue={setValue}
                    SetValue={(value) => {
                      setFinal_cost(value);
                      // handleChange("hsn_code", value);
                      clearErrors("hsnCode");
                    }}
                    message={errors.final_cost && "Hsn Code is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="start_date">
                    Start Date
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <DateInputField
                  id={"start_date"}
                  // maxDate={}
                  minDate={new Date()}
                  showYearDropdown={true}
                  showMonthDropdown={true}
                  selected={start_date}
                  SetValue={setStart_date}
                />
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="closed_date">
                    Closed Date
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <DateInputField
                  minDate={new Date()}
                  showYearDropdown={true}
                  showMonthDropdown={true}
                  id={"closed_date"}
                  selected={closed_date}
                  SetValue={setClosed_date}
                />
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="approx_end_date">
                    Approx End Date
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <DateInputField
                  minDate={new Date()}
                  showYearDropdown={true}
                  showMonthDropdown={true}
                  id={"approx_end_date"}
                  selected={approx_end_date}
                  SetValue={setapprox_end_date}
                />
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="uom_id">
                    Client
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
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
                  message={errors.client && "client is Required"}
                />
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="uom_id">
                    Master Product
                    {/* <IsRequired /> */}
                  </label>
                </div>
              </Col>
              <Col lg="3">
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
                  message={errors.product && "product is Required"}
                />
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="uom_id">
                    Employee
                    {/* <IsRequired /> */}
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <EmployeeDropdownMulti
                  id="team_members"
                  employees={employees}
                  selectedEmployees={team_members}
                  onEmployeeChange={setTeam_members}
                  register={register}
                  setValue={setValue}
                  clearErrors={clearErrors}
                  isRequired={true}
                  message={errors?.team_members?.message}
                  isMulti={true}
                  classNamePrefix="employee-select"
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default ProjectsForm;
