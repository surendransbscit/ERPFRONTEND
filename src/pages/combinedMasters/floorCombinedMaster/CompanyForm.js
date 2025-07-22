import React, {useContext} from "react";
import { Col, NumberInputField, Row, SwitchInputField, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import { Button } from "reactstrap";
import CombinedMasterTable from "../CombinedMasterTable";
import { useDispatch } from "react-redux";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  EmailInputField,
  GstInputField,
  MobileNumberFieldWithCountryCode,
} from "../../../components/form-control/InputGroup";
import { CityDropdown, CountryDropdown, StateDropdown } from "../../../components/filters/retailFilters";
import ProfileImageUpload from "../../../components/input/profile-image/ProfileImageUpload";
import { createCompany, getAllCompany, getCompanyById, updateCompanyById } from "../../../redux/thunks/settings";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const CompanyForm = ({ props }) => {
  const dispatch = useDispatch();
  const {
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
  } = props;

  const columns = [
    { accessor: "company_name", header: "Company Name", text_align: "left" },
    { accessor: "image", header: "Company Image", isImage: true },
    { accessor: "short_code", header: "Short Code", text_align: "left" },
    { accessor: "mobile", header: "Mobile", text_align: "left" },
  ];
  
  const { transformWord } = useContext(WordTransformerContext);

  const onEdit = async (index) => {
    var editId = companyList?.rows[index].pk_id;
    setCompanyId(editId);
    let result = "";
    result = await dispatch(getCompanyById(editId)).unwrap();
    console.log(result?.data);

    setName(result?.company_name);
    setMobCode(result?.mob_code);
    setShortCode(result?.short_code);
    setcompNameInSms(result?.comp_name_in_sms);
    setAddress1(result?.address1);
    setAddress2(result?.address2);
    setCountry(result?.id_country?.value);
    setState(result?.state);
    setCity(result?.city);
    setPincode(result?.pincode);
    setMobile(result?.mobile);
    setPhone(result?.phone);
    setEmail(result?.email);
    setWebsite(result?.website);
    setBankAccNumber(result?.bank_acc_number);
    setBankName(result?.bank_name);
    setBankAccName(result?.bank_acc_name);
    setBankBranch(result?.bank_branch);
    setBankIfsc(result?.bank_ifsc);
    setGstNumber(result?.gst_number);
    setCinNumber(result?.cin_number);
    setWhatsappNo(result?.whatsapp_no);
    setcom_img(result?.image);
  };

  const resetForm = () => {
    setName("");
    setShortCode("");
    setcompNameInSms("");
    setAddress1("");
    setAddress2("");
    setCountry("");
    setState("");
    setCity("");
    setPincode("");
    setMobile("");
    setPhone("");
    setEmail("");
    setWebsite("");
    setBankAccNumber("");
    setBankName("");
    setBankAccName("");
    setBankBranch("");
    setBankIfsc("");
    setGstNumber("");
    setCinNumber("");
    setWhatsappNo("");
    setMobCode(0);
    setcom_img(undefined);
    setCompanyId(undefined);
  };

  const saveCompany = async () => {
    const adddata = {
      company_name: name,
      short_code,
      comp_name_in_sms,
      address1,
      address2,
      country,
      state,
      city,
      pincode,
      mobile,
      phone,
      email,
      website,
      bank_acc_number,
      bank_name,
      bank_acc_name,
      bank_branch,
      bank_ifsc,
      gst_number,
      cin_number,
      whatsapp_no,
      image: com_img ? com_img : null,
      mob_code: mobCode,
    };
    try {
      await dispatch(createCompany(adddata)).unwrap();
      toastsuccess("Company Added successfully");
      resetForm();
      await dispatch(getAllCompany());
    } catch (error) {
      console.error(error);
    }
  };

  const editCompany = async () => {
    const adddata = {
      company_name: name,
      short_code,
      comp_name_in_sms,
      address1,
      address2,
      country,
      state,
      city,
      pincode,
      mobile,
      phone,
      email,
      website,
      bank_acc_number,
      bank_name,
      bank_acc_name,
      bank_branch,
      bank_ifsc,
      gst_number,
      cin_number,
      whatsapp_no,
      image: com_img ? com_img : null,
      mob_code: mobCode,
    };
    const reduxData = {
      id: companyId,
      putData: adddata,
    };
    try {
      await dispatch(updateCompanyById(reduxData)).unwrap();
      toastsuccess("Company Edited successfully");
      resetForm();
      await dispatch(getAllCompany());
      setCompanyId(undefined);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Row lg={12} className={"form-control-sm"}>
        {companyId == undefined ? (
          <>
            <Col md={5}></Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <Button
                // disabled={loading}
                size="md"
                className="mr-2 mt-1"
                color="primary"
                onClick={handleSubmit(saveCompany)}
              >
                Save
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
              </Button>{" "}
              <Button
                // disabled={loading}
                size="md"
                className="mr-2 mt-1"
                color="primary"
                onClick={handleSubmit(editCompany)}
              >
                Update
              </Button>
            </div>
           
          </>
        )}
      </Row>
      <div className="">
        <Row lg={12} className={"form-control-sm"}>
          <Col md={4}>
            <div className="custom-grid">
              <Row className="form-group row g-4">
                <Col md="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cname">
                      C.Name <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col md="8">
                  <div className="form-group">
                    <TextInputField
                      register={register}
                      isRequired={true}
                      id={"name"}
                      placeholder="Company Name"
                      value={name}
                      setValue={setValue}
                      SetValue={(value) => {
                        setName(transformWord(value));
                        clearErrors("name");
                      }}
                      message={errors.name && " company name is Required"}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="shortcode">
                      SMS Name
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <TextInputField
                      register={register}
                      isRequired={true}
                      id={"comp_name_in_sms"}
                      placeholder="Name in SMS"
                      value={comp_name_in_sms}
                      setValue={setValue}
                      SetValue={(value) => {
                        setcompNameInSms(transformWord(value));
                        clearErrors("comp_name_in_sms");
                      }}
                      message={errors.comp_name_in_sms && "field is Required"}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="add2">
                      Address 2
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <TextInputField
                      register={register}
                      id={"address2"}
                      placeholder="Address Line 2"
                      value={address2}
                      SetValue={setAddress2}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="state">
                      State <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="8">
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
                    />
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="pincode">
                      Pincode <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="8">
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
                      minError={"Minimum value is 100000"}
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
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="phoneno">
                      Phone No
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <NumberInputField
                      placeholder="Whats app Number"
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
                      SetValue={(value) => {
                        setPhone(value);
                        clearErrors("phone");
                      }}
                      message={errors.phone && errors.phone.message}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="8">
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
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="website">
                      GST
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <GstInputField
                      register={register}
                      isRequired={true}
                      id={"gst_number"}
                      placeholder="GST Number"
                      value={gst_number}
                      code={setGstNumber}
                      setValue={setValue}
                      SetValue={(value) => {
                        setGstNumber(value);
                        clearErrors("gst_number");
                      }}
                    />
                    {errors?.gst_number && <span className="text-danger">{errors?.gst_number.message}</span>}
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="bank_acc_name">
                      Acc.Name
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <TextInputField
                      register={register}
                      isRequired={false}
                      id={"bank_acc_name"}
                      placeholder="Bank Account Name"
                      value={bank_acc_name}
                      setValue={setValue}
                      SetValue={(value) => {
                        setBankAccName(transformWord(value));
                        clearErrors("bank_acc_name");
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="bank_branch">
                      Bank Branch
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <TextInputField
                      register={register}
                      isRequired={false}
                      id={"bank_branch"}
                      placeholder="Bank Branch"
                      value={bank_branch}
                      setValue={setValue}
                      SetValue={(value) => {
                        setBankBranch(transformWord(value));
                        clearErrors("bank_branch");
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cin_number">
                      CIN
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <TextInputField
                      register={register}
                      isRequired={false}
                      id={"cin_number"}
                      placeholder="CIN Number"
                      value={cin_number}
                      setValue={setValue}
                      SetValue={(value) => {
                        setCinNumber(value);
                        clearErrors("cin_number");
                      }}
                      message={errors.cin_number && "field is Required"}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          <Col md={4}>
            <div className="custom-grid">
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="shortcode">
                      Short Code <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <TextInputField
                      register={register}
                      isRequired={true}
                      id={"short_code"}
                      placeholder="Short Code"
                      value={short_code}
                      setValue={setValue}
                      SetValue={(value) => {
                        setShortCode(value);
                        clearErrors("short_code");
                      }}
                      message={errors.short_code && "short code is Required"}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="add1">
                      Address 1<IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="8">
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
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="country">
                      Country <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="8">
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
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">
                      City <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="8">
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
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="mobileno">
                      Mobile No <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    {/* <NumberInputField
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
                          SetValue={(value) => {
                            setMobile(value);
                            clearErrors("mobile");
                          }}
                          message={errors.mobile && errors.mobile.message}
                        /> */}
                    <MobileNumberFieldWithCountryCode
                      // disabled={customerInfo != undefined}
                      optionId={"mobCode"}
                      optionName={"mobCode"}
                      placeholder="Mobile Number"
                      id={"mobile"}
                      value={mobile}
                      text_width={100}
                      // option_width={10}
                      setValue={setValue}
                      options={countries}
                      onDropDownChange={setMobCode}
                      selectedOption={mobCode}
                      // isRequired={customerInfo == undefined}
                      register={register}
                      max={10}
                      min={10}
                      reqValueError={"This field is required"}
                      maxError={"Max Length is 10"}
                      minError={"Min Length is 10"}
                      SetValue={(value) => {
                        setMobile(value);
                        clearErrors("mobile");
                      }}
                      message={errors.mobile && errors.mobile.message}
                    />
                    {errors?.mobile && <span className="text-danger">{errors.mobile.message}</span>}
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="whatsappno">
                      Whatsapp.No
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <NumberInputField
                      placeholder="Whats app Number"
                      id={"whatsapp_no"}
                      value={whatsapp_no}
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
                        setWhatsappNo(value);
                        clearErrors("whatsapp_no");
                      }}
                      message={errors.whatsapp_no && errors.whatsapp_no.message}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="website">
                      Website
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <TextInputField
                      register={register}
                      id={"website"}
                      placeholder="Website"
                      value={website}
                      SetValue={setWebsite}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="bank_acc_number">
                      Acc.Number
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <TextInputField
                      register={register}
                      isRequired={false}
                      id={"bank_acc_number"}
                      placeholder="Bank Account Number"
                      value={bank_acc_number}
                      SetValue={(value) => {
                        setBankAccNumber(value);
                        clearErrors("bank_acc_number");
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="bank_name">
                      Bank Name
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <TextInputField
                      register={register}
                      isRequired={false}
                      id={"bank_name"}
                      placeholder="Bank Name"
                      value={bank_name}
                      SetValue={(value) => {
                        setBankName(transformWord(value));
                        clearErrors("bank_name");
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="bank_ifsc">
                      Bank IFSC
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <TextInputField
                      register={register}
                      isRequired={false}
                      id={"bank_ifsc"}
                      placeholder="Bank IFSC"
                      value={bank_ifsc}
                      SetValue={(value) => {
                        setBankIfsc(transformWord(value));
                        clearErrors("bank_ifsc");
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          <Col md={4}>
            <div className="custom-grid">
              <Row className="form-group row g-4">
                <Col md="3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="image">
                      Image
                    </label>
                  </div>
                </Col>
                <Col md="8">
                  <ProfileImageUpload id={"com_img"} image={com_img} SetImage={setcom_img} />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>

      <Row className="mt-2" md={12}>
        <CombinedMasterTable
          columns={columns}
          data={companyList?.rows}
          numericFields={""}
          onEdit={onEdit}
          isTotalReq={false}
        />
      </Row>
    </>
  );
};

export default CompanyForm;
