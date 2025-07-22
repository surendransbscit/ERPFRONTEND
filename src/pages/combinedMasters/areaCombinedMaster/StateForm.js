import { React, useContext } from "react";
import {
  Col,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import { Button } from "reactstrap";
import { CountryDropdown } from "../../../components/filters/retailFilters";
import CombinedMasterTable from "../CombinedMasterTable";
import { useDispatch } from "react-redux";
import {
  createState,
  getAllState,
  getStateById,
  updateStateById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { useCountries } from "../../../components/filters/filterHooks";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";

const StateForm = ({ props }) => {
  const { countries } = useCountries();
  const dispatch = useDispatch();
  const {
    reset,
    setValue,
    register,
    clearErrors,
    errors,
    handleSubmit,
    stateName,
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
  } = props;

  const columns = [
    { accessor: "country", header: "Country Name", text_align: "left" },
    { accessor: "name", header: "State Name", text_align: "left" },
  ];

  const { transformWord } = useContext(WordTransformerContext);

  const onEdit = async (index) => {
    var editId = stateList?.rows[index].id_state;
    setStateId(editId);
    let result = "";
    result = await dispatch(getStateById(editId)).unwrap();
    console.log(result?.data);

    setStateName(result?.data?.name);
    setStateCode(result?.data?.state_code);
    setCountry(result?.data?.country);
    setActive(result?.data?.is_default);
    reset();
  };

  const resetForm = () => {
    setStateId(undefined);
    setStateName("");
    setStateCode("");
    setCountry("");
    setActive(true);
  };

  const saveState = async () => {
    const adddata = {
      name: stateName,
      state_code,
      country,
      is_default: active,
    };
    try {
      await dispatch(createState(adddata)).unwrap();
      toastsuccess("State Added successfully");
      resetForm();
      await dispatch(getAllState());
    } catch (error) {
      console.error(error);
    }
  };

  const editState = async () => {
    const adddata = {
      name: stateName,
      state_code,
      country,
      is_default: active,
    };
    const reduxData = {
      id: steateId,
      putData: adddata,
    };
    try {
      await dispatch(updateStateById(reduxData)).unwrap();
      toastsuccess("State Edited successfully");
      resetForm();
      await dispatch(getAllState());
    } catch (error) {
      console.error(error);
    }
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      if (steateId === undefined) {
        handleSubmit(saveState)();
      } else {
        handleSubmit(editState)();
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
        {steateId == undefined ? (
          <>
            <Col md={5}></Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <Button
                // disabled={loading}
                size="md"
                className="mr-2 mt-1"
                color="primary"
                onClick={handleSubmit(saveState)}
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
                onClick={handleSubmit(editState)}
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
          <Col md="2">
            <div className="form-group">
              <label className="form-label" htmlFor="country">
                Country
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col md="3">
            <div className="form-group">
              <CountryDropdown
                register={register}
                id={"id_country"}
                countries={countries}
                selectedCountry={country}
                onCountryChange={setCountry}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors.id_country && "Country is Required"}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="2">
            <div className="form-group">
              <label className="form-label" htmlFor="stateName">
                State Name <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={true}
                id={"stateName"}
                placeholder="State Name"
                value={stateName}
                SetValue={(value) => {
                  setStateName(transformWord(value));
                  clearErrors("stateName");
                }}
                message={errors.stateName && " name is Required"}
              />
            </div>
          </Col>
        </Row>

        <Row md={12} className="form-group row g-4">
          <Col lg="2">
            <div className="form-group">
              <label className="form-label" htmlFor="state_code">
                State Code
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={true}
                id={"state_code"}
                placeholder="State Code"
                value={state_code}
                SetValue={(value) => {
                  setStateCode(transformWord(value));
                  clearErrors("state_code");
                }}
                message={errors.state_code && "state_code is Required"}
              />
            </div>
          </Col>
        </Row>

        <Row md={12} className="form-group row g-4">
          <Col lg="2">
            <div className="form-group">
              <label className="form-label" htmlFor="active">
                Is Defaut
              </label>
            </div>
          </Col>
          <Col lg="3">
            <SwitchInputField
              register={register}
              id={"active"}
              checked={active}
              SetValue={setActive}
              name={"active"}
            />
          </Col>
        </Row>
      </div>

      <Row className="mt-2" md={12}>
        <CombinedMasterTable
          columns={columns}
          data={stateList?.rows}
          numericFields={""}
          onEdit={onEdit}
          isTotalReq={false}
        />
      </Row>
    </>
  );
};

export default StateForm;
