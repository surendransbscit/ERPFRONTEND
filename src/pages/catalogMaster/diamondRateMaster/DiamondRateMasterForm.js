import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import { CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, Row } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { v4 as uuid } from "uuid";
import {
  createDiamondRateMaster,
  createPurchaseDiamondRateMaster,
  filterDiamondRateMaster,
  filterPurchaseDiamondRateMaster,
  getDiamondRateMasterById,
} from "../../../redux/thunks/catalogMaster";
import { useQualityCode } from "../../../components/filters/filterHooks";
import { QualityDropdown } from "../../../components/filters/retailFilters";
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import SupplierDropDownMulti from "../../../components/common/dropdown/SupplierDropDownMulti";
import { useHotkeys } from "react-hotkeys-hook";

const DiamondRateMasterForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setError,
    setValue,
    watch,
  } = useForm();
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
    reset: reset1,
    clearErrors: clearErrors1,
    setError: setError1,
    setValue: setValue1,
    watch: watch1,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting } = useSelector((state) => state.diamondRateMasterReducer);
  const { filteredDiamondCentsList, filteredPurchaseDiamondCentsList } = useSelector(
    (state) => state.diamondRateMasterReducer
  );
  const { quality_code } = useQualityCode();

  const [qualityCode, setQualityCode] = useState("");
  const [supplierQualityCode, setSupplierQualityCode] = useState();
  const [cent_rates, setcent_rates] = useState([]);
  const [supplierCentRates, setSupplierCentRates] = useState([]);
  const [ids, setids] = useState(1);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState();

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const addCentRate = () => {
    setcent_rates([...cent_rates, { from_cent: "", to_cent: "", rate: "", id_cents_rate: ids }]);
    setids((prevState) => prevState - 1);
  };

  const addSupplierCentRate = () => {
    setSupplierCentRates([
      ...supplierCentRates,
      { purchase_from_cent: "", purchase_to_cent: "", purchase_rate: "", id_cent_rate: uuid() },
    ]);
  };

  const editCentRate = ({ name, val, ids, ...params }) => {
    setcent_rates((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id_cents_rate == ids) {
          setValue(`${name + obj.id_cents_rate}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const editSupplierCentRate = ({ name, val, ids, ...params }) => {
    setSupplierCentRates((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id_cent_rate == ids) {
          setValue1(`${name + obj.id_cent_rate}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const deleteCentRate = (ids) => {
    setcent_rates((prevState) => prevState?.filter((obj) => obj.id_cents_rate != ids));
  };

  const deleteSupplierCentRate = (ids) => {
    setSupplierCentRates((prevState) => prevState?.filter((obj) => obj.id_cent_rate != ids));
  };

  useEffect(() => {
    id !== undefined && dispatch(getDiamondRateMasterById(id));
  }, [dispatch, id]);

  const filterSupplierCentRate = () => {
    dispatch(
      filterPurchaseDiamondRateMaster({
        quality: supplierQualityCode,
        supplier:
          selectedSupplier?.length > 0
            ? selectedSupplier?.map((obj) => {
                const container = obj.value;
                return container;
              })
            : [],
      })
    );
  };

  useEffect(() => {
    setSupplierCentRates(filteredPurchaseDiamondCentsList);
  }, [filteredPurchaseDiamondCentsList]);

  useEffect(() => {
    if (supplierCentRates?.length === 0) {
      addSupplierCentRate();
    }
  }, [supplierCentRates]);

  useEffect(() => {
    setcent_rates(filteredDiamondCentsList);
  }, [filteredDiamondCentsList]);

  useEffect(() => {
    if (cent_rates?.length === 0) {
      addCentRate();
    }
  }, [cent_rates]);

  const postData = async () => {
    if (activeTab === 1) {
      const adddata = {
        quality_code: qualityCode,
        diamond_cent_rate: cent_rates,
      };
      try {
        await dispatch(createDiamondRateMaster(adddata)).unwrap();
        toastsuccess(" Diamond Rate Added successfully");
        setQualityCode();
        setcent_rates([]);
        // navigate(`${process.env.PUBLIC_URL}/catalogmaster/diamondratemaster/list`);
      } catch (error) {
        console.error(error);
      }
    }
    if (activeTab === 2) {
      const diamond_cent_rate = supplierCentRates?.map((obj) => {
        const container = {};

        container.from_cent = obj.purchase_from_cent;
        container.to_cent = obj.purchase_to_cent;
        container.rate = obj.purchase_rate;

        return container;
      });
      const adddata = {
        quality_code: supplierQualityCode,
        supplier: selectedSupplier?.map((obj) => {
          const container = obj.value;
          return container;
        }),
        diamond_cent_rate: diamond_cent_rate,
      };
      try {
        await dispatch(createPurchaseDiamondRateMaster(adddata)).unwrap();
        toastsuccess(" Diamond Rate Added successfully");
        setSupplierQualityCode();
        setSupplierCentRates([]);
        setSelectedSupplier([]);
        // navigate(`${process.env.PUBLIC_URL}/catalogmaster/diamondratemaster/list`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (add === undefined) {
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/diamondratemaster/list`);
    }
  }, [add, id, navigate]);

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    if (id !== undefined) {
      handleSubmit(putData)();
    } else {
      handleSubmit(postData)();
    }
  },{
    enableOnFormTags: true, // Enable hotkeys inside input fields
    preventDefault: true, // Prevent default browser Save
  });
  return (
    <React.Fragment>
      <Head title={title ? title : "Diamond Rate Master"} />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
            {activeTab == 1 ? (
              <Col md={5} className="text-right flex">
                <SaveButton disabled={issubmitting} size="md" color="primary" onClick={handleSubmit(postData)}>
                  {issubmitting ? "Saving" : "Save[Ctrl+s] "}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/catalogmaster/diamondratemaster/list`)}
                >
                  Cancel
                </CancelButton>
              </Col>
            ) : (
              <Col md={5} className="text-right flex">
                <SaveButton disabled={issubmitting} size="md" color="primary" onClick={handleSubmit1(postData)}>
                  {issubmitting ? "Saving" : "Save[Ctrl+s] "}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/catalogmaster/diamondratemaster/list`)}
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {/* {id !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton disabled={issubmitting} size="md" color="primary" onClick={handleSubmit(putData)}>
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/catalogmaster/diamondratemaster/list`)}
                >
                  Cancel
                </CancelButton>
              </Col>
            )} */}
          </Row>

          <Nav tabs>
            <NavItem>
              <NavLink
                tag="a"
                href="#tab"
                className={classnames({ active: activeTab === 1 })}
                onClick={(ev) => {
                  ev.preventDefault();
                  toggle(1);
                  setSupplierCentRates([]);
                  setSupplierQualityCode();
                  setSelectedSupplier([]);
                }}
              >
                <Icon name="user-circle-fill" /> <span>Customer</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                tag="a"
                href="#tab"
                className={classnames({ active: activeTab === 2 })}
                onClick={(ev) => {
                  ev.preventDefault();
                  toggle(2);
                  setQualityCode();
                  setcent_rates([]);
                }}
              >
                <Icon name="grid-alt-fill" /> <span>Supplier</span>
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId={1}>
              <div className="custom-grid">
                <Row md={12} className="form-group row g-4">
                  <Col lg="2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="qualityCode">
                        Quality Code <IsRequired />
                      </label>
                    </div>
                  </Col>
                  <Col lg="3">
                    <QualityDropdown
                      register={register}
                      id={"qualityCode"}
                      quality_code={quality_code}
                      selectedQualitycode={qualityCode}
                      onQualityCodeChange={(value) => {
                        setQualityCode(value);
                        dispatch(
                          filterDiamondRateMaster({
                            quality: value,
                          })
                        );
                      }}
                      isRequired={true}
                      clearErrors={clearErrors}
                      setValue={setValue}
                      message={errors.qualityCode && "Quality code is Required"}
                    />
                  </Col>
                </Row>
                <Row md={12} className="form-group row g-4">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.NO</th>
                          <th>From Cent</th>
                          <th>To Cent</th>
                          <th>Rate</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cent_rates?.map((obj, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <input
                                  {...register(`from_cent${obj.id_cents_rate}`, {
                                    required: "Required",
                                    validate: (val) => {
                                      if (parseFloat(val) >= 1000000000) {
                                        return "Max Value is 999999999.999";
                                      }
                                      const numStr = String(val);
                                      if (numStr.includes(".") && numStr.split(".")[1].length > 3) {
                                        return "Max 3 decimal places allowed ";
                                      }
                                    },
                                  })}
                                  min={0}
                                  step={0.001}
                                  name="from_cent"
                                  onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  type="number"
                                  value={obj?.from_cent}
                                  onChange={(e) =>
                                    editCentRate({
                                      ids: obj?.id_cents_rate,
                                      name: e.target.name,
                                      val: e.target.value,
                                    })
                                  }
                                />
                                {errors?.[`from_cent` + `${String(obj.id_cents_rate)}`] && (
                                  <span className="text-danger">
                                    <Icon className={"sm"} name="alert-circle" />
                                    {errors?.[`from_cent` + `${String(obj.id_cents_rate)}`].message}
                                  </span>
                                )}
                              </td>
                              <td>
                                <input
                                  {...register(`to_cent${obj.id_cents_rate}`, {
                                    required: "Required",
                                    validate: (val) => {
                                      if (parseFloat(val) >= 1000000000) {
                                        return "Max Value is 999999999.999";
                                      }
                                      const numStr = String(val);
                                      if (numStr.includes(".") && numStr.split(".")[1].length > 3) {
                                        return "Max 3 decimal places allowed ";
                                      }

                                      if (parseFloat(watch(`from_cent` + `${String(obj.id_cents_rate)}`)) > val) {
                                        return "From cent can't be greater than To cent";
                                      }
                                    },
                                  })}
                                  name="to_cent"
                                  min={0}
                                  step={0.001}
                                  onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                  className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  type="number"
                                  value={obj?.to_cent}
                                  onChange={(e) =>
                                    editCentRate({
                                      ids: obj?.id_cents_rate,
                                      name: e.target.name,
                                      val: e.target.value,
                                    })
                                  }
                                />
                                {errors?.[`to_cent` + `${String(obj.id_cents_rate)}`] && (
                                  <span className="text-danger">
                                    <Icon className={"sm"} name="alert-circle" />
                                    {errors?.[`to_cent` + `${String(obj.id_cents_rate)}`].message}
                                  </span>
                                )}
                              </td>
                              <td>
                                <input
                                  {...register(`rate${obj.id_cents_rate}`, {
                                    required: "Required",
                                    validate: (val) => {
                                      if (parseFloat(val) >= 100000000) {
                                        return "Max Value is 99999999.999";
                                      }
                                      const numStr = String(val);
                                      if (numStr.includes(".") && numStr.split(".")[1].length > 2) {
                                        return "Max 2 decimal places allowed ";
                                      }
                                    },
                                  })}
                                  name="rate"
                                  min={0}
                                  step={0.01}
                                  onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                  className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  type="number"
                                  value={obj?.rate}
                                  onChange={(e) =>
                                    editCentRate({
                                      ids: obj?.id_cents_rate,
                                      name: e.target.name,
                                      val: e.target.value,
                                    })
                                  }
                                />
                                {errors?.[`rate` + `${String(obj.id_cents_rate)}`] && (
                                  <span className="text-danger">
                                    <Icon className={"sm"} name="alert-circle" />
                                    {errors?.[`rate` + `${String(obj.id_cents_rate)}`].message}
                                  </span>
                                )}
                              </td>
                              <td>
                                {index == cent_rates?.length - 1 && (
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="btn-icon btn-white btn-dim"
                                    onClick={() => addCentRate()}
                                  >
                                    <Icon name="plus" />
                                  </Button>
                                )}
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() => deleteCentRate(obj?.id_cents_rate)}
                                >
                                  <Icon name="trash-fill" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Row>
              </div>
            </TabPane>

            <TabPane tabId={2}>
              <div className="custom-grid">
                <Row md={12} className="form-group row g-4">
                  {/* <Col lg="2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="qualityCode">
                        Quality Code <IsRequired />
                      </label>
                    </div>
                  </Col> */}
                  <Col lg="3">
                    <label className="form-label" htmlFor="supplierQualityCode">
                      Quality Code <IsRequired />
                    </label>
                    <QualityDropdown
                      register={register1}
                      id={"supplierQualityCode"}
                      quality_code={quality_code}
                      selectedQualitycode={supplierQualityCode}
                      onQualityCodeChange={setSupplierQualityCode}
                      isRequired={true}
                      clearErrors={clearErrors1}
                      setValue={setValue1}
                      message={errors1.supplierQualityCode && "Quality code is Required"}
                    />
                  </Col>

                  <Col lg="2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="supplier">
                        Supplier
                        <IsRequired />
                      </label>
                      <SupplierDropDownMulti
                        id={"selectedSupplier"}
                        optionLabel={"Choose Supplier..."}
                        register={register1}
                        setError={setError1}
                        clearErrors={clearErrors1}
                        value={selectedSupplier}
                        SetValue={setSelectedSupplier}
                      />
                      {/* {errors?.selectedSupplier && <span className="text-danger">Selection is required</span>} */}
                    </div>
                  </Col>
                  <Col lg={2}>
                    <div style={{ marginTop: "35px" }}>
                      <Button type="button" className="btn btn-secondary" onClick={() => filterSupplierCentRate()}>
                        Filter
                      </Button>
                    </div>
                  </Col>
                </Row>

                <Row md={12} className="form-group row g-4">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.NO</th>
                          <th>From Cent</th>
                          <th>To Cent</th>
                          <th>Rate</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplierCentRates?.map((obj, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <input
                                  {...register1(`purchase_from_cent${obj.id_cent_rate}`, {
                                    required: "Required",
                                    validate: (val) => {
                                      if (parseFloat(val) >= 1000000000) {
                                        return "Max Value is 999999999.999";
                                      }
                                      const numStr = String(val);
                                      if (numStr.includes(".") && numStr.split(".")[1].length > 3) {
                                        return "Max 3 decimal places allowed ";
                                      }
                                    },
                                  })}
                                  min={0}
                                  step={0.001}
                                  name="purchase_from_cent"
                                  onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  type="number"
                                  value={obj?.purchase_from_cent}
                                  onChange={(e) =>
                                    editSupplierCentRate({
                                      ids: obj?.id_cent_rate,
                                      name: "purchase_from_cent",
                                      val: e.target.value,
                                    })
                                  }
                                />
                                {errors1?.[`purchase_from_cent` + `${String(obj.id_cent_rate)}`] && (
                                  <span className="text-danger">
                                    <Icon className={"sm"} name="alert-circle" />
                                    {errors1?.[`purchase_from_cent` + `${String(obj.id_cent_rate)}`].message}
                                  </span>
                                )}
                              </td>
                              <td>
                                <input
                                  {...register1(`purchase_to_cent${obj.id_cent_rate}`, {
                                    required: "Required",
                                    validate: (val) => {
                                      if (parseFloat(val) >= 1000000000) {
                                        return "Max Value is 999999999.999";
                                      }
                                      const numStr = String(val);
                                      if (numStr.includes(".") && numStr.split(".")[1].length > 3) {
                                        return "Max 3 decimal places allowed ";
                                      }

                                      if (
                                        parseFloat(watch1(`purchase_from_cent` + `${String(obj.id_cent_rate)}`)) > val
                                      ) {
                                        return "From cent can't be greater than To cent";
                                      }
                                    },
                                  })}
                                  name="purchase_to_cent"
                                  min={0}
                                  step={0.001}
                                  onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                  className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  type="number"
                                  value={obj?.purchase_to_cent}
                                  onChange={(e) =>
                                    editSupplierCentRate({
                                      ids: obj?.id_cent_rate,
                                      name: "purchase_to_cent",
                                      val: e.target.value,
                                    })
                                  }
                                />
                                {errors1?.[`purchase_to_cent` + `${String(obj.id_cent_rate)}`] && (
                                  <span className="text-danger">
                                    <Icon className={"sm"} name="alert-circle" />
                                    {errors1?.[`purchase_to_cent` + `${String(obj.id_cent_rate)}`].message}
                                  </span>
                                )}
                              </td>
                              <td>
                                <input
                                  {...register1(`purchase_rate${obj.id_cent_rate}`, {
                                    required: "Required",
                                    validate: (val) => {
                                      if (parseFloat(val) >= 100000000) {
                                        return "Max Value is 99999999.999";
                                      }
                                      const numStr = String(val);
                                      if (numStr.includes(".") && numStr.split(".")[1].length > 2) {
                                        return "Max 2 decimal places allowed ";
                                      }
                                    },
                                  })}
                                  name="purchase_rate"
                                  min={0}
                                  step={0.01}
                                  onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                  className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  type="number"
                                  value={obj?.purchase_rate}
                                  onChange={(e) =>
                                    editSupplierCentRate({
                                      ids: obj?.id_cent_rate,
                                      name: "purchase_rate",
                                      val: e.target.value,
                                    })
                                  }
                                />
                                {errors1?.[`purchase_rate` + `${String(obj.id_cent_rate)}`] && (
                                  <span className="text-danger">
                                    <Icon className={"sm"} name="alert-circle" />
                                    {errors1?.[`purchase_rate` + `${String(obj.id_cent_rate)}`].message}
                                  </span>
                                )}
                              </td>
                              <td>
                                {index == supplierCentRates?.length - 1 && (
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="btn-icon btn-white btn-dim"
                                    onClick={() => addSupplierCentRate()}
                                  >
                                    <Icon name="plus" />
                                  </Button>
                                )}
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() => deleteSupplierCentRate(obj?.id_cent_rate)}
                                >
                                  <Icon name="trash-fill" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Row>
              </div>
            </TabPane>
          </TabContent>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default DiamondRateMasterForm;
