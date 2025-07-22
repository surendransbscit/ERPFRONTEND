import React, { useEffect, useState, useContext } from "react";
import Content from "../../../../layout/content/Content";
import Head from "../../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
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
  createTask,
  updateTaskById,
  getTaskById,
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
  useModuleProject,
  useModuleMaster,
} from "../../../../components/filters/filterHooks";
import {
  MasterClientDropdown,
  MasterProductDropdown,
  MasterProjectDropdown,
  MasterModuleDropdown,
} from "../../../../components/filters/retailFilters";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../../contexts/WordTransformerContexts";
import ReactQuill from "react-quill";

const TaskForm = () => {
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
    (state) => state.taskReducer
  );
  const { taskInfo } = useSelector((state) => state.taskReducer);

  const [project, setProject] = useState();
  const [module, setModule] = useState();
  const [name, setName] = useState();
  const [start_date, setStart_date] = useState(new Date());
  const [approx_due_date, setApprox_due_date] = useState(new Date());
  const [description, setdescription] = useState();
  const [closed_date, setClosed_date] = useState(new Date());
  const [referencelink, setReferencelink] = useState();
  const [status, setStatus] = useState(null);
  const { moduleOptionList } = useModuleMaster();
  const { moduleProject } = useModuleProject();
  // console.log(moduleOptionList, moduleProject,"log");
  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      id_project: project,
      id_module: module,
      task_name: name,
      approx_due_date: moment(approx_due_date).format("YYYY-MM-DD"),
      description: description,
      start_date: moment(start_date).format("YYYY-MM-DD"),
      referencelink: referencelink,
      closed_date: moment(closed_date).format("YYYY-MM-DD"),
      status: status,
    };
    try {
      await dispatch(createTask(adddata)).unwrap();
      toastsuccess("Task added successfully");
      navigate(`${process.env.PUBLIC_URL}/admin/master/task/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      id_project: project,
      id_module: module,
      task_name: name,
      approx_due_date: moment(approx_due_date).format("YYYY-MM-DD"),
      description: description,
      start_date: moment(start_date).format("YYYY-MM-DD"),
      referencelink: referencelink,
      closed_date: moment(closed_date).format("YYYY-MM-DD"),
      status: status,
    };
    try {
      await dispatch(createTask(adddata)).unwrap();
      toastsuccess("Task added successfully");
      setName("");
      setProject("");
      setModule("");
      setdescription("");
      setReferencelink("");
      setStart_date(new Date());
      setApprox_due_date(new Date());
      setClosed_date(new Date());
      setStatus("1");
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (value) => {
    setdescription(value);
  };

  useEffect(() => {
    id !== undefined && dispatch(getTaskById(id));
  }, [dispatch, id]);
  console.log(taskInfo);

  useEffect(() => {
    if (taskInfo != null) {
      setName(taskInfo?.task_name);
      setProject(taskInfo?.id_project);
      setModule(taskInfo?.id_module);
      setdescription(taskInfo?.description);
      setReferencelink(taskInfo?.referencelink);
      setStart_date(moment(taskInfo?.start_date).toDate()),
        setApprox_due_date(moment(taskInfo?.approx_due_date).toDate()),
        setClosed_date(moment(taskInfo?.closed_date).toDate()),
        setStatus(taskInfo?.status);
      reset();
    }
  }, [taskInfo, reset]);

  const putData = async () => {
    const adddata = {
      id_project: project,
      id_module: module,
      task_name: name,
      approx_due_date: moment(approx_due_date).format("YYYY-MM-DD"),
      description: description,
      start_date: moment(start_date).format("YYYY-MM-DD"),
      referencelink: referencelink,
      closed_date: moment(closed_date).format("YYYY-MM-DD"),
      status: status,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    console.log(reduxData);

    try {
      await dispatch(updateTaskById(reduxData)).unwrap();
      toastsuccess("Task Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/admin/master/task/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const importOptions = [
    {
      label: "Pending",
      value: 1,
    },
    {
      label: "Assigned",
      value: 2,
    },
    {
      label: "Work in progress",
      value: 3,
    },
    {
      label: "Completed",
      value: 4,
    },
    {
      label: "Delivered",
      value: 5,
    },
    {
      label: "Cancelled",
      value: 6,
    },
    {
      label: "Hold",
      value: 7,
    },
  ];

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
      <Head title={title ? title : "Task"} />
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
                  onClick={handleSubmit((data) =>
                    postData(data, "saveAndClose")
                  )}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/admin/master/task/list`)
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
                    navigate(`${process.env.PUBLIC_URL}/admin/master/task/list`)
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
                    Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"name"}
                    placeholder="Task Name"
                    value={name}
                    SetValue={(value) => {
                      setName(transformWord(value));
                      clearErrors("Name");
                    }}
                    message={errors.name && " Task name is required"}
                  />
                </div>
              </Col>
            </Row>

            <Row className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="uom_id">
                    Project
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <MasterProjectDropdown
                  register={register}
                  id={"project"}
                  masterProject={moduleProject}
                  selectedMasterProject={project}
                  onMasterProjectChange={(val) => {
                    setProject(val);
                  }}
                  isRequired={false}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.project && "project is Required"}
                />
              </Col>
            </Row>

            <Row className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="uom_id">
                    Module
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <MasterModuleDropdown
                  register={register}
                  id={"module"}
                  masterModule={moduleOptionList}
                  selectedMasterModule={module}
                  onMasterModuleChange={(val) => {
                    setModule(val);
                  }}
                  isRequired={true}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.module && "module is Required"}
                />
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="description">
                    Description
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <ReactQuill value={description} onChange={handleChange} />
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="Status">
                    Status
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <select
                    className="form-control form-select"
                    id="status"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                    placeholder="Status"
                  >
                    <option label="Select Task Status" value=""></option>
                    {importOptions?.map((item, index) => (
                      <option key={index} value={item?.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="tax_name">
                    Reference Link
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    placeholder="Reference Link"
                    id={"referencelink"}
                    value={referencelink}
                    isRequired={false}
                    register={register}
                    reqValueError={"This field is required"}
                    SetValue={(value) => {
                      setReferencelink(transformWord(value));
                      clearErrors("Reference link");
                    }}
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
                    approx_due_date
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <DateInputField
                  minDate={new Date()}
                  showYearDropdown={true}
                  showMonthDropdown={true}
                  id={"approx_end_date"}
                  selected={approx_due_date}
                  SetValue={setApprox_due_date}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default TaskForm;