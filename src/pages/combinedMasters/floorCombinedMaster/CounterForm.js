import React, { useEffect, useState, useContext } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  createCounter,
  getAllCounter,
  getCounterById,
  getFloorOptions,
  updateCounterById,
} from "../../../redux/thunks/retailMaster";
import { BranchDropdown } from "../../../components/filters/retailFilters";
import { useBranches } from "../../../components/filters/filterHooks";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";

const CounterForm = ({ props }) => {
  const { floorOptions } = useSelector((state) => state.floorReducer);
  const dispatch = useDispatch();
  const {
    setValue,
    register,
    clearErrors,
    errors,
    handleSubmit,
    name,
    setName,
    floor,
    setFloor,
    active,
    setActive,
    counterEdit,
    setCounterEdit,
    counterId,
    setCounterId,
    counterList,
    branch,
    SetBranch,
  } = props;

  const [filteredFloorOptions, setFilteredFloorOptions] =
    useState(floorOptions);

  useEffect(() => {
    if (branch) {
      const filtered = floorOptions?.filter(
        (item) => item?.id_branch === branch
      );
      setFilteredFloorOptions(filtered);
    } else {
      setFilteredFloorOptions(floorOptions);
    }
  }, [branch, floorOptions]);

  const columns = [
    { accessor: "floor", header: "Floor Name", text_align: "left" },
    { accessor: "counter_name", header: "Counter Name", text_align: "left" },
    {
      accessor: "is_active",
      header: "Status",
      text_align: "left",
      isBadge: true,
      badgeText: 1,
    },
  ];

  const { branches } = useBranches();
  const { transformWord } = useContext(WordTransformerContext);

  const onEdit = async (index) => {
    var editId = counterList?.rows[index].pk_id;
    setCounterId(editId);
    console.log(counterList?.rows[index]);
    SetBranch(counterList?.rows[index]?.id_branch);
    setName(counterList?.rows[index]?.counter_name);
    setFloor(counterList?.rows[index]?.id_floor);
    setActive(counterList?.rows[index]?.is_active);
  };

  const resetForm = () => {
    setCounterId(undefined);
    setName("");
    setFloor("");
    setActive(true);
  };

  const saveCounter = async () => {
    const adddata = {
      counter_name: name,
      id_floor: floor,
      is_active: active,
    };
    try {
      await dispatch(createCounter(adddata)).unwrap();
      toastsuccess(name + " Added successfully");
      resetForm();
      await dispatch(getAllCounter());
    } catch (error) {
      console.error(error);
    }
  };

  const editCounter = async () => {
    const adddata = {
      counter_name: name,
      id_floor: floor,
      is_active: active,
    };
    const reduxData = {
      id: counterId,
      putData: adddata,
    };
    try {
      await dispatch(updateCounterById(reduxData)).unwrap();
      toastsuccess("Counter Edited successfully");
      resetForm();
      await dispatch(getAllCounter());
      setCounterId(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getFloorOptions());
  }, [dispatch]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        if (counterId !== undefined) {
          handleSubmit(editCounter)();
        } else {
          handleSubmit(saveCounter)();
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
        {counterId == undefined ? (
          <>
            <Col md={5}></Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <Button
                // disabled={loading}
                size="md"
                className="mr-2 mt-1"
                color="primary"
                onClick={handleSubmit(saveCounter)}
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
                onClick={handleSubmit(editCounter)}
              >
                Update[ctrl+s]
              </Button>
            </div>
          </>
        )}
      </Row>
      <div className="custom-grid">
        <Row md={12} className="form-group row g-4">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="scheme">
                Branch
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
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
                message={errors.branch && "Scheme is Required"}
              />
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col md="1">
            <div className="form-group">
              <label className="form-label" htmlFor="floor">
                Floor
                <IsRequired />
              </label>
            </div>
          </Col>
          <Col md="3">
            <div className="form-group">
              <div className="form-control-wrap">
                <div className="form-control-select">
                  <select
                    className="form-control form-select"
                    id="floor"
                    {...register("floor", {
                      required: true,
                    })}
                    value={floor}
                    onChange={(e) => {
                      setFloor(e.target.value);
                    }}
                    placeholder="Floor"
                  >
                    <option label="Select Floor" value=""></option>
                    {filteredFloorOptions?.map((item, index) => (
                      <option key={index} value={item?.id_floor}>
                        {item.floor_name}
                      </option>
                    ))}
                  </select>
                  {errors?.floor && (
                    <span className="invalid">This field is required</span>
                  )}
                </div>
              </div>
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
                placeholder="Counter Name"
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
          data={counterList?.rows}
          numericFields={""}
          onEdit={onEdit}
          isTotalReq={false}
        />
      </Row>
    </>
  );
};

export default CounterForm;
