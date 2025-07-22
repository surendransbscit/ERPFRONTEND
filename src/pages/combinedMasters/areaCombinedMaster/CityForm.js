import {React, useContext} from "react";
import {
  Col,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import { Button } from "reactstrap";
import { StateDropdown } from "../../../components/filters/retailFilters";
import CombinedMasterTable from "../CombinedMasterTable";
import { useDispatch } from "react-redux";
import {
  createCity,
  getAllCity,
  getCityById,
  updateCityById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { useStates } from "../../../components/filters/filterHooks";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";

const CityForm = ({ props }) => {
  const { states } = useStates();
  const dispatch = useDispatch();
  const {
    setValue,
    register,
    clearErrors,
    errors,
    reset,
    handleSubmit,
    cityName,
    setCityName,
    cityDefault,
    setCityDefault,
    cityState,
    setCityState,
    cityEdit,
    setCityEdit,
    cityId,
    setCityId,
    cityList,
    // states,
  } = props;
  
  const { transformWord } = useContext(WordTransformerContext);

  const columns = [
    { accessor: "state", header: "State Name", text_align: "left" },
    { accessor: "name", header: "City Name", text_align: "left" },
  ];

  const onEdit = async (index) => {
    var editId = cityList?.rows[index].id_city;
    setCityId(editId);
    let result = "";
    result = await dispatch(getCityById(editId)).unwrap();
    console.log(result?.data);

    setCityDefault(result?.data?.is_default);
    setCityName(result?.data?.name);
    setCityState(result?.data?.state);
    reset()
  };

  const resetForm = () => {
    setCityId(undefined);
    setCityDefault(true);
    setCityName("");
    setCityState("");
  };

  const saveCity = async () => {
    const adddata = {
      name: cityName,
      state: cityState,
      is_default: cityDefault,
    };
    try {
      await dispatch(createCity(adddata)).unwrap();
      toastsuccess("City Added successfully");
      resetForm();
      await dispatch(getAllCity());
    } catch (error) {
      console.error(error);
    }
  };

  const editCity = async () => {
    const adddata = {
      name: cityName,
      state: cityState,
      is_default: cityDefault,
    };
    const reduxData = {
      id: cityId,
      putData: adddata,
    };

    try {
      await dispatch(updateCityById(reduxData)).unwrap();
      toastsuccess("City Edited successfully");
      resetForm();
      await dispatch(getAllCity());
    } catch (error) {
      console.error(error);
    }
  };

  useHotkeys(
      "ctrl+s",
      (event) => {
        event.preventDefault();
        if (cityId === undefined) {
          handleSubmit(saveCity)();
        } else {
          handleSubmit(editCity)();
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
        {cityId == undefined ? (
          <>
            <Col md={5}></Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <Button
                // disabled={loading}
                size="md"
                className="mr-2 mt-1"
                color="primary"
                onClick={handleSubmit(saveCity)}
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
                onClick={handleSubmit(editCity)}
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
              <label className="form-label" htmlFor="cityState">
                State
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col md="3">
            <div className="form-group">
              <StateDropdown
                register={register}
                id={"cityState"}
                states={states}
                selectedState={cityState}
                onStateChange={setCityState}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors.cityState && "State is Required"}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="2">
            <div className="form-group">
              <label className="form-label" htmlFor="cityName">
                City Name
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={true}
                id={"cityName"}
                placeholder="City Name"
                value={cityName}
                SetValue={(value) => {
                  setCityName(transformWord(value));
                  clearErrors("name");
                }}
                message={errors.cityName && "name is Required"}
              />
            </div>
          </Col>
        </Row>

        <Row md={12} className="form-group row g-4">
          <Col lg="2">
            <div className="form-group">
              <label className="form-label" htmlFor="cityDefault">
                Is Defaut
              </label>
            </div>
          </Col>
          <Col lg="3">
            <SwitchInputField
              register={register}
              id={"cityDefault"}
              checked={cityDefault}
              SetValue={setCityDefault}
              name={"cityDefault"}
            />
          </Col>
        </Row>
      </div>

      <Row className="mt-2" md={12}>
        <CombinedMasterTable
          columns={columns}
          data={cityList?.rows}
          numericFields={""}
          onEdit={onEdit}
          isTotalReq={false}
        />
      </Row>
    </>
  );
};

export default CityForm;