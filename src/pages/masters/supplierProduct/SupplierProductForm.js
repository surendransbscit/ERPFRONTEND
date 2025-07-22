import React, { useEffect, useState } from "react";
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
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, Row } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  useAllDesigns,
  useDesigns,
  useProducts,
  usePurities,
  useSize,
  useSubDesigns,
  useSupplierFilter,
} from "../../../components/filters/filterHooks";
import {
  ProductDropdown,
  SupplierDropdown,
} from "../../../components/filters/retailFilters";
import { Button } from "reactstrap";
import {
  createSupplierProduct,
  getSupplierProductById,
} from "../../../redux/thunks/retailMaster";
import { v4 as uuid } from "uuid";
import DesignDropdownMulti from "../../../components/common/dropdown/DesignDropdownMulti";
import SubDesignDropdownMulti from "../../../components/common/dropdown/SubDesignDropdownMulti";
import MultiImageDropzone from "../../../components/modals/MultiImageDropzone";
import PurityDropdownMulti from "../../../components/common/dropdown/PurityDropdownMulti";
import SizeDropdownMulti from "../../../components/common/dropdown/SizeDropdownMulti";
import { useHotkeys } from "react-hotkeys-hook";

const SupplierProductForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
    watch,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { supplier } = useSupplierFilter();
  const { products } = useProducts();
  const { design } = useAllDesigns();
  const { designs } = useDesigns();
  const { subDesigns } = useSubDesigns();
  const { purities } = usePurities();
  const { size } = useSize();

  const [selectedSupplier, setSelectedSupplier] = useState();
  const [showWastageDetails, setShowWastageDetails] = useState(1);
  const [showMCDetails, setShowMCDetails] = useState(1);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [productImages, setProductImages] = useState([]);

  const [modal, setModal] = useState(false);
  const toggle = (rowId = null) => {
    if (modal) {
      setProductImages([]);
    } else if (rowId) {
      const row = supplierProducts.find((obj) => obj.id === rowId);
      setProductImages(row?.image || []);
      setActiveRow(rowId);
    }
    setModal(!modal);
  };

  const { isLoading: issubmitting, supplierProductInfo } = useSelector(
    (state) => state.karigarReducer
  );

  const addSupplierProduct = () => {
    setSupplierProducts([
      ...supplierProducts,
      {
        product: "",
        design: [],
        sub_design: [],
        purity: [],
        size: [],
        image: [],
        from_wastage: "",
        to_wastage: "",
        from_making_charge: "",
        to_making_charge: "",
        from_weight: "",
        to_weight: "",
        approx_delivery_date: 1,
        id: uuid(),
      },
    ]);
  };

  const editSupplierProduct = ({ name, val, ids, ...params }) => {
    setSupplierProducts((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id == ids) {
          setValue(`${name + obj.id}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const deleteSupplierProduct = (ids) => {
    setSupplierProducts((prevState) =>
      prevState?.filter((obj) => obj.id != ids)
    );
  };

  const convert64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleDropChange = async (acceptedFiles) => {
    const filesWithPreview = await Promise.all(
      acceptedFiles.map(async (file) => {
        const base64String = await convert64(file);
        return {
          ...file,
          preview: base64String,
          id: uuid(),
          default: false,
        };
      })
    );

    const updatedTagImages = [...productImages, ...filesWithPreview];
    setProductImages(updatedTagImages);

    if (activeRow) {
      setSupplierProducts((prevState) =>
        prevState.map((obj) =>
          obj.id === activeRow ? { ...obj, image: updatedTagImages } : obj
        )
      );
    }
  };

  const postData = async () => {
    const supplierProductDetails = supplierProducts?.map((obj) => {
      const container = {};
      container.product = obj?.product;
      container.design = obj?.design;
      container.sub_design = obj?.sub_design;
      container.purity = obj?.purity;
      container.size = obj?.size;
      container.from_wastage = obj?.from_wastage;
      container.to_wastage = obj?.to_wastage;
      container.from_making_charge = obj?.from_making_charge;
      container.to_making_charge = obj?.to_making_charge;
      container.from_weight = obj?.from_weight;
      container.to_weight = obj?.to_weight;
      container.approx_delivery_date = obj?.approx_delivery_date;
      container.image = obj?.image?.map((obj) => {
        const container = {};
        container.image = obj.preview;
        return container;
      });
      return container;
    });
    const addData = {
      supplier: selectedSupplier,
      show_wastage_details: showWastageDetails,
      show_macking_charge_details: showMCDetails,
      supplier_product_details: supplierProductDetails,
    };
    // console.log(addData);
    try {
      await dispatch(createSupplierProduct(addData)).unwrap();
      toastsuccess("Supplier Product Created successfully");
      setSelectedSupplier();
      setShowMCDetails("0");
      setShowWastageDetails("0");
      setSupplierProducts([]);
    } catch (error) {
      console.error(error);
    }
  };

  const searchSupplierProduct = async (supplierId) => {
    try {
      await dispatch(getSupplierProductById(supplierId)).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (supplierProducts?.length == 0) {
      addSupplierProduct();
    }
  }, [supplierProducts]);

  useEffect(() => {
    const convertImagesToBase64 = async () => {
      if (supplierProductInfo != null) {
        const updatedProducts = await Promise.all(
          supplierProductInfo?.supplier_product_details.map(async (product) => {
            const updatedImages = await Promise.all(
              product?.image?.map(async (imgObj) => {
                const base64String = await fetch(imgObj.image)
                  .then((res) => res.blob())
                  .then((blob) => {
                    return new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result);
                      reader.readAsDataURL(blob);
                    });
                  });

                return {
                  ...imgObj,
                  preview: base64String,
                  id: imgObj.id || uuid(),
                  default: imgObj.default || false,
                };
              })
            );

            return {
              ...product,
              image: updatedImages,
            };
          })
        );

        setSupplierProducts(updatedProducts);
        setShowMCDetails(supplierProductInfo?.show_macking_charge_details);
        setShowWastageDetails(supplierProductInfo?.show_wastage_details);
      }
    };

    convertImagesToBase64();
  }, [supplierProductInfo]);

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    if (id !== undefined) {
      handleSubmit(postData)();
    }
  },{
    enableOnFormTags: true, // Enable hotkeys inside input fields
    preventDefault: true, // Prevent default browser Save
  });

  return (
    <React.Fragment>
      <Head title={title ? title : "Supplier Product"} />
      <Content>
        <MultiImageDropzone
          isDefaultReq={false}
          modal={modal}
          toggle={toggle}
          files={productImages}
          setFiles={setProductImages}
          handleDropChange={handleDropChange}
          rowImageUpload={true}
          activeRow={activeRow}
          setSupplierProducts={setSupplierProducts}
        />

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
                onClick={handleSubmit(postData)}
                // onClick={handleSubmit((data) =>
                //   postData(data, "saveAndClose")
                // )}
              >
                {issubmitting ? "Saving" : "Save "}
              </SaveButton>

              <CancelButton
                disabled={issubmitting}
                color="danger"
                size="md"
                onClick={() =>
                  navigate(`${process.env.PUBLIC_URL}/master/karigar/list`)
                }
              >
                Cancel
              </CancelButton>
            </Col>
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="qualityCode">
                    Supplier <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <SupplierDropdown
                  register={register}
                  id={"selectedSupplier"}
                  supplier={supplier}
                  selectedSupplier={selectedSupplier}
                  onSupplierChange={(value) => {
                    setSelectedSupplier(value);
                  }}
                  isRequired={false}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.selectedSupplier && "Supplier is Required"}
                />
              </Col>
              <Col md={3} lg="3">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color=""
                  onClick={() => {
                    if (selectedSupplier) {
                      searchSupplierProduct(selectedSupplier);
                    } else {
                      toastfunc("Select Supplier");
                    }
                  }}
                >
                  Search
                </SaveButton>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col md="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="showWastageDetails">
                    Show Wastage Details
                  </label>
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="showWastageDetails_customer"
                          type="radio"
                          name={"showWastageDetails"}
                          value={1}
                          className="custom-control-input"
                          checked={showWastageDetails == 1}
                          onChange={(e) => {
                            setShowWastageDetails(e.target.value);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="showWastageDetails_customer"
                        >
                          Customer
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="showWastageDetails_admin"
                          type="radio"
                          value={2}
                          name={"showWastageDetails"}
                          className="custom-control-input "
                          checked={showWastageDetails == 2}
                          onChange={(e) => {
                            setShowWastageDetails(e.target.value);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="showWastageDetails_admin"
                        >
                          Admin
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="showWastageDetails_both"
                          type="radio"
                          value={3}
                          name={"showWastageDetails"}
                          className="custom-control-input "
                          checked={showWastageDetails == 3}
                          onChange={(e) => {
                            setShowWastageDetails(e.target.value);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="showWastageDetails_both"
                        >
                          Both
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col md="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="showMCDetails">
                    Show MC Details
                  </label>
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="showMCDetails_customer"
                          type="radio"
                          name={"showMCDetails"}
                          value={1}
                          className="custom-control-input"
                          checked={showMCDetails == 1}
                          onChange={(e) => {
                            setShowMCDetails(e.target.value);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="showMCDetails_customer"
                        >
                          Customer
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="showMCDetails_admin"
                          type="radio"
                          value={2}
                          name={"showMCDetails"}
                          className="custom-control-input "
                          checked={showMCDetails == 2}
                          onChange={(e) => {
                            setShowMCDetails(e.target.value);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="showMCDetails_admin"
                        >
                          Admin
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="showMCDetails_both"
                          type="radio"
                          value={3}
                          name={"showMCDetails"}
                          className="custom-control-input "
                          checked={showMCDetails == 3}
                          onChange={(e) => {
                            setShowMCDetails(e.target.value);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="showMCDetails_both"
                        >
                          Both
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th colSpan="6" style={{ textAlign: "center",position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                        General
                      </th>
                      <th colSpan="2" style={{ textAlign: "center",position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                        Weight Range
                      </th>
                      <th colSpan="2" style={{ textAlign: "center",position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                        Wastage Percentage
                      </th>
                      <th colSpan="2" style={{ textAlign: "center",position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                        Making Charge
                      </th>

                      <th colSpan="1" style={{ textAlign: "center",position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                        Delivery
                      </th>
                      <th colSpan="2" style={{ textAlign: "center",position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                        Actions
                      </th>
                    </tr>
                    <tr>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Image Select</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Product</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Design</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Sub Design</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Purity</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Size</th>

                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>From</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>To</th>

                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>From</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>To</th>

                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>From</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>To</th>

                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Approx. Delivery Days</th>

                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Action</th>
                    </tr>
                  </thead>
                  {/* <thead>
                    <tr>
                      <th>Image Select</th>
                      <th>Product</th>
                      <th>Design</th>
                      <th>Sub Design</th>
                      <th>Action</th>
                    </tr>
                  </thead> */}
                  <tbody>
                    {supplierProducts?.map((obj, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            {" "}
                            <Button onClick={() => toggle(obj.id)}>
                              Add Images
                            </Button>
                          </td>
                          <td>
                            <div
                              className="form-group"
                              style={{ width: "150px" }}
                            >
                              <ProductDropdown
                                register={register}
                                id={`product${obj.id}`}
                                products={products}
                                selectedProduct={obj?.product}
                                onProductChange={(value) => {
                                  editSupplierProduct({
                                    ids: obj?.id,
                                    name: "product",
                                    val: value,
                                  });
                                }}
                                isRequired={true}
                                clearErrors={clearErrors}
                                setValue={setValue}
                                message={
                                  errors?.[`product` + `${String(obj.id)}`] &&
                                  "Product is Required"
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <DesignDropdownMulti
                              isMulti={true}
                              width={
                                obj?.design?.length > 0 ? "200px" : "150px"
                              }
                              register={register}
                              id={`design${obj.id}`}
                              designs={designs}
                              selectedDesign={obj?.design}
                              selectedProduct={obj.product}
                              onDesignChange={(value) => {
                                editSupplierProduct({
                                  ids: obj?.id,
                                  name: "design",
                                  val: value,
                                });
                              }}
                              isRequired={true}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={
                                errors?.[`design` + `${String(obj.id)}`] &&
                                "Design is Required"
                              }
                            />
                          </td>
                          <td>
                            <SubDesignDropdownMulti
                              width={
                                obj?.sub_design?.length > 0 ? "200px" : "150px"
                              }
                              isMulti={true}
                              register={register}
                              id={`sub_design${obj.id}`}
                              subDesigns={subDesigns}
                              products={products}
                              designs={design}
                              selectedProduct={obj.product}
                              //   selectedDesign={obj.design}
                              selectedSubDesign={obj.sub_design}
                              onSubDesignChange={(value) => {
                                editSupplierProduct({
                                  ids: obj?.id,
                                  name: "sub_design",
                                  val: value,
                                });
                              }}
                              isRequired={true}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={
                                errors?.[`sub_design` + `${String(obj.id)}`] &&
                                "Sub Design is Required"
                              }
                            />
                          </td>
                          <td>
                            <PurityDropdownMulti
                              width={
                                obj?.purity?.length > 0 ? "200px" : "150px"
                              }
                              id={`purity${obj.id}`}
                              register={register}
                              setValue={setValue}
                              clearErrors={clearErrors}
                              selectedPurity={obj?.purity}
                              purities={purities}
                              onPurityChange={(value) => {
                                editSupplierProduct({
                                  ids: obj?.id,
                                  name: "purity",
                                  val: value,
                                });
                              }}
                              isRequired={true}
                              message={
                                errors?.[`purity${String(obj.id)}`] &&
                                "Purity is Required"
                              }
                            />
                          </td>

                          <td>
                            <SizeDropdownMulti
                              width={obj?.size?.length > 0 ? "200px" : "150px"}
                              id={`size${obj.id}`}
                              register={register}
                              setValue={setValue}
                              clearErrors={clearErrors}
                              selectedSize={obj?.size}
                              sizes={size}
                              onSizeChange={(value) => {
                                editSupplierProduct({
                                  ids: obj?.id,
                                  name: "size",
                                  val: value,
                                });
                              }}
                              isRequired={true}
                              message={
                                errors?.[`size${String(obj.id)}`] &&
                                "Size is Required"
                              }
                            />
                          </td>

                          {/* weight */}

                          <td>
                            <input
                              {...register(`from_weight${obj.id}`, {
                                required: "Required",
                              })}
                              id={`from_weight${obj.id}`}
                              type="number"
                              name="from_weight"
                              step={1}
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              placeholder="From Weight"
                              min={0}
                              onKeyDown={(evt) =>
                                ["e", "E", "+", "-"].includes(evt.key) &&
                                evt.preventDefault()
                              }
                              value={obj?.from_weight}
                              onChange={(e) => {
                                editSupplierProduct({
                                  ids: obj?.id,
                                  name: "from_weight",
                                  val: e.target.value,
                                });
                                setValue(
                                  "from_weight" + obj?.id,
                                  e.target.value
                                );
                              }}
                              style={{ width: "120px" }}
                            />
                            {errors?.[`from_weight` + `${String(obj?.id)}`] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {
                                  errors?.[`from_weight` + `${String(obj?.id)}`]
                                    .message
                                }
                              </span>
                            )}
                          </td>

                          <td>
                            <input
                              {...register(`to_weight${obj.id}`, {
                                required: "Required",
                              })}
                              id={`to_weight${obj.id}`}
                              type="number"
                              name="to_weight"
                              step={1}
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              placeholder="To Weight"
                              min={0}
                              onKeyDown={(evt) =>
                                ["e", "E", "+", "-"].includes(evt.key) &&
                                evt.preventDefault()
                              }
                              value={obj?.to_weight}
                              onChange={(e) => {
                                editSupplierProduct({
                                  ids: obj?.id,
                                  name: "to_weight",
                                  val: e.target.value,
                                });
                                setValue("to_weight" + obj?.id, e.target.value);
                              }}
                              style={{ width: "120px" }}
                            />
                            {errors?.[`to_weight` + `${String(obj?.id)}`] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {
                                  errors?.[`to_weight` + `${String(obj?.id)}`]
                                    .message
                                }
                              </span>
                            )}
                          </td>

                          {/* Wastage */}
                          <td>
                            <input
                              {...register(`from_wastage${obj.id}`, {
                                required: "Required",
                              })}
                              id={`from_wastage${obj.id}`}
                              type="number"
                              name="from_wastage"
                              step={1}
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              placeholder="From Wastage"
                              min={0}
                              onKeyDown={(evt) =>
                                ["e", "E", "+", "-"].includes(evt.key) &&
                                evt.preventDefault()
                              }
                              value={obj?.from_wastage}
                              onChange={(e) => {
                                editSupplierProduct({
                                  ids: obj?.id,
                                  name: "from_wastage",
                                  val: e.target.value,
                                });
                                setValue(
                                  "from_wastage" + obj?.id,
                                  e.target.value
                                );
                              }}
                              style={{ width: "120px" }}
                            />
                            {errors?.[
                              `from_wastage` + `${String(obj?.id)}`
                            ] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {
                                  errors?.[
                                    `from_wastage` + `${String(obj?.id)}`
                                  ].message
                                }
                              </span>
                            )}
                          </td>

                          <td>
                            <input
                              {...register(`to_wastage${obj.id}`, {
                                required: "Required",
                              })}
                              id={`to_wastage${obj.id}`}
                              type="number"
                              name="to_wastage"
                              step={1}
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              placeholder="To Wastage"
                              min={0}
                              onKeyDown={(evt) =>
                                ["e", "E", "+", "-"].includes(evt.key) &&
                                evt.preventDefault()
                              }
                              value={obj?.to_wastage}
                              onChange={(e) => {
                                editSupplierProduct({
                                  ids: obj?.id,
                                  name: "to_wastage",
                                  val: e.target.value,
                                });
                                setValue(
                                  "to_wastage" + obj?.id,
                                  e.target.value
                                );
                              }}
                              style={{ width: "120px" }}
                            />
                            {errors?.[`to_wastage` + `${String(obj?.id)}`] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {
                                  errors?.[`to_wastage` + `${String(obj?.id)}`]
                                    .message
                                }
                              </span>
                            )}
                          </td>

                          {/* making charge */}
                          <td>
                            <input
                              {...register(`from_making_charge${obj.id}`, {
                                required: "Required",
                              })}
                              id={`from_making_charge${obj.id}`}
                              type="number"
                              name="from_making_charge"
                              step={1}
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              placeholder="From Making charge"
                              min={0}
                              onKeyDown={(evt) =>
                                ["e", "E", "+", "-"].includes(evt.key) &&
                                evt.preventDefault()
                              }
                              value={obj?.from_making_charge}
                              onChange={(e) => {
                                editSupplierProduct({
                                  ids: obj?.id,
                                  name: "from_making_charge",
                                  val: e.target.value,
                                });
                                setValue(
                                  "from_making_charge" + obj?.id,
                                  e.target.value
                                );
                              }}
                              style={{ width: "120px" }}
                            />
                            {errors?.[
                              `from_making_charge` + `${String(obj?.id)}`
                            ] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {
                                  errors?.[
                                    `from_making_charge` + `${String(obj?.id)}`
                                  ].message
                                }
                              </span>
                            )}
                          </td>

                          <td>
                            <input
                              {...register(`to_making_charge${obj.id}`, {
                                required: "Required",
                              })}
                              id={`to_making_charge${obj.id}`}
                              type="number"
                              name="to_making_charge"
                              step={1}
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              placeholder="To Making charge"
                              min={0}
                              onKeyDown={(evt) =>
                                ["e", "E", "+", "-"].includes(evt.key) &&
                                evt.preventDefault()
                              }
                              value={obj?.to_making_charge}
                              onChange={(e) => {
                                editSupplierProduct({
                                  ids: obj?.id,
                                  name: "to_making_charge",
                                  val: e.target.value,
                                });
                                setValue(
                                  "to_making_charge" + obj?.id,
                                  e.target.value
                                );
                              }}
                              style={{ width: "120px" }}
                            />
                            {errors?.[
                              `to_making_charge` + `${String(obj?.id)}`
                            ] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {
                                  errors?.[
                                    `to_making_charge` + `${String(obj?.id)}`
                                  ].message
                                }
                              </span>
                            )}
                          </td>

                          <td>
                            <input
                              {...register(`approx_delivery_date${obj.id}`, {
                                required: "Required",
                              })}
                              id={`approx_delivery_date${obj.id}`}
                              type="number"
                              name="approx_delivery_date"
                              step={1}
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              placeholder="Delivery Days"
                              min={0}
                              onKeyDown={(evt) =>
                                ["e", "E", "+", "-"].includes(evt.key) &&
                                evt.preventDefault()
                              }
                              value={obj?.approx_delivery_date}
                              onChange={(e) => {
                                editSupplierProduct({
                                  ids: obj?.id,
                                  name: "approx_delivery_date",
                                  val: e.target.value,
                                });
                                setValue(
                                  "approx_delivery_date" + obj?.id,
                                  e.target.value
                                );
                              }}
                              style={{ width: "120px" }}
                            />
                            {errors?.[
                              `approx_delivery_date` + `${String(obj?.id)}`
                            ] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {
                                  errors?.[
                                    `approx_delivery_date` +
                                      `${String(obj?.id)}`
                                  ].message
                                }
                              </span>
                            )}
                          </td>

                          <td>
                            {index == supplierProducts?.length - 1 && (
                              <Button
                                color="primary"
                                size="sm"
                                className="btn-icon btn-white btn-dim"
                                onClick={() => {
                                  handleSubmit(() => addSupplierProduct())();
                                }} 
                              >
                                <Icon name="plus" />
                              </Button>
                            )}
                            <Button
                              color="primary"
                              size="sm"
                              className="btn-icon btn-white btn-dim"
                              onClick={() => deleteSupplierProduct(obj?.id)}
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

export default SupplierProductForm;
