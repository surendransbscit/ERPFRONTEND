import React, { useEffect, useState, useContext, useRef } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, Row } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useProducts } from "../../../components/filters/filterHooks";
import { ProductDropdown } from "../../../components/filters/retailFilters";
import { Button } from "reactstrap";
import {
  createWeightRange,
  getWeightRangeById,
} from "../../../redux/thunks/retailMaster";
import { v4 as uuid } from "uuid";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

import Select from "react-select";
import { faRightLong } from "@fortawesome/free-solid-svg-icons";

const WeightRangeForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
    watch,
    setFocus,
  } = useForm();
  const navigate = useNavigate();

  const inputRefs = useRef({});

  const dispatch = useDispatch();
  const { isLoading: issubmitting } = useSelector(
    (state) => state.weightRangeReducer
  );
  const { weightRangeInfo } = useSelector((state) => state.weightRangeReducer);
  const { products } = useProducts();

  const productOptions = products?.map((val) => ({
    value: val.pro_id,
    label: val.product_name,
  }));

  const [selectedProduct, setSelectedProduct] = useState([]);
  const [weight_range, setweight_range] = useState([]);
  const { transformWord } = useContext(WordTransformerContext);

  useEffect(() => {
    if (weight_range?.length == 0) {
      addWeightRange();
    }
  }, [weight_range]);

  // const addWeightRange = () => {
  //   setweight_range([
  //     ...weight_range,
  //     {
  //       from_weight: "",
  //       to_weight: "",
  //       weight_range_name: "",
  //       id_weight_range: uuid(),
  //     },
  //   ]);
  //   // setids((prevState) => prevState - 1);
  // };

  const addWeightRange = () => {
    const newId = uuid();
    const newRow = {
      from_weight: "",
      to_weight: "",
      weight_range_name: "",
      id_weight_range: newId,
    };

    setweight_range((prev) => [...prev, newRow]);
    setTimeout(() => {
      setFocus(`weight_range_name${newId}`);
    }, 0);
  };

  const editWeightRange = ({ name, val, ids, ...params }) => {
    setweight_range((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id_weight_range == ids) {
          setValue(`${name + obj.id_weight_range}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const deleteWeightRange = (ids) => {
    setweight_range((prevState) =>
      prevState?.filter((obj) => obj.id_weight_range != ids)
    );
  };

  const postData = async () => {
    const weight_ranges = weight_range?.map((obj) => {
      const container = {};
      container.id_weight_range = obj.id_weight_range;
      container.weight_range_name = obj.weight_range_name;
      container.from_weight = obj.from_weight;
      container.to_weight = obj.to_weight;
      container.id_product = selectedProduct;
      return container;
    });
    const adddata = {
      product: selectedProduct,
      weight_ranges,
    };
    try {
      await dispatch(createWeightRange(adddata)).unwrap();
      toastsuccess("Weight Range Added successfully");
      setSelectedProduct();
      setweight_range([]);
      // navigate(`${process.env.PUBLIC_URL}/master/weightrange/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getWeightRangeById(id));
  }, [dispatch, id]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    weightRangeInfo != undefined &&
      (setweight_range(weightRangeInfo?.weight_ranges), reset());
  }, [weightRangeInfo, reset, id]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      handleSubmit(postData)();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  useEffect(() => {
    if (weight_range.length === 0) return;
    const lastItem = weight_range[weight_range.length - 1];
    const input = inputRefs.current[lastItem.id_weight_range];
    if (input) {
      input.focus();
    }
  }, [weight_range]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Weight Range"} />
      <Content>
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb></ModifiedBreadcrumb>
            </Col>
            <Col md={2}></Col>

            <Col md={5} className="text-right flex">
              <SaveButton
                disabled={issubmitting}
                size="md"
                color="primary"
                onClick={handleSubmit(postData)}
                // onClick={handleSubmit((data) => postData(data, "save"))}
              >
                {issubmitting ? "Saving" : "Save [Ctrl+s]"}
              </SaveButton>

              <CancelButton
                disabled={issubmitting}
                color="danger"
                size="md"
                onClick={() => {
                  setSelectedProduct();
                  setweight_range([]);
                  dispatch({ type: "weightRangeInfo/reset" });
                }}
              >
                Clear
              </CancelButton>
            </Col>
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="qualityCode">
                    Product <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <Select
                  isMulti={true}
                  value={productOptions?.filter((option) =>
                    selectedProduct?.includes(option.value)
                  )}
                  onChange={(selectedOption) => {
                    // const value = selectedOption ? selectedOption : "";
                    setSelectedProduct(
                      selectedOption.map((option) => option.value)
                    );
                    setValue(
                      "selectedProduct",
                      selectedOption.map((option) => option.value)
                    );
                    clearErrors("selectedProduct");
                  }}
                  options={productOptions}
                  placeholder="Select Product"
                  id={"selectedProduct"}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                      fontSize: "12px",
                    }),
                  }}
                />
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <div
                className="table-responsive"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        S.NO
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        From weight
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        To weight
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {weight_range?.map((obj, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              ref={(el) =>
                                (inputRefs.current[obj.id_weight_range] = el)
                              }
                              {...register(
                                `weight_range_name${obj.id_weight_range}`,
                                {
                                  required: "Required",
                                }
                              )}
                              name="weight_range_name"
                              className="form-control form-control-sm"
                              type="text"
                              value={transformWord(obj?.weight_range_name)}
                              onChange={(e) =>
                                editWeightRange({
                                  ids: obj?.id_weight_range,
                                  name: e.target.name,
                                  val: e.target.value,
                                })
                              }
                            />
                            {errors?.[
                              `weight_range_name` +
                                `${String(obj.id_weight_range)}`
                            ] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {
                                  errors?.[
                                    `weight_range_name` +
                                      `${String(obj.id_weight_range)}`
                                  ].message
                                }
                              </span>
                            )}
                          </td>
                          <td>
                            <input
                              {...register(
                                `from_weight${obj.id_weight_range}`,
                                {
                                  required: "Required",
                                  validate: (val) => {
                                    if (parseFloat(val) >= 1000000000) {
                                      return "Max Value is 999999999.999";
                                    }
                                    const numStr = String(val);
                                    if (
                                      numStr.includes(".") &&
                                      numStr.split(".")[1].length > 3
                                    ) {
                                      return "Max 3 decimal places allowed ";
                                    }
                                  },
                                }
                              )}
                              min={0}
                              step={0.001}
                              name="from_weight"
                              onKeyDown={(evt) =>
                                ["e", "E", "+", "-"].includes(evt.key) &&
                                evt.preventDefault()
                              }
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              type="number"
                              value={obj?.from_weight}
                              onChange={(e) =>
                                editWeightRange({
                                  ids: obj?.id_weight_range,
                                  name: e.target.name,
                                  val: e.target.value,
                                })
                              }
                            />
                            {errors?.[
                              `from_weight` + `${String(obj.id_weight_range)}`
                            ] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {
                                  errors?.[
                                    `from_weight` +
                                      `${String(obj.id_weight_range)}`
                                  ].message
                                }
                              </span>
                            )}
                          </td>
                          <td>
                            <input
                              {...register(`to_weight${obj.id_weight_range}`, {
                                required: "Required",
                                validate: (val) => {
                                  if (parseFloat(val) >= 1000000000) {
                                    return "Max Value is 999999999.999";
                                  }
                                  const numStr = String(val);
                                  if (
                                    numStr.includes(".") &&
                                    numStr.split(".")[1].length > 3
                                  ) {
                                    return "Max 3 decimal places allowed ";
                                  }

                                  if (
                                    parseFloat(
                                      watch(
                                        `from_weight` +
                                          `${String(obj.id_weight_range)}`
                                      )
                                    ) > val
                                  ) {
                                    return "From Weight can't be greater than To cent";
                                  }
                                },
                              })}
                              name="to_weight"
                              min={0}
                              step={0.001}
                              onKeyDown={(evt) =>
                                ["e", "E", "+", "-"].includes(evt.key) &&
                                evt.preventDefault()
                              }
                              className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              type="number"
                              value={obj?.to_weight}
                              onChange={(e) =>
                                editWeightRange({
                                  ids: obj?.id_weight_range,
                                  name: e.target.name,
                                  val: e.target.value,
                                })
                              }
                            />
                            {errors?.[
                              `to_weight` + `${String(obj.id_weight_range)}`
                            ] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {
                                  errors?.[
                                    `to_weight` +
                                      `${String(obj.id_weight_range)}`
                                  ].message
                                }
                              </span>
                            )}
                          </td>

                          <td>
                            {index == weight_range?.length - 1 && (
                              <Button
                                color="primary"
                                size="sm"
                                className="btn-icon btn-white btn-dim"
                                onClick={() => {
                                  handleSubmit(() => addWeightRange())();
                                }}
                              >
                                <Icon name="plus" />
                              </Button>
                            )}
                            <Button
                              color="primary"
                              size="sm"
                              className="btn-icon btn-white btn-dim"
                              onClick={() =>
                                deleteWeightRange(obj?.id_weight_range)
                              }
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
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default WeightRangeForm;
