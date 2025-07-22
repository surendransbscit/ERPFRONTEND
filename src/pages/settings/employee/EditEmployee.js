import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { Block, BlockTitle, PreviewCard } from "../../../components/Component";
import { Button, Col, Row } from "reactstrap";
import { Step, Steps } from "react-step-builder";
import EmployeeFormStep1 from "./EmployeeFormStep1";
import EmployeeFormStep2 from "./EmployeeFormStep2";
import EmployeeFormStep3 from "./EmployeeFormStep3";
import moment from "moment";
import {
  getEmployeeById,
  updateEmployeeById,
} from "../../../redux/thunks/employee";
import { getAccessMenuOptions } from "../../../redux/thunks/settings";
import {
  getDepartmentOptions,
  getEmployeeTypeOptions,
} from "../../../redux/thunks/retailMaster";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  useAreas,
  useProfessions,
  useRelationTypes,
  useSections,
} from "../../../components/filters/filterHooks";
import { v4 as uuid } from "uuid";
import { useHotkeys } from "react-hotkeys-hook";

const EditEmployee = () => {
  const location = useLocation();
  const id = location?.state?.id;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const title = location?.state?.title;

  //menu access data
  const [accessData, SetAccessData] = useState([]);
  const { menuAccessOptions } = useSelector((state) => state.menuReducer);
  const { loading } = useSelector((state) => state.employeeReducer);
  const { employeeInfo, isError } = useSelector(
    (state) => state.employeeReducer
  );

  //step 1
  const [username, SetUsername] = useState("");
  const [email, SetEmail] = useState("");
  const [oldPassword, SetOldPassword] = useState("");
  const [password, SetPassword] = useState("");
  const [confirmPassword, SetConfirmPassword] = useState("");
  //step 2
  const [firstName, SetFirstName] = useState("");
  const [lastName, SetLastName] = useState("");
  const [dob, SetDob] = useState(new Date());
  const [empCode, SetEmpCode] = useState("");
  const [department, SetDepartment] = useState("");
  const [designation, SetDesignation] = useState("");
  const [dateOfJoin, SetDateOfJoin] = useState(new Date());
  const [mobile, SetMobile] = useState("");
  const [comments, SetComments] = useState("");
  const [profile, SetProfile] = useState("");
  const [loginBranches, SetLoginBranches] = useState([]);
  const [mobCode, SetMobCode] = useState(0);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [line3, setLine3] = useState("");
  const [id_area, setIdarea] = useState("");
  const [emp_img, setemp_img] = useState();
  const [digi_sign_img, setdigi_sign_img] = useState();
  const [is_system_user, setIs_system_user] = useState(0);
  const [sectionIds, setSectionIds] = useState([]);
  const { sections } = useSections();

  const { areas } = useAreas();
  const { relationTypes } = useRelationTypes();
  const { professions } = useProfessions();

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  const [changePass, SetChangePass] = useState(false);

  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [family_details, setfamily_details] = useState([]);

  const addFamilyDetails = () => {
    setfamily_details([
      ...family_details,
      {
        fam_name: "",
        relation_type: "",
        profession: "",
        mobile: undefined,
        fam_dob: undefined,
        fam_wed_dob: undefined,
        id_family_details: uuid(),
      },
    ]);
  };

  const editFamilyDetails = ({ name, val, ids }) => {
    setfamily_details((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id_family_details == ids) {
          setValue(`${name + obj.id_family_details}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const deleteFamilyDetails = (ids) => {
    setfamily_details((prevState) =>
      prevState?.filter((obj) => obj.id_family_details != ids)
    );
  };

  const putData = async () => {
    const nonEmptyRelationDetails = family_details?.filter(
      (result) => result?.fam_name !== undefined && result?.fam_name !== ""
    );

    const relation_details = nonEmptyRelationDetails?.map((obj) => {
      const container = {};
      container.relation_type = obj?.relation_type?.value
        ? obj?.relation_type.value
        : "";
      container.profession = obj?.profession?.value
        ? obj?.profession.value
        : "";
      container.name = obj.fam_name;
      container.mobile = obj.mobile;
      container.date_of_birth =
        obj?.fam_dob != undefined
          ? moment(obj?.fam_dob).format("YYYY-MM-DD")
          : null;
      container.date_of_wed =
        obj?.fam_wed_dob != undefined
          ? moment(obj?.fam_wed_dob).format("YYYY-MM-DD")
          : null;
      return container;
    });
    const access = accessData?.map((obj) => {
      const container = {};
      container.view = obj.view;
      container.add = obj.add;
      container.edit = obj.edit;
      container.delete = obj.delete;
      container.menu_id = obj.id;
      return container;
    });
    const emp = {
      // username,
      // password: changePass==true ? confirmPassword : null,
      // old_password:changePass==true ? oldPassword : null,
      email,
      firstname: firstName,
      lastname: lastName ? lastName : null,
      dept: department,
      designation: null,
      mobile: mobile,
      mob_code: mobCode,
      emp_code: empCode,
      comments,
      // is_dev: is_dev ?  1 : 0,
      login_branches: loginBranches.map((obj) => {
        const container = obj.value;
        return container;
      }),
      dob: moment(dob).format("YYYY-MM-DD"),
      doj: moment(dateOfJoin).format("YYYY-MM-DD"),
      //   login_branches: login_branches.map((obj) => {
      //     const container = obj.value;
      //     return container;
      //   }),
      is_system_user: is_system_user == 1 ? true : false,
      section: sectionIds,
      id_state: state,
      id_city: city,
      id_country: country,
      id_profile: profile,
      changepass: changePass,
      address1: line1,
      address2: line2 ? line2 : null,
      address3: line3 ? line3 : null,
      pincode: pincode,
      area: id_area,
      image: emp_img ? emp_img : null,
      signature: digi_sign_img ? digi_sign_img : null,
      relation_details,
    };
    const adddata = { emp, accessdata: access };
    const reduxData = {
      id: id,
      putData: adddata,
    };

    try {
      await dispatch(updateEmployeeById(reduxData)).unwrap();
      toastsuccess(" Employee Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/settings/employee/list`);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(id);
  useEffect(() => {
    dispatch(getEmployeeById(id));
  }, [dispatch, id]);

  useEffect(() => {
    SetAccessData(employeeInfo?.accessdata);
  }, [employeeInfo]);

  useEffect(() => {
    SetLoginBranches(employeeInfo?.employee?.login_branches);
  }, [employeeInfo?.employee]);

  console.log(employeeInfo?.image);

  useEffect(() => {
    SetUsername(employeeInfo?.employee?.username);
    SetMobCode(employeeInfo?.employee?.mob_code);
    SetEmail(employeeInfo?.employee?.email);
    SetFirstName(employeeInfo?.employee?.firstname);
    SetLastName(employeeInfo?.employee?.lastname);
    if (employeeInfo?.employee?.date_of_birth != null) {
      SetDob(moment(employeeInfo?.employee?.date_of_birth).toDate());
    }
    SetEmpCode(employeeInfo?.employee?.emp_code);
    SetDepartment(employeeInfo?.employee?.dept);
    // setis_dev(employeeInfo?.employee?.is_developer)
    // SetEmpType(employeeInfo?.employee?.emp_type);
    SetComments(employeeInfo?.employee?.comments);
    SetMobile(employeeInfo?.employee?.mobile);
    if (employeeInfo?.employee?.date_of_join != null) {
      SetDateOfJoin(moment(employeeInfo?.employee?.date_of_join).toDate());
    }
    SetDesignation(employeeInfo?.employee?.designation);
    setLine1(employeeInfo?.employee?.address1);
    setLine2(employeeInfo?.employee?.address2);
    setLine3(employeeInfo?.employee?.address3);
    setPincode(employeeInfo?.employee?.pincode);
    SetProfile(employeeInfo?.employee?.id_profile);
    setCountry(employeeInfo?.employee?.country);
    setState(employeeInfo?.employee?.state);
    setCity(employeeInfo?.employee?.city);
    setIdarea(employeeInfo?.employee?.area);
    setemp_img(employeeInfo?.employee?.image);
    setdigi_sign_img(employeeInfo?.employee?.signature);
    setIs_system_user(employeeInfo?.employee?.is_system_user);
    setSectionIds(employeeInfo?.employee?.section);
    reset();
  }, [employeeInfo?.employee, reset]);

  useEffect(() => {
    if (employeeInfo?.employee?.relations_details?.length > 0) {
      const relation_details = employeeInfo?.employee?.relations_details?.map(
        (obj) => {
          const container = {};
          container.relation_type = obj?.relation_type;
          container.profession = obj.profession;
          container.fam_name = obj.fam_name;
          container.mobile = obj.mobile;
          container.fam_dob =
            obj?.fam_dob != null ? new Date(obj?.fam_dob) : undefined;
          container.fam_wed_dob =
            obj?.fam_wed_dob != null ? new Date(obj?.fam_wed_dob) : undefined;
          return container;
        }
      );
      setfamily_details(relation_details);
    }
  }, [employeeInfo?.employee]);

  useEffect(() => {
    if (family_details?.length === 0) {
      addFamilyDetails();
    }
  }, [family_details]);

  useEffect(() => {
    dispatch(getAccessMenuOptions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDepartmentOptions());
    dispatch(getEmployeeTypeOptions());
  }, [dispatch]);

  useEffect(() => {
    SetAccessData(menuAccessOptions?.menu_access);
  }, [menuAccessOptions]);

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setIsConfirmPasswordShown((show) => !show);

  useEffect(() => {
    if (location?.state?.id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/employee/list`);
    }
  }, [location?.state?.id]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        handleSubmit(putData)();
      }, 0); // <-- Slight delay after blur
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  return (
    <React.Fragment>
      <Head title={(title ? title : "Employee") + " - Edit"} />

      <Content>
        <PreviewCard className={"h-100 form-control-sm"}>
          <Row md={12}>
            <Col md={4}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md="4"></Col>
            <Col md={4}>
              <div className="form-group action_button">
                <Button
                  disabled={loading}
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/settings/employee/list`)
                  }
                  size="md"
                  className="mr-2 mt-1"
                  color="danger"
                >
                  Cancel
                </Button>{" "}
                <Button
                  disabled={loading}
                  size="md"
                  className="mr-2 mt-1"
                  color="primary"
                  onClick={handleSubmit(putData)}
                  // onClick={() => submitData()}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>{" "}
              </div>
            </Col>
          </Row>
          <EmployeeFormStep2
            props={{
              username,
              SetUsername,
              email,
              SetEmail,
              password,
              SetPassword,
              SetChangePass,
              changepass: changePass,
              confirmPassword,
              SetConfirmPassword,
              oldPassword,
              SetOldPassword,
              isPasswordShown,
              setIsPasswordShown,
              isConfirmPasswordShown,
              setIsConfirmPasswordShown,
              handleClickShowPassword,
              handleClickShowConfirmPassword,
              is_edit: true,

              register,
              control,
              setValue,
              Controller,
              errors,
              watch,
              firstName,
              SetFirstName,
              lastName,
              SetLastName,
              dob,
              SetDob,
              empCode,
              SetEmpCode,
              department,
              SetDepartment,
              designation,
              SetDesignation,
              dateOfJoin,
              SetDateOfJoin,
              mobile,
              SetMobile,
              comments,
              SetComments,
              profile,
              SetProfile,
              loginBranches,
              SetLoginBranches,
              mobCode,
              SetMobCode,
              country,
              setCountry,
              state,
              setState,
              city,
              setCity,
              clearErrors,
              pincode,
              setPincode,
              line1,
              setLine1,
              line2,
              setLine2,
              line3,
              setLine3,
              areas,
              id_area,
              setIdarea,
              is_edit: true,
              setemp_img,
              emp_img,
              digi_sign_img,
              setdigi_sign_img,
              activeTab,
              setActiveTab,
              toggle,
              family_details,
              setfamily_details,
              addFamilyDetails,
              editFamilyDetails,
              deleteFamilyDetails,
              relationTypes,
              professions,
              is_system_user,
              setIs_system_user,
              sections,
              sectionIds,
              setSectionIds,
            }}
          />
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default EditEmployee;
