import React, { useContext } from "react";
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
import { BranchDropdown } from "../../../components/filters/retailFilters";
import {
  createFloor,
  getAllFloor,
  getFloorById,
  updateFloorById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { useBranches } from "../../../components/filters/filterHooks";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";

const FloorForm = ({ props }) => {
  const { branches } = useBranches();
  const dispatch = useDispatch();
  const {
    setValue,
    register,
    clearErrors,
    errors,
    handleSubmit,
    name,
    setName,
    active,
    setActive,
    branch,
    SetBranch,
    floorId,
    setFloorId,
    floorEdit,
    setFloorEdit,
    floorList,
  } = props;

  const columns = [
    { accessor: "branch", header: "Branch", text_align: "left" },
    { accessor: "floor_name", header: "Floor Name", text_align: "left" },
    {
      accessor: "is_active",
      header: "Status",
      text_align: "left",
      isBadge: true,
      badgeText: 1,
    },
  ];

  const { transformWord } = useContext(WordTransformerContext);

  const onEdit = async (index) => {
    var editId = floorList?.rows[index].pk_id;
    setFloorId(editId);
    let result = "";
    result = await dispatch(getFloorById(editId)).unwrap();
    console.log(result?.data);

    setName(result?.floor_name);
    SetBranch(result?.id_branch);
    setActive(result?.is_active);
  };

  const resetForm = () => {
    setFloorId(undefined);
    setName("");
    setActive(true);
    SetBranch("");
  };

  const saveFloor = async () => {
    const adddata = {
      floor_name: name,
      id_branch: branch,
      is_active: active,
    };
    try {
      await dispatch(createFloor(adddata)).unwrap();
      toastsuccess(name + " Added successfully");
      resetForm();
      await dispatch(getAllFloor());
    } catch (error) {
      console.error(error);
    }
  };

  const editFloor = async () => {
    const adddata = {
      floor_name: name,
      id_branch: branch,
      is_active: active,
    };
    const reduxData = {
      id: floorId,
      putData: adddata,
    };

    try {
      await dispatch(updateFloorById(reduxData)).unwrap();
      toastsuccess("Floor Edited successfully");
      resetForm();
      await dispatch(getAllFloor());
      setFloorId(undefined);
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
        if (floorId !== undefined) {
          handleSubmit(editFloor)();
        } else {
          handleSubmit(saveFloor)();
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
        {floorId == undefined ? (
          <>
            <Col md={5}></Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <Button
                // disabled={loading}
                size="md"
                className="mr-2 mt-1"
                color="primary"
                onClick={handleSubmit(saveFloor)}
              >
                Save[ctrl+s]
                {/* {loading ? "Saving..." : "Save"} */}
              </Button>
            </Col>
          </>
        ) : (
          <>
            <div className="col-md-12" style={{ textAlign: "right" }}>
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
                onClick={handleSubmit(editFloor)}
              >
                Update[ctrl+s]
              </Button>
            </div>
          </>
        )}
      </Row>
      <div className="custom-grid">
        <Row md={12} className="form-group row g-4">
          <Col md="1">
            <div className="form-group">
              <label className="form-label" htmlFor="branch">
                Branch
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col md="3">
            <div className="form-group">
              <BranchDropdown
                register={register}
                id={"branch"}
                branches={branches}
                selectedBranch={branch}
                onBranchChange={SetBranch}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors.branch && "Branch is Required"}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Name <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <TextInputField
                register={register}
                isRequired={true}
                id={"name"}
                placeholder="Floor Name"
                value={name}
                setValue={setValue}
                SetValue={(value) => {
                  setName(transformWord(value));
                  clearErrors("name");
                }}
                message={errors.name && " name is Required"}
              />
            </div>
          </Col>
        </Row>

        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="active">
                Active
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
          data={floorList?.rows}
          numericFields={""}
          onEdit={onEdit}
          isTotalReq={false}
        />
      </Row>
    </>
  );
};

export default FloorForm;
