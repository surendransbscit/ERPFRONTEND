import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import Content from "../../../layout/content/Content";
import { Icon, PreviewCard } from "../../../components/Component";
import classnames from "classnames";
import { useForm } from "react-hook-form";
import Head from "../../../layout/head/Head";
import { useDispatch, useSelector } from "react-redux";
import CompanyForm from "./CompanyForm";
import {
  useBranches,
  useCities,
  useCompanies,
  useCountries,
  useStates,
} from "../../../components/filters/filterHooks";
import { getAllBranch, getAllCompany } from "../../../redux/thunks/settings";
import { getAllCounter, getAllFloor } from "../../../redux/thunks/retailMaster";
import BranchForm from "./BranchForm";
import FloorForm from "./FloorForm";
import CounterForm from "./CounterForm";
import { getPagePermission } from "../../../redux/thunks/coreComponent";


const FloorMasterCombined = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
    setValue: setValue2,
    clearErrors: clearErrors2,
  } = useForm();
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
    reset: reset3,
    setValue: setValue3,
    clearErrors: clearErrors3,
  } = useForm();
  const {
    register: register4,
    handleSubmit: handleSubmit4,
    formState: { errors: errors4 },
    reset: reset4,
    setValue: setValue4,
    clearErrors: clearErrors4,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const title = location?.state?.title;

  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const { companyList } = useSelector((state) => state.companyReducer);
  const { branchList } = useSelector((state) => state.branchReducer);
  const { floorList } = useSelector((state) => state.floorReducer);
  const { counterList } = useSelector((state) => state.counterReducer);

  const pathName = location?.pathname;
     const { pagePermission } = useSelector((state) => state.coreCompReducer);
  
     useEffect(() => {
        dispatch(getPagePermission({ path: pathName }));
      }, [pathName, dispatch]);
  
    useEffect(() => {
          if (pagePermission?.add === false || pagePermission === undefined || pagePermission === null) {
            navigate(`${process.env.PUBLIC_URL}/`);
          }
        }, [pagePermission, navigate]);

  const { countries } = useCountries();
  const { states } = useStates();
  const { cities } = useCities();

  //company
  const [name, setName] = useState("");
  const [short_code, setShortCode] = useState("");
  const [comp_name_in_sms, setcompNameInSms] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [mobile, setMobile] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [bank_acc_number, setBankAccNumber] = useState("");
  const [bank_name, setBankName] = useState("");
  const [bank_acc_name, setBankAccName] = useState("");
  const [bank_branch, setBankBranch] = useState("");
  const [bank_ifsc, setBankIfsc] = useState("");
  const [gst_number, setGstNumber] = useState("");
  const [cin_number, setCinNumber] = useState("");
  const [whatsapp_no, setWhatsappNo] = useState("");
  const [mobCode, setMobCode] = useState(0);
  const [com_img, setcom_img] = useState();
  const [companyEdit, setCompanyEdit] = useState(false);
  const [companyId, setCompanyId] = useState();

  //branch
  const [id_company, setIdCompany] = useState("");
  const [showToAll, setShowToAll] = useState(1);
  const [branchName, setBranchName] = useState("");
  const [active, setActive] = useState(true);
  const [shortName, setShortName] = useState("");
  const [branchEmail, setBranchEmail] = useState("");
  const [branchAddress1, setBranchAddress1] = useState("");
  const [branchAddress2, setBranchAddress2] = useState("");
  const [branchCountry, setBranchCountry] = useState("");
  const [branchState, setBranchState] = useState("");
  const [branchCity, setBranchCity] = useState("");
  const [branchPhone, setBranchPhone] = useState("");
  const [branchMobile, setBranchMobile] = useState("");
  const [cusromerCare, setCusromerCare] = useState("");
  const [branchPincode, setBranchPincode] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [fbLink, setFbLink] = useState("");
  const [instaLink, setInstaLink] = useState("");
  const [sort, setSort] = useState("");
  const [otpVerifMobileNo, setotpVerifMobileNo] = useState("");
  const [branchType, setBranchType] = useState(1);
  const [isHo, setIsHo] = useState(true);
  const [note, setNote] = useState("");
  const [branchGstNumber, setBranchGstNumber] = useState("");
  const [logo, setlogo] = useState();
  const [branchMobCode, setBranchMobCode] = useState(0);
  const [branchEdit, setBranchEdit] = useState(false);
  const [branchId, setBranchId] = useState();

  //floor
  const [floorName, setFloorName] = useState();
  const [floorActive, setFloorActive] = useState(true);
  const [branch, SetBranch] = useState();
  const [floorEdit, setFloorEdit] = useState(false);
  const [floorId, setFloorId] = useState();

  //counter
  const [counterBranch, SetCounterBranch] = useState();
  const [counterName, setCounterName] = useState();
  const [floor, setFloor] = useState();
  const [counterActive, setCounterActive] = useState(true);
  const [counterEdit, setCounterEdit] = useState(false);
  const [counterId, setCounterId] = useState();

  useEffect(() => {
    if (activeTab == "1") {
      dispatch(getAllCompany());
    }
    if (activeTab == "2") {
      dispatch(getAllBranch());
    }
    if (activeTab == "3") {
      dispatch(getAllFloor());
    }
    if (activeTab == "4") {
      dispatch(getAllCounter());
    }
  }, [dispatch, activeTab]);

  return (
    <React.Fragment>
      <Head title={(title ? title : "Combined Masters") + " - Add"} />

      <Content>
        <PreviewCard className={"h-100 form-control-sm"}>
          <Nav tabs>
            <NavItem>
              <NavLink
                tag="a"
                href="#tab"
                className={classnames({ active: activeTab === "1" })}
                onClick={(ev) => {
                  ev.preventDefault();
                  toggle("1");
                }}
              >
                <Icon name="grid-alt-fill" /> <span>Company</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                tag="a"
                href="#tab"
                className={classnames({ active: activeTab === "2" })}
                onClick={(ev) => {
                  ev.preventDefault();
                  toggle("2");
                }}
              >
                <Icon name="grid-alt-fill" /> <span>Branch</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                tag="a"
                href="#tab"
                className={classnames({ active: activeTab === "3" })}
                onClick={(ev) => {
                  ev.preventDefault();
                  toggle("3");
                }}
              >
                <Icon name="grid-alt-fill" />
                <span>Floor</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                tag="a"
                href="#tab"
                className={classnames({ active: activeTab === "4" })}
                onClick={(ev) => {
                  ev.preventDefault();
                  toggle("4");
                }}
              >
                <Icon name="grid-alt-fill" /> <span>Counter</span>
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <CompanyForm
                props={{
                  register,
                  clearErrors,
                  errors,
                  handleSubmit,
                  setValue,
                  name,
                  setName,
                  short_code,
                  setShortCode,
                  comp_name_in_sms,
                  setcompNameInSms,
                  address1,
                  setAddress1,
                  address2,
                  setAddress2,
                  country,
                  setCountry,
                  state,
                  setState,
                  city,
                  setCity,
                  pincode,
                  setPincode,
                  mobile,
                  setMobile,
                  phone,
                  setPhone,
                  email,
                  setEmail,
                  website,
                  setWebsite,
                  bank_acc_number,
                  setBankAccNumber,
                  bank_name,
                  setBankName,
                  bank_acc_name,
                  setBankAccName,
                  bank_branch,
                  setBankBranch,
                  bank_ifsc,
                  setBankIfsc,
                  gst_number,
                  setGstNumber,
                  cin_number,
                  setCinNumber,
                  whatsapp_no,
                  setWhatsappNo,
                  mobCode,
                  setMobCode,
                  com_img,
                  setcom_img,
                  companyEdit,
                  setCompanyEdit,
                  companyId,
                  setCompanyId,
                  cities,
                  states,
                  countries,
                  companyList,
                }}
              />
            </TabPane>

            <TabPane tabId="2">
              <BranchForm
                props={{
                  setValue: setValue2,
                  register: register2,
                  clearErrors: clearErrors2,
                  errors: errors2,
                  handleSubmit: handleSubmit2,
                  id_company,
                  setIdCompany,
                  showToAll,
                  setShowToAll,
                  name: branchName,
                  setName: setBranchName,
                  active,
                  setActive,
                  shortName,
                  setShortName,
                  email: branchEmail,
                  setEmail: setBranchEmail,
                  address1: branchAddress1,
                  setAddress1: setBranchAddress1,
                  address2: branchAddress2,
                  setAddress2: setBranchAddress2,
                  city: branchCity,
                  setCity: setBranchCity,
                  state: branchState,
                  setState: setBranchState,
                  country: branchCountry,
                  setCountry: setBranchCountry,
                  pincode: branchPincode,
                  setPincode: setBranchPincode,
                  gstNumber: branchGstNumber,
                  setGstNumber: setBranchGstNumber,
                  phone: branchPhone,
                  setPhone: setBranchPhone,
                  mobile: branchMobile,
                  setMobile: setBranchMobile,
                  cusromerCare,
                  setCusromerCare,
                  mapUrl,
                  setMapUrl,
                  fbLink,
                  setFbLink,
                  instaLink,
                  setInstaLink,
                  sort,
                  setSort,
                  otpVerifMobileNo,
                  setotpVerifMobileNo,
                  branchType,
                  setBranchType,
                  isHo,
                  setIsHo,
                  note,
                  setNote,
                  logo,
                  setlogo,
                  mobCode: branchMobCode,
                  setMobCode: setBranchMobCode,
                  branchEdit,
                  setBranchEdit,
                  branchId,
                  setBranchId,
                  cities,
                  states,
                  countries,
                  branchList,
                }}
              />
            </TabPane>
            <TabPane tabId="3">
              <FloorForm
                props={{
                  setValue: setValue3,
                  register: register3,
                  clearErrors: clearErrors3,
                  errors: errors3,
                  handleSubmit: handleSubmit3,
                  name: floorName,
                  setName: setFloorName,
                  active: floorActive,
                  setActive: setFloorActive,
                  branch,
                  SetBranch,
                  floorId,
                  setFloorId,
                  floorEdit,
                  setFloorEdit,
                  // branches,
                  floorList,
                }}
              />
            </TabPane>
            <TabPane tabId="4">
              <CounterForm
                props={{
                  setValue: setValue4,
                  register: register4,
                  clearErrors: register4,
                  errors: errors4,
                  handleSubmit: handleSubmit4,
                  name: counterName,
                  setName: setCounterName,
                  floor,
                  setFloor,
                  active: counterActive,
                  setActive: setCounterActive,
                  counterEdit,
                  setCounterEdit,
                  counterId,
                  setCounterId,
                  counterList,
                  branch: counterBranch,
                  SetBranch: SetCounterBranch,
                  // floorOptions,
                }}
              />
            </TabPane>
          </TabContent>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default FloorMasterCombined;
