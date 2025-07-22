import React, { useEffect, useRef, useState } from "react";
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
  editWeightRange,
  getWeightRangeById,
} from "../../../redux/thunks/retailMaster";
import { v4 as uuid } from "uuid";
import Select from "react-select";

const WeightRangeFormEdit = () => {
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

  const inputRefs = useRef({});

  const [selectedProduct, setSelectedProduct] = useState();
  const [weight_range, setweight_range] = useState([]);

  useEffect(() => {
    if (weight_range?.length == 0) {
      addWeightRange();
    }
  }, [weight_range]);

  // const addWeightRange = () => {
  //   setweight_range([
  //     ...weight_range,
  //     { from_weight: "", to_weight: "", weight_range_name: "", id_weight_range: uuid() },
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

  const editWeightRanges = ({ name, val, ids, ...params }) => {
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
      await dispatch(editWeightRange(adddata)).unwrap();
      toastsuccess("Weight Range Updated successfully");
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
                onClick={handleSubmit((data) => postData(data, "save"))}
              >
                {issubmitting ? "Saving" : "Save "}
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
                <ProductDropdown
                  register={register}
                  id={"selectedProduct"}
                  products={products}
                  selectedProduct={selectedProduct}
                  onProductChange={(value) => {
                    setSelectedProduct(value);
                    dispatch(getWeightRangeById(value));
                  }}
                  isRequired={true}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.selectedProduct && "Product is Required"}
                />
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>Name</th>
                      <th>From weight</th>
                      <th>To weight</th>
                      <th>Action</th>
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
                              value={obj?.weight_range_name}
                              onChange={(e) =>
                                editWeightRanges({
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
                                editWeightRanges({
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
                                editWeightRanges({
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
                                onClick={() => addWeightRange()}
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

export default WeightRangeFormEdit;
