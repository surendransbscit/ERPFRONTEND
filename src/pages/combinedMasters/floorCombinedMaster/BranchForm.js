import React,{useContext} from "react";
import {
  Col,
  DropdownInputField,
  Icon,
  NumberInputField,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import { Button, Input } from "reactstrap";
import CombinedMasterTable from "../CombinedMasterTable";
import { useDispatch } from "react-redux";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { EmailInputField, GstInputField } from "../../../components/form-control/InputGroup";
import {
  CityDropdown,
  CompanyDropdown,
  CountryDropdown,
  StateDropdown,
} from "../../../components/filters/retailFilters";
import { ZoomImage } from "../../../components/form-control/ZoomImage";
import { createBranch, getAllBranch, getBranchById, updateBranchById } from "../../../redux/thunks/settings";
import { useCompanies } from "../../../components/filters/filterHooks";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";

const BranchForm = ({ props }) => {
  const dispatch = useDispatch();
  const { companies } = useCompanies();
  const {
    setValue,
    register,
    clearErrors,
    errors,
    handleSubmit,
    id_company,
    setIdCompany,
    showToAll,
    setShowToAll,
    name,
    setName,
    active,
    setActive,
    shortName,
    setShortName,
    email,
    setEmail,
    address1,
    setAddress1,
    address2,
    setAddress2,
    city,
    setCity,
    state,
    setState,
    country,
    setCountry,
    pincode,
    setPincode,
    gstNumber,
    setGstNumber,
    phone,
    setPhone,
    mobile,
    setMobile,
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
    mobCode,
    setMobCode,
    branchEdit,
    setBranchEdit,
    branchId,
    setBranchId,
    cities,
    states,
    countries,

    branchList,
  } = props;
  
  const { transformWord } = useContext(WordTransformerContext);
  const convert64 = async (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e);
    reader.onload = () => {
      setlogo(reader.result);
    };
  };

  const isBase64 = (str) => {
    try {
      return str.startsWith("data:image");
    } catch (err) {
      return false;
    }
  };

  let branchTypeOptions = [
    {
      label: "Store",
      value: 1,
    },
    {
      label: "Customer Service",
      value: 2,
    },
  ];

  let showToAllOptions = [
    {
      label: "Own",
      value: 1,
    },
    {
      label: "All",
      value: 2,
    },
  ];

  const columns = [
    { accessor: "name", header: "Branch Name", text_align: "left" },
    { accessor: "short_name", header: "Short Code", text_align: "left" },
    { accessor: "company_name", header: "Company Name", text_align: "left" },
    { accessor: "is_active", header: "Status", text_align: "left", isBadge: true, badgeText: 1 },
  ];

  const onEdit = async (index) => {
    var editId = branchList?.rows[index].pk_id;
    setBranchId(editId);
    let result = "";
    result = await dispatch(getBranchById(editId)).unwrap();
    console.log(result?.data);

    setIdCompany(result?.id_company);
    setShowToAll(result?.show_to_all);
    setName(result?.name);
    setActive(result?.active);
    setShortName(result?.short_name);
    setEmail(result?.email);
    setAddress1(result?.address1);
    setAddress2(result?.address2);
    setCountry(result?.country);
    setState(result?.state);
    setCity(result?.city);
    setMobile(result?.mobile);
    setCusromerCare(result?.cusromercare);
    setPhone(result?.phone);
    setPincode(result?.pincode);
    setMapUrl(result?.map_url);
    setFbLink(result?.fb_link);
    setInstaLink(result?.insta_link);
    setSort(result?.sort);
    setotpVerifMobileNo(result?.otp_verif_mobileno);
    setBranchType(result?.branch_type);
    setIsHo(result?.is_ho);
    setNote(result?.note);
    setGstNumber(result?.gst_number);
    setlogo(result?.logo);
    setMobCode(result?.mob_code);
  };

  const resetForm = () => {
    setBranchId(undefined);
    setIdCompany("");
    setShowToAll("");
    setName("");
    setActive(true);
    setShortName("");
    setEmail("");
    setAddress1("");
    setAddress2("");
    setCountry("");
    setState("");
    setCity("");
    setPhone("");
    setMobile("");
    setCusromerCare("");
    setPincode("");
    setMapUrl("");
    setFbLink("");
    setInstaLink("");
    setSort("");
    setotpVerifMobileNo("");
    setBranchType("");
    setIsHo(true);
    setNote("");
    setGstNumber("");
    setlogo(undefined);
    setMobCode(0);
  };

  const saveBranch = async () => {
    const adddata = {
      id_company,
      show_to_all: showToAll,
      name,
      mob_code: mobCode,
      warehouse: null,
      expo_warehouse: null,
      active,
      short_name: shortName,
      email,
      address1,
      address2,
      country,
      state,
      city,
      phone,
      mobile,
      cusromercare: cusromerCare,
      pincode,
      metal_rate_type: 0,
      map_url: mapUrl,
      fb_link: fbLink,
      insta_link: instaLink,
      sort,
      otp_verif_mobileno: otpVerifMobileNo,
      branch_type: branchType,
      is_ho: isHo,
      note,
      gst_number: gstNumber,
      logo: logo ? logo : null,
    };
    try {
      await dispatch(createBranch(adddata)).unwrap();
      toastsuccess("Branch Added successfully");
      resetForm();
      await dispatch(getAllBranch());
    } catch (error) {
      console.error(error);
    }
  };

  const editBranch = async () => {
    const adddata = {
      id_company,
      show_to_all: showToAll,
      name,
      mob_code: mobCode,
      warehouse: null,
      expo_warehouse: null,
      active,
      short_name: shortName,
      email,
      address1,
      address2,
      country,
      state,
      city,
      phone,
      mobile,
      cusromercare: cusromerCare,
      pincode,
      metal_rate_type: 0,
      map_url: mapUrl,
      fb_link: fbLink,
      insta_link: instaLink,
      sort,
      otp_verif_mobileno: otpVerifMobileNo,
      branch_type: branchType,
      is_ho: isHo,
      note,
      gst_number: gstNumber,
      logo: logo ? logo : null,
    };
    const update_data = { id: branchId, putData: adddata };
    try {
      await dispatch(updateBranchById(update_data)).unwrap();
      toastsuccess("Branch Edited successfully");
      resetForm();
      await dispatch(getAllBranch());
      setBranchId(undefined);
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
          if (branchId !== undefined) {
            handleSubmit(editBranch)();
          } else {
            handleSubmit(saveBranch)();
          }
        }, 0); // <-- Slight delay after blur
      },
      {
        enableOnFormTags: true,
        preventDefault: true,
      }
    );

  return (
    <>
      <Row lg={12} className={"form-control-sm"}>
        {branchId == undefined ? (
          <>
            <Col md={5}></Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <Button
                // disabled={loading}
                size="md"
                className="mr-2 mt-1"
                color="primary"
                onClick={handleSubmit(saveBranch)}
              >
                Save[ctrl+s]
                {/* {loading ? "Saving..." : "Save"} */}
              </Button>
            </Col>
          </>
        ) : (
          <>
            <div className="col-md-12" style={{ textAlign: 'right' }}>
              <Button
                // disabled={loading}
                size="md"
                className="mr-2 mt-1"
                color="danger"
                onClick={() => {
                  resetForm();
                }}
              >
                Cancel
                {/* {loading ? "Saving..." : "Save"} */}
              </Button>{" "}
              <Button
                // disabled={loading}
                size="md"
                className="mr-2 mt-1"
                color="primary"
                onClick={handleSubmit(editBranch)}
              >
                Update[ctrl+s]
                {/* {loading ? "Saving..." : "Save"} */}
              </Button>
            </div>
            
          </>
        )}
      </Row>
      <div className="custom-grid">
        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="site-name">
                Company
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group ">
              <CompanyDropdown
                register={register}
                id={"id_company"}
                companies={companies}
                selectedCompany={id_company}
                onCompanyChange={setIdCompany}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors.id_company && "Company is Required"}
              />
            </div>
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="site-name">
                Type
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group ">
              <DropdownInputField
                register={register}
                isRequired={true}
                id={"branchType"}
                placeholder="Select Branch Type"
                optionLabel="Select Branch Type"
                value={branchType}
                SetValue={setBranchType}
                selectOptions={branchTypeOptions}
              />
              {errors?.branchType && (
                <span className="text-danger">
                  <Icon className={"sm"} name="alert-circle" />
                  {"This field is required"}
                </span>
              )}
            </div>
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Name
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={true}
                id={"name"}
                placeholder="Branch Name"
                value={name}
                setValue={setValue}
                SetValue={(value) => {
                  setName(transformWord(value));
                  clearErrors("name");
                }}
                message={errors.name && "name is Required"}
              />
            </div>
          </Col>
        </Row>

        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="shortName">
                Code
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={true}
                id={"shortName"}
                placeholder="Short Name"
                value={shortName}
                setValue={setValue}
                SetValue={(value) => {
                  setShortName(transformWord(value));
                  clearErrors("shortName");
                }}
                message={errors.shortName && "shortName is Required"}
              />
            </div>
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <EmailInputField
                register={register}
                isRequired={true}
                id={"email"}
                placeholder="Email Address"
                value={email}
                code={setEmail}
                setValue={setValue}
                SetValue={(value) => {
                  setEmail(value);
                  clearErrors("email");
                }}
              />
              {errors?.email && <span className="text-danger">{errors?.email.message}</span>}
            </div>
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="add1">
                Address 1<IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={true}
                id={"address1"}
                placeholder="Address Line 1"
                value={address1}
                setValue={setValue}
                SetValue={(value) => {
                  setAddress1(value);
                  clearErrors("address1");
                }}
                message={errors.address1 && "field is Required"}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="add2">
                Address 2
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <TextInputField
                register={register}
                id={"address2"}
                placeholder="Address Line 2"
                value={address2}
                setValue={setValue}
                SetValue={setAddress2}
              />
            </div>
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="site-name">
                Country
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <CountryDropdown
                register={register}
                id={"id_country"}
                countries={countries}
                selectedCountry={country}
                onCountryChange={(val) => {
                  setCountry(val);
                  setState("");
                  setCity("");
                }}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors.id_country && "Country is Required"}
              ></CountryDropdown>
            </div>
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="state">
                State
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <StateDropdown
                register={register}
                id={"id_state"}
                states={states}
                selectedState={state}
                onStateChange={setState}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors.id_state && "State is Required"}
              ></StateDropdown>
            </div>
          </Col>
        </Row>

        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="city">
                City
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <CityDropdown
                register={register}
                id={"id_city"}
                cities={cities}
                selectedCity={city}
                onCityChange={setCity}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors.id_city && "City is Required"}
              ></CityDropdown>
            </div>
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="pincode">
                Pincode
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <NumberInputField
                placeholder="Pincode"
                id={"pincode"}
                value={pincode}
                isRequired={true}
                register={register}
                minLength={6}
                maxLength={6}
                min={100000}
                max={999999}
                reqValueError={"This field is required"}
                minError={"Minimum value is 6"}
                minLengthError={"Minimum length is 6 digits"}
                maxLengthError={"Maximum length is 6 digits"}
                maxError={"Max Length is 6"}
                setValue={setValue}
                SetValue={(value) => {
                  setPincode(value);
                  clearErrors("pincode");
                }}
                // message={errors.pincode && "pincode is Required"}
              />
              {errors.pincode && <span className="text-danger">{errors.pincode.message}</span>}
            </div>
          </Col>

          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <NumberInputField
                placeholder="Phone Number"
                id={"phone"}
                value={phone}
                isRequired={false}
                register={register}
                minLength={10}
                maxLength={10}
                min={1000000000}
                max={9999999999}
                reqValueError={"This field is required"}
                minError={"Minimum value is 10"}
                minLengthError={"Minimum length is 10 digits"}
                maxLengthError={"Maximum length is 10 digits"}
                maxError={"Max Length is 10"}
                setValue={setValue}
                SetValue={(value) => {
                  setPhone(value);
                  clearErrors("phone");
                }}
                // message={errors.phone && "phone no is Required"}
              />
              {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="mobile">
                Mobile
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <NumberInputField
                placeholder="Mobile Number"
                id={"mobile"}
                value={mobile}
                isRequired={true}
                register={register}
                minLength={10}
                maxLength={10}
                min={1000000000}
                max={9999999999}
                reqValueError={"This field is required"}
                minError={"Minimum value is 10"}
                minLengthError={"Minimum length is 10 digits"}
                maxLengthError={"Maximum length is 10 digits"}
                maxError={"Max Length is 10"}
                setValue={setValue}
                SetValue={(value) => {
                  setMobile(value);
                  clearErrors("mobile");
                }}
                message={errors.mobile && errors.mobile.message}
              />
            </div>
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="cusromerCare">
                C.Care
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <NumberInputField
                placeholder="Customer Care"
                id={"cusromerCare"}
                value={cusromerCare}
                isRequired={false}
                register={register}
                minLength={10}
                maxLength={10}
                min={1000000000}
                max={9999999999}
                reqValueError={"This field is required"}
                minError={"Minimum value is 10"}
                minLengthError={"Minimum length is 10 digits"}
                maxLengthError={"Maximum length is 10 digits"}
                maxError={"Max Length is 10"}
                SetValue={(value) => {
                  setCusromerCare(value);
                  clearErrors("cusromerCare");
                }}
                message={errors.cusromerCare && errors.cusromerCare.message}
              />
            </div>
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="fbLink">
                Fb Link
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={false}
                id={"fbLink"}
                placeholder="map URL"
                value={fbLink}
                SetValue={(value) => {
                  setFbLink(value);
                  clearErrors("fbLink");
                }}
                message={errors.fbLink && "fbLink is Required"}
              />
            </div>
          </Col>
        </Row>

        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="instaLink">
                Insta Link
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={false}
                id={"instaLink"}
                placeholder="Insta Link"
                value={instaLink}
                SetValue={(value) => {
                  setInstaLink(value);
                  clearErrors("instaLink");
                }}
                message={errors.instaLink && "instaLink is Required"}
              />
            </div>
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="sort">
                Sort
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <NumberInputField
                placeholder="Sort"
                id={"sort"}
                value={sort}
                isRequired={true}
                register={register}
                max={100000}
                reqValueError={"This field is required"}
                maxError={"Max Length is 100000"}
                setValue={setValue}
                SetValue={(value) => {
                  setSort(value);
                  clearErrors("sort");
                }}
                // message={errors.sort && "sort no is Required"}
              />
              {errors.sort && <span className="text-danger">{errors.sort.message}</span>}
            </div>
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="otpVerifMobileNo">
                OTP.Mobile
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <NumberInputField
                placeholder="OTP Verify Mobile No"
                id={"otpVerifMobileNo"}
                value={otpVerifMobileNo}
                isRequired={false}
                register={register}
                minLength={10}
                maxLength={10}
                min={1000000000}
                max={9999999999}
                reqValueError={"This field is required"}
                minError={"Minimum value is 10"}
                minLengthError={"Minimum length is 10 digits"}
                maxLengthError={"Maximum length is 10 digits"}
                maxError={"Max Length is 10"}
                SetValue={(value) => {
                  setotpVerifMobileNo(value);
                  clearErrors("otpVerifMobileNo");
                }}
                message={errors.otpVerifMobileNo && errors.otpVerifMobileNo.message}
              />
            </div>
          </Col>
        </Row>

        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="gst_number">
                GST
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <GstInputField
                register={register}
                isRequired={true}
                id={"gstNumber"}
                placeholder="GST Number"
                value={gstNumber}
                code={setGstNumber}
                setValue={setValue}
                SetValue={(value) => {
                  setGstNumber(value);
                  clearErrors("gstNumber");
                }}
              />
              {errors.gstNumber && <span className="text-danger">{errors.gstNumber.message}</span>}
            </div>
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="isHo">
                Head Off
              </label>
            </div>
          </Col>
          <Col lg="3">
            <SwitchInputField register={register} id={"isHo"} checked={isHo} SetValue={setIsHo} name={"isHo"} />
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="active">
                Active
              </label>
            </div>
          </Col>
          <Col lg="3">
            <SwitchInputField register={register} id={"active"} checked={active} SetValue={setActive} name={"active"} />
          </Col>
        </Row>

        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="logo">
                Logo
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-control-wrap">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Upload</span>
                </div>
                <div className="form-file">
                  <Input type="file" accept="image/*" id="logo" onChange={(e) => convert64(e.target.files[0])} />
                </div>
              </div>
            </div>
          </Col>

          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="note">
                Note
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={false}
                id={"note"}
                placeholder="Note"
                value={note}
                SetValue={(value) => {
                  setNote(value);
                  clearErrors("note");
                }}
                message={errors.note && "note is Required"}
              />
            </div>
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="site-name">
                Show to All
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group ">
              <DropdownInputField
                register={register}
                isRequired={true}
                id={"showToAll"}
                placeholder="Select Show to all"
                optionLabel="Select Show to all"
                value={showToAll}
                SetValue={setShowToAll}
                selectOptions={showToAllOptions}
              />
              {errors?.showToAll && (
                <span className="text-danger">
                  <Icon className={"sm"} name="alert-circle" />
                  {"This field is required"}
                </span>
              )}
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="2"></Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          {logo == undefined ||
            (logo !== null && (
              <>
                <Col lg="4">
                  <ZoomImage
                    alt="not found"
                    height={"300px"}
                    width={"600px"}
                    src={isBase64(logo) ? logo : logo + "?" + String()}
                  />
                  <br />
                  <Button className="mt-1 bg-red-500 text-white" size="xs" onClick={() => setlogo(undefined)}>
                    Remove
                  </Button>
                </Col>
              </>
            ))}
        </Row>
      </div>

      <Row className="mt-2" md={12}>
        <CombinedMasterTable
          columns={columns}
          data={branchList?.rows}
          numericFields={""}
          onEdit={onEdit}
          isTotalReq={false}
        />
      </Row>
    </>
  );
};

export default BranchForm;
