import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccessMenuOptions } from "../../../redux/thunks/settings";
import { useLocation, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { Button, Col, Row } from "reactstrap";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  Block,
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Step, Steps } from "react-step-builder";
import EmployeeFormStep1 from "./EmployeeFormStep1";
import EmployeeFormStep2 from "./EmployeeFormStep2";
import {
  getDepartmentOptions,
  getEmployeeTypeOptions,
} from "../../../redux/thunks/retailMaster";
import { createEmployee } from "../../../redux/thunks/employee";
import moment from "moment";
import EmployeeFormStep3 from "./EmployeeFormStep3";
import {
  useAreas,
  useProfessions,
  useRelationTypes,
  useSections,
} from "../../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useShortCodeContext } from "../../../contexts/ShortCodeContexts";
import { v4 as uuid } from "uuid";
import { useHotkeys } from "react-hotkeys-hook";

const CreateEmployee = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const { isShortCodeDisabled } = useShortCodeContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { areas } = useAreas();
  const title = location?.state?.title;

  const { relationTypes } = useRelationTypes();
  const { professions } = useProfessions();

  const [accessData, SetAccessData] = useState([]);
  const { menuAccessOptions, isLoading: loading } = useSelector(
    (state) => state.menuReducer
  );
  const { isError, isLoading: isSubmitting } = useSelector(
    (state) => state.employeeReducer
  );

  //step 1
  const [username, SetUsername] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [confirmPassword, SetConfirmPassword] = useState("");
  //step 2
  const [firstName, SetFirstName] = useState("");
  const [lastName, SetLastName] = useState();
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
  const [line2, setLine2] = useState();
  const [line3, setLine3] = useState();
  const [id_area, setIdarea] = useState("");
  const [emp_img, setemp_img] = useState();
  const [digi_sign_img, setdigi_sign_img] = useState();
  const [is_system_user, setIs_system_user] = useState(0);
  const [sectionIds, setSectionIds] = useState([]);
  const { sections } = useSections();

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);

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

  const postData = async () => {
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
      // password: password,
      email,
      firstName: firstName,
      lastName: lastName ? lastName : null,
      department,
      designation: null,
      mobile,
      mob_code: mobCode,
      emp_code: empCode,
      comments,
      emp_type: 1,
      id_state: state,
      id_city: city,
      id_country: country,
      address1: line1,
      address2: line2 ? line2 : null,
      address3: line3 ? line3 : null,
      pincode: pincode,
      id_area: id_area,
      section: sectionIds,
      // is_dev: is_dev ?  1 : 0,
      login_branches: loginBranches.map((obj) => {
        const container = obj.value;
        return container;
      }),
      is_system_user: is_system_user == 1 ? true : false,
      relation_details,
      dob: moment(dob).format("YYYY-MM-DD"),
      doj: moment(dateOfJoin).format("YYYY-MM-DD"),
      id_profile: null,
      image: emp_img ? emp_img : null,
      signature: digi_sign_img ? digi_sign_img : null,
    };
    const adddata = { emp, accessdata: access };

    try {
      await dispatch(createEmployee(adddata)).unwrap();
      toastsuccess(" Employee Created successfully");
      navigate(`${process.env.PUBLIC_URL}/settings/employee/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setIsConfirmPasswordShown((show) => !show);

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

  useEffect(() => {
    if (location?.state?.add === undefined) {
      navigate(`${process.env.PUBLIC_URL}/settings/employee/list`);
    }
  }, [location?.state?.add, navigate]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        handleSubmit(postData)();
      }, 0); // <-- Slight delay after blur
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  return (
    <React.Fragment>
      <Head title={(title ? title : "Employee") + " - Add"} />

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
                  onClick={handleSubmit(postData)}
                  // onClick={() => submitData()}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
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
              confirmPassword,
              SetConfirmPassword,
              isPasswordShown,
              setIsPasswordShown,
              isConfirmPasswordShown,
              setIsConfirmPasswordShown,
              handleClickShowPassword,
              handleClickShowConfirmPassword,
              changepass: true,

              register,
              control,
              setValue,
              Controller,
              errors,
              watch,
              areas,
              id_area,
              setIdarea,
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
              emp_img,
              setemp_img,
              digi_sign_img,
              setdigi_sign_img,
              isShortCodeDisabled,
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

export default CreateEmployee;
