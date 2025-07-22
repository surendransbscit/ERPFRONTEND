import { React, useContext } from "react";
import {
  Col,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import { Button } from "reactstrap";
import CombinedMasterTable from "../CombinedMasterTable";
import { useDispatch } from "react-redux";
import {
  createCountry,
  getAllCountry,
  getCountryById,
  updateCountryById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";

const CountryForm = ({ props }) => {
  const dispatch = useDispatch();
  const {
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
  } = props;

  const { transformWord } = useContext(WordTransformerContext);

  const columns = [
    { accessor: "name", header: "Country Name", text_align: "left" },
    { accessor: "currency_name", header: "Currency Name", text_align: "left" },
  ];

  const onEdit = async (index) => {
    var editId = countryList?.rows[index].id_country;
    setCountryId(editId);
    let result = "";
    result = await dispatch(getCountryById(editId)).unwrap();
    console.log(result?.data);

    setname(result?.data?.name);
    setShortName(result?.data?.shortname);
    setCurrencyCode(result?.data?.currency_code);
    setCurrencyName(result?.data?.currency_name);
    setMobCode(result?.data?.mob_code);
    setMobNoLen(result?.data?.mob_no_len);
    setIsDefault(result?.data?.is_default);
    reset();
  };

  const resetForm = () => {
    setCountryId(undefined);
    setIsDefault(false);
    setname("");
    setMobCode("");
    setMobNoLen("");
    setShortName("");
    setCurrencyCode("");
    setCurrencyName("");
  };

  const saveCountry = async () => {
    const adddata = {
      name,
      shortname: shortName,
      currency_name: currencyName,
      currency_code: currencyCode,
      mob_code: mobCode,
      mob_no_len: mobNoLen,
      is_default: isDefault,
    };
    try {
      await dispatch(createCountry(adddata)).unwrap();
      toastsuccess("Country Added successfully");
      resetForm();
      await dispatch(getAllCountry());
    } catch (error) {
      console.error(error);
    }
  };

  const editCountry = async () => {
    const adddata = {
      name,
      shortname: shortName,
      currency_name: currencyName,
      currency_code: currencyCode,
      mob_code: mobCode,
      mob_no_len: mobNoLen,
      is_default: isDefault,
    };
    const reduxData = {
      id: countryId,
      putData: adddata,
    };
    try {
      await dispatch(updateCountryById(reduxData)).unwrap();
      toastsuccess("Country Edited successfully");
      resetForm();
      await dispatch(getAllCountry());
    } catch (error) {
      console.error(error);
    }
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      if (countryId === undefined) {
        handleSubmit(saveCountry)();
      } else {
        handleSubmit(editCountry)();
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  return (
    <>
      <Row lg={12} className={"form-control-sm"}>
        {countryId == undefined ? (
          <>
            <Col md={5}></Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <Button
                // disabled={loading}
                size="md"
                className="mr-2 mt-1"
                color="primary"
                onClick={handleSubmit(saveCountry)}
              >
                Save[Ctrl+s]
                {/* {loading ? "Saving..." : "Save"} */}
              </Button>
            </Col>
          </>
        ) : (
          <>
            <Col md={5}></Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
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
              </Button>
              &nbsp;
              <Button
                // disabled={loading}
                size="md"
                className="mr-2 mt-1"
                color="primary"
                onClick={handleSubmit(editCountry)}
              >
                Update[Ctrl+s]
                {/* {loading ? "Saving..." : "Save"} */}
              </Button>
            </Col>
          </>
        )}
      </Row>
      <div className="custom-grid">
        <Row md={12} className="form-group row g-4">
          <Col lg="2">
            <div className="form-group">
              <label className="form-label" htmlFor="site-name">
                Name <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="2">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={true}
                id={"name"}
                placeholder="Country Name"
                value={name}
                SetValue={(value) => {
                  setname(transformWord(value));
                  clearErrors("name");
                }}
                message={errors.name && "name is Required"}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="2">
            <div className="form-group">
              <label className="form-label" htmlFor="shortName">
                Short Name <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="2">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={true}
                id={"shortName"}
                placeholder="Short Name"
                value={shortName}
                SetValue={(value) => {
                  setShortName(transformWord(value));
                  clearErrors("shortName");
                }}
                message={errors.shortName && "shortName is Required"}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="2">
            <div className="form-group">
              <label className="form-label" htmlFor="currencyName">
                Currency Name <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="2">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={true}
                id={"currencyName"}
                placeholder="Currency Name"
                value={currencyName}
                SetValue={(value) => {
                  setCurrencyName(transformWord(value));
                  clearErrors("currencyName");
                }}
                message={errors.currencyName && "currencyName is Required"}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="2">
            <div className="form-group">
              <label className="form-label" htmlFor="currencyCode">
                Currency Code <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="2">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={true}
                id={"currencyCode"}
                placeholder="Currency Code"
                value={currencyCode}
                SetValue={(value) => {
                  setCurrencyCode(transformWord(value));
                  clearErrors("currencyCode");
                }}
                message={errors.currencyCode && "currencyCode is Required"}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="2">
            <div className="form-group">
              <label className="form-label" htmlFor="mobCode">
                Mobile Code <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="2">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={true}
                id={"mobCode"}
                placeholder="Mobile Code"
                value={mobCode}
                SetValue={(value) => {
                  setMobCode(transformWord(value));
                  clearErrors("mobCode");
                }}
                message={errors.mobCode && "mobCode is Required"}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="2">
            <div className="form-group">
              <label className="form-label" htmlFor="mobNoLen">
                Mobile Code Length
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="2">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={true}
                id={"mobNoLen"}
                placeholder="Mobile Code Length"
                value={mobNoLen}
                SetValue={(value) => {
                  setMobNoLen(transformWord(value));
                  clearErrors("mobNoLen");
                }}
                message={errors.mobNoLen && "mobNoLen is Required"}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="2">
            <div className="form-group">
              <label className="form-label" htmlFor="isDefault">
                Is Default
              </label>
            </div>
          </Col>
          <Col lg="2">
            <SwitchInputField
              register={register}
              id={"isDefault"}
              checked={isDefault}
              SetValue={setIsDefault}
              name={"isDefault"}
            />
          </Col>
        </Row>
      </div>

      <Row className="mt-2" md={12}>
        <CombinedMasterTable
          columns={columns}
          data={countryList?.rows}
          numericFields={""}
          onEdit={onEdit}
          isTotalReq={false}
        />
      </Row>
    </>
  );
};

export default CountryForm;

