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
    getAllErpAttendance,
    createErpAttendance,
    getErpAttendanceById,
    updateErpAttendanceById,
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
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
    useEmployee,
} from "../../../components/filters/filterHooks";
import { useHotkeys } from "react-hotkeys-hook";



const ERPEmployeeAttendance = () => {
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
        (state) => state.erpAttendanceReducer
    );
    const { erpAttendanceInfo } = useSelector((state) => state.erpAttendanceReducer);

    const [name, setName] = useState();
    const [code, setCode] = useState();
    const [start_date, setStart_date] = useState(new Date());
    const [status, setStatus] = useState();
    const [selectAll, setSelectAll] = useState(true);
    const [selectedEmployees, setSelectedEmployees] = useState([]);


    const { employees } = useEmployee();


    const selectAllCol = (checked) => {
        setSelectAll(checked);
        if (checked) {
            setSelectedEmployees(employees.map(emp => emp.id_employee));
        } else {
            setSelectedEmployees([]);
        }
    };


    const toggleEmployeeSelection = (empId) => {
        setSelectedEmployees(prev =>
            prev.includes(empId)
                ? prev.filter(id => id !== empId)
                : [...prev, empId]
        );
    };

    const preparePayload = () => {
        return {
            date: moment(start_date).format("YYYY-MM-DD"),
            attendance_details: employees.map(emp => ({
                id_employee: emp.id_employee,
                status: selectedEmployees.includes(emp.id_employee) ? 1 : 2,
            })),
        };
    };


    const postData = async () => {
        const adddata = preparePayload();
        try {
            await dispatch(createErpAttendance(adddata)).unwrap();
            toastsuccess("Attendance added successfully");
            navigate(`${process.env.PUBLIC_URL}/admin/erpemployeeattendance/list`);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        id !== undefined && dispatch(getErpAttendanceById(id));
    }, [dispatch, id]);
    console.log(erpAttendanceInfo);

    useEffect(() => {
        if (employees.length > 0 && add) {
            const allEmployeeIds = employees.map(emp => emp.id_employee);
            setSelectedEmployees(allEmployeeIds);
            setSelectAll(true);
        }
    }, [employees, add]);


    useEffect(() => {
        if (erpAttendanceInfo != null) {
            setName(erpAttendanceInfo?.name);
            setStart_date(moment(erpAttendanceInfo?.start_date).toDate());
            setStatus(erpAttendanceInfo?.status);

            // Extract selected employees from attendance_details where status is 1
            const presentEmployeeIds = (erpAttendanceInfo?.attendance_details || [])
                .filter(detail => detail.status === 1)
                .map(detail => detail.id_employee);

            setSelectedEmployees(presentEmployeeIds);

            // Set SelectAll checkbox state based on whether all employees are selected
            const allEmployeeIds = employees.map(emp => emp.id_employee);
            const isAllSelected = allEmployeeIds.length > 0 && allEmployeeIds.every(id => presentEmployeeIds.includes(id));
            setSelectAll(isAllSelected);

            reset();
        }
    }, [erpAttendanceInfo, reset, employees]);


    const putData = async () => {
        const adddata = preparePayload();
        const reduxData = { id: id, putData: adddata };
        try {
            await dispatch(updateErpAttendanceById(reduxData)).unwrap();
            toastsuccess("attendance Edited successfully");
            navigate(`${process.env.PUBLIC_URL}/admin/erpemployeeattendance/list`);
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
                                            `${process.env.PUBLIC_URL}/admin/erpemployeeattendance/list`
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
                                            `${process.env.PUBLIC_URL}/admin/erpemployeeattendance/list`
                                        )
                                    }
                                >
                                    Cancel
                                </CancelButton>
                            </Col>
                        )}
                    </Row>
                    <div className="custom-grid">
                        <Row md={6} className="form-group row g-1">
                            <Col lg="1">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="start_date">
                                        Start Date
                                    </label>
                                </div>
                            </Col>
                            <Col lg="2">
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
                    </div>
                    <Row className="form-group row g-4">
                        <Col md={12}>
                            <div
                                className="table-responsive"
                                style={{ maxHeight: '400px', overflowY: 'auto' }}
                            >
                                <table className="table table-bordered">
                                    <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#fff' }}>
                                        <tr
                                            style={{
                                                position: "sticky",
                                                top: 0,
                                                zIndex: 1,
                                                backgroundColor: "#f8f9fa",
                                            }}
                                        >
                                            <th className="tableHeadFixed" >
                                                S.NO
                                                <input
                                                    type="checkbox"
                                                    onChange={(event) => {
                                                        selectAllCol(event.target.checked);
                                                        setSelectAll(event.target.checked);
                                                    }}
                                                    checked={selectAll}
                                                />{" "}
                                            </th>
                                            <th className="tableHeadFixed" >Eployee Name</th>
                                            <th className="tableHeadFixed" >mobile</th>
                                            <th className="tableHeadFixed" >code</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((emp, idx) => (
                                            <tr key={emp.id_employee}>
                                                <td>
                                                    {idx + 1}
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedEmployees.includes(emp.id_employee)}
                                                        onChange={() => toggleEmployeeSelection(emp.id_employee)}
                                                    />
                                                </td>
                                                <td>{emp.firstname} {emp.lastname}</td>
                                                <td>{emp.mobile}</td>
                                                <td>{emp.emp_code}</td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        </Col>
                    </Row>
                </PreviewCard>
            </Content>
        </React.Fragment>
    );
};

export default ERPEmployeeAttendance;
