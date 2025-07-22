
import React, { useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import Content from "../../../layout/content/Content";
import { Icon, PreviewCard } from "../../../components/Component";
import classnames from "classnames";
import { useForm } from "react-hook-form";
import StateForm from "./StateForm";
import CityForm from "./CityForm";
import AreaForm from "./AreaForm";
import Head from "../../../layout/head/Head";
import { useDispatch, useSelector } from "react-redux";
import { getAllArea, getAllCity, getAllCountry, getAllState } from "../../../redux/thunks/retailMaster";
import { useCountries, useStates } from "../../../components/filters/filterHooks";
import CountryForm from "./CountryForm";
import { getPagePermission } from "../../../redux/thunks/coreComponent";


const AreaMasterCombined = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    clearErrors,
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

  const [activeTab, setActiveTab] = useState("4");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const { countryList } = useSelector((state) => state.countryReducer);
  const { stateList } = useSelector((state) => state.stateReducer);
  const { cityList } = useSelector((state) => state.cityReducer);
  const { areaList } = useSelector((state) => state.areaReducer);

  //country
  const [name, setname] = useState("");
  const [shortName, setShortName] = useState("");
  const [currencyName, setCurrencyName] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [mobCode, setMobCode] = useState("");
  const [mobNoLen, setMobNoLen] = useState("");
  const [isDefault, setIsDefault] = useState(1);
  const [countryEdit, setCountryEdit] = useState(false);
  const [countryId, setCountryId] = useState();

  //state
  const [stateName, setStateName] = useState();
  const [state_code, setStateCode] = useState();
  const [active, setActive] = useState(true);
  const [country, setCountry] = useState("");
  const [stateEdit, setStateEdit] = useState(false);
  const [steateId, setStateId] = useState();

  //city
  const [cityName, setCityName] = useState();
  const [cityDefault, setCityDefault] = useState(true);
  const [cityState, setCityState] = useState("");
  const [cityEdit, setCityEdit] = useState(false);
  const [cityId, setCityId] = useState();

  //area
  const [area_name, setAreaName] = useState();
  const [pincode, setPincode] = useState();
  const [postal, setPostal] = useState();
  const [taluk, setTaluk] = useState();
  const [areaIsDefault, setAreaIsDefault] = useState(false);
  const [areaActive, setAreaActive] = useState(true);
  const [areaEdit, setAreaEdit] = useState(false);
  const [areaId, setAreaId] = useState();
  const [region, setRegion] = useState();


  useEffect(() => {
    if (activeTab == "1") {
      dispatch(getAllCountry());
    }
    if (activeTab == "2") {
      dispatch(getAllState());
    }
    if (activeTab == "3") {
      dispatch(getAllCity());
    }
    if (activeTab == "4") {
      dispatch(getAllArea());
    }
  }, [dispatch, activeTab]);

  

  return (
    <React.Fragment>
      <Head title={(title ? title : "Combined Masters") + " - Add"} />

      <Content>
        <PreviewCard className={"h-100 form-control-sm"}>
          {/* <Row md={12}>
            <Col md={4}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md="4"></Col>
            <Col md={4}>
              <div className="form-group action_button">
                <Button
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/settings/employee/list`)}
                  size="md"
                  className="mr-2 mt-1"
                  color="danger"
                >
                  Cancel
                </Button>{" "}
                <Button
                  size="md"
                  className="mr-2 mt-1"
                  color="primary"
                  // onClick={handleSubmit(postData)}
                >
                  Save
                  
                </Button>
              </div>
            </Col>
          </Row> */}

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
                <Icon name="grid-alt-fill" /> <span>Country</span>
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
                <Icon name="grid-alt-fill" /> <span>State</span>
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
                <span>City</span>
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
                <Icon name="grid-alt-fill" /> <span>Area</span>
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <CountryForm
                props={{
                  register,
                  clearErrors,
                  errors,
                  handleSubmit,
                  reset,
                  name,
                  setname,
                  shortName,
                  setShortName,
                  currencyName,
                  setCurrencyName,
                  currencyCode,
                  setCurrencyCode,
                  mobCode,
                  setMobCode,
                  mobNoLen,
                  setMobNoLen,
                  isDefault,
                  setIsDefault,
                  countryEdit,
                  setCountryEdit,
                  countryId,
                  setCountryId,
                  countryList,
                }}
              />
            </TabPane>
            <TabPane tabId="2">
              <StateForm
                props={{
                  setValue: setValue2,
                  register: register2,
                  clearErrors: clearErrors2,
                  errors: errors2,
                  handleSubmit: handleSubmit2,
                  stateName,
                  reset:reset2,
                  setStateName,
                  state_code,
                  setStateCode,
                  active,
                  setActive,
                  // countries,
                  country,
                  setCountry,
                  stateEdit,
                  setStateEdit,
                  steateId,
                  setStateId,
                  stateList,
                }}
              />
            </TabPane>
            <TabPane tabId="3">
              <CityForm
                props={{
                  setValue: setValue3,
                  register: register3,
                  clearErrors: clearErrors3,
                  errors: errors3,
                  reset: reset3,
                  handleSubmit: handleSubmit3,
                  cityName,
                  setCityName,
                  cityDefault,
                  setCityDefault,
                  cityEdit,
                  setCityEdit,
                  cityId,
                  setCityId,
                  cityList,
                  cityState,
                  setCityState,
                  // states,
                }}
              />
            </TabPane>
            <TabPane tabId="4">
              <AreaForm
                props={{
                  setValue: setValue4,
                  register: register4,
                  clearErrors: register4,
                  errors: errors4,
                  handleSubmit: handleSubmit4,
                  reset: reset4,
                  area_name,
                  setAreaName,
                  pincode,
                  setPincode,
                  postal,
                  setPostal,
                  taluk,
                  setTaluk,
                  areaIsDefault,
                  setAreaIsDefault,
                  areaActive,
                  setAreaActive,
                  areaEdit,
                  setAreaEdit,
                  areaId,
                  setAreaId,
                  areaList,
                  region,
                  setRegion,
                }}
              />
            </TabPane>
          </TabContent>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default AreaMasterCombined;
