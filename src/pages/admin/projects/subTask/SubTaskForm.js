/* eslint-disable no-unused-expressions */
import React, { useContext, useEffect, useRef, useState } from "react";
import Content from "../../../../layout/content/Content";
import Head from "../../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  DateInputField,
  PreviewCard,
  SaveButton,
} from "../../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastsuccess } from "../../../../components/sds-toast-style/toast-style";
import {
  Col,
  Row,
  SwitchInputField,
  TextInputField,
  NumberInputField,
} from "../../../../components/Component";
import IsRequired from "../../../../components/erp-required/erp-required";
import {
  createMasterModule,
  getMasterModuleById,
  updateMasterModuleById,
} from "../../../../redux/thunks/adminMaster";
import { Button, Input } from "reactstrap";
import { ZoomImage } from "../../../../components/form-control/ZoomImage";
import ModifiedBreadcrumb from "../../../../components/common/breadcrumb/ModifiedBreadCrumb";
import ReactQuill from "react-quill";
import { WordTransformerContext } from "../../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";
import {
  createSubTask,
  getSubTaskById,
  updateSubTaskById,
} from "../../../../redux/thunks/adminProject";
import {
  ActiveEmployeeDropdown,
  TaskDropdown,
} from "../../../../components/filters/retailFilters";
import {
  useEmployeeDropdown,
  useTasks,
} from "../../../../components/filters/filterHooks";
import moment from "moment";

const SubTaskForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm();
  const navigate = useNavigate();
  const { transformWord } = useContext(WordTransformerContext);

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.subTaskReducer
  );
  const { subTaskInfo } = useSelector((state) => state.subTaskReducer);

  const { employees } = useEmployeeDropdown();

  const { taskList } = useTasks();

  const taskRef = useRef();

  const [tasks, setTasks] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [refernceLink, setRefernceLink] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedBy, setAssignedBy] = useState("");

  const postData = async () => {
    const adddata = {
      id_task: tasks,
      task_name: name,
      start_date: moment(startDate).format("YYYY-MM-DD"),
      end_date: moment(endDate).format("YYYY-MM-DD"),
      due_date: moment(dueDate).format("YYYY-MM-DD"),
      description,
      referencelink: refernceLink,
      status,
      assigned_to: assignedTo,
      assigned_by: assignedBy,
    };
    try {
      await dispatch(createSubTask(adddata)).unwrap();
      toastsuccess("Sub Task Added successfully");
      navigate(`${process.env.PUBLIC_URL}/admin/master/sub_task/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      id_task: tasks,
      task_name: name,
      start_date: moment(startDate).format("YYYY-MM-DD"),
      end_date: moment(endDate).format("YYYY-MM-DD"),
      due_date: moment(dueDate).format("YYYY-MM-DD"),
      description,
      referencelink: refernceLink,
      status,
      assigned_to: assignedTo,
      assigned_by: assignedBy,
    };
    try {
      await dispatch(createSubTask(adddata)).unwrap();
      toastsuccess("Sub Task Added successfully");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getSubTaskById(id));
  }, [dispatch, id]);

  useEffect(() => {
    subTaskInfo != undefined &&
      (setTasks(subTaskInfo?.id_task),
      setName(subTaskInfo?.task_name),
      setStartDate(moment(subTaskInfo?.start_date).toDate()),
      setEndDate(moment(subTaskInfo?.end_date).toDate()),
      setDueDate(moment(subTaskInfo?.due_date).toDate()),
      setDescription(subTaskInfo?.description),
      setStatus(subTaskInfo?.status),
      setAssignedTo(subTaskInfo?.assigned_to),
      setAssignedBy(subTaskInfo?.assigned_by),
      setRefernceLink(subTaskInfo?.referencelink),
      reset());
  }, [subTaskInfo, reset]);

  const putData = async () => {
    const adddata = {
      id_task: tasks,
      task_name: name,
      start_date: moment(startDate).format("YYYY-MM-DD"),
      end_date: moment(endDate).format("YYYY-MM-DD"),
      due_date: moment(dueDate).format("YYYY-MM-DD"),
      description,
      referencelink: refernceLink,
      status,
      assigned_to: assignedTo,
      assigned_by: assignedBy,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateSubTaskById(reduxData)).unwrap();
      toastsuccess(" Sub Task Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/admin/master/sub_task/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/admin/master/sub_task/list`);
    }
  }, [add, id, navigate]);

  const handleChange = (value) => {
    setDescription(value);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+S or Cmd+S
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault(); // block browser Save dialog

        document.activeElement?.blur(); // trigger form validations

        setTimeout(() => {
          if (id !== undefined) {
            handleSubmit(putData)();
          } else {
            handleSubmit(postData)();
          }
        }, 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, postData, putData, id]);

  const statusOptions = [
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

  return (
    <React.Fragment>
      <Head title={title ? title : "Sub Task"} />
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
                    navigate(
                      `${process.env.PUBLIC_URL}/admin/master/sub_task/list`
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
                      `${process.env.PUBLIC_URL}/admin/master/sub_task/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>

          <div className="">
            <Row lg={12} className={"form-control-sm"}>
              <Col md={6}>
                <div className="custom-grid">
                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="name">
                          Task <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TaskDropdown
                          ref={taskRef}
                          register={register}
                          id={"tasks"}
                          task={taskList}
                          selectedTask={tasks}
                          onTaskChange={(val) => {
                            setTasks(val);
                          }}
                          isRequired={false}
                          clearErrors={clearErrors}
                          setValue={setValue}
                          message={errors.tasks && "tasks is Required"}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="name">
                          Name <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"name"}
                          placeholder="Name"
                          value={name}
                          SetValue={(value) => {
                            setName(transformWord(value));
                            clearErrors("name");
                          }}
                          message={errors.name && "name"}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="description">
                          Description
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <ReactQuill value={description} onChange={handleChange} />
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="refernceLink">
                          Refernce Link
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          placeholder="Refernce Link"
                          id={"refernceLink"}
                          value={refernceLink}
                          isRequired={false}
                          register={register}
                          SetValue={(value) => {
                            setRefernceLink(value);
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col md={6}>
                <div className="custom-grid">
                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="startDate">
                          Start Date
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <DateInputField
                        id={"startDate"}
                        minDate={new Date()}
                        showYearDropdown={true}
                        showMonthDropdown={true}
                        selected={startDate}
                        SetValue={setStartDate}
                      />
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="endDate">
                          End Date
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <DateInputField
                        id={"endDate"}
                        minDate={new Date()}
                        showYearDropdown={true}
                        showMonthDropdown={true}
                        selected={endDate}
                        SetValue={setEndDate}
                      />
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="dueDate">
                          Due Date
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <DateInputField
                        id={"dueDate"}
                        minDate={new Date()}
                        showYearDropdown={true}
                        showMonthDropdown={true}
                        selected={dueDate}
                        SetValue={setDueDate}
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group ">
                        <label className="form-label" htmlFor="assignedBy">
                          Assigned By
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ActiveEmployeeDropdown
                          register={register}
                          id={"assignedBy"}
                          selectedEmployee={assignedBy}
                          onEmployeeChange={setAssignedBy}
                          isRequired={true}
                          options={employees}
                          clearErrors={clearErrors}
                          setValue={setValue}
                          message={errors.assignedBy && "Employee is Required"}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group ">
                        <label className="form-label" htmlFor="assignedTo">
                          Assigned To
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ActiveEmployeeDropdown
                          register={register}
                          id={"assignedTo"}
                          selectedEmployee={assignedTo}
                          onEmployeeChange={setAssignedTo}
                          isRequired={true}
                          options={employees}
                          clearErrors={clearErrors}
                          setValue={setValue}
                          message={errors.assignedTo && "Employee is Required"}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="Status">
                          Status
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
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
                          <option label="Select Task Status " value=""></option>
                          {statusOptions?.map((item, index) => (
                            <option key={index} value={item?.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default SubTaskForm;