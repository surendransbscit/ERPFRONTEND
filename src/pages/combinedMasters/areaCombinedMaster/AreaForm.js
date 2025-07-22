import { React, useContext } from "react";
import {
  Col,
  NumberInputField,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import { Button } from "reactstrap";
import CombinedMasterTable from "../CombinedMasterTable";
import { useDispatch } from "react-redux";
import {
  createArea,
  getAllArea,
  getAreaById,
  updateAreaById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";
import RegionDropDownMulti from "../../../components/common/dropdown/RegionDropdownMulti";

const AreaForm = ({ props }) => {
  const dispatch = useDispatch();
  const {
    reset,
    register,
    clearErrors,
    errors,
    handleSubmit,
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
  } = props;

  const { transformWord } = useContext(WordTransformerContext);

  const columns = [
    { accessor: "area_name", header: "Area Name", text_align: "left" },
    { accessor: "postal", header: "Postal Name", text_align: "left" },
    { accessor: "taluk", header: "Taluk Name", text_align: "left" },
    { accessor: "region", header: "Region Name", text_align: "left" },

    { accessor: "pincode", header: "Pin Code", text_align: "left" },
    {
      accessor: "is_active",
      header: "Status",
      text_align: "left",
      isBadge: true,
      badgeText: 1,
    },
  ];

  const onEdit = async (index) => {
    var editId = areaList?.rows[index].id_area;
    setAreaId(editId);
    let result = "";
    result = await dispatch(getAreaById(editId)).unwrap();
    console.log(result?.data);

    setAreaName(result?.area_name);
    setPincode(result?.pincode);
    setPostal(result?.postal);
    setTaluk(result?.taluk);
    setAreaIsDefault(result?.is_default);
    setAreaActive(result?.is_active);
    setRegion(result?.region);

    reset();
  };

  const resetForm = () => {
    setAreaId(undefined);
    setAreaIsDefault(false);
    setAreaName("");
    setAreaActive(true);
    setTaluk("");
    setPostal("");
    setPincode("");
    setRegion("");
  };

  const saveArea = async () => {
    const adddata = {
      area_name,
      pincode,
      is_default: areaIsDefault,
      is_active: areaActive,
      postal,
      taluk,
      region: region.map((obj) => {
        const container = obj.value;
        return container;
      }),
    };
    try {
      await dispatch(createArea(adddata)).unwrap();
      toastsuccess(area_name + " Added successfully");
      resetForm();
      await dispatch(getAllArea());
    } catch (error) {
      console.error(error);
    }
  };

  const editArea = async () => {
    const adddata = {
      area_name,
      pincode,
      is_default: areaIsDefault,
      is_active: areaActive,
      postal,
      taluk,
      region: region.map((obj) => {
        const container = obj.value;
        return container;
      }),
    };
    const reduxData = {
      id: areaId,
      putData: adddata,
    };

    try {
      await dispatch(updateAreaById(reduxData)).unwrap();
      toastsuccess("Area Edited successfully");
      resetForm();
      await dispatch(getAllArea());
    } catch (error) {
      console.error(error);
    }
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      if (areaId === undefined) {
        handleSubmit(saveArea)();
      } else {
        handleSubmit(editArea)();
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
        {areaId == undefined ? (
          <>
            <Col md={5}></Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <Button
                // disabled={loading}
                size="md"
                className="mr-2 mt-1"
                color="primary"
                onClick={handleSubmit(saveArea)}
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
                onClick={handleSubmit(editArea)}
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
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="area_name">
                Name <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={true}
                id={"area_name"}
                placeholder="Area Name"
                value={area_name}
                SetValue={(value) => {
                  setAreaName(transformWord(value));
                  clearErrors("area_name");
                }}
                message={errors.area_name && " area name is Required"}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="pincode">
                Pincode
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <NumberInputField
                placeholder="Pincode"
                id={"pincode"}
                value={pincode}
                isRequired={false}
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
                SetValue={(value) => {
                  setPincode(value);
                  clearErrors("pincode");
                }}
              />
              {errors.pincode && (
                <span className="text-danger">{errors.pincode.message}</span>
              )}
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="site-name">
                Postal
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={false}
                id={"postal"}
                placeholder="Postal Name"
                value={postal}
                SetValue={(value) => {
                  setPostal(transformWord(value));
                  clearErrors("postal");
                }}
                message={errors.postal && " Postal name is Required"}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="taluk">
                Taluk
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={false}
                id={"taluk"}
                placeholder="Taluk Name"
                value={taluk}
                SetValue={(value) => {
                  setTaluk(transformWord(value));
                  clearErrors("taluk");
                }}
                message={errors.taluk && " Taluk name is Required"}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="taluk">
                Region
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <RegionDropDownMulti
                id={"region"}
                optionLabel={"Choose Region..."}
                register={register}
                setError={errors}
                clearErrors={clearErrors}
                value={region}
                SetValue={setRegion}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="areaIsDefault">
                Is Default
              </label>
            </div>
          </Col>
          <Col lg="3">
            <SwitchInputField
              register={register}
              id={"areaIsDefault"}
              checked={areaIsDefault}
              SetValue={setAreaIsDefault}
              name={"areaIsDefault"}
            />
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="areaActive">
                Active
              </label>
            </div>
          </Col>
          <Col lg="3">
            <SwitchInputField
              register={register}
              id={"areaActive"}
              checked={areaActive}
              SetValue={setAreaActive}
              name={"areaActive"}
            />
          </Col>
        </Row>
      </div>

      <Row className="mt-2" md={12}>
        <CombinedMasterTable
          columns={columns}
          data={areaList?.rows}
          numericFields={""}
          onEdit={onEdit}
          isTotalReq={false}
        />
      </Row>
    </>
  );
};

export default AreaForm;
