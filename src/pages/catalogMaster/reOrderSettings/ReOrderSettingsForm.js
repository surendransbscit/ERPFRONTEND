import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import {
  BlockTitle,
  CancelButton,
  Icon,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import {
  Col,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createReOrderSettings,
  getActiveSize,
  getProductById,
  getReOrderSettings,
  getReOrderSettingsById,
} from "../../../redux/thunks/catalogMaster";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  useSubDesigns,
  useBranches,
  useDesigns,
  useProducts,
} from "../../../components/filters/filterHooks";
import {
  BranchDropdown,
  DesignDropdown,
  ProductDropdown,
  SizeDropdown,
  SubDesignDropdown,
  WeightRangeDropdown,
} from "../../../components/filters/retailFilters";
import { Button } from "reactstrap";
import { getWeightRangeById } from "../../../redux/thunks/retailMaster";
import { v4 as uuid } from "uuid";
import { useHotkeys } from "react-hotkeys-hook";
import Loading from "../../../components/erp-loading/erp-loader";

const ReOrderSettingsForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const {
    reOrderSettingsList,
    isLoading: issubmitting,
    isError,
  } = useSelector((state) => state.reOrderSettingsReducer);
  const { weightRangeInfo } = useSelector((state) => state.weightRangeReducer);
  const { activeSizeList } = useSelector((state) => state.sizeReducer);
  const { productInfo } = useSelector((state) => state.productReducer);

  const { products } = useProducts();
  const { designs } = useDesigns();
  const { subDesigns } = useSubDesigns();
  const { branches } = useBranches();

  const [selectedProduct, setSelectedProduct] = useState();
  const [idBranch, setIdBranch] = useState("");
  const [orderSettings, setOrderSettings] = useState([]);

  useEffect(() => {
    if (orderSettings?.length == 0 && selectedProduct) {
      addOrderSettings();
    }
  }, [orderSettings]);

  const addOrderSettings = () => {
    setOrderSettings([
      ...orderSettings,
      {
        design: "",
        sub_design: "",
        size: "",
        weight_range: "",
        min_pcs: "",
        max_pcs: "",
        id_reorder_setting: uuid(),
      },
    ]);
    // setids((prevState) => prevState - 1);
  };

  const editOrderSettings = ({ name, val, ids, ...params }) => {
    setOrderSettings((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id_reorder_setting == ids) {
          setValue(`${name + obj.id_reorder_setting}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const deleteOrderSettings = (ids) => {
    setOrderSettings((prevState) =>
      prevState?.filter((obj) => obj.id_reorder_setting != ids)
    );
  };

  const postData = async () => {
    const reorder_settings = orderSettings?.map((obj) => {
      const container = {};
      container.design = obj.design;
      container.sub_design = obj?.sub_design == "" ? null : obj?.sub_design;
      container.size = obj?.size == "" ? null : obj?.size;
      container.weight_range =
        obj?.weight_range == "" ? null : obj?.weight_range;
      container.min_pcs = obj?.min_pcs;
      container.max_pcs = obj?.max_pcs;
      return container;
    });
    const adddata = {
      reorder_settings,
      product: selectedProduct,
      branch: idBranch,
    };
    try {
      await dispatch(createReOrderSettings(adddata)).unwrap();
      toastsuccess("Re-order settings Added successfully");
      setSelectedProduct();
      setOrderSettings([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    if (
      reOrderSettingsList !== undefined &&
      reOrderSettingsList?.reorder_settings?.length > 0
    ) {
      setOrderSettings(reOrderSettingsList?.reorder_settings);
    } else {
      setOrderSettings([]);
    }
    // if (
    //   reOrderSettingsList != undefined &&
    //   reOrderSettingsList?.reorder_settings == undefined
    // ) {
    //   if (selectedProduct) {
    //     toastfunc("No Data Found");
    //     if (settings?.is_sub_design_req == 1) {
    //       let sub_design = subDesigns.filter(
    //         (item) => item.id_product === selectedProduct
    //       );
    //       let ord = sub_design?.map((obj) => {
    //         const container = {};
    //         container.design = obj.id_design;
    //         container.sub_design = obj.id_sub_design;
    //         container.size = "";
    //         container.weight_range = "";
    //         container.min_pcs = "";
    //         container.max_pcs = "";
    //         container.id_reorder_setting = uuid();
    //         return container;
    //       });
    //       setOrderSettings(ord);
    //     } else {
    //       let design = designs.filter(
    //         (item) => item.id_product === selectedProduct
    //       );
    //       let ord = design?.map((obj) => {
    //         const container = {};
    //         container.design = obj.id_design;
    //         container.sub_design = "";
    //         container.size = "";
    //         container.weight_range = "";
    //         container.min_pcs = "";
    //         container.max_pcs = "";
    //         container.id_reorder_setting = uuid();
    //         return container;
    //       });
    //       console.log(ord);
    //       setOrderSettings(ord);
    //     }
    //   }
    // }
    // reOrderSettingsList != undefined && (setOrderSettings(reOrderSettingsList?.reorder_settings), reset());
  }, [reOrderSettingsList, reset, selectedProduct]);

  useEffect(() => {
    dispatch(getActiveSize());
  }, [dispatch]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();

      handleSubmit(postData)();
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  return (
    <React.Fragment>
      <Head title="Re Order Settings" />
      <Content>
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <SaveButton
                disabled={issubmitting}
                size="md"
                color="primary"
                onClick={handleSubmit((data) => postData(data, "save"))}
              >
                {issubmitting ? "Saving" : "Save[Ctrl+s]"}
              </SaveButton>

              {/* <CancelButton
                disabled={issubmitting}
                color="danger"
                size="md"
                onClick={() => navigate(`${process.env.PUBLIC_URL}/catalogmaster/reordersettings/list`)}
              >
                Cancel
              </CancelButton> */}
            </Col>
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="branch">
                    Branch
                    <IsRequired />
                  </label>
                  <BranchDropdown
                    register={register}
                    id={"idBranch"}
                    branches={branches}
                    selectedBranch={idBranch}
                    onBranchChange={(value) => {
                      setIdBranch(value);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.idBranch && "Branch is Required"}
                  ></BranchDropdown>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Product
                    <IsRequired />
                  </label>
                  <ProductDropdown
                    register={register}
                    id={"selectedProduct"}
                    products={products}
                    selectedProduct={selectedProduct}
                    onProductChange={(value) => {
                      setSelectedProduct(value);
                      dispatch(
                        getReOrderSettings({ branch: idBranch, product: value })
                      );
                      dispatch(getWeightRangeById(value));
                      dispatch(getProductById(value));
                      // dispatch(getActiveSize());
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectedProduct && "Product is Required"}
                  />
                </div>
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
                        Design
                      </th>
                      {settings?.is_sub_design_req == 1 && (
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Sub Design
                        </th>
                      )}
                      {productInfo?.has_weight_range == "1" && (
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Weight Range
                        </th>
                      )}
                      {productInfo?.has_size == "1" && (
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Size
                        </th>
                      )}
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Min pcs
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Max pcs
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
                    {issubmitting ? (
                      <tr>
                        <td className="text-center" colSpan='7'>
                          <Loading />
                        </td>
                      </tr>
                    ) : orderSettings?.length > 0 && selectedProduct ? (
                      orderSettings?.map((obj, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="form-group">
                                <DesignDropdown
                                  register={register}
                                  id={`design${obj.id_reorder_setting}`}
                                  name="design"
                                  designs={designs}
                                  selectedProduct={selectedProduct}
                                  selectedDesign={obj?.design}
                                  onDesignChange={(value) =>
                                    editOrderSettings({
                                      ids: obj?.id_reorder_setting,
                                      name: "design",
                                      val: value,
                                    })
                                  }
                                  isRequired={true}
                                  clearErrors={clearErrors}
                                  setValue={setValue}
                                  message={
                                    errors?.[
                                      `design` +
                                        `${String(obj.id_reorder_setting)}`
                                    ] && "Design is Required"
                                  }
                                />
                                {/* {errors?.[`design` + `${String(obj.id_reorder_setting)}`] && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  Design is required
                                </span>
                              )} */}
                              </div>
                            </td>
                            {settings?.is_sub_design_req == 1 && (
                              <td>
                                <div className="form-group">
                                  <SubDesignDropdown
                                    register={register}
                                    id={`sub_design${obj.id_reorder_setting}`}
                                    name="sub_design"
                                    subDesigns={subDesigns}
                                    selectedProduct={selectedProduct}
                                    selectedDesign={obj?.design}
                                    selectedSubDesign={obj?.sub_design}
                                    onSubDesignChange={(value) =>
                                      editOrderSettings({
                                        ids: obj?.id_reorder_setting,
                                        name: "sub_design",
                                        val: value,
                                      })
                                    }
                                    isRequired={true}
                                    clearErrors={clearErrors}
                                    setValue={setValue}
                                    message={
                                      errors?.[
                                        `sub_design` +
                                          `${String(obj.id_reorder_setting)}`
                                      ] && "Sub Design is Required"
                                    }
                                  />
                                </div>
                              </td>
                            )}
                            {productInfo?.has_weight_range == "1" && (
                              <td>
                                <div className="form-group">
                                  <WeightRangeDropdown
                                    register={register}
                                    id={`weight_range${obj.id_reorder_setting}`}
                                    name="weight_range"
                                    weightRanges={
                                      weightRangeInfo?.weight_ranges
                                    }
                                    selectedWeightRange={obj?.weight_range}
                                    onWeightRangeChange={(value) =>
                                      editOrderSettings({
                                        ids: obj?.id_reorder_setting,
                                        name: "weight_range",
                                        val: value,
                                      })
                                    }
                                    isRequired={
                                      productInfo?.has_weight_range == "1"
                                        ? true
                                        : false
                                    }
                                    clearErrors={clearErrors}
                                    setValue={setValue}
                                    message={
                                      errors?.[
                                        `weight_range` +
                                          `${String(obj.id_reorder_setting)}`
                                      ] && "Weight Range is Required"
                                    }
                                  />
                                </div>
                              </td>
                            )}
                            {productInfo?.has_size == "1" && (
                              <td>
                                <div className="form-group">
                                  <SizeDropdown
                                    register={register}
                                    id={`size${obj.id_reorder_setting}`}
                                    name="size"
                                    size={activeSizeList}
                                    selectedProduct={selectedProduct}
                                    products={products}
                                    selectedSize={obj?.size}
                                    onSizeChange={(value) =>
                                      editOrderSettings({
                                        ids: obj?.id_reorder_setting,
                                        name: "size",
                                        val: value,
                                      })
                                    }
                                    isRequired={
                                      productInfo?.has_size == "1"
                                        ? true
                                        : false
                                    }
                                    clearErrors={clearErrors}
                                    setValue={setValue}
                                    message={
                                      errors?.[
                                        `size` +
                                          `${String(obj.id_reorder_setting)}`
                                      ] && "Size is Required"
                                    }
                                  />
                                </div>
                              </td>
                            )}
                            <td>
                              <input
                                {...register(
                                  `min_pcs${obj.id_reorder_setting}`,
                                  {
                                    required: "Required",
                                  }
                                )}
                                type="number"
                                name="min_pcs"
                                step={1}
                                className="form-control no-spinner"
                                onWheel={(e) => e.target.blur()}
                                placeholder="Enter Min pcs"
                                min={0}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={obj?.min_pcs}
                                onChange={(e) =>
                                  editOrderSettings({
                                    ids: obj?.id_reorder_setting,
                                    name: e.target.name,
                                    val: e.target.value,
                                  })
                                }
                              />
                              {errors?.[
                                `min_pcs` + `${String(obj.id_reorder_setting)}`
                              ] && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {
                                    errors?.[
                                      `min_pcs` +
                                        `${String(obj.id_reorder_setting)}`
                                    ].message
                                  }
                                </span>
                              )}
                            </td>
                            <td>
                              <input
                                {...register(
                                  `max_pcs${obj.id_reorder_setting}`,
                                  {
                                    required: "Required",
                                  }
                                )}
                                type="number"
                                step={1}
                                min={0}
                                name="max_pcs"
                                className="form-control no-spinner"
                                onWheel={(e) => e.target.blur()}
                                placeholder="Enter Max pcs"
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={obj?.max_pcs}
                                onChange={(e) =>
                                  editOrderSettings({
                                    ids: obj?.id_reorder_setting,
                                    name: e.target.name,
                                    val: e.target.value,
                                  })
                                }
                              />
                              {errors?.[
                                `max_pcs` + `${String(obj.id_reorder_setting)}`
                              ] && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {
                                    errors?.[
                                      `max_pcs` +
                                        `${String(obj.id_reorder_setting)}`
                                    ].message
                                  }
                                </span>
                              )}
                            </td>
                            <td>
                              {index == orderSettings?.length - 1 && (
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() => {
                                    handleSubmit(() => addOrderSettings())();
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
                                  deleteOrderSettings(obj?.id_reorder_setting)
                                }
                              >
                                <Icon name="trash-fill" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="text-center" colSpan="7">
                          <h4>Select Branch & Product to proceed.</h4>
                        </td>
                      </tr>
                    )}
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
export default ReOrderSettingsForm;
